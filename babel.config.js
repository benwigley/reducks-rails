module.exports = {
  plugins: ["@babel/plugin-transform-classes"],
  presets: [
    [
      "@babel/preset-env", {
        targets: {
          node: "current",
          // ie: 11, // threw an error with this option
        },
        useBuiltIns: "usage"
      }
    ],
    "@babel/preset-typescript"
  ]
}
