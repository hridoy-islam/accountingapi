export interface TransactionReport {
  category: string;
  transactions: number;
  storages: { [key: string]: number };
  subTotal: number;
}

export interface ReportResponse {
  inflowData: TransactionReport[];
  outflowData: TransactionReport[];
}