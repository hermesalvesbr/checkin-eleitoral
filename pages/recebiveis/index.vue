<script setup lang="ts">
// Estados, Municípios, Cargos e Vereadores
const estados = ref([])
const municipios = ref([])
const cargos = ref([])
const vereadores = ref([]) // Lista de vereadores

// Seleções dos selects
const selectedUF = ref('')
const selectedMunicipio = ref('')
const selectedCargo = ref('')

// Parâmetros fixos
const anoEleicao = 2024
const sqEleicao = 2045202024
const codigoVereador = 13 // Código fixo para vereador

// Função para carregar os estados a partir do arquivo local
async function carregarEstados() {
  try {
    const response = await fetch('/eleicao_atual.json')
    const data = await response.json()

    // Verifica se os dados estão disponíveis
    if (data && data.ues) {
      estados.value = data.ues.map(estado => ({
        sigla: estado.sigla,
        nome: estado.nome,
        cargos: estado.cargos || [], // Garantindo que cargos existam
      }))
    }
    else {
      console.error('Dados de estados não encontrados')
    }
  }
  catch (error) {
    console.error('Erro ao carregar estados:', error)
  }
}

// Carregar os Municípios quando um UF for selecionado
async function carregarMunicipios(siglaUF) {
  try {
    const response = await fetch(`/municipios_${siglaUF}.json`)
    const data = await response.json()

    if (data && data.municipios) {
      municipios.value = data.municipios.map(municipio => ({
        nome: municipio.nome,
        codigo: municipio.codigo,
      }))
    }
    else {
      console.error(`Nenhum município encontrado para ${siglaUF}`)
      municipios.value = []
    }
  }
  catch (error) {
    console.error(`Erro ao carregar municípios para ${siglaUF}:`, error)
  }
}

// Carregar os Cargos quando um Município for selecionado
function carregarCargos(siglaUF) {
  const estadoSelecionado = estados.value.find(estado => estado.sigla === siglaUF)

  if (estadoSelecionado && estadoSelecionado.cargos) {
    cargos.value = estadoSelecionado.cargos.map(cargo => ({
      nome: cargo.nome,
      codigo: cargo.codigo,
    }))
  }
  else {
    console.error('Nenhum cargo encontrado para o estado selecionado')
    cargos.value = [] // Limpa os cargos se não houver dados
  }
}

// Carregar a lista de vereadores ao selecionar "Vereador"
async function carregarVereadores(codigoMunicipio) {
  if (selectedCargo.value === '13' && codigoMunicipio) { // Verifica se o cargo é "Vereador"
    try {
      console.log(`Carregando vereadores para município: ${codigoMunicipio}`)
      const url = `https://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/listar/${anoEleicao}/${codigoMunicipio}/${sqEleicao}/${codigoVereador}/candidatos`
      const response = await fetch(url)
      const data = await response.json()

      if (data) {
        vereadores.value = data.map(candidato => ({
          nome: candidato.nmCandidato,
          numero: candidato.nrCandidato,
          partido: candidato.sgPartido,
        }))
      }
      else {
        console.error('Nenhum vereador encontrado para o município selecionado')
        vereadores.value = []
      }
    }
    catch (error) {
      console.error(`Erro ao carregar vereadores para o município ${codigoMunicipio}:`, error)
    }
  }
}

// Watcher para UF selecionado
watch(selectedUF, (novoUF) => {
  if (novoUF) {
    carregarMunicipios(novoUF)
    carregarCargos(novoUF)
  }
})

// Carregar os estados ao montar a página
onMounted(() => {
  carregarEstados()
})
</script>

<template>
  <v-container>
    <!-- Select para UF -->
    <v-select
      v-model="selectedUF"
      :items="estados"
      item-title="nome"
      item-value="sigla"
      label="Selecione o Estado (UF)"
      outlined
    />

    <!-- Select para Município -->
    <v-select
      v-model="selectedMunicipio"
      :items="municipios"
      item-title="nome"
      item-value="codigo"
      label="Selecione o Município"
      outlined
      :disabled="!selectedUF"
    />

    <!-- Select para Cargo -->
    <v-select
      v-model="selectedCargo"
      :items="cargos"
      item-title="nome"
      item-value="codigo"
      label="Selecione o Cargo"
      outlined
      :disabled="!selectedMunicipio"
      @change="carregarVereadores(selectedMunicipio)"
    />

    <!-- Lista de Vereadores -->
    <v-card v-if="selectedCargo === '13' && vereadores.length > 0">
      <v-card-title>Lista de Vereadores</v-card-title>
      <v-list>
        <v-list-item
          v-for="(vereador, index) in vereadores"
          :key="index"
        >
          <v-list-item-title>{{ vereador.nome }}</v-list-item-title>
          <v-list-item-subtitle>Número: {{ vereador.numero }} - Partido: {{ vereador.partido }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>
