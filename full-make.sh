#!/bin/bash
set -e

HERE="$(realpath $(dirname $0))"

cd "$HERE" && (
    rm -rf "$HERE/node_modules"
    npm install
)

cd "$HERE/common" && (
    rm -rf "$HERE/common/node_modules" 
    npm install 
    npm run test
    #npm run build 
)

 cd "$HERE/cli" && (
     rm -rf "$HERE/cli/node_modules/" 
     npm install 
     npm run generate-code
    #  npm run generate-blackhole-data
 )

cd "$HERE/website" && (
    rm -rf "$HERE/website/node_modules/" 
    npm install 
    npm run build
)
