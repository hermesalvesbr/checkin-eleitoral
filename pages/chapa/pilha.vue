<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click="abrirDialogoAdicionarPessoa"
          >Adicionar Pessoa</v-btn
        >

        <v-dialog
          v-model="dialog"
          transition="dialog-top-transition"
          max-width="400px"
        >
          <v-card>
            <v-toolbar dense flat>Adicionar Nova Pessoa</v-toolbar>
            <v-card-text>
              <v-text-field
                v-model="novaPessoa.nome"
                label="Nome Completo"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                v-model="novaPessoa.votos"
                label="Quantidade de Votos"
                type="number"
                outlined
                dense
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="adicionarPessoa"
                >Adicionar</v-btn
              >
              <v-btn color="grey darken-1" text @click="fecharDialogo"
                >Cancelar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-divider class="my-4"></v-divider>
    <v-data-table-virtual
      :headers="headers"
      :items="pessoas"
      item-key="nome"
      class="elevation-1"
    >
      <template v-slot:item.votos="{ item }">
        <v-text-field
          v-model.number="item.votos"
          type="number"
          dense
          solo
          hide-details
          @change="ordenarPessoasPorVotos"
        ></v-text-field>
      </template>
    </v-data-table-virtual>
    <v-divider class="my-4"></v-divider>
    <h4> {{ totalDeVotos }}</h4>
    {{ totalDePessoas }}
    {{ pessoas }}
  </v-container>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  interface Pessoa {
    nome: string
    votos: number
  }

  const pessoas = ref<Pessoa[]>([
    { nome: 'Hermes Alves', votos: 1500 },
    { nome: 'João', votos: 234 },
  ])
  const headers = ref([
    { text: 'Nome', align: 'start', value: 'nome' },
    { text: 'Votos', value: 'votos' },
  ])
  const dialog = ref(false)
  const novaPessoa = ref<Pessoa>({ nome: '', votos: 0 })
  const totalDeVotos = computed(() => {
    return pessoas.value.reduce(
      (total, pessoa) => total + Number(pessoa.votos),
      0
    )
  })
  const totalDePessoas = computed(() => {
    return pessoas.value.length || 0
  })
  // Debounce function
  function debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout>
    return function executedFunction(...args: any) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  const ordenarPessoasPorVotosDebounced = debounce(() => {
    ordenarPessoasPorVotos()
  }, 1500)

  function abrirDialogoAdicionarPessoa() {
    dialog.value = true
  }

  function fecharDialogo() {
    dialog.value = false
  }

  function adicionarPessoa() {
    pessoas.value.push({ ...novaPessoa.value })
    ordenarPessoasPorVotos()
    novaPessoa.value = { nome: '', votos: 0 }
    dialog.value = false
  }

  function ordenarPessoasPorVotos() {
    pessoas.value.sort((a, b) => b.votos - a.votos)
  }
</script>
