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
    cidade: item.cidade,
    uf: item.uf,
    totalEleitores: item.total_eleitores,
    totalComparecimento: item.total_comparecimento,
    vereadores: item.vereadores,
  }))
}
function converterParaChapas(candidatos: any[]) {
  const partidosMap: { [key: string]: Chapa } = {}

  candidatos.forEach((candidato) => {
    const partido = candidato.SG_PARTIDO
    if (!partidosMap[partido]) {
      partidosMap[partido] = {
        cidadeId: cidadeSelecionada.value?.id || '',
        nome: `${candidato.SG_PARTIDO} - ${candidato.NR_PARTIDO}`,
        valor: candidato.SG_PARTIDO,
        logo: `/partido/${candidato.SG_PARTIDO}.png`,
        id: Date.now() + Math.random(),
        pessoas: [],
      }
    }

    partidosMap[partido].pessoas.push({
      nome: candidato.NM_URNA_CANDIDATO,
      votos: '99',
    })
  })

  return Object.values(partidosMap)
}

async function getCandidatosByMunicipio(cidade: string, uf: string) {
  const response = await d.getItems('candidatos', { filter:
    {
      NM_UE: cidade,
      SG_UF: uf,
      DS_CARGO: 'VEREADOR',
    },
  })
  return response
}
watch(cidadeSelecionada, async () => {
  if (cidadeSelecionada.value) {
    const chapasExistentes = chapasCriadas.value.filter(chapa => chapa.cidadeId === cidadeSelecionada.value?.id)

    // Se todas as chapas existentes tiverem pessoas, não faz a chamada
    const existeChapaSemPessoas = chapasExistentes.some(chapa => chapa.pessoas.length === 0)

    if (existeChapaSemPessoas || chapasExistentes.length === 0) {
      // Caso exista alguma chapa sem pessoas, ou se não houver chapas criadas para a cidade
      const retorno = await getCandidatosByMunicipio(
        cidadeSelecionada.value.cidade,
        cidadeSelecionada.value.uf,
      )

      const chapas = converterParaChapas(retorno)
      chapasCriadas.value = chapas
    }
  }
})
</script>

<template>
  <v-container class="pt-4 mt-5">
    <v-row class="mb-6">
      <h1 class="text-h5">
        Chapa eleitoral da sua Cidade
      </h1>
      <h2 class="text-h6 pl-2">
        informe os vereadores por partido
      </h2>
    </v-row>
    <v-row justify="center">
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
        autocomplete="off"
        @update:search="onSearchChange"
      />
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
          v-model="chapasCriadas"
          :cidade="cidadeSelecionada"
        />
      </v-row>
      <v-row id="salvar" class="mt-7">
        <UsuarioSalvar :key="cidadeSelecionada.id" v-model="chapasCriadas" :cidade="cidadeSelecionada.id" />
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
