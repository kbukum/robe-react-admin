const webpack = require("webpack");
const FileChanger = require("webpack-file-changer");
const Utility = require("./util/Utility");
const path = require("path");
const package = require("../package.json");

/**
 * import common webpack settings
 */
/**
 * import common webpack settings
 */
const commonSettings = require("./webpack.config.common.js")("/src", "/build", "__test__");


/**
 * @link https://github.com/webpack/docs/wiki/optimization#deduplication
 * @type DedupePlugin
 */
commonSettings.plugins.push(new webpack.optimize.DedupePlugin());
/**
 * @link https://github.com/webpack/docs/wiki/optimization#deduplication
 * @type DedupePlugin
 */
commonSettings.plugins.push(new webpack.optimize.UglifyJsPlugin());
/**
 * @link https://github.com/webpack/docs/wiki/optimization#minimize
 * @type OccurenceOrderPlugin
 */
commonSettings.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
/**
 * https://github.com/webpack/docs/wiki/optimization#chunks
 * @type LimitChunkCountPlugin
 */
commonSettings.plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 15 }));
/**
 * @link https://github.com/webpack/docs/wiki/optimization#chunks
 * @type MinChunkSizePlugin
 */
commonSettings.plugins.push(new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 }));

/**
 *
 * @type {{root: *[]}}
 */
commonSettings.entry = {
    app: "../src/index.js"
};

/**
 * @link https://webpack.github.io/docs/configuration.html#devtool
 * Choose a developer tool to enhance debugging.
 * source-map - A SourceMap is emitted. See also output.sourceMapFilename.
 * @type {string}
 */
commonSettings.devtool = "source-map";

commonSettings.output = {
    path: commonSettings.paths.build,
    filename: "bundle.[hash].js"
    // chunkFilename: "[id].bundle.js"
};

const fileChanger = new FileChanger({
    move: [{
        from: path.join(Utility.projectDir, "static"),
        to: path.join(Utility.projectDir, "./build")
    }
    ],
    change: [{
        file: "./build/index.html",
        parameters: {
            "\\$VERSION": package.version,
            "\\$BUILD_TIME": new Date(),
            "bundle\\.js": "bundle.[hash].js"
        }
    }
    ]
});
commonSettings.plugins.push(fileChanger);

/* Use production parameter for hiding warnings which are coming from React library. */
commonSettings.plugins.push(new webpack.DefinePlugin({
    "process.env": {
        NODE_ENV: JSON.stringify("production")
    }
}));


module.exports = commonSettings;
