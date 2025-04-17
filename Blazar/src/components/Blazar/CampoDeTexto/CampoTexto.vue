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
              <input id="nascimento" type="date" v-model="nascimento" placeholder="dd/mm/aaaa" />
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
              <input id="pontoDeReferencia" type="text" v-model="pontoDeReferencia" />
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
                <option v-for="cidade in cidades" :key="cidade.id" :value="cidade.nome">
                  {{ cidade.nome }}
                </option>
              </select>
            </div>

            <div class="campo">
              <label for="estado">Estado</label>
              <select id="estado" @change="carregarCidades" v-model="estado">
                <option value="" disabled selected>Selecione o estado</option>
                <option v-for="estado in estados" :key="estado.id" :value="estado.id">
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
              <a target="_blank" href="https://drive.google.com/file/d/1nVks_cwwPFoiZKc7nQOP5PmZ-oDh7nLN/view?usp=sharing">
                termos e condições de uso
              </a>.
            </label>
          </div>

          <div class="termo">
            <input id="checkPolPriv" type="checkbox" v-model="termosPrivacidade" />
            <label for="checkPolPriv">
              Eu li e concordo com os termos da
              <a target="_blank" href="https://drive.google.com/file/d/1nVks_cwwPFoiZKc7nQOP5PmZ-oDh7nLN/view?usp=sharing">
                Política de privacidade
              </a>.
            </label>
          </div>
        </div>

        <input id="btnAvancar" type="submit" value="Avançar" :disabled="!formValido" />
      </div>
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