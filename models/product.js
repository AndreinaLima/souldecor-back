import { DataTypes } from "sequelize"
import { connection } from "../config/db.js"
import { User } from "./user.js"

export const Product = connection.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM,
    values: ["Móveis", "Decoração", "Utensílios", "Iluminação", "Outros"],
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
})
