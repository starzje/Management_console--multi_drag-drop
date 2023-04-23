import { RootState } from "../redux/store";

export enum ExecResultCode {
  /** igre uspješno spremljene */
  OK = 0,
  /** greška kod spremanja popisa igara */
  Error = -1,
}

export enum DiscardChangesRejectReasons {
  /** sql proc returned negative exec result code  */
  SqlExRes,
  /** communication error */
  CommError,
}

export type DiscardChangesRejectValue =
  | {
      rejectReason: DiscardChangesRejectReasons.CommError;
    }
  | {
      rejectReason: DiscardChangesRejectReasons.SqlExRes;
      exRes: ExecResultCode;
    };

export interface ThunkConfig {
  state: RootState;
  extra?: unknown;
  rejectValue: DiscardChangesRejectValue;
  rejectedMeta: void;
}

export type ThunkArgs = string | void;
