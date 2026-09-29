# Changelog

All notable changes to this project are recorded here. The format follows Keep a Changelog, and versions follow Semantic Versioning (MAJOR.MINOR.PATCH). The version number is also set in `manifest.json`, and each release has a matching git tag such as `v1.2.0`.

## [1.2.0] on 2026-09-29

### Changed
- The interface is now in English for an international audience. The right click menu item is "Copy image credit", the on page messages are in English, and the manifest description is in English. The credit line itself still follows the language of the page.
- The README is now in English only. The previous Hebrew section remains available in the git history.
- Code comments are now in English.

### Added
- `PRIVACY.md`, the privacy policy for the store listing.
- `store/listing.md`, the text for the Chrome Web Store listing, the permission justifications and the review notes. It is not part of the extension package.

## [1.1.1] on 2026-09-29

### Added
- Extension icons in three sizes (16, 48 and 128 pixels), declared in `manifest.json`. The 128 pixel icon is required by the Chrome Web Store.
- `tools/make_icons.py`, a script that regenerates the icons using only the Python standard library. It is a development tool and is not part of the extension package.

## [1.1.0] on 2026-09-29

### Added
- The credit line now includes the photographer or creator of the clicked image when the page publishes one. Detection order: a dedicated credit element (class name containing `credit` or `photographer`, `aria-label` containing `credit`, or `itemprop="creator"`), then the image caption (`figcaption`, an element whose class name or `aria-label` contains `caption`, and the `title` and `alt` attributes).
- Credits are read from labeled text (`Photo:`, `Photo by`, `Credit:`, `צילום:`), from text after a copyright sign (`© Name, AFP`), or from the last parenthetical of a caption (`(Name, Agency)`).
- The credit is searched in the containers around the image, up to five levels up, as long as they hold this one image only. This covers sites where the credit sits in a sibling of the image wrapper.
- The whole credit line follows the language of the page. Hebrew pages get the Hebrew format and dated `29.9.2026`. English pages, and pages in any other language, get `Image credit: ...` and a date such as `29 September 2026`. The page title decides the language, and the `lang` attribute is used when the title does not decide.
- The on page message says when no photographer or creator was found.
- A diagnostic line starting with `[ImageCredit]` is written to the page console.

### Changed
- Hebrew wording of the date changed from "נוצר בתאריך" to "תועד בתאריך".
- `figcaption` is now found when it sits directly inside `picture`, without a `figure` around it.

## [1.0.0] on 2026-09-29

### Added
- Initial release. Right click an image and choose the menu item to copy a credit line with the site name, the main site URL, the page title and the date the credit was created.
- README in Hebrew and English.
