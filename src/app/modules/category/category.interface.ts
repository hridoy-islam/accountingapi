export interface TCategory {
  categoryName: string; 
  categoryType: "inflow" | "outflow";
  parentCategoryId?: string;
}
