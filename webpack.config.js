const path = require("path");
const nodeExternals = require("webpack-node-externals");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin");
const webpack = require("webpack");

module.exports = env => {
    const mode = env === "prod" ? "production" : "development";
    const outputDir = path.resolve(__dirname, "dist");

    const commonConfig = {
        mode,
        devtool: "source-map",
        resolve: {
            extensions: [".ts", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    enforce: "pre",
                    loader: "source-map-loader",
                },
            ],
        },
        watchOptions: {
            poll: 1000,
        },
    };

    const clientConfig = {
        ...commonConfig,
        name: "client",
        resolve: {
            extensions: [...commonConfig.resolve.extensions, ".tsx", ".jsx"],
        },
        entry: "./src/client/index.tsx",
        output: {
            path: path.resolve(outputDir, "client"),
            filename: "client.js",
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/client/index.html",
            }),
            new webpack.EnvironmentPlugin({
                PUBLIC_URL: "",
            }),
        ],
        module: {
            rules: [
                ...commonConfig.module.rules,
                {
                    test: /\.tsx?$/,
                    exclude: [/node_modules/],
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.client.json",
                    },
                },
                {
                    test: /\.html$/,
                    loader: "html-loader",
                },
                {
                    test: /\.css$/,
                    loader: ["style-loader", "css-loader"],
                },
            ],
        },
        devServer: {
            proxy: {
                "/socket": {
                    target: "ws://localhost:3000",
                    ws: true,
                },
            },
        },
    };

    const serverConfig = {
        name: "server",
        ...commonConfig,
        entry: "./src/server/main.ts",
        output: {
            path: outputDir,
            filename: "server.js",
        },
        module: {
            rules: [
                ...commonConfig.module.rules,
                {
                    test: /\.ts?$/,
                    exclude: [/node_modules/],
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.server.json",
                    },
                },
            ],
        },
        node: {
            process: false,
        },
        externals: [nodeExternals()],
        plugins: [],
    };

    if (mode === "development") {
        serverConfig.plugins.push(new WebpackShellPlugin({ onBuildEnd: ["cd dist && nodemon server.js"] }));
    }

    return [clientConfig, serverConfig];
};
