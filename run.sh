#!/bin/bash

# exit when any command fails
set -e

# Goto current script folder
cd "$(dirname "$0")"

rm -rf ./build

cd ./src
npx ts-node ./index.ts $1 $2 $3

