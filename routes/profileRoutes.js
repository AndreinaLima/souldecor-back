import { Router } from "express"
import * as profileController from "../controllers/profileController.js"
import { protect } from "../utils/authMiddleware.js"

const router = Router()

router.get("/", protect, profileController.getProfiles) // Função para listar todos os perfis, caso exista
router.get("/:id", protect, profileController.getProfileById) // Função para obter perfil por ID
router.post("/", protect, profileController.createProfile)
router.put("/:id", protect, profileController.updateProfile)
router.delete("/:id", protect, profileController.deleteProfile)

export default router
