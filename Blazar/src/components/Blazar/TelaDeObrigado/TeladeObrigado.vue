<template>
  <div className="container">
    <h1>Obrigado!</h1>
    <p>Seu pagamento foi concluido com sucesso!</p>
    <a href="/" className="btn">Voltar para a Página Inicial</a>
  </div>
</template>

<script>
import "./TeladeObrigado.scss";

export default {
  name: "TeladeObrigado",
  setup() {
    console.log("Renderizando Tela de Obrigado");
  },
};
</script>
