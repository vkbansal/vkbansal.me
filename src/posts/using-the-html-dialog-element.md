---
layout: 'layouts/Blog.astro'
title: Using the HTML &lt;dialog/> element
description: Here, we take a look at using the new HTML <code>dialog</code> element
date: 2018-01-21
tags:
  - html
  - javascript
  - react
---

In HTML 5.2, `dialog` element was [introduced](https://www.w3.org/TR/html52/interactive-elements.html#the-dialog-element). It can be used to create a dialog box such as a popup or modal window. It automatically takes care of stacking, thus eliminating the need of any custom solutions like bootstrap-modal. At the time of writing this post, it is [supported](https://caniuse.com/#search=dialog) only in Chrome and Opera.

<iframe src="https://caniuse.bitsofco.de/embed/index.html?feat=dialog&amp;periods=future_1,current,past_1,past_2&amp;accessible-colours=false" frameborder="0" width="100%" height="420px" kwframeid="9"></iframe>

<br/>

<br/>

## Usage

The `<dialog>` element has two methods `show` and `showModal` that can be used to show the dialog. The main difference between the two is that `showModal` shows a backdrop whereas `show` does not. When the dialog is open, `open` attribute is added to the `<dialog>` element. The `<dialog>` element also has `close` method, which can be used to close the dialog.

## Code Example

```html
<dialog id="modal">
	<p>Hi! This is a modal.</p>
	<button id="hide-modal">OK</button>
</dialog>
<button id="show-modal">Show Modal</button>
<script>
	const modal = document.getElementById('modal');
	const showModalBtn = document.getElementById('show-modal');
	const hideModalBtn = document.getElementById('hide-modal');

	showModalBtn.addEventListener('click', () => {
		modal.showModal();
	});

	hideModalBtn.addEventListener('click', () => {
		modal.close();
	});
</script>
```

<iframe height='265' scrolling='no' title='Using HTML Dialog element' src='//codepen.io/vkbansal/embed/preview/VygmvV/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/vkbansal/pen/VygmvV/'>Using HTML Dialog element</a> by Vivek Kumar Bansal (<a href='https://codepen.io/vkbansal'>@vkbansal</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

<br/>

<br/>

## Styling

It is very easy to style the dialog using CSS. `::backdrop` selector can be used to style the backdrop. `transition`(s) do not work for animating the `<dialog>` element, but `@keyframes` animations can be used instead.

For animating the opening of a dialog, animation can be added `dialog[open]` and `dialog::backdrop`. For animating the closing of a dialog, we can add some class lets say `.close` to the dialog, add animation to `dialog.close` and `dialog.close::backdrop` , add an `animationend` event listener and remove the `.close` and call the `close` method in the callback.

You can see the code in action below:

<iframe height='265' scrolling='no' title='Animating HTML Dialog element' src='//codepen.io/vkbansal/embed/preview/dJaOmL/?height=265&theme-id=0&default-tab=css,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/vkbansal/pen/dJaOmL/'>Animating HTML Dialog element</a> by Vivek Kumar Bansal (<a href='https://codepen.io/vkbansal'>@vkbansal</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

<br/>

<br/>

`<dialog>` element can also be used with react as shown in below example:

<iframe src="https://codesandbox.io/embed/52k737m3n4?module=%2FDialog.js" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
