import { db } from "../../utils/db";

export const getAllCategories= async () => {
  return db.category.findMany();
};
