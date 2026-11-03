# Third-party notices

CyberJourney is MIT licensed (see LICENSE). It is built with the open-source
software below. No third-party fonts, images or icon files are bundled: the app
icon and logo were drawn for this project, and the UI uses fonts already
installed on your computer (Inter / Segoe UI, JetBrains Mono / Cascadia Mono / Consolas).

## Color palette

The UI palette is original to CyberJourney (no color files are copied). It is
inspired by the calm, mostly monochrome dark themes of Linear
(https://linear.app/now/how-we-redesigned-the-linear-ui) and Vercel Geist
(https://vercel.com/geist/colors): warm neutral grays, one muted accent
(Periwinkle, Sage or Rose) and soft, low-saturation tones for status and charts.
All text colors reach WCAG AA (4.5:1).

## Runtime

| Package | Version | License |
|---|---|---|
| [electron](https://github.com/electron/electron) | 38.8.6 | MIT |

Electron includes Chromium and Node.js. Their licenses are shipped with the
app as `LICENSE.electron.txt` and `LICENSES.chromium.html` in the install folder.

## Packages bundled into the app (163)

Almost all are MIT. A few small helpers used inside recharts, TipTap / ProseMirror, refractor and
Radix use other permissive licenses (ISC, BSD-3-Clause, 0BSD); their full texts are below.

| Package | Version | License |
|---|---|---|
| [@floating-ui/core](https://github.com/floating-ui/floating-ui) | 1.8.0 | MIT |
| [@floating-ui/dom](https://github.com/floating-ui/floating-ui) | 1.8.0 | MIT |
| [@floating-ui/react-dom](https://github.com/floating-ui/floating-ui) | 2.1.9 | MIT |
| [@floating-ui/utils](https://github.com/floating-ui/floating-ui) | 0.2.12 | MIT |
| [@radix-ui/primitive](https://github.com/radix-ui/primitives) | 1.2.0 | MIT |
| [@radix-ui/react-arrow](https://github.com/radix-ui/primitives) | 1.1.17 | MIT |
| [@radix-ui/react-collection](https://github.com/radix-ui/primitives) | 1.2.0 | MIT |
| [@radix-ui/react-compose-refs](https://github.com/radix-ui/primitives) | 1.1.5 | MIT |
| [@radix-ui/react-context](https://github.com/radix-ui/primitives) | 1.3.0 | MIT |
| [@radix-ui/react-dialog](https://github.com/radix-ui/primitives) | 1.3.1 | MIT |
| [@radix-ui/react-direction](https://github.com/radix-ui/primitives) | 1.2.0 | MIT |
| [@radix-ui/react-dismissable-layer](https://github.com/radix-ui/primitives) | 1.2.1 | MIT |
| [@radix-ui/react-dropdown-menu](https://github.com/radix-ui/primitives) | 2.2.1 | MIT |
| [@radix-ui/react-focus-guards](https://github.com/radix-ui/primitives) | 1.2.0 | MIT |
| [@radix-ui/react-focus-scope](https://github.com/radix-ui/primitives) | 1.3.1 | MIT |
| [@radix-ui/react-id](https://github.com/radix-ui/primitives) | 1.1.4 | MIT |
| [@radix-ui/react-menu](https://github.com/radix-ui/primitives) | 2.2.1 | MIT |
| [@radix-ui/react-popover](https://github.com/radix-ui/primitives) | 1.3.1 | MIT |
| [@radix-ui/react-popper](https://github.com/radix-ui/primitives) | 1.4.0 | MIT |
| [@radix-ui/react-portal](https://github.com/radix-ui/primitives) | 1.2.0 | MIT |
| [@radix-ui/react-presence](https://github.com/radix-ui/primitives) | 1.1.11 | MIT |
| [@radix-ui/react-primitive](https://github.com/radix-ui/primitives) | 2.2.0 | MIT |
| [@radix-ui/react-roving-focus](https://github.com/radix-ui/primitives) | 1.2.1 | MIT |
| [@radix-ui/react-slot](https://github.com/radix-ui/primitives) | 1.5.0 | MIT |
| [@radix-ui/react-tooltip](https://github.com/radix-ui/primitives) | 1.4.1 | MIT |
| [@radix-ui/react-use-callback-ref](https://github.com/radix-ui/primitives) | 1.1.5 | MIT |
| [@radix-ui/react-use-controllable-state](https://github.com/radix-ui/primitives) | 1.3.0 | MIT |
| [@radix-ui/react-use-effect-event](https://github.com/radix-ui/primitives) | 0.0.5 | MIT |
| [@radix-ui/react-use-is-hydrated](https://github.com/radix-ui/primitives) | 0.1.3 | MIT |
| [@radix-ui/react-use-layout-effect](https://github.com/radix-ui/primitives) | 1.1.4 | MIT |
| [@radix-ui/react-use-rect](https://github.com/radix-ui/primitives) | 1.1.4 | MIT |
| [@radix-ui/react-use-size](https://github.com/radix-ui/primitives) | 1.1.5 | MIT |
| [@radix-ui/react-visually-hidden](https://github.com/radix-ui/primitives) | 1.2.13 | MIT |
| [@radix-ui/rect](https://github.com/radix-ui/primitives) | 1.1.3 | MIT |
| [@reduxjs/toolkit](https://github.com/reduxjs/redux-toolkit) | 2.13.0 | MIT |
| [@standard-schema/spec](https://github.com/standard-schema/standard-schema) | 1.1.0 | MIT |
| [@standard-schema/utils](https://github.com/standard-schema/standard-schema) | 0.3.0 | MIT |
| [@tabler/icons](https://github.com/tabler/tabler-icons) | 3.50.0 | MIT |
| [@tabler/icons-react](https://github.com/tabler/tabler-icons) | 3.50.0 | MIT |
| [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography) | 0.5.20 | MIT |
| [@tiptap/core](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-blockquote](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-bold](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-bullet-list](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-code](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-code-block](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-document](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-dropcursor](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-gapcursor](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-hard-break](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-heading](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-horizontal-rule](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-italic](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-link](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-list](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-list-item](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-list-keymap](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-ordered-list](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-paragraph](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-placeholder](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-strike](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-table](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-text](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extension-underline](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/extensions](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/markdown](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/pm](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/react](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@tiptap/starter-kit](https://github.com/ueberdosis/tiptap) | 3.32.2 | MIT |
| [@types/d3-array](https://github.com/DefinitelyTyped/DefinitelyTyped) | 3.2.2 | MIT |
| [@types/d3-color](https://github.com/DefinitelyTyped/DefinitelyTyped) | 3.1.3 | MIT |
| [@types/d3-ease](https://github.com/DefinitelyTyped/DefinitelyTyped) | 3.0.2 | MIT |
| [@types/d3-interpolate](https://github.com/DefinitelyTyped/DefinitelyTyped) | 3.0.4 | MIT |
| [@types/d3-path](https://github.com/DefinitelyTyped/DefinitelyTyped) | 3.1.1 | MIT |
| [@types/d3-scale](https://github.com/DefinitelyTyped/DefinitelyTyped) | 4.0.9 | MIT |
| [@types/d3-shape](https://github.com/DefinitelyTyped/DefinitelyTyped) | 3.2.0 | MIT |
| [@types/d3-time](https://github.com/DefinitelyTyped/DefinitelyTyped) | 3.0.4 | MIT |
| [@types/d3-timer](https://github.com/DefinitelyTyped/DefinitelyTyped) | 3.0.2 | MIT |
| [@types/hast](https://github.com/DefinitelyTyped/DefinitelyTyped) | 3.0.5 | MIT |
| [@types/prismjs](https://github.com/DefinitelyTyped/DefinitelyTyped) | 1.26.6 | MIT |
| [@types/unist](https://github.com/DefinitelyTyped/DefinitelyTyped) | 3.0.3 | MIT |
| [@types/use-sync-external-store](https://github.com/DefinitelyTyped/DefinitelyTyped) | 0.0.6 | MIT |
| [aria-hidden](https://github.com/theKashey/aria-hidden) | 1.2.6 | MIT |
| [character-entities](https://github.com/wooorm/character-entities) | 2.0.2 | MIT |
| [character-entities-legacy](https://github.com/wooorm/character-entities-legacy) | 3.0.0 | MIT |
| [character-reference-invalid](https://github.com/wooorm/character-reference-invalid) | 2.0.1 | MIT |
| [clsx](https://github.com/lukeed/clsx) | 2.1.1 | MIT |
| [cmdk](https://github.com/pacocoursey/cmdk) | 1.1.1 | MIT |
| [comma-separated-tokens](https://github.com/wooorm/comma-separated-tokens) | 2.0.3 | MIT |
| [cssesc](https://github.com/mathiasbynens/cssesc) | 3.0.0 | MIT |
| [d3-array](https://github.com/d3/d3-array) | 3.2.4 | ISC |
| [d3-color](https://github.com/d3/d3-color) | 3.1.0 | ISC |
| [d3-ease](https://github.com/d3/d3-ease) | 3.0.1 | BSD-3-Clause |
| [d3-format](https://github.com/d3/d3-format) | 3.1.2 | ISC |
| [d3-interpolate](https://github.com/d3/d3-interpolate) | 3.0.1 | ISC |
| [d3-path](https://github.com/d3/d3-path) | 3.1.0 | ISC |
| [d3-scale](https://github.com/d3/d3-scale) | 4.0.2 | ISC |
| [d3-shape](https://github.com/d3/d3-shape) | 3.2.0 | ISC |
| [d3-time](https://github.com/d3/d3-time) | 3.1.0 | ISC |
| [d3-time-format](https://github.com/d3/d3-time-format) | 4.1.0 | ISC |
| [d3-timer](https://github.com/d3/d3-timer) | 3.0.1 | ISC |
| [date-fns](https://github.com/date-fns/date-fns) | 4.4.0 | MIT |
| [decimal.js-light](https://github.com/MikeMcl/decimal.js-light) | 2.5.1 | MIT |
| [decode-named-character-reference](https://github.com/wooorm/decode-named-character-reference) | 1.3.0 | MIT |
| [detect-node-es](https://github.com/thekashey/detect-node) | 1.1.0 | MIT |
| [es-toolkit](https://github.com/toss/es-toolkit) | 1.53.1 | MIT |
| [eventemitter3](git://github.com/primus/eventemitter3) | 5.0.4 | MIT |
| [fast-equals](https://github.com/planttheidea/fast-equals) | 5.4.5 | MIT |
| [get-nonce](git@github.com:theKashey/get-nonce) | 1.0.1 | MIT |
| [hast-util-parse-selector](https://github.com/syntax-tree/hast-util-parse-selector) | 4.0.0 | MIT |
| [hastscript](https://github.com/syntax-tree/hastscript) | 9.0.3 | MIT |
| [immer](https://github.com/immerjs/immer) | 11.2.9 | MIT |
| [internmap](https://github.com/mbostock/internmap) | 2.0.3 | ISC |
| [is-alphabetical](https://github.com/wooorm/is-alphabetical) | 2.0.1 | MIT |
| [is-alphanumerical](https://github.com/wooorm/is-alphanumerical) | 2.0.1 | MIT |
| [is-decimal](https://github.com/wooorm/is-decimal) | 2.0.1 | MIT |
| [is-hexadecimal](https://github.com/wooorm/is-hexadecimal) | 2.0.1 | MIT |
| [linkifyjs](https://github.com/nfrasser/linkifyjs) | 4.4.0 | MIT |
| [marked](git://github.com/markedjs/marked) | 17.0.6 | MIT |
| [nanoid](https://github.com/ai/nanoid) | 6.0.2 | MIT |
| [orderedmap](https://github.com/marijnh/orderedmap) | 2.1.1 | MIT |
| [parse-entities](https://github.com/wooorm/parse-entities) | 4.0.2 | MIT |
| [postcss-selector-parser](https://github.com/postcss/postcss-selector-parser) | 6.0.10 | MIT |
| [property-information](https://github.com/wooorm/property-information) | 7.2.0 | MIT |
| [prosemirror-changeset](https://code.haverbeke.berlin/prosemirror/prosemirror-changeset) | 2.4.6 | MIT |
| [prosemirror-commands](https://code.haverbeke.berlin/prosemirror/prosemirror-commands) | 1.7.2 | MIT |
| [prosemirror-dropcursor](https://code.haverbeke.berlin/prosemirror/prosemirror-dropcursor) | 1.8.4 | MIT |
| [prosemirror-gapcursor](git://github.com/prosemirror/prosemirror-gapcursor) | 1.4.1 | MIT |
| [prosemirror-history](https://code.haverbeke.berlin/prosemirror/prosemirror-history) | 1.5.1 | MIT |
| [prosemirror-inputrules](git://github.com/prosemirror/prosemirror-inputrules) | 1.5.1 | MIT |
| [prosemirror-keymap](git://github.com/prosemirror/prosemirror-keymap) | 1.2.3 | MIT |
| [prosemirror-model](https://code.haverbeke.berlin/prosemirror/prosemirror-model) | 1.25.12 | MIT |
| [prosemirror-schema-list](https://code.haverbeke.berlin/prosemirror/prosemirror-schema-list) | 1.6.0 | MIT |
| [prosemirror-state](git://github.com/prosemirror/prosemirror-state) | 1.4.4 | MIT |
| [prosemirror-tables](https://github.com/ProseMirror/prosemirror-tables) | 1.8.5 | MIT |
| [prosemirror-transform](https://code.haverbeke.berlin/prosemirror/prosemirror-transform) | 1.12.4 | MIT |
| [prosemirror-view](https://code.haverbeke.berlin/prosemirror/prosemirror-view) | 1.42.9 | MIT |
| [react](https://github.com/react/react) | 19.3.1 | MIT |
| [react-dom](https://github.com/react/react) | 19.3.1 | MIT |
| [react-redux](https://github.com/reduxjs/react-redux) | 9.3.1 | MIT |
| [react-remove-scroll](https://github.com/theKashey/react-remove-scroll) | 2.7.2 | MIT |
| [react-remove-scroll-bar](https://github.com/theKashey/react-remove-scroll-bar) | 2.3.8 | MIT |
| [react-style-singleton](https://github.com/theKashey/react-style-singleton) | 2.2.3 | MIT |
| [recharts](https://github.com/recharts/recharts) | 3.10.1 | MIT |
| [redux](https://github.com/reduxjs/redux) | 5.0.1 | MIT |
| [redux-thunk](https://github.com/reduxjs/redux-thunk) | 3.1.0 | MIT |
| [refractor](https://github.com/wooorm/refractor) | 5.0.0 | MIT |
| [reselect](https://github.com/reduxjs/reselect) | 5.2.0 | MIT |
| [rope-sequence](https://github.com/marijnh/rope-sequence) | 1.3.4 | MIT |
| [scheduler](https://github.com/react/react) | 0.28.0 | MIT |
| [sonner](https://github.com/emilkowalski/sonner) | 2.0.8 | MIT |
| [space-separated-tokens](https://github.com/wooorm/space-separated-tokens) | 2.0.2 | MIT |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 3.7.0 | MIT |
| [tailwindcss](https://github.com/tailwindlabs/tailwindcss) | 4.3.3 | MIT |
| [tiny-invariant](https://github.com/alexreardon/tiny-invariant) | 1.3.3 | MIT |
| [tslib](https://github.com/Microsoft/tslib) | 2.9.1 | 0BSD |
| [use-callback-ref](https://github.com/theKashey/use-callback-ref/) | 1.3.3 | MIT |
| [use-sidecar](https://github.com/theKashey/use-sidecar) | 1.1.3 | MIT |
| [use-sync-external-store](https://github.com/react/react) | 1.7.0 | MIT |
| [util-deprecate](git://github.com/TooTallNate/util-deprecate) | 1.0.2 | MIT |
| [victory-vendor](https://github.com/FormidableLabs/victory) | 37.4.1 | MIT AND ISC AND BSD-3-Clause |
| [w3c-keyname](https://github.com/marijnh/w3c-keyname) | 2.2.8 | MIT |
| [zustand](https://github.com/pmndrs/zustand) | 5.0.16 | MIT |

## Build tools (not shipped)

electron-vite, Vite, TypeScript, ESLint, typescript-eslint, @vitejs/plugin-react,
@tailwindcss/vite and electron-builder (all MIT; TypeScript is Apache-2.0).
`scripts/nsis-no-wine` calls electron-builder's own `UninstallerReader` (MIT).

## License texts for non-MIT packages

### d3-array@3.2.4 (ISC)

```text
Copyright 2010-2023 Mike Bostock

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```

### d3-color@3.1.0 (ISC)

```text
Copyright 2010-2022 Mike Bostock

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```

### d3-ease@3.0.1 (BSD-3-Clause)

```text
Copyright 2010-2021 Mike Bostock
Copyright 2001 Robert Penner
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the author nor the names of contributors may be used to
  endorse or promote products derived from this software without specific prior
  written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

### d3-format@3.1.2 (ISC)

```text
Copyright 2010-2026 Mike Bostock

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```

### d3-interpolate@3.0.1 (ISC)

```text
Copyright 2010-2021 Mike Bostock

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```

### d3-path@3.1.0 (ISC)

```text
Copyright 2015-2022 Mike Bostock

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```

### d3-scale@4.0.2 (ISC)

```text
Copyright 2010-2021 Mike Bostock

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```

### d3-shape@3.2.0 (ISC)

```text
Copyright 2010-2022 Mike Bostock

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```

### d3-time@3.1.0 (ISC)

```text
Copyright 2010-2022 Mike Bostock

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```

### d3-time-format@4.1.0 (ISC)

```text
Copyright 2010-2021 Mike Bostock

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```

### d3-timer@3.0.1 (ISC)

```text
Copyright 2010-2021 Mike Bostock

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```

### internmap@2.0.3 (ISC)

```text
Copyright 2021 Mike Bostock

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```

### tslib@2.9.1 (0BSD)

```text
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```

### victory-vendor@37.4.1 (MIT AND ISC AND BSD-3-Clause)

```text
The MIT License (MIT)

Copyright (c) 2015-2026 Nearform.

Copyright (c) 2016-2020 Alexey Svetliakov <https://github.com/asvetliakov>,
snerks <https://github.com/snerks>, Krzysztof Cebula <https://github.com
Havret>, Vitaliy Polyanskiy <https://github.com/alreadyExisted>, James Lismore
<https://github.com/jlismore>, Stack Builders <https://github.com
stackbuilders>, Esteban Ibarra <https://github.com/ibarrae>, Dominic Lee
<https://github.com/dominictwlee>, Dave Vedder <https://github.com
veddermatic>, Alec Flett <https://github.com/alecf> and potentially other
DefinitelyTyped contributors.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

================================================================================
Third-party software
================================================================================

`victory-vendor` bundles transpiled copies of the following libraries in
`lib-vendor/` (used by the CommonJS build). Their licenses are reproduced
below. The original license file for each library is also available at
`lib-vendor/<library>/LICENSE`.

--------------------------------------------------------------------------------
d3-array (ISC), d3-color (ISC), d3-format (ISC), d3-interpolate (ISC),
d3-path (ISC), d3-scale (ISC), d3-shape (ISC), d3-time (ISC),
d3-time-format (ISC), d3-timer (ISC), internmap (ISC)
--------------------------------------------------------------------------------

Copyright 2010-2022 Mike Bostock
Copyright 2010-2021 Mike Bostock
Copyright 2015-2021 Mike Bostock
Copyright 2021 Mike Bostock

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.

--------------------------------------------------------------------------------
d3-ease (BSD-3-Clause)
--------------------------------------------------------------------------------

Copyright 2010-2021 Mike Bostock
Copyright 2001 Robert Penner
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the author nor the names of contributors may be used to
  endorse or promote products derived from this software without specific prior
  written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

--------------------------------------------------------------------------------
d3-voronoi (BSD-3-Clause)
--------------------------------------------------------------------------------

Copyright 2010-2016 Mike Bostock
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the author nor the names of contributors may be used to
  endorse or promote products derived from this software without specific prior
  written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Copyright (C) 2010-2013 Raymond Hill
https://github.com/gorhill/Javascript-Voronoi

Licensed under The MIT License
http://en.wikipedia.org/wiki/MIT_License

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## MIT License texts

Each MIT package keeps its own copyright line in its LICENSE file. The common text is:

```text
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

Copyright lines:

- @floating-ui/core: Copyright (c) 2021-present Floating UI contributors
- @floating-ui/dom: Copyright (c) 2021-present Floating UI contributors
- @floating-ui/react-dom: Copyright (c) 2021-present Floating UI contributors
- @floating-ui/utils: Copyright (c) 2021-present Floating UI contributors
- @radix-ui/primitive: Copyright (c) 2022 WorkOS
- @radix-ui/react-arrow: Copyright (c) 2022 WorkOS
- @radix-ui/react-collection: Copyright (c) 2022 WorkOS
- @radix-ui/react-compose-refs: Copyright (c) 2022 WorkOS
- @radix-ui/react-context: Copyright (c) 2022 WorkOS
- @radix-ui/react-dialog: Copyright (c) 2022 WorkOS
- @radix-ui/react-direction: Copyright (c) 2022 WorkOS
- @radix-ui/react-dismissable-layer: Copyright (c) 2022 WorkOS
- @radix-ui/react-dropdown-menu: Copyright (c) 2022 WorkOS
- @radix-ui/react-focus-guards: Copyright (c) 2022 WorkOS
- @radix-ui/react-focus-scope: Copyright (c) 2022 WorkOS
- @radix-ui/react-id: Copyright (c) 2022 WorkOS
- @radix-ui/react-menu: Copyright (c) 2022 WorkOS
- @radix-ui/react-popover: Copyright (c) 2022 WorkOS
- @radix-ui/react-popper: Copyright (c) 2022 WorkOS
- @radix-ui/react-portal: Copyright (c) 2022 WorkOS
- @radix-ui/react-presence: Copyright (c) 2022 WorkOS
- @radix-ui/react-primitive: Copyright (c) 2022 WorkOS
- @radix-ui/react-roving-focus: Copyright (c) 2022 WorkOS
- @radix-ui/react-slot: Copyright (c) 2022 WorkOS
- @radix-ui/react-tooltip: Copyright (c) 2022 WorkOS
- @radix-ui/react-use-callback-ref: Copyright (c) 2022 WorkOS
- @radix-ui/react-use-controllable-state: Copyright (c) 2022 WorkOS
- @radix-ui/react-use-effect-event: Copyright (c) 2022 WorkOS
- @radix-ui/react-use-is-hydrated: Copyright (c) 2022 WorkOS
- @radix-ui/react-use-layout-effect: Copyright (c) 2022 WorkOS
- @radix-ui/react-use-rect: Copyright (c) 2022 WorkOS
- @radix-ui/react-use-size: Copyright (c) 2022 WorkOS
- @radix-ui/react-visually-hidden: Copyright (c) 2022 WorkOS
- @radix-ui/rect: Copyright (c) 2022 WorkOS
- @reduxjs/toolkit: Copyright (c) 2018 Mark Erikson
- @standard-schema/spec: Copyright (c) 2024 Colin McDonnell
- @standard-schema/utils: Copyright (c) 2024 Fabian Hiller
- @tabler/icons: Copyright (c) 2020-2026 Paweł Kuna
- @tabler/icons-react: Copyright (c) 2020-2026 Paweł Kuna
- @tailwindcss/typography: Copyright (c) Tailwind Labs, Inc.
- @tiptap/core: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-blockquote: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-bold: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-bullet-list: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-code: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-code-block: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-document: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-dropcursor: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-gapcursor: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-hard-break: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-heading: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-horizontal-rule: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-italic: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-link: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-list: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-list-item: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-list-keymap: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-ordered-list: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-paragraph: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-placeholder: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-strike: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-table: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-text: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extension-underline: Copyright (c) 2025, Tiptap GmbH
- @tiptap/extensions: Copyright (c) 2025, Tiptap GmbH
- @tiptap/markdown: Copyright (c) 2025, Tiptap GmbH
- @tiptap/pm: Copyright (c) 2025, Tiptap GmbH
- @tiptap/react: Copyright (c) 2025, Tiptap GmbH
- @tiptap/starter-kit: Copyright (c) 2025, Tiptap GmbH
- @types/d3-array: Copyright (c) Microsoft Corporation.
- @types/d3-color: Copyright (c) Microsoft Corporation.
- @types/d3-ease: Copyright (c) Microsoft Corporation.
- @types/d3-interpolate: Copyright (c) Microsoft Corporation.
- @types/d3-path: Copyright (c) Microsoft Corporation.
- @types/d3-scale: Copyright (c) Microsoft Corporation.
- @types/d3-shape: Copyright (c) Microsoft Corporation.
- @types/d3-time: Copyright (c) Microsoft Corporation.
- @types/d3-timer: Copyright (c) Microsoft Corporation.
- @types/hast: Copyright (c) Microsoft Corporation.
- @types/prismjs: Copyright (c) Microsoft Corporation.
- @types/unist: Copyright (c) Microsoft Corporation.
- @types/use-sync-external-store: Copyright (c) Microsoft Corporation.
- aria-hidden: Copyright (c) 2017 Anton Korzunov
- character-entities: Copyright (c) 2015 Titus Wormer <tituswormer@gmail.com>
- character-entities-legacy: Copyright (c) 2015 Titus Wormer <tituswormer@gmail.com>
- character-reference-invalid: Copyright (c) 2015 Titus Wormer <tituswormer@gmail.com>
- clsx: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
- cmdk: Copyright (c) 2022 Paco Coursey
- comma-separated-tokens: Copyright (c) 2016 Titus Wormer <tituswormer@gmail.com>
- cssesc: Copyright Mathias Bynens <https://mathiasbynens.be/>
- date-fns: Copyright (c) 2021 Sasha Koss and Lesha Koss https://kossnocorp.mit-license.org
- decimal.js-light: Copyright (c) 2020 Michael Mclaughlin
- decode-named-character-reference: Copyright (c) Titus Wormer <tituswormer@gmail.com>
- detect-node-es: Copyright (c) 2017 Ilya Kantor
- es-toolkit: Copyright (c) 2024 Viva Republica, Inc.
- eventemitter3: Copyright (c) 2014 Arnout Kazemier
- fast-equals: Copyright (c) 2025 Tony Quetano
- get-nonce: Copyright (c) 2020 Anton Korzunov
- hast-util-parse-selector: Copyright (c) 2016 Titus Wormer <tituswormer@gmail.com>
- hastscript: Copyright (c) Titus Wormer <tituswormer@gmail.com>
- immer: Copyright (c) 2017 Michel Weststrate
- is-alphabetical: Copyright (c) 2016 Titus Wormer <tituswormer@gmail.com>
- is-alphanumerical: Copyright (c) 2016 Titus Wormer <tituswormer@gmail.com>
- is-decimal: Copyright (c) 2016 Titus Wormer <tituswormer@gmail.com>
- is-hexadecimal: Copyright (c) 2016 Titus Wormer <tituswormer@gmail.com>
- linkifyjs: Copyright (c) 2024 Nick Frasser
- marked: Copyright (c) 2018+, MarkedJS (https://github.com/markedjs/)
- nanoid: Copyright 2017 Andrey Sitnik <andrey@sitnik.es>
- orderedmap: Copyright (C) 2016 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
- parse-entities: Copyright (c) Titus Wormer <mailto:tituswormer@gmail.com>
- postcss-selector-parser: Copyright (c) Ben Briggs <beneb.info@gmail.com> (http://beneb.info)
- property-information: Copyright (c) Titus Wormer <mailto:tituswormer@gmail.com>
- prosemirror-changeset: Copyright (C) 2017 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
- prosemirror-commands: Copyright (C) 2015-2017 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
- prosemirror-dropcursor: Copyright (C) 2015-2017 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
- prosemirror-gapcursor: Copyright (C) 2015-2017 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
- prosemirror-history: Copyright (C) 2015-2017 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
- prosemirror-inputrules: Copyright (C) 2015-2017 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
- prosemirror-keymap: Copyright (C) 2015-2017 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
- prosemirror-model: Copyright (C) 2015-2017 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
- prosemirror-schema-list: Copyright (C) 2015-2017 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
- prosemirror-state: Copyright (C) 2015-2017 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
- prosemirror-tables: Copyright (C) 2015-2016 by Marijn Haverbeke <marijnh@gmail.com> and others
- prosemirror-transform: Copyright (C) 2015-2017 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
- prosemirror-view: Copyright (C) 2015-2017 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
- react: Copyright (c) Meta Platforms, Inc. and affiliates.
- react-dom: Copyright (c) Meta Platforms, Inc. and affiliates.
- react-redux: Copyright (c) 2015-present Dan Abramov
- react-remove-scroll: Copyright (c) 2017 Anton Korzunov
- react-remove-scroll-bar: see package LICENSE
- react-style-singleton: Copyright (c) 2017 Anton Korzunov
- recharts: Copyright (c) 2015-present recharts
- redux: Copyright (c) 2015-present Dan Abramov
- redux-thunk: Copyright (c) 2015-present Dan Abramov
- refractor: Copyright (c) Titus Wormer <tituswormer@gmail.com>
- reselect: Copyright (c) 2015-2018 Reselect Contributors
- rope-sequence: Copyright (C) 2016 by Marijn Haverbeke <marijn@haverbeke.berlin>
- scheduler: Copyright (c) Meta Platforms, Inc. and affiliates.
- sonner: Copyright (c) 2023 Emil Kowalski
- space-separated-tokens: Copyright (c) 2016 Titus Wormer <tituswormer@gmail.com>
- tailwind-merge: Copyright (c) 2021 Dany Castillo
- tailwindcss: Copyright (c) Tailwind Labs, Inc.
- tiny-invariant: Copyright (c) 2019 Alexander Reardon
- use-callback-ref: Copyright (c) 2017 Anton Korzunov
- use-sidecar: Copyright (c) 2017 Anton Korzunov
- use-sync-external-store: Copyright (c) Meta Platforms, Inc. and affiliates.
- util-deprecate: Copyright (c) 2014 Nathan Rajlich <nathan@tootallnate.net>
- w3c-keyname: Copyright (C) 2016 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
- zustand: Copyright (c) 2019 Paul Henschel

## Development-only tools (not shipped in the app)

- playwright-core 1.64.1 — Apache-2.0 — Copyright Microsoft Corporation. Used only by `scripts/component-shots.cjs` to take component screenshots. https://github.com/microsoft/playwright

## Mobile app

The phone app lives in its own repo, [kryfsec-mobile](https://github.com/0xbasinas/kryfsec-mobile), with its own notices.
