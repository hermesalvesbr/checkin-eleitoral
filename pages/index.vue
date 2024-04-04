<template>
  <div>
    <h1>Pessoas</h1>
    <code>
      {{ pessoas }}
    </code>
  </div>
</template>
<script setup lang="ts">
const directus = new useDirectus()
const pessoas = await directus.getItems('pessoas')
</script>