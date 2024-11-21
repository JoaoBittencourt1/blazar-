<template>
  <form @submit.prevent="onSubmit">
    <div class="tabela">
      <a id="dadPes">Dados Pessoais</a>
      <a id="endCob">Endereço de cobrança</a>

      <!-- Campos do formulário -->
      <label id="LabelNome" for="nome">Nome completo</label>
      <input id="nome" type="text" v-model="nome" />

      <label id="LabelCpf" for="cpf">CPF</label>
      <input id="cpf" type="text" v-model="cpf" />

      <label id="LabelDN" for="nascimento">Data de nascimento</label>
      <input id="nascimento" type="date" v-model="nascimento" />

      <label id="LabelEmail" for="email">E-mail</label>
      <input id="email" type="text" v-model="email" />

      <label id="LabelSenha" for="senha">Senha</label>
      <input id="senha" type="password" v-model="senha" />

      <label for="cep" id="LabelCep">CEP</label>
      <input id="cep" type="text" v-model="cep" />

      <label for="pontoDeReferencia" id="LabelPontoR"
        >Ponto de referência</label
      >
      <input id="pontoDeReferencia" type="text" v-model="pontoDeReferencia" />

      <label id="LabelEnd" for="endereco">Endereço</label>
      <input id="endereco" type="text" v-model="endereco" />

      <label id="LabelNCasa" for="numeroDaCasa">Número</label>
      <input id="numeroDaCasa" type="number" v-model="numeroDaCasa" />

      <label id="LabelComplemento" for="complemento">Complemento</label>
      <input id="complemento" type="text" v-model="complemento" />

      <label id="LabelEstado" for="estado">Estado</label>
      <select id="estado" @change="carregarCidades" v-model="estado">
        <option value="" disabled>Selecione o estado</option>
        <option v-for="estado in estados" :key="estado.id" :value="estado.id">
          {{ estado.nome }}
        </option>
      </select>

      <label id="LabelCidade" for="cidade">Cidade</label>
      <select id="cidade" v-model="cidade">
        <option value="" disabled>Selecione a cidade</option>
        <option v-for="cidade in cidades" :key="cidade.id" :value="cidade.nome">
          {{ cidade.nome }}
        </option>
      </select>

      <br />

      <a id="testarFerramenta" @click.prevent="irParaSolicitacao">
        Testar ferramenta gratuitamente
      </a>

      <input
        id="btnAvancar"
        type="submit"
        name="Avançar"
        value="Avançar"
        :disabled="!formValido"
      />

      <a id="liTermoUso">Eu li e concordo com os</a>
      <a
        id="linkTermoUso"
        target="_blank"
        href="https://drive.google.com/file/d/1nVks_cwwPFoiZKc7nQOP5PmZ-oDh7nLN/view?usp=sharing"
        >termos e condições de uso.</a
      >
      <input id="checkTermoUso" type="checkbox" v-model="termosUso" />

      <a id="liPolPriv">Eu li e concordo com os termos da</a>
      <a
        id="linkPolPriv"
        target="_blank"
        href="https://drive.google.com/file/d/1nVks_cwwPFoiZKc7nQOP5PmZ-oDh7nLN/view?usp=sharing"
        >Política de privacidade.</a
      >
      <input id="checkPolPriv" type="checkbox" v-model="termosPrivacidade" />
    </div>
  </form>
</template>

<script>
import { db } from "../../../Firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "./CampoTexto.scss";

export default {
  name: "CampoTexto",
  data() {
    return {
      nome: "",
      cpf: "",
      nascimento: "",
      email: "",
      senha: "",
      cep: "",
      endereco: "",
      numeroDaCasa: "",
      complemento: "",
      estado: "",
      cidade: "",
      pontoDeReferencia: "",
      termosUso: false,
      termosPrivacidade: false,
      estados: [],
      cidades: [],
    };
  },
  mounted() {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((response) => response.json())
      .then((data) => {
        this.estados = data.sort((a, b) => a.nome.localeCompare(b.nome));
      })
      .catch((error) => {
        console.error("Erro ao carregar os estados:", error);
      });
  },
  methods: {
    irParaSolicitacao() {
      this.$router.push({ name: "Solicitacao" });
    },

    carregarCidades() {
      if (this.estado) {
        fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${this.estado}/municipios`
        )
          .then((response) => response.json())
          .then((data) => {
            this.cidades = data;
          })
          .catch((error) => {
            console.error("Erro ao carregar as cidades:", error);
          });
      } else {
        this.cidades = [];
      }
    },

    async salvarDadosNoFirebase(userId) {
      try {
        const clienteDocRef = doc(collection(db, `Users/${userId}/Cliente`));
        await setDoc(clienteDocRef, {
          nome: this.nome,
          cpf: this.cpf,
          nascimento: this.nascimento,
          email: this.email,
          cep: this.cep,
          endereco: this.endereco,
          numeroDaCasa: this.numeroDaCasa,
          complemento: this.complemento,
          estado: this.estado,
          cidade: this.cidade,
          pontoDeReferencia: this.pontoDeReferencia,
        });

        console.log(
          "Dados do cliente salvos com sucesso na subcoleção Clientes."
        );
        return true;
      } catch (error) {
        console.error("Erro ao salvar os dados no Firebase:", error);
        return false;
      }
    },

    async onSubmit() {
      if (this.formValido) {
        const auth = getAuth();
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            this.email,
            this.senha
          );
          const userId = userCredential.user.uid;
          console.log(
            "Usuário criado com sucesso no Firebase Authentication, UID:",
            userId
          );

          const dadosSalvos = await this.salvarDadosNoFirebase(userId);

          if (dadosSalvos) {
            this.$router.push({ name: "Pagamento", params: { userId } });
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
    },
  },
  computed: {
    formValido() {
      return (
        this.nome !== "" &&
        this.cpf !== "" &&
        this.nascimento !== "" &&
        this.email !== "" &&
        this.senha !== "" &&
        this.cep !== "" &&
        this.endereco !== "" &&
        this.numeroDaCasa !== "" &&
        this.estado !== "" &&
        this.cidade !== "" &&
        this.termosUso &&
        this.termosPrivacidade
      );
    },
  },
};
</script>

<style scoped></style>
