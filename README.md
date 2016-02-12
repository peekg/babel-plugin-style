# babel-plugin-style

[![Build Status](https://travis-ci.org/peekg/babel-plugin-style.svg)](https://travis-ci.org/peekg/babel-plugin-style)

This is a [Babel](https://babeljs.io/) plugin that defines a JavaScripy Style Object, for defining CSS.

Comparison of CSS in JS Libraries for React

https://github.com/FormidableLabs/radium/blob/master/docs/comparison/README.md

```js
var heading = Style.heading({
  "font-family": "'Open Sans', sans-serif",
  "font-size": "75%",
  "line-height": "1.35",
  "color": "black",
  "text-decoration": "none",
  "@media (max-width: 600px)": {
    "font-size": "50%"
  },
  ":hover": {
    "text-decoration": "underline",
  }
});

```
JS output with --debug option
```js
var headding = "headding0";
```
CSS output with --debug option
```css
.heading0 {
font-family: 'Open Sans', sans-serif;
font-size: 75%;
line-height: 1.35;
color: black;
text-decoration: none;
}
.heading0 :hover {
text-decoration: underline;
}
@media (max-width: 600px) {
.heading0 {
font-size: 50%;
}
}
```
