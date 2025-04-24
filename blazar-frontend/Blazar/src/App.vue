<template>
  <!-- <div id="app" style="width: 100%"> -->
  <router-view></router-view>
  <!-- </div> -->
</template>

<script>
import Blazar from "./components/Blazar/Blazar.vue";
import CampoTexto from "./components/Blazar/CampoDeTexto/CampoTexto.vue";
import Pagamento from "./components/Blazar/Pagamento/Pagamento";
import Solicitacao from "./components/Blazar/Solicitacao/Solicitacao";
import TeladeObrigado from "./components/Blazar/TelaDeObrigado/TeladeObrigado.vue";

export default {
  name: "App",
};
</script>

<style scoped>
@import "./index.css";
</style>
