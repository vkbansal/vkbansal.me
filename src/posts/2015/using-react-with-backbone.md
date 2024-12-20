---
title: Using React with Backbone
date: 2015-01-18
description: This article deals with using React, a javascript library for building user interfaces and Backbone, a minimal javascript MVC framework.
tags:
  - reactjs
  - backbonejs
  - javascript
---

[Backbone](http://backbonejs.org/) is a very popular and minimal MVC framework for javascript by [Jeremy Ashkenas](https://github.com/jashkenas). It gives a web application a nice structure and helps in seperation of concerns with _Models, Collections and Views_. But Backbone Views are very minimal and requires a lot of code to setup. This is where [React](http://facebook.github.io/react/) steps in. It's a javascript library for building user interfaces by Facebook and people use React as the V in MVC as their website states. While researching for ways to use them together I came across many different solutions but none of them were satisfactory for me until I came across an answer by [Dan Abramov](https://twitter.com/dan_abramov) on [stackoverflow](http://stackoverflow.com/questions/21709905/can-i-avoid-forceupdate-when-using-react-with-backbone/21709906#21709906). I found it very helpful and wanted to share this.

### The Mixin

Dan made a simple mixin which uses neither `setProps` nor `forceUpdate` which is what I was exactly looking for.

```js
var BackboneStateMixin = {
	getInitialState: function () {
		return this.getBackboneState(this.props);
	},

	componentDidMount: function () {
		if (!_.isFunction(this.getBackboneState)) {
			throw new Error('You must provide getBackboneState(props).');
		}

		this._bindBackboneEvents(this.props);
	},

	componentWillReceiveProps: function (newProps) {
		this._unbindBackboneEvents();
		this._bindBackboneEvents(newProps);
	},

	componentWillUnmount: function () {
		this._unbindBackboneEvents();
	},

	_updateBackboneState: function () {
		var state = this.getBackboneState(this.props);
		this.setState(state);
	},

	_bindBackboneEvents: function (props) {
		if (!_.isFunction(this.watchBackboneProps)) {
			return;
		}

		if (this._backboneListener) {
			throw new Error('Listener already exists.');
		}

		if (!props) {
			throw new Error('Passed props are empty');
		}

		var listener = _.extend({}, Backbone.Events),
			listenTo = _.partial(listener.listenTo.bind(listener), _, _, this._updateBackboneState);

		this.watchBackboneProps(props, listenTo);
		this._backboneListener = listener;
	},

	_unbindBackboneEvents: function () {
		if (!_.isFunction(this.watchBackboneProps)) {
			return;
		}

		if (!this._backboneListener) {
			throw new Error('Listener does not exist.');
		}

		this._backboneListener.stopListening();
		delete this._backboneListener;
	},
};
```

The idea behind this mixin is that _Backbone Models\Collections_ are set as `props` and their `toJSON` value is automatically put by mixin into `state`. One needs to override `getBackboneState(props)` for this to work, and optionally `watchBackboneProps` to tell the mixin when to call `setState` with fresh values.

### Usage Example

The above mixin can be used with any _React components_ as follows without having to worry about stale values in _Backbone Model\Collection_

```js
var MyComponent = React.createClass({
	mixins: [BackboneStateMixin],
	getBackboneState: function (props) {
		return {
			model: props.model.toJSON(),
			collection: props.collection.toJSON(),
		};
	},
	watchBackboneProps: function (props, listenTo) {
		listenTo(props.model, 'change:someValue');
		listenTo(props.collection, 'change reset add remove');
	},
	render: function () {
		//Use JSON values from this.state.model
		//or this.state.collection
	},
});
```

### Conclusion

I found this very helpful and hope you too can benefit from it.
