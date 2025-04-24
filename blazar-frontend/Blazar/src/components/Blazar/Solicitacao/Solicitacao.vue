<template>
  <div class="container">
    <a id="textoSolicitacao"> A sua solicitação foi concluída!<br /> </a>
    <a id="textoEmail"> Você receberá um email com o link de teste. </a>

    <div class="loader-container">
      <div class="loader"></div>
      <a id="textoAguarde">Aguarde!!!</a>
    </div>

    <div class="voltar" @click="voltarParaCampoTexto">
      <a id="textoVoltar">Voltar</a>
    </div>
  </div>
</template>

<script>
import "./Solicitacao.scss";

export default {
  name: "Solicitacao",
  methods: {
    voltarParaCampoTexto() {
      this.$router.push({ name: "CampoTexto" }); // Ajuste para o nome da sua rota
    },
  },
};
</script>

<style scoped></style>