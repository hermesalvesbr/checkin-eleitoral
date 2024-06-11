<script lang="ts" setup>
interface CardData {
  cidade: string
  politico: string
}
const props = defineProps<{ localidadeDados?: CardData }>()
</script>

<template>
  <v-row
    v-if="props.localidadeDados"
    id="localidade"
    class="my-1 d-flex flex-wrap"
  >
    <v-col cols="6">
      <v-card
        v-if="props.localidadeDados?.cidade"
        class="d-flex flex-column"
        elevation="10"
        color="surface-variant"
      >
        <v-card-title class="justify-center text-caption text-uppercase">
          Cidade
        </v-card-title>
        <v-card-text id="dados" class="text-start text-lg-h5 text-truncate">
          {{ props.localidadeDados.cidade }}
        </v-card-text>
      </v-card>
      <v-card
        v-if="props.localidadeDados?.politico"
        class="d-flex flex-column"
        elevation="10"
        color="secondary"
      >
        <v-card-title class="justify-center text-caption text-uppercase">
          Apoiando
        </v-card-title>
        <v-card-text id="dados" class="text-start text-lg-h5 text-truncate">
          {{ props.localidadeDados.politico }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
