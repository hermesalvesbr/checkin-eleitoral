<template>
  <v-container fluid>
    <v-row class="pa-6" v-if="numeroVereadores == 0">
      <v-card
        class="mx-auto"
        @click="solicitarNumeroVereadores"
        max-width="344"
        prepend-icon="mdi-vote"
        rel="noopener"
        subtitle="Informe o número de vereadores"
        title="Coeficiente eleitoral"
      ></v-card>
    </v-row>
    <v-row>
      <v-dialog
        v-model="dialog"
        transition="dialog-bottom-transition"
        max-width="400px"
      >
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title class="text-nowrap"
              >Coeficiente eleitoral</v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <p>Quantidade de vereadores em {{ cidade.nome }}?</p>
            <v-text-field
              label="Número de vereadores"
              v-model="numeroVereadores"
              type="number"
              min="9"
              max="31"
              class="mt-4"
              @change="ajustarImpar"
              :rules="[(v) => !!v || 'Este campo é obrigatório']"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
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
    <v-row id="coeficiente" class="justify-start" v-if="isDataValid">
      <v-divider :thickness="2"></v-divider>
      <v-col cols="12">
        <v-list>
          <v-list-subheader class="text-caption text-uppercase"
            >Coeficiente eleitoral</v-list-subheader
          >
          <v-list-item color="primary">
            <v-list-item-title class="text-caption"
              >{{ coeficienteEleitoral.toFixed(0) }} votos por
              chapa</v-list-item-title
            >
            <v-list-item-subtitle class="text-caption"
              >Votos para a chapa eleger em
              {{ cidade.nome }}</v-list-item-subtitle
            >
          </v-list-item>
          <v-list-item color="primary">
            <v-list-item-title
              class="text-caption"
              :class="{ 'font-weight-bold text-red': numeroVereadores === 0 }"
            >
              {{ numeroVereadores }} vagas de vereador
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption"
              >Candidatos são competitivos apartir de
              {{ minimoVotos.toFixed(0) }} votos</v-list-item-subtitle
            >
          </v-list-item>
          <v-list-item color="primary">
            <v-list-item-title class="text-caption"
              >Limite por chapa {{ limiteChapa }} candidatos</v-list-item-title
            >
            <v-list-item-subtitle class="text-caption"
              >Lei 14.211/2022, 100% de vagas + 1</v-list-item-subtitle
            >
          </v-list-item>
        </v-list>
        <v-col cols="12" class="text-caption mt-2 bg-blue-lighten-5">
          Caso a quantidade de vereadores esteja incorreta,
          <a
            target="_blank"
            :href="`https://wa.me/+5581989531156?text=Ol%C3%A1%2C%20Quantidade%20de%20vereadores%20em%20${cidade.nome}%20est%C3%A1%20incorreto.`"
            @click=""
            class="text-decoration-none"
            >informe agora</a
          >.
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
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
  const isDataValid = computed(() => {
    return (
      numeroVereadores.value > 0 &&
      isFinite(minimoVotos.value) &&
      minimoVotos.value > 0
    )
  })
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
      if (num > 31) num = 31
    }
    numeroVereadores.value = num
  }
  function calcular() {
    if (numeroVereadores.value > 0) {
      coeficienteEleitoral.value =
        cidade.value.totalComparecimento / numeroVereadores.value
      minimoVotos.value = calcularVotosPorCandidato()
    }
  }
  async function getVereadores(cidadeId: number): Promise<number> {
    const response = await d.getItem('votantes', cidadeId, {
      fields: ['vereadores'],
      limit: 10,
    })
    return response.vereadores
  }

  const calcularVotosPorCandidato = (): number => {
    const chapas = props.modelValue.length
    const candidatos = chapas * limiteChapa.value
    return cidade.value.totalComparecimento / candidatos
  }

  watch(
    () => props.modelValue.length,
    () => {
      minimoVotos.value = calcularVotosPorCandidato()
    }
  )
  watch(
    () => props.cidadeSelecionada,
    async (newCity, oldCity) => {
      if (newCity && newCity.id !== oldCity?.id) {
        cidade.value = newCity
        numeroVereadores.value = await getVereadores(newCity.id)
        if (numeroVereadores.value > 0) {
          calcular()
        } else {
          coeficienteEleitoral.value = 0
          minimoVotos.value = 0
        }
      }
    },
    { deep: true, immediate: true }
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
