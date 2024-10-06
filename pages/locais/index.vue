<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

const estados = ref([])
const municipios = ref([])
const locaisVotacao = ref([])
const votosEsperados = ref({})
const selectedUF = ref('')
const selectedMunicipio = ref('')
const loading = ref(false)
const arquivosPorEstado = {
  AC: ['eleitorado_local_votacao_2024_AC_part1.json'],
  AL: ['eleitorado_local_votacao_2024_AL_part1.json'],
  AM: ['eleitorado_local_votacao_2024_AM_part1.json'],
  AP: ['eleitorado_local_votacao_2024_AP_part1.json'],
  BA: ['eleitorado_local_votacao_2024_BA_part1.json', 'eleitorado_local_votacao_2024_BA_part2.json'],
  CE: ['eleitorado_local_votacao_2024_CE_part1.json'],
  ES: ['eleitorado_local_votacao_2024_ES_part1.json'],
  GO: ['eleitorado_local_votacao_2024_GO_part1.json'],
  MA: ['eleitorado_local_votacao_2024_MA_part1.json'],
  MG: ['eleitorado_local_votacao_2024_MG_part1.json', 'eleitorado_local_votacao_2024_MG_part2.json'],
  MS: ['eleitorado_local_votacao_2024_MS_part1.json'],
  MT: ['eleitorado_local_votacao_2024_MT_part1.json'],
  PA: ['eleitorado_local_votacao_2024_PA_part1.json'],
  PB: ['eleitorado_local_votacao_2024_PB_part1.json'],
  PE: ['eleitorado_local_votacao_2024_PE_part1.json'],
  PI: ['eleitorado_local_votacao_2024_PI_part1.json'],
  PR: ['eleitorado_local_votacao_2024_PR_part1.json'],
  RJ: ['eleitorado_local_votacao_2024_RJ_part1.json', 'eleitorado_local_votacao_2024_RJ_part2.json'],
  RN: ['eleitorado_local_votacao_2024_RN_part1.json'],
  RO: ['eleitorado_local_votacao_2024_RO_part1.json'],
  RR: ['eleitorado_local_votacao_2024_RR_part1.json'],
  RS: ['eleitorado_local_votacao_2024_RS_part1.json'],
  SC: ['eleitorado_local_votacao_2024_SC_part1.json'],
  SE: ['eleitorado_local_votacao_2024_SE_part1.json'],
  SP: [
    'eleitorado_local_votacao_2024_SP_part1.json',
    'eleitorado_local_votacao_2024_SP_part2.json',
    'eleitorado_local_votacao_2024_SP_part3.json',
    'eleitorado_local_votacao_2024_SP_part4.json',
  ],
  TO: ['eleitorado_local_votacao_2024_TO_part1.json'],
  undefined: ['eleitorado_local_votacao_2024_undefined_part1.json'],
}

// Função para buscar dados com cache no localStorage, mas evita cache se o tamanho for muito grande
async function fetchWithLocalStorage(key, url) {
  const cachedData = localStorage.getItem(key)
  if (cachedData) {
    return JSON.parse(cachedData)
  }

  try {
    const response = await fetch(url)
    const data = await response.json()

    // Tentamos armazenar no localStorage apenas se o tamanho for menor que 4MB
    const dataSize = new Blob([JSON.stringify(data)]).size
    const maxLocalStorageSize = 4 * 1024 * 1024 // 4MB
    if (dataSize < maxLocalStorageSize) {
      try {
        localStorage.setItem(key, JSON.stringify(data))
      }
      catch (storageError) {
        console.warn('Dados muito grandes para armazenar no localStorage:', storageError)
      }
    }
    else {
      console.warn('Dados excedem o limite de 4MB. Não serão armazenados no localStorage.')
    }

    return data
  }
  catch (error) {
    console.error('Erro ao buscar os dados:', error)
    throw error
  }
}

