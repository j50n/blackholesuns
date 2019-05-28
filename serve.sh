#!/bin/bash
set -e

HERE="$(realpath $(dirname $0))"

cd "$HERE/common" && (
    npm run test
    npm run build 
)

cd "$HERE/website" && (
    npm update 
    npm run serve
)
