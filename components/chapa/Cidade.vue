<template>
  <v-col cols="12">
    <v-expansion-panels popout v-model="internalPanelOpen">
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ cidade.nome }}
          <template v-slot:actions="{ expanded }">
            <span v-if="!expanded" class="text-caption mr-7">
              Chapas {{ totalChapa.toLocaleString() }}
            </span>
            <v-icon
              :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            ></v-icon>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list dense>
            <v-list-item>
              <v-list-item-content class="d-flex justify-space-between">
                <v-list-item-title>Eleitores</v-list-item-title>
                <v-list-item-subtitle>{{
                  totalEleitores
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="d-flex justify-space-between">
                <v-list-item-title>Comparecimento</v-list-item-title>
                <v-list-item-subtitle>{{
                  totalComparecimento
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="d-flex justify-space-between">
                <v-list-item-title>Chapa</v-list-item-title>
                <v-list-item-subtitle>{{
                  totalChapa.toLocaleString()
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-col>
</template>

<script setup lang="ts">
  interface Pessoa {
    nome: string
    votos: number
  }
  interface Cidade {
    nome: string
    uf: string
    totalEleitores: number
    totalComparecimento: number
    chapa: string
  }
  interface Chapa {
    nome: string
    valor: string
    logo: string
    id: number
    pessoas: Pessoa[]
  }
  const props = defineProps<{
    modelValue: Cidade
    chapa: Chapa[]
  }>()
  const emit = defineEmits(['update:modelValue'])

  const cidade = computed(() => props.modelValue)
  const chapa = ref(props.chapa)
  const totalChapa = ref(0)
  const totalEleitores = computed(() =>
    cidade.value.totalEleitores.toLocaleString()
  )
  const totalComparecimento = computed(() =>
    cidade.value.totalComparecimento.toLocaleString()
  )
  function calculateTotalChapa(): number {
    return chapa.value.reduce((acc, curr) => {
      const totalVotosChapa = curr.pessoas.reduce((accPessoa, currPessoa) => {
        if (typeof currPessoa.votos === 'string') {
          const votos = parseInt(currPessoa.votos, 10)
          return accPessoa + (isNaN(votos) ? 0 : votos)
        } else {
          return accPessoa + currPessoa.votos
        }
      }, 0)
      return acc + totalVotosChapa
    }, 0)
  }
  watch(
    () => props.chapa,
    (newValue) => {
      chapa.value = newValue
      totalChapa.value = calculateTotalChapa()
    },
    { deep: true }
  )

  watch(
    chapa,
    () => {
      totalChapa.value = calculateTotalChapa()
    },
    { deep: true }
  )
  const internalPanelOpen = ref(1)
</script>
