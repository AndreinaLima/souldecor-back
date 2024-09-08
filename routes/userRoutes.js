import { Router } from "express"
import * as userController from "../controllers/userController.js"
import { protect } from "../utils/authMiddleware.js"

const router = Router()

router.get("/", protect, userController.getUsers)
router.get("/:id", protect, userController.getUserById)
router.post("/", protect, userController.createUser)
router.put("/:id", protect, userController.updateUser)
router.delete("/:id", protect, userController.deleteUser)
router.post("/change-password", protect, userController.changePassword)

export default router
