import { AsyncThunkPayloadCreator } from "@reduxjs/toolkit";
import sqlProcedureCaller, { ExecResultTable } from "../../lib/sqlProcedureCaller";
import { Game } from "../../types/gameData";
import { DiscardChangesRejectReasons, ExecResultCode, ThunkArgs, ThunkConfig } from "../../types/thunkTypes";

export const fetchGamesPayloadCreator: AsyncThunkPayloadCreator<Array<Game>,ThunkArgs,ThunkConfig> = async (thunkArgs, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const { ngitsid, ngitguid }: { ngitsid: string; ngitguid: string } = window as any;

    try {
        const [execResult, games] = await sqlProcedureCaller<
          [ExecResultTable, Array<Game>]
        >(
          `${BASE_MODULE}`
          {},
          ngitguid,
          ngitsid,
          `${BASE_URL}/${BASE_PATH}`
        );
        const { exRes } = execResult[0];
        switch (exRes) {
            case ExecResultCode.OK:
                return games;
            default:
                return(rejectWithValue({
                    rejectReason: DiscardChangesRejectReasons.SqlExRes,
                    exRes
                }));
        }
    } catch {
        return(rejectWithValue({
            rejectReason: DiscardChangesRejectReasons.CommError
        }));
    }
};