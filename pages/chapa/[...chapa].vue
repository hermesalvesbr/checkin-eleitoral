<script setup lang="ts">
import type { Chapa, Cidade } from '~/types'

const route = useRoute()
const d = new useDirectus()
const chapaId = ref('') as Ref<string>
const cidadeId = ref('')
const chapas = ref<Chapa[]>([])
const cidadeSelecionada = ref<Cidade | null>(null)
async function getChapaByCidadeId(chapaId: string): Promise<Chapa | null> {
  const cidade = await d.getItem('chapas', chapaId)
  return cidade
}
const slug = ref(route.params.chapa as string[])
if (slug.value && slug.value.length > 1) {
  chapaId.value = slug.value[0]
  cidadeId.value = slug.value[1]
}
onMounted(async () => {
  chapas.value = await getChapaByCidadeId(chapaId.value)
})
</script>

<template>
  <v-container>
    <div id="cidade-escolhida">
      <!-- <v-row>
        <ChapaCidade
          :key="updateKey"
          v-model="chapas.cidade"
          :chapas="chapas"
        />
      </v-row> -->
      <v-row>
        {{ chapas }}
      </v-row>
      <v-row id="coeficiente" class="mt-7">
        Coeficiente
      </v-row>
    </div>
  </v-container>
</template>
