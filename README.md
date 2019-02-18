# blackholesuns

NMS Black Hole Suns route-finder website.

## Installation

### Prerequisites

-   Build scripts in `package.json` use `bash` syntax
    -   Linux or Mac should "just work"
    -   For Windows 10, use WSL
-   Install `git`
-   Install the latest LTR version of `node.js` (https://nodejs.org)

This list is incomplete. If someone wants to help me complete this, let me know. Otherwise I will
take care of it next time I do a clean install.

### Setup

-   Clone the repository:
    `git clone git@github.com:j50n/blackholesuns.git`
    _creates a project folder named `blackholesuns` in the current folder on your laptop_
-   Setup node modules:
    `npm install`
    _creates a `node_modules` folder in the project folder with project depenendencies_

### Run in Development Mode

To run in development mode:

```bash
npm run dev
```

This runs a Parcel development server at `http://localhost:1234`. You can use `firefox`, `chromium`, or `chrome`
to view the development site on your laptop.

### Build the Site

To build the production site:

```bash
npm run build
```

The site is created at `./site`. This needs to be manually be saved to branch `gh-pages`.
