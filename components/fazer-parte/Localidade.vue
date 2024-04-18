<template>
  <v-row
    id="localidade"
    class="my-1 d-flex flex-wrap"
    v-if="props.localidadeDados"
  >
    <v-col cols="6">
      <v-card
        class="d-flex flex-column"
        elevation="10"
        color="surface-variant"
        v-if="props.localidadeDados?.cidade"
      >
        <v-card-title class="justify-center text-caption text-uppercase">
          Cidade
        </v-card-title>
        <v-card-text id="dados" class="text-start text-lg-h5 text-truncate">
          {{ props.localidadeDados.cidade }}
        </v-card-text>
      </v-card>
      <v-card
        class="d-flex flex-column"
        elevation="10"
        color="secondary"
        v-if="props.localidadeDados?.politico"
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

<script lang="ts" setup>
  interface CardData {
    cidade: string
    politico: string
  }
  const props = defineProps<{ localidadeDados?: CardData }>()
</script>
