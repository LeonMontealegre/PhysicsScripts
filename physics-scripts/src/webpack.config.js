const ts = require("typescript");
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const defaultConfig = {
    entry: "src/",
    publicPath: "public/",
    output: "build/"
}

function getAliases(cwd) {
    const file = path.join(cwd, "tsconfig.json");

    const rawConfig = ts.readConfigFile(file, ts.sys.readFile).config;
    const config = ts.parseJsonConfigFileContent(
        rawConfig,
        ts.sys,
        cwd
    );

    let aliases = {};
    if (config.options.paths) {
        const paths = config.options.paths;
        Object.entries(paths).forEach(([n, [p]]) => {
            const name = n.replace("/*", "");
            const url = path.resolve(cwd, p.replace("/*", ""));
            aliases[name] = url;
        });
    }

    return aliases;
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
                                path.join(cwd, "node_modules/leon-physics-lib/lib/cpp/include")
                            ]
                        }
                    }
                }
            ]
        },
        resolve: {
            alias: getAliases(cwd),
            extensions: [".ts", ".js", ".c", ".cpp"]
        },
        plugins: [
            new HtmlWebpackPlugin({ template: path.join(cwd, config.publicPath, "index.html") })
        ]
    }
}
