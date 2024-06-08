<script setup lang="ts">
  //site: {
  //  url: 'https://campanha.softagon.app',
  //name: 'Construção Chapa Eleitoral',
  //description: 'Softagon Sistemas',
  // defaultLocale: 'pt-br', // not needed if you have @nuxtjs/i18n installed
  // },
</script>
<template>
  <v-card class="mx-auto">
    <v-layout>
      <v-app-bar color="secondary" density="compact" elevation="1">
        <template v-slot:prepend>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Coligação para Vereador</v-app-bar-title>

        <template v-slot:append>
          <v-btn icon="mdi-export-variant"></v-btn>
        </template>
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <v-row dense>
            <v-col>
              <h1>Construa a Chapa Eleitoral da sua Cidade </h1>
              <h2>informe os vereadores por partido</h2>
              <slot />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
