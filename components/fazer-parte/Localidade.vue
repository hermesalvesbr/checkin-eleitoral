<template>
  <v-row id="localidade" class="my-2 d-flex flex-wrap">
    <v-col cols="6 " v-for="(card, index) in dashboardCards" :key="index">
      <v-card
        class="d-flex flex-column align-center"
        elevation="10"
        :color="card.color"
      >
        <v-card-title class="justify-center text-caption text-uppercase">
          {{ card.title }}
        </v-card-title>
        <v-card-text id="dados" class="text-start">
          {{ card.value }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  const dashboardCards = computed(() => [
    {
      title: 'Cidade',
      value: 'Araripina - PE',
      color: 'surface-variant',
    },
    {
      title: 'Apoiando',
      value: 'Osvaldo da Abelha Branca',
      color: 'secondary',
    },
  ])
</script>
