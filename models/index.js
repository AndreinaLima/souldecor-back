import { User } from "./user.js"
import { Product } from "./product.js"
import { Profile } from "./profile.js"

// Relacionamento User -> Profile (1:1)
User.hasOne(Profile, { foreignKey: "userId", onDelete: "CASCADE" })
Profile.belongsTo(User, { foreignKey: "userId" })

// Relacionamento User -> Product (1:N)
User.hasMany(Product, { foreignKey: "sellerId", onDelete: "CASCADE" })
Product.belongsTo(User, { foreignKey: "sellerId" })

export { User, Product, Profile }
