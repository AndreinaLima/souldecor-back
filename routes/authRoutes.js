import { Router } from "express"
import {
  registerClient,
  registerSeller,
  login,
  registerAdmin,
  changePassword,
  verifyToken,
} from "../controllers/authController.js"
import { protect } from "../utils/authMiddleware.js"

const router = Router()

router.post("/register/admin", registerAdmin)

// Rota para registro de clientes
router.post("/register/client", registerClient)

// Rota para registro de vendedores
router.post("/register/seller", registerSeller)

// Rota para login de usuários
router.post("/login", login)

router.get("/check-token", verifyToken)
// Middleware para proteger as rotas seguintes
router.use(protect)

// Rota para alterar a senha de um usuário
router.post("/change-password", changePassword)

export default router