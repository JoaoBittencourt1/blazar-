<template>
  <div class="fatura">
    <!-- Card 1 -->
    <div class="card">
      <form @submit.prevent="onSubmit">
        <div class="fatura-header">
          <span class="title">Fatura #313233</span>
          <span>(26/09/2024)</span>
        </div>
        <hr />
        <div class="fatura-row">
          <span class="title">Descrição</span>
          <span class="value">Valor</span>
        </div>
        <hr />
        <div class="fatura-row">
          <span class="title">Plano Gold Anual</span>
          <span class="value">R$ 1,00</span>
        </div>
        <hr />
        <div class="fatura-total-row">
          <span class="title">Total a pagar</span>
          <span class="value">R$ 1,00</span>
        </div>
      </form>
    </div>

    <!-- Card 2 -->
    <div class="card2">
      <form @submit.prevent="onSubmit">
        <span class="title" style="margin-bottom: 20px;">Dados de Pagamento</span>
        <input type="text" placeholder="Nome Completo" v-model="cardOwnerName" required />
        <input type="text" placeholder="CPF - EX: 071.XXX.XXX-XX" v-model="cpf" required />

        <div id="card-number-element" class="stripe-input"></div>

        <div id="cvcValidade">
          <div id="card-expiry-element" class="stripe-input"></div>
          <div id="card-cvc-element" class="stripe-input"></div>
        </div>

        <input :disabled="isSubmitting" class="botao-concluir" type="submit" value="Concluir" />
      </form>
    </div>
  </div>
</template>

<script>
import "./Pagamento.scss"; // Importa o SCSS
import { ref, onMounted } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { db } from "../../../Firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "vue-router";

export default {
  name: "Pagamento",
  props: {
    userId: { type: String, required: true },
  },
  setup(props) {
    const stripePromise = loadStripe("pk_live_..."); // sua chave pública
    const cardNumberElement = ref(null);
    const cardExpiryElement = ref(null);
    const cardCvcElement = ref(null);
    const cardOwnerName = ref("");
    const cpf = ref("");
    const clientSecret = ref("");
    const isSubmitting = ref(false);
    const router = useRouter();

    onMounted(async () => {
      try {
        const response = await axios.post("http://localhost:5000/create-payment-intent");
        clientSecret.value = response.data.clientSecret;

        if (!clientSecret.value) {
          alert("Erro ao configurar o pagamento.");
          return;
        }

        const stripe = await stripePromise;
        const elements = stripe.elements();

        cardNumberElement.value = elements.create("cardNumber", { style: { base: { fontSize: "16px", color: "#32325d" } } });
        cardNumberElement.value.mount("#card-number-element");

        cardExpiryElement.value = elements.create("cardExpiry", { style: { base: { fontSize: "16px", color: "#32325d" } } });
        cardExpiryElement.value.mount("#card-expiry-element");

        cardCvcElement.value = elements.create("cardCvc", { style: { base: { fontSize: "16px", color: "#32325d" } } });
        cardCvcElement.value.mount("#card-cvc-element");
      } catch (error) {
        alert("Erro ao configurar o pagamento.");
      }
    });

    const onSubmit = async () => {
      if (isSubmitting.value || !clientSecret.value) return;
      isSubmitting.value = true;

      const stripe = await stripePromise;

      try {
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret.value, {
          payment_method: {
            card: cardNumberElement.value,
            billing_details: { name: cardOwnerName.value },
          },
        });

        if (error) {
          alert("Erro ao processar o pagamento: " + error.message);
        } else {
          const pagamentoRef = doc(db, `Users/${props.userId}/Dados de Pagamento`, paymentIntent.id);
          await setDoc(pagamentoRef, {
            cardOwnerName: cardOwnerName.value,
            cpf: cpf.value,
            amount: "R$ 1,00 (Teste)",
            paymentDate: new Date().toISOString(),
            paymentStatus: paymentIntent.status,
            paymentId: paymentIntent.id,
          });
          router.push({ name: "TeladeObrigado" });
        }
      } catch {
        alert("Erro ao processar pagamento. Tente novamente.");
      } finally {
        isSubmitting.value = false;
      }
    };

    return { onSubmit, cardOwnerName, cpf, isSubmitting };
  },
};
</script>