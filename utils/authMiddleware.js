import jwt from "jsonwebtoken"

// Função para gerar um token JWT
const generateToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role, // Pode ser "vendedor", "cliente" ou "admin"
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })
}

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token)
    return res
      .status(401)
      .json({ message: "Acesso não autorizado, token não encontrado" })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded

    // se o usuario for admin, permite que ele defina um sellerId diferente do seu próprio ID para listar produtos de um vendedor específico
    if (req.user.role === "admin" && req.query.sellerId) {
      req.sellerId = req.query.sellerId
    } else {
      req.sellerId = req.user.id
    }
    next()
  } catch (error) {
    res.status(401).json({ message: "Token inválido ou expirado" })
  }
}

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    // Se o usuário for um admin, permita que ele prossiga independentemente do sellerId fornecido
    if (req.user.role === "admin") {
      next()
    } else if (roles.includes(req.user.role)) {
      // Se o usuário não for um admin, mas tiver um dos papéis permitidos, prossiga
      next()
    } else {
      // Se o usuário não tiver permissão, retorne um erro 403 Acesso Negado
      return res.status(403).json({ message: "Acesso negado" })
    }
  }
}

export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token, { complete: true })
    if (!decoded) {
      return true // Se o token não pôde ser decodificado, assume-se que expirou ou é inválido
    }
    const { exp } = decoded.payload
    return Date.now() >= exp * 1000
  } catch (error) {
    return true // Em caso de erro, considera o token como expirado ou inválido
  }
}

// Neste código, o middleware primeiro verifica se o usuário tem o papel de admin.Se sim, ele permite que a requisição prossiga sem verificar o sellerId.Se o usuário não for um admin, ele verifica se o papel do usuário está incluído na lista de papéis permitidos(roles).Se o papel estiver incluído, a requisição também prossegue.Caso contrário, um erro 403 é retornado.

// Exportar a função para geração de tokens, se necessário em outras partes do projeto
export { generateToken }