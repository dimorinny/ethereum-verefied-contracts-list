#!/usr/bin/env bash

VERIFIER_IMAGE=dimorinny/ethereum-contract-verifier:1.0.0

CONTRACTS_DIRECTORY=contracts

function getContracts () {
    ls -d ${CONTRACTS_DIRECTORY}/*
}

function verify () {
    CONTRACTS=$(getContracts)
    FAILED_CONTRACTS=()

    for contract in ${CONTRACTS}
    do
        echo "Starting verifying directory: ${contract}..."

        docker run \
            -v $(pwd)/${contract}:/contract \
            ${VERIFIER_IMAGE} \
            ethereum-contract-verifier verify /contract

        if [ $? -ne 0 ]; then
            FAILED_CONTRACTS+=" ${contract}"
        fi
    done

    if [ -n "$FAILED_CONTRACTS" ]; then
        echo "Validation failed for${FAILED_CONTRACTS}"
        exit 1
    fi
}

verify
