import http, { IncomingMessage } from "http";

import { createLogger } from "./lib/logger";
const debug = createLogger('server:server');

const options = {
    host: "localhost",
    port: process.env.PORT || '3000',
    timeout: 2000,
    path: '/healthcheck/'
};

const request = http.request(options, (res:IncomingMessage) => {
    debug(`Healthcheck: STATUS: ${res.statusCode}`);

    if (res.statusCode == 200) {
        process.exit(0);
    } else {
        process.exit(1);
    }
});

request.on("error", function (err) {
    debug("Healthcheck: ERROR");
    process.exit(1);
});

request.end();