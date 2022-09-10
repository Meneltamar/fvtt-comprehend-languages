const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  // bundling mode
  mode: "production",

  // entry files
  entry: "./src/scripts/lib.ts",

  // output bundles (location)
  output: {
    // path: path.resolve(__dirname, "dist"),
    path: "/home/ubuntu/foundrydata/Data/modules/comprehend-languages",
    filename: "./scripts/main.js",
    clean: true,
  },

  // file resolutions
  resolve: {
    extensions: [".ts", ".js"],
  },

  // loaders
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, "src/module.json") },
        { from: "**", to: "languages/", context: "src/languages" },
        { from: "**", to: "styles/", context: "src/styles/" },
      ],
    }),
  ],
};
