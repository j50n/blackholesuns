#!/bin/bash
set -e

HERE="$(realpath $(dirname $0))"

cd "$HERE/common" && (
    rm -rf "$HERE/common/node_modules" 
    npm update && 
    npm run test
    npm run build 
)

 cd "$HERE/cli" && (
     rm -rf "$HERE/cli/node_modules/" 
     npm update 
     npm run generate-blackhole-data
 )

 cd "$HERE/common" && (
     npm run build
 )

 cd "$HERE/cli" && (
     npm run build
 )

cd "$HERE/website" && (
    rm -rf "$HERE/website/node_modules/" 
    npm update 
    npm run build || npm run build
)


