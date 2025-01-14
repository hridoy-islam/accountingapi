
export interface TStorage {
  storageName: string; // Not Null
  openingBalance: number; // Not Null, Default: 0
  openingDate: Date; // Not Null
  logo?: string; // Nullable
  status: boolean; // Not Null, Default: true
  auditStatus: boolean; // Not Null, Default: true
}