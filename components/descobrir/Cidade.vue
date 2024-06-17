<script setup lang="ts">
const props = defineProps<{
  cidade: any
  somaVotos: number
}>()

const cidade = computed(() => props.cidade)

const votosDisponiveis = computed(
  () => cidade.value?.total_comparecimento - props.somaVotos,
)
const totalEleitores = computed(() =>
  cidade.value?.total_eleitores.toLocaleString(),
)
const totalComparecimento = computed(() =>
  cidade.value?.total_comparecimento.toLocaleString(),
)

const internalPanelOpen = ref<number>(0)
</script>

<template>
  <v-col cols="12">
    <v-expansion-panels v-model="internalPanelOpen" popout>
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ cidade?.cidade }} - {{ cidade?.uf }}
          <template #actions="{ expanded }">
            <span v-if="!expanded" class="text-caption mr-7">
              Votos disponíveis {{ votosDisponiveis.toLocaleString() }}
            </span>
            <v-icon
              :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list dense>
            <v-list-item>
              <div class="d-flex justify-space-between align-center w-100">
                <v-list-item-title>Eleitores</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    totalEleitores
                  }}
                </v-list-item-subtitle>
              </div>
            </v-list-item>
            <v-list-item>
              <div class="d-flex justify-space-between align-center w-100">
                <v-list-item-title>Comparecimento</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    totalComparecimento
                  }}
                </v-list-item-subtitle>
              </div>
            </v-list-item>
            <v-list-item>
              <div class="d-flex justify-space-between align-center w-100">
                <v-list-item-title>Votos disponíveis</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    votosDisponiveis.toLocaleString()
                  }}
                </v-list-item-subtitle>
              </div>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-col>
</template>
