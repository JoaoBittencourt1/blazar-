<template>
  <div class="container" style="background: rgba(255, 255, 255, 0.404)">
    <a id="textoSolicitacao"> A sua solicitação foi concluída!<br /> </a>
    <a id="textoEmail"> Você receberá um email com o link de teste. </a>

    <div class="loader-container">
      <div class="loader"></div>
      <a id="textoAguarde">Aguarde!!!</a>
    </div>

    <div class="voltar">
      <a id="textoVoltar">Voltar</a>
    </div>
  </div>
</template>

<script>
import "./Solicitacao.scss";

export default {
  name: "Solicitacao",
};
</script>

<style scoped></style>
