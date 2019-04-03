#!/bin/bash
set -e

HERE="$(realpath $(dirname $0))"

cd "$HERE/common"
npm update
npm run build

cd "$HERE/cli"
npm update
npm run build

cd "$HERE/website"
npm update
npm run build
