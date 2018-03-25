#!/usr/bin/env bash

REPOSITORY=dimorinny/ethereum-verified-contracts

setup() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit() {
  git checkout -b master
  git add contracts/**/*
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

push() {
  git remote add origin-pages https://${GH_TOKEN}@github.com/${REPOSITORY}.git > /dev/null 2>&1
  git push --quiet --set-upstream origin-pages master
}

./check.js
if [ $? -eq 0 ]; then
  setup
  commit
  push
fi
