#!/usr/bin/env node
require("yargs")
    .usage("Usage: $0 <command> [options]")
    .command("build", "Production build", {}, prodBuild)
    .command("start", "Start a dev server build", {}, devBuild)
    .demandCommand()
    .help()
    .argv;

function prodBuild(args) {
    const chalk = require("chalk");
    const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
    const printBuildError = require("react-dev-utils/printBuildError");
    const config = require("./webpack.config.js")("production");
    const webpack = require("webpack");

    webpack(config, (err, stats) => {
        if (err) {
            console.error(err.stack || err, err.details || "");
            return;
        }

        const {errors, warnings} = formatWebpackMessages(stats.toJson({ all: false, warnings: true, errors: true }));

        if (errors.length) {
            console.log(chalk.red('Failed to compile.\n'));
            printBuildError(new Error(errors[0]));
            process.exit(1);
        }

        if (warnings.length) {
            console.log(chalk.yellow('Compiled with warnings.\n'));
            console.log(warnings.join('\n\n'));
            console.log(
                '\nSearch for the ' +
                chalk.underline(chalk.yellow('keywords')) +
                ' to learn more about each warning.'
            );
            console.log(
                'To ignore, add ' +
                chalk.cyan('// eslint-disable-next-line') +
                ' to the line before.\n'
            );
        } else {
            console.log(chalk.green('Compiled successfully.\n'));
        }

        console.log("Done");
    });
}

function devBuild() {
    const webpack = require("webpack");
    const WebpackDevServer = require("webpack-dev-server");
    const config = require("./webpack.config.js")("development");

    const options = {
        contentBase: config.output.path,
        // publicPath: config.output.publicPath,
        hot: true,
        inline: true,
        stats: { colors: true },
        port: 8080
    };

    const server = new WebpackDevServer(webpack(config), options);

    server.listen(8080, "localhost", (err) => {
        if (err)
            console.error(err);
        console.log("WebpackDevServer listening at localhost: 8080");
    });
}



