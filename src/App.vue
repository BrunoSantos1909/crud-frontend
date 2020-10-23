<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-card-title>Bruno's API</v-card-title>
      </div>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <Alunos/>
    </v-main>
  </v-app>
</template>

<script>
import Alunos from './components/Alunos';
export default {
  name: 'App',

  components: {
    Alunos
  },

  data: () => ({
    //
  }),
};
</script>
