import "bootstrap/dist/css/bootstrap.min.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";
import { socket } from "./logic/socket-client";

socket.connect();
ReactDOM.render(<App />, document.getElementById("root"));
