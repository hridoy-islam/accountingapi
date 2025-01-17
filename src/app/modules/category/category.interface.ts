export interface TCategory {
  name: string;
  type: "inflow" | "outflow";
  parentId: string | null;
  audit: "Active" | "In Active";
  status: "Active" | "Inactive";
}