// Função para carregar os estados
async function carregarEstados() {
  try {
    const data = await fetchWithLocalStorage('estados', '/eleicao_atual.json')
    if (data && data.ues) {
      estados.value = data.ues.map(estado => ({
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

// Função para carregar os municípios com base no UF selecionado
async function carregarMunicipios(siglaUF) {
  try {
    const data = await fetchWithLocalStorage(`municipios_${siglaUF}`, `/municipios_${siglaUF}.json`)
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

// Função para carregar locais de votação de um estado, buscando múltiplos arquivos se necessário
async function carregarLocaisVotacao(siglaUF) {
  const cacheKey = `locais_votacao_${siglaUF}_${selectedMunicipio.value}`
  const votosCacheKey = `votos_esperados_${selectedMunicipio.value}`
  const cachedData = localStorage.getItem(cacheKey)
  const cachedVotos = localStorage.getItem(votosCacheKey)

  if (cachedVotos) {
    votosEsperados.value = JSON.parse(cachedVotos)
  }

  if (cachedData) {
    locaisVotacao.value = JSON.parse(cachedData)
    locaisVotacao.value.forEach((local) => {
      if (!votosEsperados.value[local.nome]) {
        votosEsperados.value[local.nome] = 0
      }
    })
    return
  }

  loading.value = true
  try {
    // Verifica os arquivos associados ao estado selecionado
    const arquivosEstado = arquivosPorEstado[siglaUF] || []
    const data = []

    // Busca e concatena os dados de todos os arquivos de um estado
    for (const arquivo of arquivosEstado) {
      const partialData = await fetchWithLocalStorage(`locais_votacao_${siglaUF}_${arquivo}`, `/locais/${arquivo}`)
      data.push(...partialData)
    }

    const locaisAgrupados = data
      .filter(local => local.CD_MUNICIPIO === selectedMunicipio.value)
      .reduce((acc, local) => {
        const { NM_LOCAL_VOTACAO, DS_ENDERECO, NM_BAIRRO, NR_SECAO, QT_ELEITOR_SECAO } = local
        if (!acc[NM_LOCAL_VOTACAO]) {
          acc[NM_LOCAL_VOTACAO] = {
            nome: NM_LOCAL_VOTACAO,
            endereco: `${DS_ENDERECO}, ${NM_BAIRRO}`,
            secoes: [],
            totalEleitores: 0,
          }
        }
        acc[NM_LOCAL_VOTACAO].secoes.push(NR_SECAO)
        acc[NM_LOCAL_VOTACAO].totalEleitores += Number(QT_ELEITOR_SECAO) || 0
        return acc
      }, {})

    const locaisArray = Object.values(locaisAgrupados)
    locaisVotacao.value = locaisArray

    // Inicializa votosEsperados para garantir que o objeto esteja preenchido
    locaisArray.forEach((local) => {
      if (!votosEsperados.value[local.nome]) {
        votosEsperados.value[local.nome] = 0
      }
    })

    localStorage.setItem(cacheKey, JSON.stringify(locaisArray))
  }
  catch (error) {
    console.error('Erro ao carregar locais de votação:', error)
    locaisVotacao.value = []
  }
  finally {
    loading.value = false
  }
}

// Função para validar a quantidade de votos esperados
function validarVotos(local, valor) {
  const votos = Number(valor)

  if (votos > local.totalEleitores) {
    votosEsperados.value[local.nome] = local.totalEleitores
  }
  else {
    votosEsperados.value[local.nome] = votos
  }

  // Salvar no localStorage para manter persistência
  const cacheKey = `votos_esperados_${selectedMunicipio.value}`
  const cachedVotos = localStorage.getItem(cacheKey)
  let votosCache = {}

  if (cachedVotos) {
    votosCache = JSON.parse(cachedVotos)
  }

  votosCache[local.nome] = votos
  localStorage.setItem(cacheKey, JSON.stringify(votosCache))
}

// Computed para somar os votos esperados
const somaVotosEsperados = computed(() => {
  return Object.values(votosEsperados.value).reduce((acc, val) => acc + Number(val), 0)
})

// Watcher para carregar municípios ao selecionar um UF
watch(selectedUF, (novoUF) => {
  if (novoUF) {
    selectedMunicipio.value = ''
    carregarMunicipios(novoUF)
  }
  else {
    selectedMunicipio.value = ''
    municipios.value = []
  }
})

// Watcher para carregar locais de votação ao selecionar um município
watch(selectedMunicipio, (novoMunicipio) => {
  if (novoMunicipio) {
    carregarLocaisVotacao(selectedUF.value)
  }
})

// Carregar estados ao montar o componente
onMounted(() => {
  carregarEstados()
})
</script>

<template>
  <v-container>
    <!-- Select para escolher UF -->
    <v-select
      v-model="selectedUF"
      :items="estados"
      item-title="nome"
      item-value="sigla"
      label="Selecione o Estado (UF)"
      outlined
    />

    <!-- Select para escolher Município -->
    <v-select
      v-model="selectedMunicipio"
      :items="municipios"
      item-title="nome"
      item-value="codigo"
      label="Selecione o Município"
      outlined
      :disabled="!selectedUF"
    />

    <!-- Indicador de carregamento -->
    <v-progress-linear v-if="loading" indeterminate color="blue" />

    <!-- Lista de Locais de Votação agrupados -->
    <v-card v-if="!loading && locaisVotacao.length > 0">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Locais de Votação</span>
        <v-chip color="green" text-color="white" label>
          Soma de votos: {{ somaVotosEsperados.toLocaleString('pt-BR') }}
        </v-chip>
      </v-card-title>

      <v-list>
        <v-row v-for="(local, index) in locaisVotacao" :key="index" class="mb-4">
          <!-- Coluna Única: Detalhes do local e input para votos esperados -->
          <v-col cols="12">
            <v-list-item>
              <v-list-item-title>{{ local.nome }}</v-list-item-title>
              <v-list-item-subtitle>{{ local.endereco }}</v-list-item-subtitle>
              <v-list-item-subtitle>Seções: {{ local.secoes.join(', ') }}</v-list-item-subtitle>
              <v-list-item-subtitle>Total de Eleitores: {{ local.totalEleitores }}</v-list-item-subtitle>
              <br>
              <!-- Input para votos esperados -->
              <v-text-field
                v-model="votosEsperados[local.nome]"
                label="Votos Esperados"
                type="number"
                :error="votosEsperados[local.nome] > local.totalEleitores"
                :error-messages="votosEsperados[local.nome] > local.totalEleitores ? 'Quantidade excede total de eleitores' : ''"
                :max="local.totalEleitores"
                outlined
                @input="validarVotos(local, $event.target.value)"
              />
            </v-list-item>
            <v-divider /> <!-- Separador entre os locais -->
          </v-col>
        </v-row>
      </v-list>
    </v-card>

    <!-- Mensagem de nenhum local de votação -->
    <v-alert v-if="!loading && locaisVotacao.length === 0 && selectedMunicipio" type="info">
      Nenhum local de votação encontrado para o município selecionado.
    </v-alert>
  </v-container>
</template>
