import { AsyncThunkPayloadCreator } from "@reduxjs/toolkit";
import sqlProcedureCaller, { ExecResultTable } from "../../lib/sqlProcedureCaller";
import { Game, DiscardChangesRejectReasons, ExecResultCode, ThunkArgs, ThunkConfig } from "../../types";

export const fetchGamesPayloadCreator: AsyncThunkPayloadCreator<Array<Game>, ThunkArgs, ThunkConfig> = async (
  thunkArgs,
  thunkAPI,
) => {
  const { rejectWithValue } = thunkAPI;
  const { ngitsid, ngitguid }: { ngitsid: string; ngitguid: string } = window as any;

  try {
    const [execResult, games] = await sqlProcedureCaller<[ExecResultTable, Array<Game>]>(
      `${process.env.SQL_SERVER_PATH}`,
      {},
      ngitguid,
      ngitsid,
      `${process.env.DBNAME}`,
    );
    const { exRes } = execResult[0];
    switch (exRes) {
      case ExecResultCode.OK:
        return games;
      default:
        return rejectWithValue({
          rejectReason: DiscardChangesRejectReasons.SqlExRes,
          exRes,
        });
    }
  } catch {
    return rejectWithValue({
      rejectReason: DiscardChangesRejectReasons.CommError,
    });
  }
};
