<script setup lang="ts">
import type { Chapa, Cidade } from '~/types'

const props = defineProps({
  cidade: {
    type: String,
    required: true,
  },
  chapas: {
    type: Array as PropType<Chapa[]>,
    required: true,
  },
})
const d = new useDirectus()
const u = new useUtils()
const cidadeId = computed(() => props.cidade)
const chapas = computed(() => props.chapas)
const cidadeInfo = ref()
const eleitores = ref()

function getCidadeByCidadeId(data: any[], cidadeId: string): Cidade | null {
  for (const item of data) {
    if (item.cidade.id === cidadeId) {
      return item.cidade
    }
  }
  return null
}

async function uploadBandeira(imageUrl: string, cidade: Cidade) {
  const fileObject = {
    title: `bandeira de ${cidade.cidade} ${cidade.uf}`,
    folder: 'b9271604-3a64-488c-910d-966b4de8de47',
    description: cidade,
    location: `${cidade.cidade}, ${cidade.uf}`,
  }
  const recemSalvo = await d.importAFile(imageUrl, fileObject)
  return recemSalvo.id || null
}

async function pegaBandeira(cidade: Cidade) {
  if (!cidade.bandeira) {
    setTimeout(async () => {
      const imageFetcher = new ImageFetcher()
      const imageUrl = await imageFetcher.fetchImage(`bandeira de ${cidade.cidade} ${cidade.uf}`)
      if (imageUrl) {
        const fileId = await uploadBandeira(imageUrl, cidade)
        if (fileId) {
          cidade.bandeira = fileId
          await d.updateItem('votantes', cidade.id, { bandeira: fileId })
        }
      }
    }, 3000)
  }
}

onMounted(() => {
  cidadeInfo.value = getCidadeByCidadeId(chapas.value, cidadeId.value)
  eleitores.value = new Intl.NumberFormat('pt-BR').format(cidadeInfo.value?.total_eleitores).replace(',', '.')
  pegaBandeira(cidadeInfo.value)
})

const filteredChapas = u.extractChapasByCidadeId(chapas.value, cidadeId.value)
const qtdChapas = filteredChapas.length.toString().padStart(2, '0')
</script>

<template>
  <v-col cols="12">
    <v-card color="#1F7087">
      <div class="d-flex flex-no-wrap justify-space-between">
        <div>
          <v-card-title class="text-h6">
            {{ cidadeInfo?.cidade }} - {{ cidadeInfo?.uf }}
            <div class="text-subtitle-2">
              {{ eleitores }}  eleitores
            </div>
          </v-card-title>

          <v-card-subtitle class="text-wrap">
            <strong>{{ qtdChapas }}</strong> Chapas montadas em {{ cidadeInfo?.cidade }}
          </v-card-subtitle>

          <v-card-actions>
            <v-btn
              class="ms-2"
              size="small"
              text="Ver Ánalise"
              variant="outlined"
              :to="`/descobrir/${cidadeInfo?.id}`"
            />
          </v-card-actions>
        </div>

        <v-avatar
          class="ma-1 mt-4"
          rounded="1"
          size="125"
        >
          <v-img :src="`https://eleicoes.softagon.app/assets/${cidadeInfo?.bandeira}/bandeira-${cidadeInfo?.cidade}.webp?fit=cover&width=125&height=125&quality=80`" />
        </v-avatar>
      </div>
    </v-card>
  </v-col>
</template>
