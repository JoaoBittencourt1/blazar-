require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Função para validar o CPF (apenas uma verificação básica de formato)
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, ""); // Remove caracteres não numéricos
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0,
    resto;
  for (let i = 1; i <= 9; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.substring(10, 11));
}

// Rota para validar nome e CPF
app.post("/validate-user", (req, res) => {
  const { name, cpf } = req.body;

  // Validações simples de nome e CPF
  if (!name || name.length < 3) {
    return res.status(400).json({ isValid: false, message: "Nome inválido" });
  }

  if (!cpf || !validarCPF(cpf)) {
    return res.status(400).json({ isValid: false, message: "CPF inválido" });
  }

  // Se ambos forem válidos, retorna isValid: true
  res.json({ isValid: true });
});

// Rota para criar um PaymentIntent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // valor em centavos (100 centavos = 1 real/dólar)
      currency: "brl", // ou 'usd' se a moeda padrão for em dólares
      payment_method_types: ["card"],
      description: "Pagamento Plano Gold Anual (Teste)",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Erro ao criar PaymentIntent:", error);
    res.status(500).json({ error: "Erro ao criar PaymentIntent" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
