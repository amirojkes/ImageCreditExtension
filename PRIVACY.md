# Privacy Policy for Image Credit

Last updated: 29 September 2026

Image Credit ("the extension") is a browser extension that copies a credit line for an image that you right click.

## Summary

The extension does not collect, store, sell or send any personal data or browsing data. Everything happens locally in your browser.

## What the extension reads

The extension reads information from a page only when you choose the "Copy image credit" item in the right click menu, and only in the tab where you clicked. It reads:

- The address of the image you clicked.
- The title of the page, the name of the site and the main address of the site.
- The caption, the credit, and the alt and title text that belong to that image.

This information is used only to build the credit line.

## What the extension does with it

The credit line is built in your browser and copied to your clipboard. The extension also writes a short diagnostic line to the browser console of that page, with the image address and the credit it detected. The console line stays in your browser and is not sent anywhere.

## What the extension does not do

- It does not make network requests.
- It does not send data to the developer or to any third party.
- It does not store data. It does not use cookies, local storage or any other storage.
- It does not use analytics, advertising, accounts or remote code.

## Permissions

- `contextMenus`: adds the "Copy image credit" item to the right click menu.
- `activeTab`: gives the extension temporary access to the current tab after you click the menu item.
- `scripting`: runs the small function in that tab that builds the credit line and copies it.

The extension does not request access to all websites.

## Changes to this policy

If this policy changes, the new version will be published in this repository with a new date.

## Contact

Questions can be sent by opening an issue at https://github.com/amirojkes/ImageCreditExtension/issues
