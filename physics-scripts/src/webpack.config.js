const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const WebpackTest = require("webpacktest");

const path = require("path");

const defaultConfig = {
    entry: "src/",
    publicPath: "public/",
    output: "build/"
}

module.exports = function(mode, inConfig = {}) {
    const config = {...defaultConfig, ...inConfig};

    const cwd = process.cwd();

    return {
        mode,
        entry: path.join(cwd, config.entry),
        output: {
            path: path.join(cwd, config.output),
            // publicPath: config.publicPath,
            filename: "bundle.js"
        },
        module: {
            rules: [
                { test: /\.(ts)$/, loader: "ts-loader" },
                {
                    test: /\.(c|cpp)$/,
                    use: {
                        loader: "emscript-loader",
                        options: {
                            includes: [
                                path.join(cwd, "node_modules/leonmontealegre-physics-cpp/lib/cpp/include")
                            ]
                        }
                    }
                }
            ]
        },
        resolve: {
            plugins: [new TsconfigPathsPlugin({ configFile: path.join(cwd, "tsconfig.json") })],
            extensions: [".ts", ".js", ".c", ".cpp"]
        },
        plugins: [
            new HtmlWebpackPlugin({ template: path.join(cwd, config.publicPath, "index.html") })
        ]
    }
}
