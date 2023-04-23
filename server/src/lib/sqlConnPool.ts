import { ConnectionPool, Request } from "mssql";
import { createLogger } from "./logger";

const debug = createLogger("server:server");

const sqlConnPool = new ConnectionPool({
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  connectionTimeout: 15000,
  requestTimeout: 15000,
  pool: {
    min: 2,
    max: 200,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
  },
  arrayRowMode: true,
});

debug("SQL connection pool created");

process.on("exit", function () {
  debug("closing SQL connection pool");
  sqlConnPool.close();
});

/**
 * Creates new SQL request object
 */
export const createSqlReq = async () => {
  const sqlConn = await sqlConnPool.connect();
  return new Request(sqlConn);
};
