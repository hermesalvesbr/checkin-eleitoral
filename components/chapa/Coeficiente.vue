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
const limiteChapa = computed(() => {
  return numeroVereadores.value + 1
})
const chapasDaCidade = computed(() =>
  props.modelValue.filter(chapa => chapa.cidadeId === cidade.value.id),
)

function solicitarNumeroVereadores() {
  dialog.value = true
}

function salvarInformacoes() {
  if (numeroVereadores.value > 0) {
    calcular()
    d.updateItem('votantes', cidade.value.id.toString(), {
      vereadores: numeroVereadores.value,
    })
    dialog.value = false
  }
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
function calcular() {
  if (numeroVereadores.value > 0) {
    coeficienteEleitoral.value
        = (cidade.value.totalComparecimento ?? 0) / numeroVereadores.value
  }
}
async function getVereadores(cidadeId: number): Promise<number> {
  const response = await d.getItem('votantes', cidadeId, {
    fields: ['vereadores'],
    limit: 10,
  })
  return response.vereadores
}

function calcularVotosPorCandidato(): number {
  const chapas = chapasDaCidade.value.length
  const candidatos = chapas * limiteChapa.value
  const minVot = (cidade.value.totalComparecimento ?? 0) / (candidatos / 2)
  return minVot
}
watch(
  () => chapasDaCidade.value.length,
  () => {
    minimoVotos.value = calcularVotosPorCandidato()
  },
)
onMounted(async () => {
  if (cidade.value) {
    numeroVereadores.value = await getVereadores(cidade.value.id)
    if (numeroVereadores.value > 0) {
      calcular()
      minimoVotos.value = calcularVotosPorCandidato()
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
        title="Coeficiente eleitoral"
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
              Coeficiente eleitoral
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
            Coeficiente eleitoral
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
            <v-list-item-title
              class="text-caption"
              :class="{ 'font-weight-bold text-red': numeroVereadores === 0 }"
            >
              {{ numeroVereadores }} vagas de vereador
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              Candidatos são competitivos apartir de
              {{ minimoVotos.toFixed(0) }} votos
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
    </v-row>
  </v-container>
</template>
