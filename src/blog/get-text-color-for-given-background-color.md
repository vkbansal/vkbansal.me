---
title: Get text color for given background color
description: Dynamically determine the font color for given background-color
date: 2017-10-18
tags:
  - tricks
  - css
---

For a side project, I needed a way to determine, whether to use a dark font or light font, based on the `background-color`, which is configurable by the user. After googling for a while, I found a perfect solution (for my use case at least).

If **luminance** of `background-color` is less than `0.5`, use light font else use dark font. Luminance of a given RGB value can be calculated using the following function:

```javascript
/**
 * red   number HEX value between 0 and 255 scaled to 0 and 1
 * green number HEX value between 0 and 255 scaled to 0 and 1
 * blue  number HEX value between 0 and 255 scaled to 0 and 1
 */
function getLuminance(red, green, blue) {
  const luminance = 1 - (0.299 * red + 0.587 * green + 0.114 * blue);

  return luminance;
}
```

This utility function is also [available](https://polished.js.org/docs/#getluminance) as a part of [Polished](https://github.com/styled-components/polished) library, and can handle hex values too. [Will Bamford](https://codepen.io/WebSeed/) has a [CodePen demonstrating the same](https://codepen.io/WebSeed/pen/pvgqEq).
