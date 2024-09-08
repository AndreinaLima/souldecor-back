import { Profile } from "../models/profile.js" // Supondo que você tenha um modelo Profile

// Função para obter o perfil do usuário
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { user_id: req.user.id } })
    if (!profile)
      return res.status(404).json({ message: "Perfil não encontrado" })
    res.status(200).json(profile)
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter perfil", error })
  }
}

// Função para obter o perfil por ID
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { user_id: req.params.id } })
    if (!profile)
      return res.status(404).json({ message: "Perfil não encontrado" })
    res.status(200).json(profile)
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter perfil", error })
  }
}
export const createProfile = async (req, res) => {
  try {
    const { bio, avatar_url, address, city, state, postal_code, country } = req.body;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    const profile = await Profile.create({
      user_id: req.user.id,
      bio,
      avatar_url,
      address,
      city,
      state,
      postal_code,
      country,
    });
    res.status(201).json({ message: "Perfil criado com sucesso", profile });
  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    res.status(500).json({ message: "Erro ao criar perfil", error: error.message });
  }
}
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Encontre o perfil pelo ID
    const profile = await Profile.findByPk(id)
    if (!profile) {
      return res.status(404).json({ message: "Perfil não encontrado" })
    }

    // Verifique se o perfil pertence ao usuário autenticado
    if (profile.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Você não tem permissão para atualizar este perfil" })
    }

    // Atualize o perfil
    await profile.update(updateData)

    res.json({
      message: "Perfil atualizado com sucesso",
      profile,
    })
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar perfil", error })
  }
}


// Função para listar todos os perfis (caso exista)
export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll()
    res.status(200).json(profiles)
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter perfis", error })
  }
}

// Função para deletar o perfil do usuário
export const deleteProfile = async (req, res) => {
  try {
    const deleted = await Profile.destroy({ where: { user_id: req.user.id } })
    if (!deleted)
      return res.status(404).json({ message: "Perfil não encontrado" })
    res.status(204).send() // 204 No Content
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar perfil", error })
  }
}
