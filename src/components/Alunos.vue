<template>
  <div style="padding: 100px">
    <div id="div-table">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Pesquisar"
        single-line
        hide-details
        class="mb-3"
      ></v-text-field>
      <v-btn @click="dialogRegister = true" color="success">Cadastrar</v-btn>
      <v-data-table
        sort-by="ra"
        :search="search"
        :headers="headers"
        :items="items"
      >
        <template v-slot:[`item.acoes`]="{ item }">
          <v-btn color="primary" @click="sendDataToEdit(item)">Editar</v-btn>
          <v-btn
            @click="sendStudentToExclude(item.name, item.ra)"
            class="ml-3"
            color="error"
            >Excluir</v-btn
          >
        </template>
      </v-data-table>
      
    </div>
    <div>
      <v-navigation-drawer absolute permanent>
        <template v-slot:prepend>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-comment-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Alunos</v-list-item-title>
          </v-list-item>
        </template>

        <v-divider></v-divider>
      </v-navigation-drawer>
    </div>
    <!-- *TELA DE EDIÇÃO DE ALUNO* -->
    <v-row justify="center">
      <v-dialog
        v-model="dialogEdit"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialogEdit = false, cleanFields()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title
              >Editar dados do aluno: {{ objToUpdate.name }}</v-toolbar-title
            >
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list three-line subheader>
            <v-card class="body-form">

              <v-alert v-if="showSuccessAlert" border="right" type="success"
                >Aluno atualizado com sucesso!</v-alert
              >
              <v-form ref="form" lazy-validation>
                <v-text-field
                  v-model="raStudent"
                  label="Registro Acadêmico"
                  disabled
                ></v-text-field>
                <v-text-field
                  v-model="nameStudent"
                  :counter="25"
                  label="Informe o nome completo"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="emailStudent"
                  label="Informe apenas um e-mail"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="cpfStudent"
                  label="Informe o número do documento"
                  disabled
                ></v-text-field>

                <v-btn @click="updateStudent" color="success" class="mr-4">
                  Atualizar
                </v-btn>

                <v-btn
                  @click="(dialogEdit = false), cleanFields()"
                  color="error"
                  class="mr-4"
                >
                  Cancelar
                </v-btn>
              </v-form>
            </v-card>
          </v-list>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- *TELA DE CADASTRO DE ALUNO* -->
    <v-row justify="center">
      <v-dialog
        v-model="dialogRegister"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="(dialogRegister = false), cleanFields()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Cadastrar um novo aluno</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list three-line subheader>
            <v-card class="body-form">
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-alert v-if="showSuccessAlert" border="right" type="success"
                  >Aluno cadastrado com sucesso!</v-alert
                >

                <v-alert v-if="showErrorAlert" border="right" type="error"
                  >Houve algum erro para cadastrar o aluno!</v-alert
                >
                <v-text-field
                  v-model="raStudent"
                  label="Informe o registro acadêmico"
                  :rules="raRules"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="nameStudent"
                  :counter="25"
                  label="Informe o nome completo"
                  :rules="nameRules"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="emailStudent"
                  label="Informe apenas um e-mail"
                  :rules="emailRules"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="cpfStudent"
                  label="Informe o número do documento"
                  required
                  :rules="cpfRules"
                ></v-text-field>

                <v-btn :disabled="!valid" @click="registerStudent" color="success" class="mr-4">
                  Criar
                </v-btn>

                <v-btn @click="cleanFields" color="warning" class="mr-4">
                  Limpar
                </v-btn>
                <v-btn @click="cleanFields(), dialogRegister = false" color="error" class="mr-4">
                  Cancelar
                </v-btn>
              </v-form>
            </v-card>
          </v-list>
        </v-card>
      </v-dialog>
    </v-row>

    <!--*MODAL DE CONFIRMAÇÃO DE EXCLUSÃO*-->
    <v-row justify="center">
      <v-dialog v-model="dialogExclude" persistent max-width="290">
        <v-card>
          <v-card-title class="headline"> Exclusão de aluno </v-card-title>
          <v-card-text
            >Você tem certeza que deseja excluir o aluno <b>{{ nameStudent }}</b
            >?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="(dialogExclude = false), cleanFields()"
            >
              Cancelar
            </v-btn>
            <v-btn color="error" text @click="deleteStudent(raStudent)">
              Excluir
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
     <div class="text-center">

    <v-snackbar
      v-model="deleteSnack"
      :timeout="timeout"
    >
      Aluno excluído com sucesso!

      
    </v-snackbar>
  </div>
  </div>
