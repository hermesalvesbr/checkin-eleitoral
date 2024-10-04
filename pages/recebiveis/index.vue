<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

const estados = ref([])
const municipios = ref([])
const vereadores = ref([])
const loading = ref(false)
const eleicaoData = ref(null)

const cargos = ref([
  { codigo: 11, nome: 'Prefeito' },
  { codigo: 12, nome: 'Vice-prefeito' },
  { codigo: 13, nome: 'Vereador' },
])

const selectedUF = ref('')
const selectedMunicipio = ref('')
const selectedCargo = ref('')

const anoEleicao = 2024
const sqEleicao = 2045202024
const codigoVereador = 13
const eleicaoUrl = computed(() => {
  if (selectedUF.value && eleicaoData.value) {
    const estadoSelecionado = estados.value.find(estado => estado.sigla === selectedUF.value)
    return `https://divulgacandcontas.tse.jus.br/divulga/#/candidato/${estadoSelecionado?.regiao}/${selectedUF.value}/${eleicaoData.value}`
  }
  return null
})
async function fetchWithLocalStorage(key, url) {
  const cachedData = localStorage.getItem(key)
  if (cachedData) {
    return JSON.parse(cachedData)
  }
  try {
    const response = await fetch(url)
    const data = await response.json()
    localStorage.setItem(key, JSON.stringify(data))
    return data
  }
  catch (error) {
    console.error('Erro ao buscar os dados:', error)
    throw error
  }
}

