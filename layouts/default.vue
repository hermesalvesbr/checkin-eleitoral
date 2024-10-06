<script setup lang="ts">
const drawer = ref(false)
const router = useRouter()
const selectedItem = ref<string | null>(null)
function toggleDrawer() {
  drawer.value = !drawer.value
}

function shareOnWhatsApp() {
  const url = 'https://campanha.softagon.app'
  const message = encodeURIComponent(
    'Confira esta campanha para construção de chapa eleitoral!',
  )
  const whatsappUrl = `https://wa.me/?text=${message}%20${url}`
  window.open(whatsappUrl, '_blank')
}

const items = [
  { title: 'Inicial', value: 1, path: '/' },
  { type: 'subheader', title: 'Cidades' },
  { title: 'Descobrir', value: 1, path: '/descobrir' },
  { title: 'Dinheiro', value: 1, path: '/recebiveis' },
  { title: 'Local de votação', value: 1, path: '/locais' },
  { type: 'subheader', title: 'Você' },
  { title: 'Suas análises', value: 4, path: '/suas-analises' },
]
function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <v-card class="mx-auto">
    <v-layout>
      <v-navigation-drawer v-model="drawer" app>
        <!-- Conteúdo do menu lateral -->
        <v-list v-model:selected="selectedItem">
          <template v-for="item in items" :key="item.value">
            <v-list-subheader v-if="item.type === 'subheader'">
              {{ item.title }}
            </v-list-subheader>
            <v-list-item
              v-if="item.type !== 'subheader'"
              :value="item.path"
              @click="navigateTo(item.path)"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
        <v-divider />
        <v-card class="mx-auto mt-7 pt-8" max-width="400">
          <v-img
            class="align-end text-white"
            height="220"
            src="/softagon-sistemas.png"
            cover
          />
          <v-card-subtitle class="pt-4 text-wrap">
            Softagon Sistemas
          </v-card-subtitle>
          <v-card-text>
            <div>
              Conte com a Softagon para soluções completas para sua Prefeitura e
              Câmara de Vereadores
            </div>
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
        <template #prepend>
          <v-app-bar-nav-icon @click="toggleDrawer" />
        </template>

        <v-app-bar-title class="text-uppercase">
          <v-btn size="large" to="/">
            Softagon Sistemas
          </v-btn>
        </v-app-bar-title>

        <template #append>
          <v-btn icon="mdi-export-variant" @click="shareOnWhatsApp" />
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
