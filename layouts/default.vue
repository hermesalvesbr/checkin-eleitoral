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
              <slot />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
