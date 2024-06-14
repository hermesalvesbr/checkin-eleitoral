<script setup lang="ts">
import type { Chapa, Cidade } from '~/types'

const route = useRoute()
const d = new useDirectus()
const chapaId = ref('') as Ref<string>
const chapas = ref<Chapa[]>([])
async function getChapaByCidadeId(chapaId: string): Promise<Chapa | null> {
  const cidade = await d.getItem('chapas', chapaId)
  return cidade
}
if (route.params.chapa) {
  chapaId.value = route.params.chapa.toString()
}
onMounted(async () => {
  chapas.value = await getChapaByCidadeId(chapaId.value)
})
</script>

<template>
  <v-container>
    <div id="cidade-escolhida">
      <v-row>
        <v-row>
          {{ chapas }}
        </v-row>
        <v-row id="coeficiente" class="mt-7">
          Coeficiente
        </v-row>
      </v-row>
    </div>
  </v-container>
</template>
