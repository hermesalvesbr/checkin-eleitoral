<template>
  <v-row class="pa-6" v-if="!coeficienteEleitoral">
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
  <v-row class="pa-5">
    <v-col cols="12">
      <div>
        <h2>Coeficiente Eleitoral para {{ cidade.nome }}</h2>
        <p>Total de vagas: {{ numeroVereadores }}</p>
        <p>Limite por chapa: {{ numeroVereadores + 1 }}</p>
      </div>
    </v-col>
    <v-col>
      <v-alert v-if="coeficienteEleitoral" type="warning" dismissible>
        O coeficiente eleitoral é: {{ coeficienteEleitoral.toFixed(0) }} votos
        por chapa
      </v-alert>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { Chapa, Cidade } from '~/types'

  const props = defineProps<{
    modelValue: Chapa[]
    cidadeSelecionada: Cidade
  }>()
  const cidade = ref(props.cidadeSelecionada)
  const dialog = ref(false)
  const numeroVereadores = ref<number>(9)
  const coeficienteEleitoral = ref(0)

  function solicitarNumeroVereadores() {
    dialog.value = true
  }

  function salvarInformacoes() {
    console.log(`Número de vereadores salvos: ${numeroVereadores.value}`)
    calcular()
    dialog.value = false
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
    }
  }
</script>
