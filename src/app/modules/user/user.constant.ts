export const USER_ROLE = {
  user: "user",
  admin: "admin",
  company:"company",
  manager:"manager",
  administrator:"administrator",
  audit:"audit"

} as const;

export const UserStatus = ["block", "active"];

export const UserSearchableFields = ["email", "name"];
