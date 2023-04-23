import express, { Request, Response, NextFunction } from "express";
const sql = require("mssql");
const createError = require("http-errors");
const { createSqlReq } = require("../lib/sqlConnPool"); // global SQL conn pool managment

const thumbRouter = express.Router();

thumbRouter.get(
  "/:gameProviderWebName/:gameWebName.jpg",
  async (req: Request<{ gameProviderWebName: string; gameWebName: string }>, res: Response, next: NextFunction) => {
    const { gameProviderWebName, gameWebName } = req.params;

    // NE smijem dopustiti da greška na SQL serveru servisima sruši web server
    try {
      const sqlReq = await createSqlReq();

      sqlReq.input("gameProviderWebName", sql.NVarChar(255), gameProviderWebName);
      sqlReq.input("gameWebName", sql.NVarChar(255), gameWebName);

      const sqlResult = await sqlReq.execute(`[dbo].[${process.env.SP_GET_THUMB_64}`);

      if (sqlResult.recordsets.length === 0 || sqlResult.recordsets[0].length === 0) {
        next(createError(404));
        return;
      }

      const thumb64 = sqlResult.recordsets[0][0][0];

      if (!thumb64) {
        next(createError(404)); // ako slika ne postoji
        return;
      }

      const image = Buffer.from(thumb64, "base64");

      res.set("content-type", "image/jpg");
      res.set("content-length", `${image.length}`);
      // do not cache - ne koristimo nikakav cache busting, pa je potrebno nametnuti da se slike ne keširaju
      res.set("cache-control", "no-cache, max-age=0");
      res.end(image, "binary");
    } catch (ex) {
      console.error(ex);
      next(createError(500)); // biti će prikazana default 500 stranica - vidi `app.js`
      return;
    }
  }
);

export default thumbRouter;
