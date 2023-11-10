#!/bin/bash

rm -rf ../app/src/generated
rm -rf ../firebase/functions/src/generated

mkdir ../app/src/generated
mkdir ../firebase/functions/src/generated

cp -rf ./generated/artifacts ../app/src/generated
cp -rf ./generated/contracts.json ../app/src/generated

cp -rf ./generated/artifacts ../firebase/functions/src/generated
cp -rf ./generated/contracts.json ../firebase/functions/src/generated

