<script setup lang="ts">
import type { Chapa, Cidade } from '~/types'

const d = new useDirectus()
const localidade = ref<Cidade | null>()
const cidadeId = ref('') as Ref<string>
const chapas = ref([])
const chapasFiltradas = ref()
const route = useRoute()
async function getCidadeByCidadeId(cidadeId: string): Promise<Cidade | null> {
  const cidade = await d.getItem('votantes', cidadeId)
  return cidade
}
if (route.params.cidade) {
  cidadeId.value = route.params.cidade.toString()
  localidade.value = await getCidadeByCidadeId(cidadeId.value)
}
function filtrarRegistrosPorCidade(registros: Chapa[], cidadeId: string): Chapa[] {
  return registros.map((registro: any) => {
    let chapasFiltradas = []

    if (Array.isArray(registro.chapas)) {
      chapasFiltradas = registro.chapas.filter((chapa: Chapa) => chapa.cidadeId.toString() === cidadeId)
    }
    else if (registro.chapas && Array.isArray(registro.chapas.chapas)) {
      chapasFiltradas = registro.chapas.chapas.filter((chapa: Chapa) => chapa.cidadeId.toString() === cidadeId)
    }

    return {
      ...registro,
      chapas: chapasFiltradas,
    }
  }).filter(registro => registro.chapas.length > 0)
}
onMounted(async () => {
  chapas.value = await d.getItems('chapas', {
    fields: ['cidade.*', 'usuario.*', '*'],
  })

  chapasFiltradas.value = filtrarRegistrosPorCidade(chapas.value, cidadeId.value).sort((a, b) => {
    return new Date(b.date_updated).getTime() - new Date(a.date_updated).getTime()
  })
})
</script>

<template>
  <v-container v-if="localidade" class="pa-6 pa-md-12" fluid>
    <p class="font-weight-medium text-primary">
      Chapas Eleitoral para {{ localidade.cidade }} - {{ localidade.uf }}
    </p>

    <p class="mt-2 text-h6 font-weight-bold text-sm-h4">
      Análises Eleitorais de {{ localidade.cidade }} - {{ localidade.uf }}
    </p>
    <p class="mt-4 mb-6 text-body-1">
      Você está vendo as análises eleitorais de {{ localidade.cidade }}! Aqui, usuários fizeram previsões para vereadores, detalhando cada chapa e candidato. As análises são responsabilidade dos usuários, tornando {{ localidade.cidade }} uma cidade de colaboração e participação ativa. Contribua com suas próprias previsões!
    </p>
    <v-row justify="center">
      <v-list lines="three">
        <template v-for="registro in chapasFiltradas" :key="registro.id">
          <v-list-item :to="`/chapa/${registro.id}/${localidade.id}`" nav>
            <v-list-item-title>{{ registro.usuario?.first_name || 'Usuário desconhecido' }}</v-list-item-title>
            <v-list-item-subtitle>
              Quantidade de chapas: {{ registro.chapas.length }}<br>
              Atualizado em: {{ new Date(registro.date_updated).toLocaleString() }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-divider v-if="registro !== chapasFiltradas[chapasFiltradas.length - 1]" />
        </template>
      </v-list>
    </v-row>
  </v-container>
</template>
