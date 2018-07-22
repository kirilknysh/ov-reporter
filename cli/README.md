# ov-reporter-cli
## Command-line interface

### Install

`npm i -g ov-reporter-cli`

If you see the next error:
```
ERROR: Failed to download Chromium r571375! Set "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD" env variable to skip download.
```

Try: `npm i -g ov-reporter-cli --unsafe-perm=true --allow-root`

### Usage example

`ovr -u username -p pwd -o ./reports -c 3190730003212963 -d 1 1 1 1 1 0 0 -m 7`

or create a config file (see template in `config.example.json`) and run:

`ovr --config=path/to/your-config.json`
