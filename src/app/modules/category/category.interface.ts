export interface TCategoty {
  categoryName: string; 
  categoryType: "inflow" | "outflow";
  parentCategoryId?: number;
}
