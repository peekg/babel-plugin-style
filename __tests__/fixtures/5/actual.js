Style({".className":{
  "span":{
    "color":"blue",
    "@media (max-width: 40em)": {
      position: "absolute",
      left: "-10000px",
      top: "auto",
      width: "1px",
      height: "1px",
      overflow: "hidden"
      },
      "@media (max-width: 41em)": {
        color: "grey"
      },
      "@media (max-width: 42em)": {
        color: "yellow"
      },
    },
  a:{
    color:"red",
    ":hover": {
      "text-decoration": "underline"
      }
    },
  div: {
    color: "green"
  },
  color: "darkgreen"
}
});

Style.heading({
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

