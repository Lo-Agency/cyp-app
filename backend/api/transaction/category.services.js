import { db } from "../../utils/db";

export const getCategories = async () => {
  return db.category.findMany({
    select: {
      id: true,
      name: true,
      type: true,
    },
  });
};