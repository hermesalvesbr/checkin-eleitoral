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
            <v-toolbar-title>Entrar/Registrar Salvar</v-toolbar-title>
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
            <CitySearch
              v-model:cidade="cityUser"
              :initialCityId="initialCityId"
            />
            <v-text-field
              v-model="novaPessoa.email"
              label="E-mail"
              type="email"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              id="votos"
              v-model="novaPessoa.votos"
              label="Telefone"
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
              >Registrar</v-btn
            >
            <v-btn
              class="text-none ms-4 text-white"
              color="secondary"
              variant="flat"
              @click="fecharDialogo()"
              >Não Salvar</v-btn
            >
          </v-card-actions>
          <div></div>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const d = new useDirectus();

const emit = defineEmits(["update:modelValue"]);
const cityUser = ref<Cidade | null>(null);
const localDialog = ref(props.modelValue);
const cidadeID = await buscarCidade();
const initialCityId = ref(cidadeID.id);
watch(
  () => props.modelValue,
  (newVal) => {
    localDialog.value = newVal;
  }
);

watch(localDialog, (newVal) => {
  emit("update:modelValue", newVal);
});

const novaPessoa = ref({
  nome: "",
  cidade: "",
  email: "",
  telefone: "",
});

function fecharDialogo() {
  localDialog.value = false;
}

function adicionarPessoa() {
  fecharDialogo();
}

async function buscarCidade() {
  const location = await useGeolocation();
  if (!location) return;
  const cidade = location;
  const [data] = await d.getItems("votantes", {
    search: location.city,
    filter: { uf: { _eq: cidade.region } },
    fields: ["id,cidade,uf"],
  });
  return data;
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
