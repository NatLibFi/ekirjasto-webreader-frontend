# Thorium Web

Thorium Web is a web-based reader for EPUB and other digital publications, built using Next.js and modern web technologies. It is designed to provide a fast, responsive, and accessible reading experience.

![Thorium Web in a browser with settings and table of contents panels open. Default settings such as font-size, font-family, and themes are visible in the overflowing settings panel. In table of contents, the current entry is indicated, and its parent entry is expanded.](./thorium-web.png)

## Features

- Supports EPUB
- Fast and responsive rendering of publications using Next.js
- Accessible design for readers with disabilities
- Customizable reading experience with themes, adjustable font sizes, line heights, word- and letter-spacing, etc.

## Getting Started

There are two ways to get started with Thorium Web:

- Using the Next.JS App as is
- Using the Thorium Web package in your own project

You can take a look at the [Implementers’ Guide](./docs/ImplementersGuide.md) for more details.

### Using the Next.JS App as is

To get started with Thorium Web, follow these steps:

- Fork or clone the repository: `git clone https://github.com/edrlab/thorium-web.git`
- Install dependencies: `pnpm install`
- Start the development server: `pnpm dev`
- Open the reader in your web browser: [http://localhost:3000](http://localhost:3000)

The development server will automatically reload the page when you make changes to the code.

### Using the Thorium Web package in your own project

To use Thorium Web in your own project, install the package and its peer dependencies:

```bash
npm install @edrlab/thorium-web @readium/css @readium/navigator @readium/navigator-html-injectables @readium/shared react-redux @reduxjs/toolkit i18next i18next-browser-languagedetector i18next-http-backend motion react-aria react-aria-components react-stately react-modal-sheet react-resizable-panels 
```

Then you can import and use the components in your own code:

```tsx
import { StatefulReader } from "@edrlab/thorium-web/epub"

const MyApp = () => {
  // ... fetch the manifest and get its self link href
  return (
    <StatefulReader
      rawManifest={ manifestObject }
      selfHref={ manifestSelfHref }
    />
  )
}
```

You can use the StatefulReader component to use the same exact Reader component as the one in the Next.JS App, but with your own [plugins, store and preferences](./docs/packages/Epub/Guide.md). Or you can use its components to build your own custom reader.

> [!IMPORTANT]
> At this point in time, when using components from `@edrlab/thorium-web/epub`, you have to import the store/lib, hooks and Preferences Provider from the same path, otherwise your custom app will use another instance.

## Customizing

You can customize this project extensively through [Preferences](./src/preferences.ts): breakpoints, which and how to display actions, themes provided to users, configuration of the docking system, sizes and offsets of icons, etc.

See [Customization in docs](./docs/customization/Customization.md) for further details.

## Building and Deploying

To build and deploy Thorium Web, run the following commands:

```bash
pnpm build
pnpm run deploy
```

This will create a production-ready build of the reader and deploy it to the specified hosting platform.

This repository is using the following configuration:

- Go-Toolkit on Google Cloud Run
- Thorium Web App on CloudFlare Pages
- Assets e.g. demo EPUBs stored on Google Cloud Storage

To deploy, the following script is run: 

```bash
npx @cloudflare/next-on-pages && npx wrangler pages deploy
```

It’s running with defaults, which means a commit triggers a build and deploy for the current branch to preview. You can then access the app from a subdomain using this branch name. 

More details in [the @cloudflare/next-on-pages repo](https://github.com/cloudflare/next-on-pages).

## Known Issues

- Fullscreen is not available on iOS and very limited on iPadOS. We encountered so many issues on iPadOS that it has been disabled for the time being.
- on iPadOS, when the app is requested in its desktop version, some interventions are implemented in Safari to provide users with a “desktop-class experience.” Unfortunately, one of this intervention is impacting the font-size setting, and requires a flag to be toggled in the Preferences API in order to apply a patch. However, this patch may not catch all edge cases.

## Contributing

We welcome contributions to Thorium web! If you're interested in helping out, please fork this repository and submit a pull request with your changes.

## License

Thorium Web is licensed under the [BSD-3-Clause license](https://opensource.org/licenses/BSD-3-Clause).

## Acknowledgments

Thorium Web is built using a number of open-source libraries and frameworks, including [Readium](https://readium.org/), [React](https://reactjs.org/), [React Aria](https://react-spectrum.adobe.com/react-aria/index.html), and [Material Symbols and Icons](https://fonts.google.com/icons). We are grateful for the contributions of the developers and maintainers of these projects.

## Example manifest

{
  "@context": "https://readium.org/webpub-manifest/context.jsonld",
  "links": [
    {
      "href": "~readium/positions.json",
      "type": "application/vnd.readium.position-list+json"
    },
    {
      "href": "~readium/content.json",
      "type": "application/vnd.readium.content+json"
    },
    {
      "href": "http://localhost:15080/OTc4OTUxMTQyNjIwMi5lcHVi/manifest.json",
      "rel": "self",
      "type": "application/webpub+json"
    }
  ],
  "metadata": {
    "title": "Tokkerin käsikirja",
    "author": "Jaakob Rissanen & Ville Kormilainen",
    "language": "fi",
    "identifier": "urn:uuid:f0d26c0b-a79e-42c4-9764-aa44dcc0511a",
    "publisher": "Kustannusosakeyhtiö Otava",
    "published": "2021-11-24T07:28:13Z",
    "modified": "2021-11-29T08:57:28Z",
    "presentation": {
      "layout": "reflowable"
    },
    "conformsTo": "https://readium.org/webpub-manifest/profiles/epub",
    "http://idpf.org/epub/vocab/package/meta/#Sigil version": "1.8.0",
    "http://idpf.org/epub/vocab/package/meta/#generator": "Adobe InDesign 16.4",
    "http://purl.org/dc/terms/rights": "Tekijät ja Kustannusosakeyhtiö Otava",
    "http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0/specified-fonts": "true",
    "http://www.idpf.org/2007/opf#version": "3.0",
    "https://github.com/readium/go-toolkit/releases": "v0.10.2"
  },
  "readingOrder": [
    { "href": "OEBPS/Tokkerin_kasikirja.xhtml", "type": "application/xhtml+xml" },
    { "href": "OEBPS/Tokkerin_kasikirja-1.xhtml", "type": "application/xhtml+xml" },
    { "href": "OEBPS/Tokkerin_kasikirja-2.xhtml", "type": "application/xhtml+xml" },
    ...
    { "href": "OEBPS/Tokkerin_kasikirja-61.xhtml", "type": "application/xhtml+xml" }
  ],
  "resources": [
    { "href": "OEBPS/toc.ncx", "type": "application/x-dtbncx+xml" },
    { "href": "OEBPS/toc.xhtml", "rel": "contents", "type": "application/xhtml+xml" },
    { "href": "OEBPS/css/idGeneratedStyles.css", "type": "text/css" },
    { "href": "OEBPS/font/AktivGrotesk-Light.ttf", "type": "application/vnd.ms-opentype" },
    ...
    { "href": "OEBPS/video/video-20.mp4", "type": "video/mp4" }
  ],
  "toc": [
    { "href": "OEBPS/Tokkerin_kasikirja.xhtml#_idParaDest-1", "title": "Kansi" },
    { "href": "OEBPS/Tokkerin_kasikirja-1.xhtml#_idParaDest-2", "title": "Nimiö" },
    { "href": "OEBPS/Tokkerin_kasikirja-2.xhtml#_idParaDest-3", "title": "Tekijänoikeudet" },
    ...
    { "href": "OEBPS/Tokkerin_kasikirja-59.xhtml#_idParaDest-27", "title": "23. Lopuksi" }
  ]
}