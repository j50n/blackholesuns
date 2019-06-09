#!/bin/bash
set -e
set -x

while :
do
    ./update.sh || true
    date
    sleep 1h
done