async function carregarEstados() {
  try {
    const response = await fetch('/eleicao_atual.json')
    const data = await response.json()
    if (data && data.ues) {
      estados.value = data.ues.map(estado => ({
        sigla: estado.sigla,
        nome: estado.nome,
        regiao: estado.regiao,
      }))
      eleicaoData.value = data?.eleicao?.sq_ELEICAO
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

async function montarUrlPrestacaoContas(candidato) {
  const sqEleicao = candidato.eleicao.id
  const anoEleicao = candidato.eleicao.ano
  const codigoMunicipio = candidato.ufCandidatura
  const codigoCargo = candidato.cargo.codigo
  const codigoPartido = String(candidato.numero).substring(0, 2)
  const numeroCandidato = candidato.numero
  const idCandidato = candidato.id

  const url = `https://divulgacandcontas.tse.jus.br/divulga/rest/v1/prestador/consulta/${sqEleicao}/${anoEleicao}/${codigoMunicipio}/${codigoCargo}/${codigoPartido}/${numeroCandidato}/${idCandidato}`

  const key = `prestacao_${idCandidato}`
  const cachedData = localStorage.getItem(key)

  if (cachedData) {
    const parsedData = JSON.parse(cachedData)
    if (parsedData.dadosConsolidados?.totalRecebido === 0) {
      console.log('Total recebido é 0, ignorando cache e fazendo nova requisição para:', idCandidato)
    }
    else {
      return parsedData
    }
  }

  try {
    const response = await fetch(url)
    const data = await response.json()
    if (data.dadosConsolidados?.totalRecebido > 0) {
      localStorage.setItem(key, JSON.stringify(data))
    }
    return data
  }
  catch (error) {
    console.error('Erro ao buscar dados de prestação de contas:', error)
    throw error
  }
}

async function carregarVereadores(codigoMunicipio) {
  if (String(selectedCargo.value) === '13' && codigoMunicipio) {
    loading.value = true
    try {
      const url = `https://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/listar/${anoEleicao}/${codigoMunicipio}/${sqEleicao}/${codigoVereador}/candidatos`
      const key = `candidatos_${codigoMunicipio}_${anoEleicao}`
      const data = await fetchWithLocalStorage(key, url)

      if (data && data.candidatos) {
        vereadores.value = await Promise.all(
          data.candidatos.map(async (candidato) => {
            const urlPrestacaoContas = await montarUrlPrestacaoContas(candidato)
            let totalRecebido = 0

            try {
              const responsePrestacao = await fetchWithLocalStorage(`prestacao_${candidato.id}`, urlPrestacaoContas)
              totalRecebido = responsePrestacao.dadosConsolidados?.totalRecebido || 0
            }
            catch (error) {
              console.error(`Erro ao carregar dados de prestação de contas para o candidato ${candidato.nomeUrna}:`, error)
            }

            return {
              nome: candidato.nomeUrna,
              numero: candidato.numero,
              partido: candidato.partido.sigla,
              idCandidato: candidato.id,
              totalRecebido,
            }
          }),
        )
      }
      else {
        console.error('Nenhum vereador encontrado para o município selecionado')
        vereadores.value = []
      }
    }
    catch (error) {
      console.error(`Erro ao carregar vereadores para o município ${codigoMunicipio}:`, error)
    }
    finally {
      loading.value = false // Finaliza o carregamento
    }
  }
}

const vereadoresAgrupadosPorPartido = computed(() => {
  return vereadores.value.reduce((acumulador: any, vereador) => {
    if (!acumulador[vereador.partido]) {
      acumulador[vereador.partido] = {
        vereadores: [],
        totalRecebido: 0,
      }
    }
    acumulador[vereador.partido].vereadores.push(vereador)
    acumulador[vereador.partido].totalRecebido += vereador.totalRecebido
    return acumulador
  }, {})
})

watch(selectedUF, (novoUF) => {
  if (novoUF) {
    selectedMunicipio.value = ''
    selectedCargo.value = ''
    carregarMunicipios(novoUF)
  }
  else {
    selectedMunicipio.value = ''
    selectedCargo.value = ''
    municipios.value = []
  }
})

watch(selectedMunicipio, (novoMunicipio) => {
  if (novoMunicipio) {
    selectedCargo.value = ''
  }
  else {
    selectedCargo.value = ''
  }
})

watch(selectedCargo, (novoCargo) => {
  if (Number(novoCargo) === 13 && selectedMunicipio.value) {
    carregarVereadores(selectedMunicipio.value)
  }
})

onMounted(() => {
  carregarEstados()
})
</script>

<template>
  <v-container>
    <v-select
      id="uf"
      v-model="selectedUF"
      :items="estados"
      item-title="nome"
      item-value="sigla"
      label="Selecione o Estado (UF)"
      outlined
    />

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

    <v-alert
      v-if="selectedCargo"
      type="info"
      color="green lighten-2"
      elevation="2"
      prominent
      icon="mdi-information-outline"
    >
      <template #default>
        <a :href="eleicaoUrl" target="_blank" class="text-decoration-none" style="color: yellow">
          Confira essas informações no site oficial do TSE
          / {{ selectedUF }}
        </a>
      </template>
    </v-alert>
    <!-- Indicador de carregamento -->
    <v-progress-linear v-if="loading" indeterminate color="blue" />

    <v-card v-if="selectedCargo === 13 && Object.keys(vereadoresAgrupadosPorPartido).length > 0">
      <v-card-title>Total líquido de Recursos Recebidos</v-card-title>

      <v-list v-for="(dadosPartido, partido) in vereadoresAgrupadosPorPartido" :key="partido">
        <v-list-subheader>
          {{ partido }} - {{ dadosPartido.totalRecebido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
        </v-list-subheader>
        <v-divider />

        <v-list-item v-for="(vereador, index) in dadosPartido.vereadores" :key="index">
          <v-list-item-title>
            {{ vereador.nome }} -
            {{ vereador.totalRecebido > 0 ? vereador.totalRecebido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Indisponível' }}
          </v-list-item-title>

          <v-list-item-subtitle>Número: {{ vereador.numero }} - {{ vereador.partido }}</v-list-item-subtitle>
        </v-list-item>

        <v-divider />
      </v-list>
    </v-card>
  </v-container>
</template>
