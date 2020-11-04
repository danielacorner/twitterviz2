const path = require("path");

module.exports = ({ config, mode }) => {
  config.module.rules.push({
    test: /\.scss$/,
    // loaders: ["style-loader", "css-loader", "sass-loader"],
    include: path.resolve(__dirname, "../src"),
  });
  config.resolve.extensions.push(".scss");

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: path.resolve(__dirname, "../src"),
    // loader: require.resolve("ts-loader"),
  });
  config.resolve.extensions.push(".ts", ".tsx");

  config.resolve.modules = [path.resolve(__dirname, ".."), "node_modules"];

  config.resolve.alias = {
    ...config.resolve.alias,
    utils: path.resolve(__dirname, "../src/utils"),
    hooks: path.resolve(__dirname, "../src/hooks"),
    providers: path.resolve(__dirname, "../src/providers"),
  };

  return config;
};
