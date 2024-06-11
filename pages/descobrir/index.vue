<script setup lang="ts">
const cidades = [
  { id: 1, nome: 'São Paulo' },
  { id: 2, nome: 'Rio de Janeiro' },
  { id: 3, nome: 'Belo Horizonte' },
  // Adicione mais cidades aqui
]
</script>

<template>
  <div>
    <v-card>
      <v-card-title> Lista de Cidades </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="cidade in cidades" :key="cidade.id">
            <v-list-item-title>{{ cidade.nome }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>
