import React from "react";

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  const Zustand = require("zustand");
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackExtraHooks: [[Zustand, "useStore"]],
  });
}
