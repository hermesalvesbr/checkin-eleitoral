<script setup lang="ts">
import { StorageSerializers, useStorage } from '@vueuse/core'
import type { Chapa, Cidade } from '~/types'

const d = new useDirectus()
const busca = ref('')
const cidades = ref<Cidade[]>([])
const cidadeSelecionada = ref<Cidade | null>(null)
const chapasCriadas = useStorage<Chapa[]>('chapas-criadas', [], undefined, {
  serializer: StorageSerializers.object,
})
const updateKey = ref(0)

watch(
  chapasCriadas,
  () => {
    updateKey.value++
  },
  { deep: true },
)

function debounce(fn: (...args: any[]) => void, delay: number) {
  let timeoutId: any
  return (...args: any[]) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
const debouncedCarregarCidades = debounce(carregarCidades, 500)
function onSearchChange(newValue: string) {
  busca.value = newValue
  debouncedCarregarCidades()
}

async function carregarCidades() {
  if (busca.value.length < 3)
    return

  const response = await d.getItems('votantes', {
    search: busca.value,
    fields: [
      'id',
      'cidade',
      'uf',
      'total_eleitores',
      'total_comparecimento',
      'vereadores',
    ],
    limit: 10,
  })

  cidades.value = response.map((item: any) => ({
    id: item.id,
    nome: `${item.cidade} - ${item.uf}`,
    uf: item.uf,
    totalEleitores: item.total_eleitores,
    totalComparecimento: item.total_comparecimento,
    vereadores: item.vereadores,
  }))
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-col cols="12">
          <v-autocomplete
            v-model="cidadeSelecionada"
            :items="cidades"
            item-title="nome"
            :return-object="true"
            class="mx-auto"
            menu-icon=""
            placeholder="Cidade que criará a chapa"
            prepend-inner-icon="mdi-magnify"
            style="max-width: 650px"
            theme="light"
            variant="solo"
            auto-select-first
            :hide-no-data="true"
            rounded
            @update:search="onSearchChange"
          />
        </v-col>
      </v-col>
    </v-row>
    <div v-if="cidadeSelecionada" id="cidade-escolhida">
      <v-row>
        <ChapaCidade
          :key="updateKey"
          v-model="cidadeSelecionada"
          :chapas="chapasCriadas"
        />
      </v-row>
      <v-row>
        <ChapaCriarPartidos
          :key="cidadeSelecionada.id"
          v-model="chapasCriadas"
          :cidade="cidadeSelecionada"
        />
      </v-row>
      <v-row id="coeficiente" class="mt-7">
        <ChapaCoeficiente
          :key="cidadeSelecionada.id"
          v-model="chapasCriadas"
          :cidade-selecionada="cidadeSelecionada"
        />
      </v-row>
    </div>
  </v-container>
</template>