</template>

<script>
import axios from "axios";
import Constants from "../services/Constants";
export default {
  components: {},
  data() {
    return {
      objToUpdate: {},
      dialogEdit: false,
      dialogRegister: false,
      dialogExclude: false,
      showSuccessAlert: false,
      showErrorAlert: false,
      deleteSnack: false,
      valid: true,
      timeout: 2000,
      emailRules: Constants.regex.EMAIL,
      nameRules: Constants.regex.NAME,
      raRules: Constants.regex.RA,
      cpfRules: Constants.regex.CPF,
      headers: [
        { text: "Registro Acadêmico", value: "ra" },
        { text: "Nome", value: "name" },
        { text: "Email", value: "email" },
        { text: "CPF", value: "cpf" },
        { text: "Ações", value: "acoes", sortable: false },
      ],
      items: [],
      search: "",
      nameStudent: "",
      emailStudent: "",
      cpfStudent: "",
      raStudent: null,
    };
  },

  mounted() {
    this.getStudents();
  },

  methods: {
    async getStudents() {
      await axios.get("http://localhost:3000/api/students").then((response) => {
        this.items = response.data;
      });
    },

    async registerStudent() {
      await axios
        .post(Constants.api.url_endpoint, {
          name: this.nameStudent,
          email: this.emailStudent,
          cpf: this.cpfStudent,
          ra: this.raStudent,
        })
        .then((response) => {
          if (response.status === 200) {
            this.showErrorAlert = false;
            this.showSuccessAlert = true;
            this.getStudents();
          }
        })
        .catch((response) => {
          this.showSuccessAlert = false;
          this.showErrorAlert = true;
          console.log("response", response);
        });
    },

    async updateStudent() {
      await axios
        .put(`${Constants.api.url_endpoint}/${this.raStudent}`, {
          name: this.nameStudent,
          email: this.emailStudent,
          cpf: this.cpfStudent,
        })
        .then((response) => {
          console.log("response", response);
          if (response.status === 200) {
            this.showErrorAlert = false;
            this.showSuccessAlert = true;
            this.getStudents();
          }
        })
        .catch((response) => {
          this.showSuccessAlert = false;
          this.showErrorAlert = true;
          console.log("response", response);
        });
    },

    async deleteStudent(ra) {
      await axios
        .delete(`${Constants.api.url_endpoint}/${ra}`)
        .then((response) => {
          this.getStudents();
          this.dialogExclude = false;
          this.deleteSnack = true;
          return response;
        });
    },

    sendDataToEdit(obj) {
      this.objToUpdate = obj;
      this.nameStudent = obj.name;
      this.emailStudent = obj.email;
      this.cpfStudent = obj.cpf;
      this.raStudent = obj.ra;
      this.dialogEdit = true;
    },

    sendStudentToExclude(name, ra) {
      this.dialogExclude = true;
      this.nameStudent = name;
      this.raStudent = ra;
    },

    cleanFields() {
      this.nameStudent = "";
      this.emailStudent = "";
      this.cpfStudent = "";
      this.raStudent = null;
      this.showSuccessAlert = false;
    },
  },
};
</script>

<style >
.body-form {
  padding: 150px;
  width: 50%;
  height: 50%;
  margin-left: auto;
  margin-right: auto;
  background-color: lightgray;
}
#div-table {
  margin-left: 200px;
  margin-top: -92px;
}
</style>