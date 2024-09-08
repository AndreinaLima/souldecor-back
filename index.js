import express from "express";
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import { connection, authenticate } from "./config/db.js"


const app = express()
const PORT = process.env.PORT || 3000
const ORIGIN = [
  "http://localhost:5173",
  "https://e-commerce-rn2-front-five.vercel.app",
  "https://e-commerce-rn2-front-cmdi15upu-andreinalimas-projects.vercel.app",
  process.env.FRONTEND_URL || "https://ecommerce-souldecor.vercel.app",
]
authenticate(connection).then(() => {
  console.log("Conectado ao banco de dados com sucesso.")
  connection.sync();
  // connection.sync({ force: true });
}).catch((error) => {
  console.error("Não foi possível conectar ao banco de dados:", error)
  process.exit(1)
});


const corsOptions = {
  origin: function (origin, callback) {
    if (ORIGIN.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));


app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/users", userRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`)
  console.log(`Acesse ${ORIGIN}/api/products`);
})
