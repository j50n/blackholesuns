# blackholesuns

NMS Black Hole Suns website.

## Installation

### Prerequisites

-   Build commands use `bash` syntax.
    -   Linux or Mac should "just work."
    -   For Windows 10, use WSL.

This list is incomplete. If someone wants to help me complete this, let me know. Otherwise I will
take care of it next time I do a clean install.

### Build the Site

Build is really simple at this point. The site, css, and scripts are unoptimized. The build does a TypeScript
compile and then copies the files from that plus the files in `./html` into `./site`.

`npm run build`

### Run the Site

Change directory to `./site` and run `firefox index.html` or equivalent with any browser.
