#!/usr/bin/env bash

VERIFIER_IMAGE=dimorinny/ethereum-contract-verifier:1.0.0

CONTRACTS_DIRECTORY="contracts"
CONTRACT_CONFIGURATION_FILE_NAME="contract.yaml"

function getContracts () {
    ls -d ${CONTRACTS_DIRECTORY}/*
}

function verifyDirectoryName () {
    CONTRACT_FOLDER=$1
    ADDRESS_REGEX='0x[a-fA-F0-9]\{40\}'

    CONFIGURATION_PATH="${CONTRACT_FOLDER}/${CONTRACT_CONFIGURATION_FILE_NAME}"

    CONFIGURATION_ADDRESS=$(cat ${CONFIGURATION_PATH} | \
        grep "contract-address: '${ADDRESS_REGEX}'" | \
        grep -oh ${ADDRESS_REGEX})

    if [ "${CONTRACTS_DIRECTORY}/${CONFIGURATION_ADDRESS}" == ${CONTRACT_FOLDER} ]; then
        true
    else
        false
    fi
}

function verify () {
    CONTRACTS=$(getContracts)
    FAILED_CONTRACTS=()

    for contract in ${CONTRACTS}
    do
        echo "Starting verifying directory: ${contract}..."
        echo "Checking folder name (should has the same name as a contract address)..."

        if $(verifyDirectoryName ${contract}); then
            echo "Addresses matched"
            echo "Checking matching contract sources with deployed version..."

            docker run \
                -v $(pwd)/${contract}:/contract \
                ${VERIFIER_IMAGE} \
                ethereum-contract-verifier verify /contract

            if [ $? -ne 0 ]; then
                FAILED_CONTRACTS+=" ${contract}"
            fi
        else
            echo "${contract} folder should has the same name as 'contract-address' field inside ${CONTRACT_CONFIGURATION_FILE_NAME} file"
            FAILED_CONTRACTS+=" ${contract}"
        fi
    done

    if [ -n "$FAILED_CONTRACTS" ]; then
        echo "Validation failed for${FAILED_CONTRACTS}"
        exit 1
    fi
}

verify
