import JsonProxy from "@ngit/json-proxy";
import { JpTableSet } from "@ngit/json-proxy/dist/types/JpTypes";

export type ExecResultRow = {
  /** kod koji govori je li izvršavanje uspjelo */
  exRes: number;
};

export type ExecResultTable = ExecResultRow[];

const sqlProcedureCaller = async <T extends JpTableSet>(
  procedure: number | string,
  params: any,
  ngitguid: string,
  ngitsid: string,
  endpoint: string,
): Promise<T> => {
  return (await JsonProxy({
    endpoint: endpoint,
    proc: procedure,
    params: params,
    autoUnpackData: true,
  })) as T;
};

export default sqlProcedureCaller;
