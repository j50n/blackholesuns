#!/bin/bash
set -e
set -x

TARGET="blackholesuns-staging.gh-pages"
HERE="$(realpath $(dirname $0))"
PAGES="$(realpath "$HERE/../$TARGET")"

cd "$HERE/cli" && (
    npm run all   
)

cp "$HERE/website/public/blackholes.txt" "$PAGES/"

cd "$PAGES" && (
    echo "ADDING...."
    git commit -am "data update `date`"

    echo "PUSHING...."
    git push
)

echo "TOTAL: $(cat "$PAGES/blackholes.txt" | wc -l)"
