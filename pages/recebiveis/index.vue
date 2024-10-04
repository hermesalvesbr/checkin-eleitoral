<script setup lang="ts">
// Estados, Municípios, Cargos e Vereadores
const estados = ref([])
const municipios = ref([])
const vereadores = ref([]) // Lista de vereadores

// Array fixo de cargos
const cargos = ref([
  { codigo: 11, nome: 'Prefeito' },
  { codigo: 12, nome: 'Vice-prefeito' },
  { codigo: 13, nome: 'Vereador' },
])

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
      estados.value = data.ues.map((estado: { sigla: any, nome: any }) => ({
        sigla: estado.sigla,
        nome: estado.nome,
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

async function carregarMunicipios(siglaUF: string) {
  try {
    const response = await fetch(`/municipios_${siglaUF}.json`)
    const data = await response.json()

    if (data && data.municipios) {
      municipios.value = data.municipios.map((municipio: { nome: any, codigo: any }) => ({
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

async function carregarVereadores(codigoMunicipio: any) {
  if (String(selectedCargo.value) === '13' && codigoMunicipio) {
    try {
      console.log(`Carregando vereadores para município: ${codigoMunicipio}`)
      const url = `https://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/listar/${anoEleicao}/${codigoMunicipio}/${sqEleicao}/${codigoVereador}/candidatos`
      const response = await fetch(url)
      const data = await response.json()
      if (data && data.candidatos) {
        vereadores.value = data.candidatos.map((candidato: { nomeUrna: any, numero: any, partido: { sigla: any } }) => ({
          nome: candidato.nomeUrna, // Nome do candidato está em nomeUrna
          numero: candidato.numero, // Número do candidato
          partido: candidato.partido.sigla, // Sigla do partido
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
// Função para agrupar os vereadores por partido
const vereadoresAgrupadosPorPartido = computed(() => {
  return vereadores.value.reduce((acumulador: any, vereador: { partido: string }) => {
    // Se o partido já existe no acumulador, adiciona o vereador, senão, cria o array
    if (!acumulador[vereador.partido]) {
      acumulador[vereador.partido] = []
    }
    acumulador[vereador.partido].push(vereador)
    return acumulador
  }, {})
})

// Watcher para UF selecionado
watch(selectedUF, (novoUF) => {
  if (novoUF) {
    // Resetar município e cargo ao mudar o estado
    selectedMunicipio.value = ''
    selectedCargo.value = ''
    carregarMunicipios(novoUF)
  }
  else {
    // Se o estado for deselecionado, também resetar município e cargo
    selectedMunicipio.value = ''
    selectedCargo.value = ''
    municipios.value = []
  }
})

// Watcher para Município selecionado
watch(selectedMunicipio, (novoMunicipio) => {
  if (novoMunicipio) {
    // Resetar cargo ao mudar o município
    selectedCargo.value = ''
  }
  else {
    // Se o município for deselecionado, resetar o cargo
    selectedCargo.value = ''
  }
})

watch(selectedCargo, (novoCargo) => {
  // Convertendo novoCargo para número antes de comparar
  if (Number(novoCargo) === 13 && selectedMunicipio.value) {
    carregarVereadores(selectedMunicipio.value)
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
      id="uf"
      v-model="selectedUF"
      :items="estados"
      item-title="nome"
      item-value="sigla"
      label="Selecione o Estado (UF)"
      outlined
    />

    <!-- Select para Município -->
    <v-select
      id="municipio"
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
      id="cargo"
      v-model="selectedCargo"
      :items="cargos"
      item-title="nome"
      item-value="codigo"
      label="Selecione o Cargo"
      outlined
      :disabled="!selectedMunicipio"
    />
    {{ selectedCargo }}
    {{ Object.keys(vereadoresAgrupadosPorPartido).length }}
    <v-card v-if="selectedCargo === 13 && Object.keys(vereadoresAgrupadosPorPartido).length > 0">
      <v-card-title>Lista de Vereadores</v-card-title>

      <!-- Iterar sobre os partidos -->
      <v-list v-for="(vereadoresDoPartido, partido) in vereadoresAgrupadosPorPartido" :key="partido">
        <v-list-subheader>{{ partido }}</v-list-subheader> <!-- Exibe o nome do partido -->
        <v-divider /> <!-- Divisor para separar partidos -->

        <!-- Iterar sobre os vereadores de cada partido -->
        <v-list-item v-for="(vereador, index) in vereadoresDoPartido" :key="index">
          <v-list-item-title>{{ vereador.nome }}</v-list-item-title>
          <v-list-item-subtitle>Número: {{ vereador.numero }} - Partido: {{ vereador.partido }}</v-list-item-subtitle>
        </v-list-item>

        <v-divider /> <!-- Divisor entre vereadores -->
      </v-list>
    </v-card>
  </v-container>
</template>
