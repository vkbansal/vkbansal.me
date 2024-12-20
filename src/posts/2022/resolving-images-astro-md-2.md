---
title: Resolving markdown images with Astro (part 2)
date: 2022-08-07
description: The RC7 release of Astro, broke the previous implementation. Here is an updated version.
tags:
  - astro
  - vite
---

I had recently written about [resolving markdown images with Astro](/blog/resolving-images-astro-md),
but with the recent RC7 release of Astro, it no longer works and I had to update the implementation.
I recommend reading my [previous post](/blog/resolving-images-astro-md) to get an understanding of
the basic concepts and then come back here to see what changed.

## Changes in Astro

In the versions before RC7, the `compiledContent` function returned the HTML string directly, but in
RC7, a variable named `html` is initialized with the HTML string and the `compiledContent` function
returns the `html` variable.

```diff
+ const html = "<img src=\"./path/to/image.png\" />"

export function compiledContent() {
-  return '<img src="./path/to/image.png" />';
+  return html
}
```

## My Changes

After the update, [recast](https://github.com/benjamn/recast) was unable to parse the JS code anymore.
I was not able to figure out why. So I decided to ditch `recast` and use good old regex.

```diff
import path from 'node:path';
- import { parse, visit, prettyPrint } from 'recast';
import { camelCase } from 'change-case';

+ const HTML_REGEX = /const\s+html\s+=\s+(".*");/;
const IMG_REGEX = /<img\s.*?(src=('|")(.*?)(\2)).*?>/g;

function processHTMLContent(content: string, imgImports: string[]) {
  const newContent = content.replace(IMG_REGEX, (imgTag, fullSrc, _0, src) => {
    const variableName = camelCase(path.basename(src));

    imgImports.push(`import ${variableName} from "${src}";`);

    const updatedImg = imgTag.replace(fullSrc, 'src="${' + variableName + '}"');

    return updatedImg;
  });

  return newContent;
}

// focusing only on the transform function here
transform(code, id) {
  if (id.endsWith('md')) {
    const imgImports = []; // collecting all the imports here
-    const ast = parse(code);
-
-    visit(ast, {
-      visitFunctionDeclaration(path) {
-        if (path.node.id?.name === 'compiledContent') {
-          const returnStatement = path.node.body.body[0];
-
-          if (returnStatement.type === 'ReturnStatement' && returnStatement.argument) {
-            const { code } = prettyPrint(returnStatement.argument, printOptions);
-            const processedHTML = processHTMLContent(code, imgImports);
-
-            returnStatement.argument = parse(processedHTML).program.body[0];
-          }
-        }
-
-        return false;
-      },
-    });
-
-    const finalCode = `${imgImports.join('\n')}\n${prettyPrint(ast).code}`;

+    const result = code.replace(HTML_REGEX, (_0, html) => {
+        const preprocessedHTML = JSON.parse(html) // to unescape the string
+          .replace(/\\/g, '\\\\') // escape all the backslashes
+          .replace(/\$/g, '\\$') // escape all dollar signs
+          .replace(/`/g, '\\`'); // escape all back-ticks
+        const processedHTML = processHTMLContent(preprocessedHTML, imgImports);
+
+        return `const html = \`${processedHTML}\`;`;
+      });
+
+      const finalCode = `${imgImports.join('\n')}\n${result}`;

    return {
      code: finalCode,
    };a
  }
}
```

As you can see in the code, I use a regex to match and update the HTML content. The HTML is being
pre-processed a bit before it's updated using `processHTMLContent`.

1. The HTML is [serialized using `JSON.stringify`](https://github.com/withastro/astro/blob/78eeb4075d2d41213d10925d1aed3430f00c36ed/packages/astro/src/vite-plugin-markdown/index.ts#L62), hence we need to do the reverse and unescape it.
2. Escape all `\`. `$` and <code>`</code>, as the processed HTML will be serialized into JS template string.

Now this escaped HTML is passed to `processHTMLContent` in same way as before.

Here is what my final code looks like:

```ts
import path from 'node:path';
import { parse, visit, prettyPrint } from 'recast';
import { camelCase } from 'change-case';

const IMG_REGEX = /<img\s.*?(src=('|")(.*?)(\2)).*?>/g;

function processHTMLContent(content: string, imgImports: string[]) {
  const newContent = content.replace(IMG_REGEX, (imgTag, fullSrc, _0, src) => {
    const variableName = camelCase(path.basename(src));

    imgImports.push(`import ${variableName} from "${src}";`);

    const updatedImg = imgTag.replace(fullSrc, 'src="${' + variableName + '}"');

    return updatedImg;
  });

  return newContent;
}

// focusing only on the transform function here
transform(code, id) {
  if (id.endsWith('md')) {
    const imgImports = []; // collecting all the imports here
    const result = code.replace(HTML_REGEX, (_0, html) => {
      const preprocessedHTML = JSON.parse(html) // to unescape the string
        .replace(/(\\|\$|`)/g, '\\$1'); // escape all \, $, and `
      const processedHTML = processHTMLContent(preprocessedHTML, imgImports);

      return `const html = \`${processedHTML}\`;`;
    });

    const finalCode = `${imgImports.join('\n')}\n${result}`;

    return {
      code: finalCode,
    };
  }
}
```

I hope there will not be any more breaking changes going forward 🤞.
