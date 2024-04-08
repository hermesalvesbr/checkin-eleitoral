<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-dialog
          v-model="dialog"
          transition="dialog-bottom-transition"
          max-width="400"
        >
          <v-card>
            <v-toolbar color="primary" dark>
              <v-toolbar-title>Nova Pessoa</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="fecharDialogo">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-text-field
                v-model="novaPessoa.nome"
                label="Nome Completo"
                outlined
                dense
                autofocus
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
              <v-btn
                class="text-none ms-4 text-white"
                color="primary"
                variant="flat"
                @click="adicionarPessoa()"
                >Adicionar</v-btn
              >
              <v-btn
                class="text-none ms-4 text-white"
                color="secondary"
                variant="flat"
                @click="fecharDialogo()"
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
      <template v-slot:item.add="{ index }">
        <v-btn
          id="removerPessoa"
          class="ma-1"
          color="warning"
          icon="mdi-delete-forever-outline"
          size="small"
          @click="abrirDialogDeRemocaoPessoa(index)"
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
    <v-dialog
      v-model="dialogPessoa"
      transition="dialog-bottom-transition"
      max-width="400"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Remover Pessoa?</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogPessoa = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          Você tem certeza que deseja remover esta Pessoa?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="text-none ms-4 text-white"
            color="primary"
            variant="flat"
            @click="confirmarRemocaoPessoa()"
            >Confirmar</v-btn
          >
          <v-btn
            class="text-none ms-4 text-white"
            color="secondary"
            variant="flat"
            @click="dialogPessoa = false"
            >Desistir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  interface Pessoa {
    nome: string
    votos: number
  }
  const props = defineProps<{
    modelValue: Pessoa[]
  }>()
  const emit = defineEmits(['update:modelValue'])
  const pessoas = ref<Pessoa[]>(props.modelValue)
  const dialogPessoa = ref(false)
  const pessoaParaRemover = ref<number | null>(null)
  watch(
    pessoas,
    (newValue) => {
      emit('update:modelValue', newValue)
    },
    { deep: true }
  )

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
    if (!novaPessoa.value.nome.trim()) {
      alert('Por favor, preencha o nome da pessoa.')
      return
    }
    pessoas.value.push({ ...novaPessoa.value })
    ordenarPessoasPorVotos()
    novaPessoa.value = { nome: '', votos: 0 }
    dialog.value = false
  }

  function ordenarPessoasPorVotos() {
    pessoas.value.sort((a, b) => b.votos - a.votos)
  }

  const abrirDialogDeRemocaoPessoa = (index: number) => {
    pessoaParaRemover.value = index
    dialogPessoa.value = true
  }

  const confirmarRemocaoPessoa = () => {
    if (pessoaParaRemover.value !== null) {
      pessoas.value.splice(pessoaParaRemover.value, 1)
      dialogPessoa.value = false
      pessoaParaRemover.value = null
    }
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
