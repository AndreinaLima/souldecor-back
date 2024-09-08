import bcrypt from "bcryptjs"
import { User } from "../models/user.js" // Importa o modelo User
import { Profile } from "../models/profile.js"
import { generateToken, isTokenExpired } from "../utils/authMiddleware.js" // Importe a função generateToken

const registerUser = async (req, res, role) => {
  const { name, email, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    })
    await Profile.create({ user_id: user.id })
    res.status(201).json({ message: `${role} registrado com sucesso`, user })
  } catch (error) {
    res.status(500).json({ message: `Erro ao registrar ${role}`, error })
  }
}

export const registerClient = (req, res) => registerUser(req, res, "cliente")
export const registerSeller = (req, res) => registerUser(req, res, "vendedor")
export const registerAdmin = (req, res) => registerUser(req, res, "admin")

// Função de login
export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são necessários" })
  }

  try {
    // Encontra o usuário pelo e-mail
    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(401).json({ message: "Credenciais inválidas" })

    // Compara a senha fornecida com a senha criptografada
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(401).json({ message: "Credenciais inválidas" })

    // Gere o token usando a função importada
    const token = generateToken(user)

    res.status(200).json({ message: "Login realizado com sucesso", token })
  } catch (error) {
    console.error("Error during login:", error)
    res.status(500).json({ message: "Erro ao fazer login", error })
  }
}

// Função para alterar a senha
export const changePassword = async (req, res) => {
  try {
    // Busca o usuário pelo ID armazenado na sessão após autenticação
    const user = await User.findByPk(req.user.id)
    if (user) {
      if (await bcrypt.compare(req.body.oldPassword, user.password)) {
        // Criptografa a nova senha antes de salvar
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10)
        user.password = hashedPassword
        await user.save()
        res.status(200).json({ message: "Senha atualizada com sucesso" })
      } else {
        res.status(401).json({ message: "Senha inválida" })
      }
    } else {
      res.status(404).json({ message: "Usuário não encontrado" })
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao alterar a senha", error })
  }
}

export const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(400).json({ message: "Token não fornecido" })
  }

  if (isTokenExpired(token)) {
    return res.status(200).json({ message: "Token expirado" })
  }
}