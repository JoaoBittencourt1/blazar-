import { createRouter, createWebHistory } from "vue-router";
import CampoTexto from "../components/Blazar/CampoDeTexto/CampoTexto.vue";
import Pagamento from "../components/Blazar/Pagamento/Pagamento.vue";
import TeladeObrigado from "../components/Blazar/TelaDeObrigado/TeladeObrigado.vue";
import Solicitacao from "../components/Blazar/Solicitacao/Solicitacao.vue";

const routes = [
  {
    path: "/",
    name: "CampoTexto",
    component: CampoTexto,
  },
  {
    path: "/pagamento/", // Adiciona userId como parâmetro dinâmico
    name: "Pagamento",
    component: Pagamento,
    props: true, // Habilita o uso do parâmetro como prop no componente
  },
  {
    path: "/obrigado",
    name: "TeladeObrigado",
    component: TeladeObrigado,
  },
  {
    path: "/solicitacao",
    name: "Solicitacao",
    component: Solicitacao,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
