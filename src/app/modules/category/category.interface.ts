export interface TCategory {
  name: string;
  type: "inflow" | "outflow";
  parentId: string | null;
  audit: "Active" | "Inactive";
  status: "Active" | "Inactive";
}