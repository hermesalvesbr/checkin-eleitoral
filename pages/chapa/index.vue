<template>
  <div>
    <h1>Chapa</h1>
    <ChapaCriarPartidos v-model="chapasCriadas" />
  </div>
</template>
<script setup lang="ts">
  const chapasCriadas = ref([])
  watch(
    chapasCriadas,
    (newValue) => {
      console.log('Atualizou', newValue)
    },
    { deep: true }
  )
</script>
