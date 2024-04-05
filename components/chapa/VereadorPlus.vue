<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Votos Disponíveis: <span :style="{ color: votosDisponiveis >= 0 ? '#4CAF50' : '#F44336' }">{{ votosDisponiveis }}</span></h1>
      </v-col>
      <v-col cols="12">
        <v-select
          :items="quantidadesVotos"
          v-model="quantidadeVotosSelecionada"
          label="Quantidade de votos por clique"
          dense
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(vereador, index) in vereadores"
        :key="index"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="pa-4" outlined>
          <v-card-title>{{ vereador.nome }}</v-card-title>
          <v-card-text>
            Votos: {{ vereador.votos }}
          </v-card-text>
          <v-card-actions>
            <v-btn icon @click="adicionarVoto(vereador)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn icon @click="removerVoto(vereador)">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Vereador {
  nome: string
  votos: number
}

const votosTotais = ref(10000)
const vereadores = ref<Vereador[]>([
  { nome: 'João de Deus', votos: 0 },
  { nome: 'Maria Francisca', votos: 0 },
  // Adicione mais vereadores conforme necessário
])

const quantidadesVotos = [50, 100, 200, 500, 1000]
const quantidadeVotosSelecionada = ref(50)

const votosDisponiveis = ref(votosTotais.value)

const atualizarVotos = () => {
  const totalVotosAlocados = vereadores.value.reduce((total, vereador) => total + vereador.votos, 0)
  votosDisponiveis.value = votosTotais.value - totalVotosAlocados
}

const adicionarVoto = (vereador: Vereador) => {
  const votosParaAdicionar = quantidadeVotosSelecionada.value
  if (votosDisponiveis.value >= votosParaAdicionar) {
    vereador.votos += votosParaAdicionar
    atualizarVotos()
  }
}

const removerVoto = (vereador: Vereador) => {
  const votosParaRemover = quantidadeVotosSelecionada.value
  if (vereador.votos >= votosParaRemover) {
    vereador.votos -= votosParaRemover
    atualizarVotos()
  }
}

watch(vereadores, atualizarVotos, { deep: true })
</script>
