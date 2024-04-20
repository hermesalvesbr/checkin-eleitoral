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
  import type { Chapa, Cidade } from '~/types'

  const props = defineProps<{
    modelValue: Cidade
    chapas: Chapa[]
  }>()

  const cidade = computed(() => props.modelValue)
  const chapas = ref<Chapa[]>(props.chapas)

  // Utilize a watch para atualizar a ref 'chapas' sempre que as chapas do prop mudarem
  watch(
    () => props.chapas,
    (newChapas) => {
      chapas.value = newChapas
    },
    { deep: true }
  )

  const chapasFiltradas = computed(() =>
    chapas.value.filter((chapa) => chapa.cidadeId === cidade.value.id)
  )

  const totalChapa = computed(() =>
    chapasFiltradas.value.reduce(
      (total, chapa) =>
        total +
        chapa.pessoas.reduce((acc, pessoa) => acc + Number(pessoa.votos), 0),
      0
    )
  )

  const votosDisponiveis = computed(
    () => cidade.value.totalComparecimento - totalChapa.value
  )

  const totalEleitores = computed(() =>
    cidade.value.totalEleitores.toLocaleString()
  )
  const totalComparecimento = computed(() =>
    cidade.value.totalComparecimento.toLocaleString()
  )

  const internalPanelOpen = ref<number>(0)
</script>
