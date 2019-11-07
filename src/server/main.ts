import * as bodyParser from "body-parser";
import * as express from "express";
import * as _ from "lodash";
import * as io from "socket.io";

import * as sourceMapSupport from "source-map-support";
import { logger } from "./logging";

sourceMapSupport.install({
    handleUncaughtExceptions: false,
});

const app: express.Application = express();
const port: string = process.env.PORT || "3000";
app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client"));
}

const listener = app.listen(port, () => logger.info(`Listening on port ${port}`));

const ioServer: io.Server = io(listener, {
    path: "/socket",
});

ioServer.sockets.on("connection", socket => {
    logger.info("new connection, total: " + _.size(ioServer.sockets.sockets));
    socket.on("disconnect", () => {
        logger.info("lost connection, total: " + _.size(ioServer.sockets.sockets));
    });
});
