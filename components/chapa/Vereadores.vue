<template>
  <v-container>
    <v-row>
      <v-col cols="12">
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
                id="votos"
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
      density="compact"
      class="titulo-negrito"
    >
      <template v-slot:header.add="{ column }">
        <v-btn
          size="small"
          class="pr-1 mb-2"
          color="primary"
          rounded="xs"
          @click="abrirDialogoAdicionarPessoa"
        >
          <template #prepend>
            <v-icon>mdi-plus-box</v-icon>
          </template>
          <span class="d-none d-sm-flex mr-1">Pessoa</span>
        </v-btn>
      </template>
      <template v-slot:item.add="{ item }">
        <v-btn
          class="ma-1"
          color="warning"
          icon="mdi-delete-forever-outline"
          size="small"
        ></v-btn>
      </template>
      <template v-slot:item.votos="{ item }">
        <v-text-field
          v-model.number="item.votos"
          type="number"
          dense
          solo
          hide-details
          @change="ordenarPessoasPorVotos"
          density="compact"
        ></v-text-field>
      </template>
    </v-data-table-virtual>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  interface Pessoa {
    nome: string
    votos: number
  }

  const pessoas = ref<Pessoa[]>([
    { nome: 'Hermes Alves', votos: 1500 },
    { nome: 'João', votos: 234 },
  ])
  const headers = ref([
    { title: 'Nome', align: 'start', value: 'nome', sortable: true },
    {
      title: 'Votos',
      align: 'start',
      value: 'votos',
      width: '130px',
      sortable: true,
    },
    { title: 'Add', align: 'start', value: 'add', width: '50px' },
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
    novaPessoa.value = { nome: '', votos: 100 }
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
<style lang="scss">
  .v-data-table-header__content {
    font-weight: bold;
  }
  .v-data-table .v-table__wrapper > table tbody > tr:nth-of-type(odd) > td,
  .v-data-table .v-table__wrapper > table tbody > tr:nth-of-type(odd) th {
    background-color: #f5f5f5 !important;
  }

  .v-data-table .v-table__wrapper > table tbody > tr:nth-of-type(even) > td,
  .v-data-table .v-table__wrapper > table tbody > tr:nth-of-type(even) th {
    background-color: #f9faf4 !important;
  }
</style>
