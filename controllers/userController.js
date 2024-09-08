import { User } from "../models/user.js"
import bcrypt from "bcryptjs"

// Criar um novo usuário
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Listar todos os usuários
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Obter um usuário por ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Atualizar um usuário por ID
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { password, ...rest } = req.body

    // Criptografe a senha somente se for fornecida
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      // Atualize o usuário com a senha criptografada
      await User.update(
        { ...rest, password: hashedPassword },
        { where: { id } }
      )
    } else {
      // Atualize o usuário sem alterar a senha
      await User.update(rest, { where: { id } })
    }

    // Busque o usuário atualizado para retornar a resposta
    const updatedUser = await User.findByPk(id)
    if (updatedUser) {
      res.status(200).json(updatedUser)
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Deletar um usuário por ID
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    })
    if (deleted) {
      res.status(204).send()
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Alterar a senha de um usuário
export const changePassword = async (req, res) => {
  try {
    // buscando o usuário pelo ID armazenado na sessão após autenticação
    const user = await User.findByPk(req.user.id)
    if (user) {
      if (await bcrypt.compare(req.body.oldPassword, user.password)) {
        // Criptografa a nova senha antes de salvar
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10)
        user.password = hashedPassword
        await user.save()
        res.status(200).json({ message: "Password updated successfully" })
      } else {
        res.status(401).json({ message: "Invalid password" })
      }
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}