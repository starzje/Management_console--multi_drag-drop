const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env, argv) => {
  // Datoteke spremam u direktorije:
  // - ${DEST_DIR}/public/ = buildane JS datoteke
  // - ${DEST_DIR}/views/partials/ = EJS template koji se insertira u <head> element
  //
  // NAPOMENA
  // (default) U debug načinu pokretanja servera, `ts-node` izravno čita datoteke iz
  // `server/src` direktorija. To je ujedno working direktorij za tako pokrenuti
  // Express instancu.  Zato kod debug načina rada Webpack sve build-ane datoteke
  // sprema u taj direktorij.
  //
  // Build za produkciju se radi kroz multi-stage Dockerfile. Stage koji build-a
  // client-side datoteke radi u izolaciji od servera, a producirane datoteke
  // se u zadnjoj build fazi kopiraju kamo već trebaju.
  // U ovom slučaju će `DEST_DIR` biti prilagođen kroz Dockerfile ENV varijablu
  const DEST_DIR = process.env.WEBPACK_DEST_DIR ?? "../server/src";

  const dotenv = require("dotenv");

  // čitam `BASE_PATH` iz `.env` datoteke
  // > biti za zakačen na `process.env`
  dotenv.config({ path: process.env.WEBPACK_ENV_FILE_PATH ?? "../.env" });

  const { BASE_PATH } = process.env;

  const devMode = argv.mode !== "production";

  const config = {
    entry: "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, `${DEST_DIR}/public/script`),
      filename: devMode ? `[name].js` : `[name].[contenthash].js`, // in dev env don't hash the filename
    },
    // u dev okruženju kreiram brze "eval" source maps
    // u produkciji kreiram prave source-mape
    devtool: devMode ? "eval-source-map" : "source-map",
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[path][name].[ext]",
              },
            },
          ],
        },
        {
          test: /\.(js|jsx|ts|tsx)?$/,
          use: "babel-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(scss|css)$/,
          use: [{ loader: MiniCssExtractPlugin.loader }, { loader: "css-loader" }, { loader: "sass-loader" }],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".tsx", ".ts"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        appMountId: "app",
        // generiramo Express partial koji će bit umetnut u <head>
        filename: path.resolve(__dirname, `${DEST_DIR}/views/partials/html-head--scripts.ejs`),
        inject: false, // disabling automatic assets injection - we will do it manually
        publicPath: `${BASE_PATH}/script`,
        // overridam default template kako ne bi bio generiran <head> tag
        templateContent: ({ htmlWebpackPlugin }) => `${htmlWebpackPlugin.tags.headTags}`,
      }),
      new MiniCssExtractPlugin({
        // slijedeće pravilo definira naziv entrypoint datoteke koja se učita na početku
        filename: devMode ? `style/[name].css` : `style/[name].[contenthash].css`,
        // slijedeće pravilo definira naziv imena chunk datoteka koje će biti učitate naknadno prema potrebi
        chunkFilename: devMode ? `style/[name].css` : `style/[name].[contenthash].css`,
      }),
      new CleanWebpackPlugin(),
      // slijedeće nam omogućuje da u client-side source kodu dobijemo
      // varijable definirane u `.env` datoteci
      new webpack.DefinePlugin({
        BASE_PATH: JSON.stringify(BASE_PATH),
      }),
    ],
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
  };

  return config;
};
