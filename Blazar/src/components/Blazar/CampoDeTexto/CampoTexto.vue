<template>
  <form @submit.prevent="onSubmit">
    <div class="tabela">
      <div class="cabecalho">
        <div class="titulo">Dados Pessoais</div>
        <div class="titulo">Endereço de cobrança</div>
      </div>

      <div class="colunas">
        <!-- Coluna da Esquerda - Dados Pessoais -->
        <div class="coluna">
          <div class="campo">
            <label for="nome">Nome completo</label>
            <input id="nome" type="text" v-model="nome" />
          </div>

          <div class="grupo-horizontal">
            <div class="campo">
              <label for="cpf">CPF</label>
              <input id="cpf" type="text" v-model="cpf" />
            </div>

            <div class="campo">
              <label for="nascimento">Data de nascimento</label>
              <input
                id="nascimento"
                type="date"
                v-model="nascimento"
                placeholder="dd/mm/aaaa"
              />
            </div>
          </div>

          <div class="campo">
            <label for="email">E-mail</label>
            <input id="email" type="email" v-model="email" />
          </div>

          <div class="campo">
            <label for="senha">Senha</label>
            <input id="senha" type="password" v-model="senha" />
          </div>
        </div>

        <!-- Coluna da Direita - Endereço -->
        <div class="coluna">
          <div class="grupo-horizontal">
            <div class="campo">
              <label for="cep">CEP</label>
              <input id="cep" type="text" v-model="cep" />
            </div>

            <div class="campo">
              <label for="pontoDeReferencia">Ponto de referência</label>
              <input
                id="pontoDeReferencia"
                type="text"
                v-model="pontoDeReferencia"
              />
            </div>
          </div>

          <div class="grupo-horizontal">
            <div class="campo endereco">
              <label for="endereco">Endereço</label>
              <input id="endereco" type="text" v-model="endereco" />
            </div>

            <div class="campo numero">
              <label for="numeroDaCasa">Número</label>
              <input id="numeroDaCasa" type="number" v-model="numeroDaCasa" />
            </div>
          </div>

          <div class="campo">
            <label for="complemento">Complemento</label>
            <input id="complemento" type="text" v-model="complemento" />
          </div>

          <div class="grupo-horizontal">
            <div class="campo">
              <label for="cidade">Cidade</label>
              <select id="cidade" v-model="cidade">
                <option value="" disabled selected>Selecione a cidade</option>
                <option
                  v-for="cidade in cidades"
                  :key="cidade.id"
                  :value="cidade.nome"
                >
                  {{ cidade.nome }}
                </option>
              </select>
            </div>

            <div class="campo">
              <label for="estado">Estado</label>
              <select id="estado" @change="carregarCidades" v-model="estado">
                <option value="" disabled selected>Selecione o estado</option>
                <option
                  v-for="estado in estados"
                  :key="estado.id"
                  :value="estado.id"
                >
                  {{ estado.nome }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="rodape">
        <a class="testar-ferramenta" @click.prevent="irParaSolicitacao">
          Testar ferramenta gratuitamente
        </a>

        <div class="termos">
          <div class="termo">
            <input id="checkTermoUso" type="checkbox" v-model="termosUso" />
            <label for="checkTermoUso">
              Eu li e concordo com os
              <a
                target="_blank"
                href="https://drive.google.com/file/d/1nVks_cwwPFoiZKc7nQOP5PmZ-oDh7nLN/view?usp=sharing"
              >
                termos e condições de uso
              </a>.
            </label>
          </div>

          <div class="termo">
            <input id="checkPolPriv" type="checkbox" v-model="termosPrivacidade" />
            <label for="checkPolPriv">
              Eu li e concordo com os termos da
              <a
                target="_blank"
                href="https://drive.google.com/file/d/1nVks_cwwPFoiZKc7nQOP5PmZ-oDh7nLN/view?usp=sharing"
              >
                Política de privacidade
              </a>.
            </label>
          </div>
        </div>
        <input
          id="btnAvancar"
          type="submit"
          value="Avançar"
          :disabled="!formValido"
        />
      </div>
    </div>
  </form>
</template>

<script>
import { db } from "../../../Firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router"; // Importe useRouter
import { ref, reactive, onMounted, computed } from "vue"; // Importe ref, reactive, onMounted e computed
import "./CampoTexto.scss";

export default {
  name: "CampoTexto",
  setup() {
    const nome = ref("");
    const cpf = ref("");
    const nascimento = ref("");
    const email = ref("");
    const senha = ref("");
    const cep = ref("");
    const endereco = ref("");
    const numeroDaCasa = ref("");
    const complemento = ref("");
    const estado = ref("");
    const cidade = ref("");
    const pontoDeReferencia = ref("");
    const termosUso = ref(false);
    const termosPrivacidade = ref(false);
    const estados = ref([]);
    const cidades = ref([]);
    const router = useRouter(); // Inicialize o useRouter

    const formValido = computed(() => {
      return (
        nome.value !== "" &&
        cpf.value !== "" &&
        nascimento.value !== "" &&
        email.value !== "" &&
        senha.value !== "" &&
        cep.value !== "" &&
        endereco.value !== "" &&
        numeroDaCasa.value !== "" &&
        estado.value !== "" &&
        cidade.value !== "" &&
        termosUso.value &&
        termosPrivacidade.value
      );
    });

    onMounted(() => {
      fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then((response) => response.json())
        .then((data) => {
          estados.value = data.sort((a, b) => a.nome.localeCompare(b.nome));
        })
        .catch((error) => {
          console.error("Erro ao carregar os estados:", error);
        });
    });

    const carregarCidades = () => {
      if (estado.value) {
        fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.value}/municipios`
        )
          .then((response) => response.json())
          .then((data) => {
            cidades.value = data;
          })
          .catch((error) => {
            console.error("Erro ao carregar as cidades:", error);
          });
      } else {
        cidades.value = [];
      }
    };

    const salvarDadosNoFirebase = async (userId) => {
      try {
        const db = getFirestore();
        const clienteDocRef = doc(collection(db, `Users/${userId}/Cliente`));
        await setDoc(clienteDocRef, {
          nome: nome.value,
          cpf: cpf.value,
          nascimento: nascimento.value,
          email: email.value,
          cep: cep.value,
          endereco: endereco.value,
          numeroDaCasa: numeroDaCasa.value,
          complemento: complemento.value,
          estado: estado.value,
          cidade: cidade.value,
          pontoDeReferencia: pontoDeReferencia.value,
        });

        console.log(
          "Dados do cliente salvos com sucesso na subcoleção Clientes."
        );
        return true;
      } catch (error) {
        console.error("Erro ao salvar os dados no Firebase:", error);
        return false;
      }
    };

    const onSubmit = async () => {
      if (formValido.value) {
        const auth = getAuth();
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email.value,
            senha.value
          );
          const userId = userCredential.user.uid;
          console.log(
            "Usuário criado com sucesso no Firebase Authentication, UID:",
            userId
          );

          const dadosSalvos = await salvarDadosNoFirebase(userId);

          if (dadosSalvos) {
            router.push({ name: "Pagamento", params: { userId } });
          } else {
            alert("Ocorreu um erro ao salvar os dados. Tente novamente.");
          }
        } catch (error) {
          console.error(
            "Erro ao criar usuário no Firebase Authentication:",
            error
          );
          alert(
            "Ocorreu um erro ao criar o usuário. Verifique os dados e tente novamente."
          );
        }
      } else {
        alert("Por favor, preencha todos os campos.");
      }
    };

    const irParaSolicitacao = () => {
      router.push({ name: "Solicitacao" });
    };

    return {
      nome,
      cpf,
      nascimento,
      email,
      senha,
      cep,
      endereco,
      numeroDaCasa,
      complemento,
      estado,
      cidade,
      pontoDeReferencia,
      termosUso,
      termosPrivacidade,
      estados,
      cidades,
      formValido,
      irParaSolicitacao,
      onSubmit,
      carregarCidades,
    };
  },
};
</script>