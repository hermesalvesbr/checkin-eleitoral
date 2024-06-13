<script setup lang="ts">
const imageFetcher = new ImageFetcher()
const imageUrl = await imageFetcher.fetchImage('bandeira de Araripina Pernambuco')
if (imageUrl) {
  console.log('Imagem encontrada:', imageUrl)
}
else {
  console.log('Nenhuma imagem encontrada.', imageUrl)
}
</script>

<template>
  <div>
    <h1>Busca de Imagens</h1>

    <div v-if="imageUrl">
      <img :src="imageUrl" alt="Bandeira de Araripina">
    </div>

    <CidadeListar />
  </div>
</template>

  <style scoped>
  img {
    max-width: 200px;
    max-height: 200px;
    margin: 10px;
  }
  </style>
