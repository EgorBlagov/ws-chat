import * as bodyParser from "body-parser";
import * as express from "express";
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

app.get('/', (_, res) => res.send({status: 'ok'}));
app.listen(port, () => logger.info(`Listening on port ${port}`));
