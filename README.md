# UrlScrapingPlugin

2020 Presidential Election Research Project.

This is a url scraping browser extension with an integrated s3 pipeline. This research data collection tool is created by [Iva Porfirova](https://github.com/ivaPorfirova), [Riya Mokashi](https://github.com/RiyaMokashi), and [Ledion Lecaj](https://github.com/LedionLecaj). :computer: :plugin:

## Quick Start

If you just want to run the extension locally to see the user interface and s3 pipeline:

* Download the repository from the master branch. You may use git clone.

* Change the identityPoolId, bucketRegion, and bucketName variables in the background.js file to match your s3 bucket credentials.

* In Chrome, go to chrome://extensions, turn on Developer Mode, and choose Load Unpacked extension, and select the folder where you cloned or downloaded this repository. 

* In Firefox navigate to the root directory of the downloaded repository. In a node.js terminal run npm install --global web-ext. Once that has downloaded, run web-ext run in the root directory of the extension. This will open the extension in developer mode in Firefox.
