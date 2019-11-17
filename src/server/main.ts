import * as bodyParser from "body-parser";
import * as express from "express";
import * as _ from "lodash";

import * as sourceMapSupport from "source-map-support";
import { logger } from "./logging";
import { socketServer } from "./socket-server";

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
socketServer.connect(listener);
