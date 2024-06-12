<script setup lang="ts">
const imageFetcher = new ImageFetcher()

onMounted(async () => {
  const imageUrl = await imageFetcher.fetchImage('bandeira de Araripina Pernambuco')
  if (imageUrl) {
    console.log('Imagem encontrada:', imageUrl)
  }
  else {
    console.log('Nenhuma imagem encontrada.', imageUrl)
  }
})
</script>

<template>
  <div>
    <h1>Busca de Imagens</h1>
    <div v-if="imageFetcher.error">
      {{ imageFetcher.error }}
    </div>
    <div v-else>
      <div v-if="imageFetcher.image">
        <img :src="imageFetcher.image" alt="Bandeira de Araripina">
      </div>
      <div v-else>
        Nenhuma imagem encontrada.
      </div>
    </div>
  </div>
</template>

  <style scoped>
  img {
    max-width: 200px;
    max-height: 200px;
    margin: 10px;
  }
  </style>
