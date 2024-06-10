<template>
    <v-row>
      <v-col cols="12">
        <v-dialog
          v-model="localDialog"
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
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const props = defineProps<{
    modelValue: boolean;
  }>();
  
  const emit = defineEmits(["update:modelValue"]);
  
  const localDialog = ref(props.modelValue);
  
  watch(() => props.modelValue, (newVal) => {
    localDialog.value = newVal;
  });
  
  watch(localDialog, (newVal) => {
    emit('update:modelValue', newVal);
  });
  
  const novaPessoa = ref({
    nome: '',
    votos: 0
  });
  
  function fecharDialogo() {
    localDialog.value = false;
  }
  
  function adicionarPessoa() {
    // Adicione a lógica de adicionar pessoa aqui
    fecharDialogo();
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
  