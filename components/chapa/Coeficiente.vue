<script setup lang="ts">
import type { Chapa, Cidade } from '~/types'

const props = defineProps<{
  modelValue: Chapa[]
  cidadeSelecionada: Cidade
}>()
const d = new useDirectus()

const cidade = ref(props.cidadeSelecionada)
const dialog = ref(false)
const numeroVereadores = ref<number>(0)
const coeficienteEleitoral = ref(0)
const minimoVotos = ref(0)
const limiteChapa = computed(() => Number.parseInt(numeroVereadores.value) + 1)

const chapasDaCidade = computed(() =>
  props.modelValue.filter(chapa => chapa.cidadeId === cidade.value.id),
)
const totalComparecimento = computed(() => cidade.value.totalComparecimento)

function solicitarNumeroVereadores() {
  dialog.value = true
}
function ajustarImpar() {
  let num = numeroVereadores.value || 9
  if (num % 2 === 0) {
    num++
    if (num > 31)
      num = 31
  }
  numeroVereadores.value = num
}

async function getVereadores(cidadeId: number): Promise<number> {
  const response = await d.getItem('votantes', cidadeId, {
    fields: ['vereadores'],
    limit: 10,
  })
  return response.vereadores
}

// Calcula o coeficiente eleitoral (votos válidos / número de vereadores)
function calcularCoeficienteEleitoral(totalVotos: number, vagas: number): number {
  return vagas > 0 ? totalVotos / vagas : 0
}

function calcularTotalVotosPartido(chapas: Chapa[]): number {
  return chapas.reduce((total, chapa) => {
    const votosChapa = chapa.pessoas.reduce((soma, pessoa) => soma + Number(pessoa.votos), 0)
    return total + votosChapa
  }, 0)
}

function calcularMinimoVotosPorCandidato(votosPartido: number, coefEleitoral: number): number {
  if (coefEleitoral === 0)
    return 0 // Evitar divisões por zero
  const minimoVotos = votosPartido / coefEleitoral
  // Evitar valores excessivamente baixos e aplicar um limite inferior razoável
  return minimoVotos < 100 ? 100 : minimoVotos
}
const resumoVereador = ref()

const podeResumir = ref()
function calcularQuocientePartidario(chapas: Chapa[], numeroVagas: number): string {
  // Função para somar os votos de cada chapa
  function calcularTotalVotosPartido(chapa: Chapa): number {
    return chapa.pessoas.reduce((total, pessoa) => total + Number(pessoa.votos), 0)
  }

  // Calcular o total de votos de todas as chapas
  const totalVotos = chapas.reduce((total, chapa) => total + calcularTotalVotosPartido(chapa), 0)

  // Cálculo do quociente eleitoral (total de votos / número de vagas)
  const quocienteEleitoral = totalVotos / numeroVagas

  // Calcular o quociente partidário para cada partido
  const quocientesPartidarios = chapas.map((chapa) => {
    const votosPartido = calcularTotalVotosPartido(chapa)
    const vagas = Math.floor(votosPartido / quocienteEleitoral) // Desprezar a fração
    return { partido: chapa.valor, vagas }
  })

  // Construir a string de saída
  let resultado = `O quociente eleitoral para esta eleição em ${cidade.value.nome}, com ${numeroVagas} vagas de vereador, é ${quocienteEleitoral.toFixed(2)} (aproximadamente).\n\n`
  resultado += 'Com base nisso, o número de vagas a que cada partido tem direito (quociente partidário) é o seguinte:\n\n'

  quocientesPartidarios.forEach(({ partido, vagas }) => {
    resultado += `${partido}: ${vagas} vagas\n`
  })

  // Filtrar os partidos com pelo menos uma vaga
  const partidosComVagas = quocientesPartidarios.filter(qp => qp.vagas > 0).map(qp => qp.partido)

  resultado += `\nOs partidos que têm direito a pelo menos uma vaga são ${partidosComVagas.join(', ')}.`
  resumoVereador.value = resultado
  return resultado
}

function partidosComQuocienteEleitoral(): string[] {
  const limiteVotos = coeficienteEleitoral.value
  const chapas = chapasDaCidade.value
  function calcularTotalVotosPartido(chapa: Chapa): number {
    return chapa.pessoas.reduce((total, pessoa) => total + Number(pessoa.votos), 0)
  }

  return chapas
    .filter(chapa => calcularTotalVotosPartido(chapa) >= limiteVotos)
    .map(chapa => chapa.valor) // Retorna apenas o nome do partido (valor)
}

