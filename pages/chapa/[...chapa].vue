<script setup lang="ts">
import type { Chapa, Cidade } from '~/types'

const route = useRoute()
const d = new useDirectus()
const chapaId = ref('') as Ref<string>
const cidadeId = ref('')
const chapas = ref<Chapa[]>([])
const cidadeSelecionada = ref<Cidade | null>(null)
const totalChapa = ref(100)
async function getChapaByCidadeId(chapaId: string): Promise<Chapa | null> {
  const chapas = await d.getItem('chapas', chapaId, {
    fields: ['cidade.*', 'usuario.*', '*'],
  })
  return chapas
}
const slug = ref(route.params.chapa as string[])
if (slug.value && slug.value.length > 1) {
  chapaId.value = slug.value[0]
  cidadeId.value = slug.value[1]
}
const updateKey = ref(0)
watch(
  chapaId,
  () => {
    updateKey.value++
  },
  { deep: true },
)
onMounted(async () => {
  chapas.value = await getChapaByCidadeId(chapaId.value)
  const { cidade } = chapas.value
  cidadeSelecionada.value = cidade
})
</script>

<template>
  <v-container>
    <div id="cidade-escolhida">
      <v-row>
        <DescobrirCidade
          :key="updateKey"
          :cidade="cidadeSelecionada"
          :soma-votos="totalChapa"
        />
      </v-row>
      <v-row>
        <DescobrirCriarPartidos
          :key="updateKey"
          v-model="chapas"
          :cidade="cidadeSelecionada"
        />
      </v-row>
      <v-row id="coeficiente" class="mt-7">
        Coeficiente
      </v-row>
    </div>
  </v-container>
</template>
