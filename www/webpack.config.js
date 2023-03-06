const path = require("path");

module.exports = {
  entry: {
    bootstrap: "./src/bootstrap.js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
  },
};
