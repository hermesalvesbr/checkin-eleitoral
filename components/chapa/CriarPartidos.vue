<script setup lang="ts">
import { StorageSerializers, useStorage } from '@vueuse/core'
import type { Chapa, Cidade, Pessoa } from '~/types'

const props = defineProps<{
  modelValue: Chapa[]
  cidade: Cidade
}>()
const emit = defineEmits(['update:modelValue'])

const { modelValue, cidade } = toRefs(props)

const partidos = [
  { nome: 'MDB - 15', valor: 'MDB', logo: '/partido/MDB.png' },
  { nome: 'PT - 13', valor: 'PT', logo: '/partido/PT.png' },
  { nome: 'PRD - 25', valor: 'PRD', logo: '/partido/PRD.png' },
  { nome: 'PSDB - 45', valor: 'PSDB', logo: '/partido/PSDB.png' },
  { nome: 'PP - 11', valor: 'PP', logo: '/partido/PP.png' },
  { nome: 'PDT - 12', valor: 'PDT', logo: '/partido/PDT.png' },
  { nome: 'UNIÃO - 44', valor: 'UNIÃO', logo: '/partido/UNIAO.png' },
  { nome: 'PL - 22', valor: 'PL', logo: '/partido/PL.png' },
  { nome: 'PODE - 20', valor: 'PODE', logo: '/partido/PODE.png' },
  { nome: 'PSB - 40', valor: 'PSB', logo: '/partido/PSB.png' },
  {
    nome: 'REPUBLICANOS - 10',
    valor: 'REPUBLICANOS',
    logo: '/partido/REPUBLICANOS.png',
  },
  {
    nome: 'CIDADANIA - 23',
    valor: 'CIDADANIA',
    logo: '/partido/CIDADANIA.png',
  },
  { nome: 'PSD - 55', valor: 'PSD', logo: '/partido/PSD.png' },
  { nome: 'PCdoB - 65', valor: 'PCdoB', logo: '/partido/PCdoB.png' },
  {
    nome: 'SOLIDARIEDADE - 77',
    valor: 'SOLIDARIEDADE',
    logo: '/partido/SOLIDARIEDADE.png',
  },
  { nome: 'PV - 43', valor: 'PV', logo: '/partido/PV.png' },
  { nome: 'PSOL - 50', valor: 'PSOL', logo: '/partido/PSOL.png' },
  { nome: 'AVANTE - 70', valor: 'AVANTE', logo: '/partido/AVANTE.png' },
  { nome: 'MOBILIZA - 33', valor: 'MOBILIZA', logo: '/partido/MOBILIZA.png' },
  { nome: 'AGIR - 36', valor: 'AGIR', logo: '/partido/AGIR.png' },
  { nome: 'DC - 27', valor: 'DC', logo: '/partido/DC.png' },
  { nome: 'PRTB - 28', valor: 'PRTB', logo: '/partido/PRTB.png' },
  { nome: 'PMB - 35', valor: 'PMB', logo: '/partido/PMB.png' },
  { nome: 'NOVO - 30', valor: 'NOVO', logo: '/partido/NOVO.png' },
  { nome: 'REDE - 18', valor: 'REDE', logo: '/partido/REDE.png' },
  { nome: 'PSTU - 16', valor: 'PSTU', logo: '/partido/PSTU.png' },
  { nome: 'PCB - 21', valor: 'PCB', logo: '/partido/PCB.png' },
  { nome: 'UP - 80', valor: 'UP', logo: '/partido/UP.png' },
  { nome: 'PCO - 29', valor: 'PCO', logo: '/partido/PCO.png' },
]

const partidoSelecionado = ref(null)
const chapasCriadas = useStorage<Chapa[]>('chapas-criadas', [], undefined, {
  serializer: StorageSerializers.object,
})
const chapaParaRemover = ref<number | null>(null)
const chapasCriadasComputed = computed(() =>
  chapasCriadas.value.filter(
    (chapa: { cidadeId: number }) => chapa.cidadeId === cidade.value.id,
  ),
)

const nextId = ref(0)
const panelsAbertos = ref<number[]>([]) // Controla os painéis abertos
function abrirTodosOsPanels() {
  // Abrir todos os painéis de uma vez
  panelsAbertos.value = chapasCriadasComputed.value.map((_, index) => index)

  // Esperar um pequeno tempo para garantir que os painéis sejam abertos antes da impressão
  setTimeout(() => {
    const content = document.getElementById('partidos')?.innerHTML // Pega o conteúdo da div 'partidos'

    if (content) {
      const printWindow = window.open('', '', 'height=600,width=800')
      printWindow?.document.write(`
        <html>
          <head>
            <title>Visite campanha.softagon.app</title>
            <style>
              /* Estilos básicos para garantir que a impressão seja limpa */
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }

              /* Certifique-se de que os textos e números estão visíveis */
              h3 {
                font-size: 18px;
              }

              /* Esconde elementos desnecessários para impressão */
              .v-btn, .mdi-close-circle {
                display: none !important;
              }

              /* Corrige o alinhamento dos elementos */
              .v-row, .v-col {
                display: block;
                width: 100%;
              }

              /* Expande o conteúdo de cada painel para garantir que ele seja impresso corretamente */
              .v-expansion-panel {
                border: 1px solid #ddd;
                margin-bottom: 10px;
              }

              /* Ajusta o tamanho das imagens para que fiquem visíveis */
              img {
                max-width: 50px;
                height: auto;
              }

              /* Garante que os chips e rótulos estejam visíveis e bem formatados */
              .v-chip {
                display: inline-block;
                padding: 8px;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            ${content}
            <pre>Não é pesquisa, é uma análise individual especulativa usando a ferramenta https://campanha.softagon.app</pre>
          </body>
        </html>
      `)
      printWindow?.document.close()
      printWindow?.focus()
      printWindow?.print()
      printWindow?.close()
    }
  }, 500)
}