async function salvarInformacoes() {
  if (numeroVereadores.value > 0) {
    const resp = await d.updateItem('votantes', cidade.value.id.toString(), {
      vereadores: numeroVereadores.value,
    })
    dialog.value = false
    numeroVereadores.value = resp.vereadores

    if (resp?.id) {
      window.location.reload()
    }
  }
}
watch(
  () => numeroVereadores.value,
  () => {
    if (numeroVereadores.value > 0 && coeficienteEleitoral.value > 0) {
      const totalVotosPartido = calcularTotalVotosPartido(chapasDaCidade.value)
      minimoVotos.value = calcularMinimoVotosPorCandidato(totalVotosPartido, coeficienteEleitoral.value)
      console.log('Mínimo de votos atualizado:', minimoVotos.value)
      calcularQuocientePartidario(chapasDaCidade.value, numeroVereadores.value)
      podeResumir.value = partidosComQuocienteEleitoral()
    }
  },
  {
    deep: true,
  },
)
watch(
  () => chapasDaCidade.value.length,
  () => {
    if (numeroVereadores.value > 0 && coeficienteEleitoral.value > 0) {
      const totalVotosPartido = calcularTotalVotosPartido(chapasDaCidade.value)
      minimoVotos.value = calcularMinimoVotosPorCandidato(totalVotosPartido, coeficienteEleitoral.value)
      console.log('Mínimo de votos atualizado:', minimoVotos.value)
      calcularQuocientePartidario(chapasDaCidade.value, numeroVereadores.value)
      podeResumir.value = partidosComQuocienteEleitoral()
    }
  },
  {
    deep: true,
  },
)

onMounted(async () => {
  if (cidade.value) {
    numeroVereadores.value = await getVereadores(cidade.value.id)
    console.log('Número de Vereadores:', numeroVereadores.value)

    if (numeroVereadores.value > 0) {
      coeficienteEleitoral.value = calcularCoeficienteEleitoral(totalComparecimento.value, numeroVereadores.value)
      console.log('Coeficiente Eleitoral calculado:', coeficienteEleitoral.value)

      const totalVotosPartido = calcularTotalVotosPartido(chapasDaCidade.value)
      console.log('Total de votos por partido:', totalVotosPartido)

      minimoVotos.value = calcularMinimoVotosPorCandidato(totalVotosPartido, coeficienteEleitoral.value)
      console.log('Mínimo de votos calculado:', minimoVotos.value)

      calcularQuocientePartidario(chapasDaCidade.value, numeroVereadores.value)
      podeResumir.value = partidosComQuocienteEleitoral()
    }
  }
})
</script>

<template>
  <v-container fluid>
    <v-row v-if="numeroVereadores === 0" class="pa-6">
      <v-card
        class="mx-auto"
        max-width="344"
        prepend-icon="mdi-vote"
        rel="noopener"
        subtitle="Informe o número de vereadores"
        title="Quociente eleitoral"
        @click="solicitarNumeroVereadores"
      />
    </v-row>
    <v-row>
      <v-dialog
        v-model="dialog"
        transition="dialog-bottom-transition"
        max-width="400px"
      >
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title class="text-nowrap">
              Quociente eleitoral
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <p>Quantidade de vereadores em {{ cidade.nome }}?</p>
            <v-text-field
              v-model="numeroVereadores"
              label="Número de vereadores"
              type="number"
              min="9"
              max="31"
              class="mt-4"
              :rules="[(v) => !!v || 'Este campo é obrigatório']"
              @change="ajustarImpar"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              class="text-none ms-4 text-white"
              color="primary"
              variant="flat"
              @click="salvarInformacoes"
            >
              Salvar
            </v-btn>
            <v-btn
              class="text-none ms-4 text-white"
              color="secondary"
              variant="flat"
              @click="dialog = false"
            >
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row v-if="numeroVereadores !== 0" id="coeficiente" class="justify-start">
      <v-divider :thickness="2" />
      <v-col cols="12">
        <v-list>
          <v-list-subheader class="text-caption text-uppercase">
            Quociente  eleitoral
            <span class="text-lowercase">(estimativa)</span>
          </v-list-subheader>
          <v-list-item color="primary">
            <v-list-item-title class="text-caption">
              {{ coeficienteEleitoral.toFixed(0) }} votos por
              chapa
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              Votos para a chapa eleger em
              {{ cidade.nome }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item color="primary">
            <v-list-item-title class="text-caption">
              Limite por chapa {{ limiteChapa }} candidatos
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              Lei 14.211/2022, 100% de vagas + 1
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <v-col cols="12" class="text-caption mt-2 bg-blue-lighten-5">
          Caso a quantidade de vereadores esteja incorreta,
          <a
            target="_blank"
            :href="`https://wa.me/+5581989531156?text=Ol%C3%A1%2C%20Quantidade%20de%20vereadores%20em%20${cidade.nome}%20est%C3%A1%20incorreto.`"
            class="text-decoration-none"
          >informe agora</a>.
        </v-col>
      </v-col>
      <div v-if="podeResumir && podeResumir.length > 0">
        <v-alert :text="resumoVereador" class="ma-4" />
      </div>
    </v-row>
  </v-container>
</template>
