import { Router } from "express"
import * as productController from "../controllers/productController.js"
import { protect, authorizeRole } from "../utils/authMiddleware.js"

const router = Router()

router.get("/", productController.getAllProducts)

router.get("/:id", productController.getProductById)

router.get('/category/:category', productController.getProductsByCategory);

router.post(
  "/",
  protect,
  authorizeRole(["vendedor", "admin"]),
  productController.createProduct
)

router.put(
  "/:id",
  protect,
  authorizeRole(["vendedor", "admin"]),
  productController.updateProduct
)


router.delete(
  "/:id",
  protect,
  authorizeRole(["admin", "vendedor"]),
  productController.deleteProduct
)

router.get('/seller/:sellerId', productController.getProductsBySeller);

export default router
