<template>
  <v-col cols="12">
    <v-expansion-panels popout v-model="internalPanelOpen">
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ cidade.nome }}
          <template v-slot:actions="{ expanded }">
            <span v-if="!expanded" class="text-caption mr-7">
              Votos disponíveis {{ votosDisponiveis.toLocaleString() }}
            </span>
            <v-icon
              :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            ></v-icon>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list dense>
            <v-list-item>
              <div class="d-flex justify-space-between align-center w-100">
                <v-list-item-title>Eleitores</v-list-item-title>
                <v-list-item-subtitle>{{
                  totalEleitores
                }}</v-list-item-subtitle>
              </div>
            </v-list-item>
            <v-list-item>
              <div class="d-flex justify-space-between align-center w-100">
                <v-list-item-title>Comparecimento</v-list-item-title>
                <v-list-item-subtitle>{{
                  totalComparecimento
                }}</v-list-item-subtitle>
              </div>
            </v-list-item>
            <v-list-item>
              <div class="d-flex justify-space-between align-center w-100">
                <v-list-item-title>Votos disponíveis</v-list-item-title>
                <v-list-item-subtitle>{{
                  votosDisponiveis.toLocaleString()
                }}</v-list-item-subtitle>
              </div>
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
    cidadeId: number
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
  watchEffect(() => {
    totalChapa.value = props.chapa.reduce((total, curr) => {
      return (
        total +
        curr.pessoas.reduce((totalVotos, pessoa) => {
          return totalVotos + Number(pessoa.votos)
        }, 0)
      )
    }, 0)
  })
  const votosDisponiveis = computed(
    () => props.modelValue.totalComparecimento - totalChapa.value
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
