module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/blackholesuns/" : "/",
  configureWebpack: {
    module: {
      rules: []
    }
  }
};
