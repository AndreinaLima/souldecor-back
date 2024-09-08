import { Product } from "../models/product.js"

// Verificar se a categoria é válida
const validCategories = [
  "Móveis",
  "Decoração",
  "Utensílios",
  "Iluminação",
  "Outros",
]


function validateCategory(category) {
  if (!validCategories.includes(category)) {
    throw new Error(
      "Categoria inválida. As categorias válidas são: 'Móveis', 'Decoração', 'Utensílios', 'Iluminação', 'Outros'."
    );
  }
}

// validar url para ser reutilizada
function validateUrl(url) {
  if (!url) {
    throw new Error("URL da imagem é obrigatória.");
  }
}

export const createProduct = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body
  const sellerId = req.user.id // ID do vendedor logado, obtido do token de autenticação

  // Verificar se a categoria é válida
  validateCategory(category);

  // Verificar se a URL da imagem é válida
  validateUrl(imageUrl);

  try {
    const product = await Product.create({
      name,
      description,
      price,
      category,
      imageUrl,
      sellerId, // Incluindo o sellerId ao criar o produto
    })
    res.status(201).json(product)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const { name, minPrice, maxPrice, sellerId } = req.query

    // Construir condições de filtro
    const where = {}
    if (name) {
      where.name = {
        [Op.iLike]: `%${name}%`, // Filtragem por nome com busca insensível a maiúsculas/minúsculas
      }
    }
    if (minPrice || maxPrice) {
      where.price = {
        [Op.and]: [
          minPrice ? { [Op.gte]: parseFloat(minPrice) } : {},
          maxPrice ? { [Op.lte]: parseFloat(maxPrice) } : {},
        ],
      }
    }
    if (sellerId) {
      where.sellerId = sellerId // Filtrar por sellerId se fornecido
    }

    const products = await Product.findAll({ where })
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// Obter um produto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (product) {
      res.status(200).json(product)
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Atualizar um produto por ID
export const updateProduct = async (req, res) => {
  const { category, imageUrl } = req.body

  // Verificar se a categoria é válida
  if (category) {
    validateCategory(category);
  } else {
    return res.status(400).json({ error: "Categoria é obrigatória." })
  }

  // Verificar se a URL da imagem é válida
  if (imageUrl) {
    validateUrl(imageUrl);
  } else {
    return res.status(400).json({ error: "URL da imagem é obrigatória." })
  }

  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id },
    })
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.id)
      res.status(200).json(updatedProduct)
    } else {
      res.status(404).json({ message: "Produto não encontrado" })
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Deletar um produto por ID
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id },
    })
    if (deleted) {
      res.status(204).send()
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Função para listar produtos de um vendedor específico ou todos os produtos para um admin
export const getProductsBySeller = async (req, res) => {
  const { sellerId } = req.params;

  try {
    const produtosDoVendedor = await Product.findAll({
      where: { sellerId }
    });

    if (produtosDoVendedor.length === 0) {
      return res.status(404).send('Produtos não encontrados para este vendedor.');
    }

    res.json(produtosDoVendedor);
  } catch (error) {
    console.error('Erro ao buscar produtos do vendedor:', error);
    res.status(500).send('Erro interno do servidor.');
  }
};


// Filtro por categoria (listar)
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.findAll({
      where: { category }, // Filtra pela categoria
      limit: 5, // Limita a quantidade de produtos retornados
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter produtos da mesma categoria' });
  }
};
