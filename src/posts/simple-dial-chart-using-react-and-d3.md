---
layout: 'layouts/Blog.astro'
title: Simple dial chart using react and d3
description: A simple dial using react and d3 modules.
date: 2016-02-01
tags:
  - react
  - d3
  - charts
  - javascript
---

Here is a simple dial chart in react by making use of [d3-shape](https://github.com/d3/d3-shape) and [d3-scale](https://github.com/d3/d3-scale) modules.

```jsx
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { arc } from 'd3-shape';
import { scaleLinear } from 'd3-scale';

const startAngle = (-1 * Math.PI) / 3; // - 60deg
const endAngle = Math.PI / 3; // 60deg

//Create an arc path for dial
const dial = arc().startAngle(startAngle).endAngle(endAngle).innerRadius(80).outerRadius(145);

//Create a scale for using with arc
const scale = scaleLinear()
	.domain([0, 100]) // Adjust the values according to your data
	.range([startAngle, endAngle]);

const Chart = React.createClass({
	render() {
		const width = 300,
			height = 300,
			transform = `translate(${width * 0.5},${0.65 * height})`,
			current = (x) => dial.endAngle(scale(x))(); // get arc path for given value

		return (
			<svg viewBox={`0 0 ${width} ${height}`}>
				<path fill="#dddddd" d={dial()} transform={transform} />
				<path fill="#f44336" d={current(this.props.fill)} transform={transform} />
			</svg>
		);
	},
});

//Do not forget to include/change the id of the target element
ReactDOM.render(<Chart fill={60} />, document.getElementById('main'));
```

<p><iframe height='268' scrolling='no' src='//codepen.io/vkbansal/embed/preview/NxzBGM/?height=268&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/vkbansal/pen/NxzBGM/'>Simple dial chart using react and d3</a> by Vivek Kumar Bansal (<a href='http://codepen.io/vkbansal'>@vkbansal</a>) on <a href='http://codepen.io'>CodePen</a>.

</iframe>

</p>
