const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const buildMode =
  process.argv[3] === "production" ? "production" : "development";
const isProductionBuild = buildMode === "production";
const [outDir] = (() => {
  const outDir =
    buildMode === "production"
      ? path.join(__dirname, "dist/")
      : path.join("/home/ubuntu/foundrydata/Data/modules/comprehend-languages");
  return [outDir];
})();
module.exports = {
  // bundling mode
  mode: buildMode,

  // entry files
  entry: "./src/scripts/lib.ts",

  // output bundles (location)
  output: {
    // path: path.resolve(__dirname, "dist"),
    path: outDir,
    filename: "./scripts/main.js",
    clean: true,
  },

  // file resolutions
  resolve: {
    extensions: [".ts", ".js"],
  },
  devtool: isProductionBuild ? undefined : "inline-source-map",
  watch: !isProductionBuild,

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
