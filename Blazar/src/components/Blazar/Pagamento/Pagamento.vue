<template>
  <div class="fatura">
    <div class="card">
      <form @submit.prevent="onSubmit">
        <a id="numFatura">Fatura #313233</a>
        <a id="dataFatura">(26/09/2024)</a>
        <br />
        <hr />
        <a id="textoDesc">Descrição</a>
        <a id="textoVal">Valor</a>
        <hr id="hr2" />
        <a id="textoPlanoGold">Plano Gold Anual</a>
        <a id="textoValor">R$ 1,00</a>
        <hr id="hr4" />
        <a id="textoTotPag">Total a pagar</a>
        <a id="textoValPag">R$ 1,00</a>
      </form>
    </div>
    <div class="card2">
      <form @submit.prevent="onSubmit">
        <a id="tabelaDadPag">Dados de Pagamento</a>
        <input
          id="nomeCartao"
          type="text"
          placeholder="Nome Completo"
          v-model="cardOwnerName"
        />
        <input
          id="CPF"
          type="text"
          placeholder="CPF - EX: 071.XXX.XXX-XX"
          v-model="cpf"
        />

        <div id="card-number-element" class="stripe-input"></div>

        <div id="cvcValidade">
          <div id="card-expiry-element" class="stripe-input"></div>
          <div id="card-cvc-element" class="stripe-input"></div>
        </div>

        <input
          :disabled="isSubmitting"
          style="
            position: relative;
            left: 330px;
            width: 200px;
            height: 53px;
            background-color: #56aaff;
            top: 100px;
            cursor: pointer;
            font-weight: bold;
            font-size: 20px;
          "
          type="submit"
          name="Concluir"
          value="Concluir"
        />
      </form>
    </div>
  </div>
</template>

<script>
import "./Pagamento.scss";
import { loadStripe } from "@stripe/stripe-js";
import { ref, onMounted } from "vue";
import axios from "axios";
import { db } from "../../../Firebase";
import { doc, collection, setDoc } from "firebase/firestore";
import { useRouter } from "vue-router";

export default {
  name: "Pagamento",
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const stripePromise = loadStripe(
      "pk_live_51Q8L6cEOxADUOmj9XU5XqytwVp2aDZiGoATvkXG1LDV76GLS1HkiDJYZ6ds444bknSItPipDe4b0m2t29UGiogE600O5URqK1R"
    );
    const cardNumberElement = ref(null);
    const cardExpiryElement = ref(null);
    const cardCvcElement = ref(null);
    const cardOwnerName = ref("");
    const cpf = ref("");
    const clientSecret = ref("");
    const cardError = ref(null);
    const isSubmitting = ref(false);
    const router = useRouter();

    onMounted(async () => {
      console.log("Montando componente Pagamento com userId:", props.userId);
      try {
        const response = await axios.post(
          "http://localhost:5000/create-payment-intent"
        );
        clientSecret.value = response.data.clientSecret;

        if (!clientSecret.value) {
          console.error("Erro: clientSecret não foi recebido do backend.");
          alert("Erro ao configurar o pagamento.");
          return;
        }

        console.log("clientSecret recebido:", clientSecret.value);

        const stripe = await stripePromise;
        const elements = stripe.elements();

        cardNumberElement.value = elements.create("cardNumber", {
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              "::placeholder": {
                color: "#a0aec0",
              },
            },
          },
        });
        cardNumberElement.value.mount("#card-number-element");

        cardExpiryElement.value = elements.create("cardExpiry", {
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              "::placeholder": {
                color: "#a0aec0",
              },
            },
          },
        });
        cardExpiryElement.value.mount("#card-expiry-element");

        cardCvcElement.value = elements.create("cardCvc", {
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              "::placeholder": {
                color: "#a0aec0",
              },
            },
          },
        });
        cardCvcElement.value.mount("#card-cvc-element");
      } catch (error) {
        console.error("Erro ao obter clientSecret:", error);
        alert("Erro ao configurar o pagamento.");
      }
    });

    const onSubmit = async () => {
      if (isSubmitting.value || !clientSecret.value) return;
      isSubmitting.value = true;

      const stripe = await stripePromise;

      try {
        console.log(
          "Iniciando pagamento com clientSecret:",
          clientSecret.value
        );

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret.value,
          {
            payment_method: {
              card: cardNumberElement.value,
              billing_details: {
                name: cardOwnerName.value,
              },
            },
          }
        );

        if (error) {
          cardError.value = error.message;
          alert("Erro ao processar o pagamento: " + error.message);
        } else {
          console.log("Pagamento bem-sucedido!", paymentIntent);

          try {
            const pagamentoRef = doc(
              db,
              `Users/${props.userId}/Dados de Pagamento`,
              paymentIntent.id
            );
            await setDoc(pagamentoRef, {
              cardOwnerName: cardOwnerName.value,
              cpf: cpf.value,
              amount: "R$ 1,00 (Teste)",
              paymentDate: new Date().toISOString(),
              paymentStatus: paymentIntent.status,
              paymentId: paymentIntent.id,
            });

            console.log("Dados de pagamento salvos com sucesso no Firestore.");
            router.push({ name: "TeladeObrigado" });
          } catch (firebaseError) {
            console.error(
              "Erro ao salvar os dados de pagamento no Firestore:",
              firebaseError
            );
            alert("Ocorreu um erro ao salvar os dados de pagamento.");
          }
        }
      } catch (error) {
        console.error("Erro ao processar pagamento:", error);
        alert("Ocorreu um erro ao processar o pagamento. Tente novamente.");
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      onSubmit,
      cardError,
      cardOwnerName,
      cpf,
      isSubmitting,
    };
  },
};
</script>

<style scoped></style>