function criarChapa() {
  const partidoDetalhes = partidos.find(
    partido => partido.valor === partidoSelecionado.value,
  )
  if (
    partidoDetalhes
    && !chapasCriadasComputed.value.some(
      chapa => chapa.valor === partidoDetalhes.valor,
    )
  ) {
    const novaChapa = {
      cidadeId: cidade.value.id,
      ...partidoDetalhes,
      id: Date.now(), // Usando timestamp para garantir um ID único
      pessoas: [],
    }
    chapasCriadas.value.push(novaChapa)
    emit('update:modelValue', chapasCriadas.value)
    partidoSelecionado.value = null
  }
  else {
    alert(
      'Uma chapa para este partido já foi criada ou partido não encontrado.',
    )
  }
}
function removerChapa(id: number) {
  const index = chapasCriadas.value.findIndex(chapa => chapa.id === id)
  if (index !== -1) {
    chapasCriadas.value.splice(index, 1)
    emit('update:modelValue', chapasCriadas.value)
  }
}
function totalVotosChapa(pessoas: Pessoa[]) {
  return pessoas.reduce((total, pessoa) => total + Number(pessoa.votos), 0)
}
function somaTotalDePessoas(pessoas: Pessoa[]) {
  return pessoas.length || 0
}
const dialog = ref(false)
function abrirDialogDeRemocao(id: number) {
  const chapa = chapasCriadas.value.find(
    chapa => chapa.id === id && chapa.cidadeId === cidade.value.id,
  )
  if (chapa) {
    chapaParaRemover.value = id
    dialog.value = true
  }
  else {
    alert('Erro: Chapa não encontrada.')
  }
}
function confirmarRemocao() {
  const index = chapasCriadas.value.findIndex(
    chapa =>
      chapa.id === chapaParaRemover.value
      && chapa.cidadeId === cidade.value.id,
  )
  if (index !== -1) {
    chapasCriadas.value.splice(index, 1)
    emit('update:modelValue', chapasCriadas.value)
    dialog.value = false
    chapaParaRemover.value = null
  }
  else {
    alert('Erro ao remover a chapa.')
  }
}
</script>

<template>
  <v-container>
    <v-row no-gutters class="align-center">
      <v-col cols="12" class="d-flex">
        <v-autocomplete
          v-model="partidoSelecionado"
          density="comfortable"
          :items="partidos"
          item-title="nome"
          item-value="valor"
          label="Escolha um partido"
          class="flex-grow-1"
          autocomplete="off"
        />
        <v-btn
          color="primary"
          class="ml-2 mt-2"
          :style="{ height: '37px' }"
          @click="criarChapa"
        >
          Criar Chapa
        </v-btn>
      </v-col>
    </v-row>
    <ChapaDashboard
      :key="chapasCriadasComputed.length"
      v-model="chapasCriadasComputed"
    />
    <v-row no-gutters class="d-flex justify-end align-center">
      <v-btn @click="abrirTodosOsPanels">
        Imprimir Análise
      </v-btn>
    </v-row>

    <v-row id="partidos">
      <v-expansion-panels v-model="panelsAbertos" multiple>
        <v-expansion-panel
          v-for="(chapa, index) in chapasCriadasComputed"
          :key="index"
        >
          <v-expansion-panel-title>
            <v-row align-self="center">
              <v-col cols="1">
                <v-btn
                  icon
                  variant="text"
                  density="compact"
                  @click.stop="abrirDialogDeRemocao(chapa.id)"
                >
                  <v-icon>mdi-close-circle</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="8" class="d-flex align-center">
                <NuxtImg
                  :src="chapa.logo"
                  :alt="chapa.nome"
                  width="35"
                  densities="x1 x2"
                />
                <h3 class="ml-2 mb-0">
                  {{ totalVotosChapa(chapa.pessoas) }}
                </h3>
                <span class="ml-1 text-truncate">votos {{ chapa.valor }}</span>
              </v-col>
              <v-col cols="3" class="d-flex justify-end">
                <v-chip
                  prepend-icon="mdi-account-tie"
                  color="primary"
                  class="pa-3 mr-3"
                >
                  {{ somaTotalDePessoas(chapa.pessoas) }}
                </v-chip>
              </v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <ChapaVereadores v-model="chapa.pessoas" class="mt-n10" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      max-width="400"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Remover chapa?</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          Você tem certeza que deseja remover esta chapa?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="text-none ms-4 text-white"
            color="primary"
            variant="flat"
            @click="confirmarRemocao()"
          >
            Confirmar
          </v-btn>
          <v-btn
            class="text-none ms-4 text-white"
            color="secondary"
            variant="flat"
            @click="dialog = false"
          >
            Desistir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
