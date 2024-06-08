<script setup lang="ts">
  const drawer = ref(false)

  const toggleDrawer = () => {
    drawer.value = !drawer.value
  }

  const shareOnWhatsApp = () => {
    const url = 'https://campanha.softagon.app'
    const message = encodeURIComponent(
      'Confira esta campanha para construção de chapa eleitoral!'
    )
    const whatsappUrl = `https://wa.me/?text=${message}%20${url}`
    window.open(whatsappUrl, '_blank')
  }

  const items = [
    { type: 'subheader', title: 'Cidades' },
    { title: 'Descobrir', value: 1, path: '/descobrir' },
    { type: 'divider' },
    { type: 'subheader', title: 'Você' },
    { title: 'Suas análises', value: 4, path: '/suas-analises' },
  ]
</script>

<template>
  <v-card class="mx-auto">
    <v-layout>
      <v-navigation-drawer v-model="drawer" app>
        <!-- Conteúdo do menu lateral -->
        <v-list :items="items" color="bg-accent"></v-list>
        <v-divider></v-divider>
        <v-card class="mx-auto mt-7 pt-8" max-width="400">
          <v-img
            class="align-end text-white"
            height="220"
            src="/softagon-sistemas.png"
            cover
          >
          </v-img>
          <v-card-subtitle class="pt-4 text-wrap">
            Softagon Sistemas
          </v-card-subtitle>
          <v-card-text>
            <div
              >Conte com a Softagon para soluções completas para sua Prefeitura
              e Câmara de Vereadores</div
            >
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="text-none mb-4"
              color="indigo-darken-3"
              size="x-large"
              variant="flat"
              block
              href="https://wa.me/558189531156?text=Olá%20Softagon,%20gostaria%20de%20saber%20mais%20sobre%20os%20seus%20serviços%20para%20Câmara%20de%20Vereadores%20e%20Prefeituras."
              target="_blank"
            >
              Fale com Softagon
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-navigation-drawer>

      <v-app-bar color="accent" elevation="1">
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title class="text-uppercase"
          >Coligação Municipal</v-app-bar-title
        >

        <template v-slot:append>
          <v-btn icon="mdi-export-variant" @click="shareOnWhatsApp"></v-btn>
        </template>
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <v-row dense>
            <v-col>
              <h1 class="text-h5">Chapa eleitoral da sua Cidade</h1>
              <h2 class="text-h6">informe os vereadores por partido</h2>
              <slot />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
