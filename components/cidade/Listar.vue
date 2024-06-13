<script setup lang="ts">
const props = defineProps({
  cidade: {
    type: String,
    required: true,
  },
  chapas: {
    type: Number,
    required: true,
  },
})

const qtdChapas = props.chapas || 0
const eleitores = new Intl.NumberFormat('pt-BR').format(59486).replace(',', '.')
const quantidadeChapas = qtdChapas.toString().padStart(2, '0')
</script>

<template>
  <v-col cols="12">
    <v-card color="#1F7087">
      <div class="d-flex flex-no-wrap justify-space-between">
        <div>
          <v-card-title class="text-h6">
            Araripina - PE
            <div class="text-subtitle-2">
              {{ eleitores }} eleitores
            </div>
          </v-card-title>

          <v-card-subtitle class="text-wrap">
            <strong>{{ quantidadeChapas }}</strong> Chapas montadas em Araripina
          </v-card-subtitle>

          <v-card-actions>
            <v-btn
              class="ms-2"
              size="small"
              text="Ver Ánalise"
              variant="outlined"
            />
          </v-card-actions>
        </div>

        <v-avatar
          class="ma-3"
          rounded="0"
          size="125"
        >
          <v-img src="https://cdn.vuetifyjs.com/images/cards/foster.jpg" />
        </v-avatar>
      </div>
    </v-card>
  </v-col>
</template>
