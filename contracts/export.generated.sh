#!/bin/bash

rm -rf ../app/src/contracts
rm -rf ../firebase/functions/src/contracts

mkdir ../app/src/contracts
mkdir ../firebase/functions/src/contracts

cp -rf ./export/abis.ts ../app/src/contracts
rsync -avm --include='*/' --include='deployed_addresses.json' --exclude='*' ./ignition/deployments ../app/src/contracts

cp -rf ./export/abis.ts ../firebase/functions/src/contracts
rsync -avm --include='*/' --include='deployed_addresses.json' --exclude='*' ./ignition/deployments ../firebase/functions/src/contracts

