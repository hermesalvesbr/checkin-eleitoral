<template>
  <v-alert
    title="Coeficiente eleitoral"
    text=" Quer calcular o coeficiente eleitoral? Precisamos saber quantos vereadores
      são na sua cidade."
    type="warning"
    variant="tonal"
  ></v-alert>
</template>

<script setup lang="ts">
  import type { Chapa, Cidade } from '~/types'

  const props = defineProps<{
    modelValue: Chapa[]
    cidadeSelecionada: Cidade
  }>()
  const cidade = ref(props.cidadeSelecionada)
  function solicitarNumeroVereadores() {
    // Lógica para abrir um modal ou outro componente para entrada do número de vereadores
  }
</script>
