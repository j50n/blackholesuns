#!/bin/bash
set -e
set -x

TARGET="blackholesuns.gh-pages"
TARGET_STAGING="blackholesuns-staging.gh-pages"

HERE="$(realpath $(dirname $0))"
PAGES="$(realpath "$HERE/../$TARGET")"
PAGES_STAGING="$(realpath "$HERE/../$TARGET_STAGING")"

cd "$HERE/cli" && (
    npm run all   
)

cp "$HERE/website/public/blackholes.txt" "$PAGES/"
cp "$HERE/website/public/blackholes.txt" "$PAGES_STAGING/"

cd "$PAGES" && (
    git commit -am "data update `date`"
    git push
)

cd "$PAGES_STAGING" && (
    git commit -am "data update `date`"
    git push
)

echo "TOTAL: $(cat "$PAGES/blackholes.txt" | wc -l)"
