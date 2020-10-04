module.exports = {
  plugins: ["@babel/plugin-transform-classes", 'lodash'],
  presets: [
    [
      "@babel/preset-env", {
        targets: {
          node: "current",
          // ie: 11, // threw an error with this option
        }
      }
    ]
  ]
}
