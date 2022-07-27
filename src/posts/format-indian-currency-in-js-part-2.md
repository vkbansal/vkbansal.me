---
layout: 'layouts/Blog.astro'
title: Format INR currency using JavaScript (Part 2)
description: Format INR currency using JavaScript (Part 2)
date: 2020-09-18
tags:
  - tricks
  - javascript
---

Some time back I had written about [formatting INR currency using JavaScript](/blog/format-indian-currency-in-js).
There I had shown a way using a regular expression. But we have come along since then and browsers now have better
internationalization (i18n) support thanks to the introduction of [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) Object. `Intl` is a global object that provides many language sensitive utility functions.

Today we will be taking a look at [`Intl.NumberFormat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat), which enables language sensitive number formatting.

```js
const numberFormatter = new Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'INR',
	minimumIntegerDigits: 2,
	currencyDisplay: 'symbol',
});

function formatNumberToINR(num) {
	return numberFormatter.format(num);
}

const formattedString = formatNumberToINR(1234567.89);

console.log(formattedString); // ₹12,34,567.89;
```

The above example shows how to format numbers to INR currency but you can customise it your needs by passing appropriate options.
