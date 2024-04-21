<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-col cols="12">
          <v-autocomplete
            :items="cidades"
            v-model="cidadeSelecionada"
            @update:search="onSearchChange"
            item-title="nome"
            :return-object="true"
            class="mx-auto"
            menu-icon=""
            placeholder="Cidade que criará a chapa"
            prepend-inner-icon="mdi-magnify"
            style="max-width: 650px"
            theme="light"
            variant="solo"
            auto-select-first
            :hide-no-data="true"
            rounded
          ></v-autocomplete>
        </v-col>
      </v-col>
    </v-row>
    <div id="cidade-escolhida" v-if="cidadeSelecionada">
      <v-row>
        <ChapaCidade
          v-model="cidadeSelecionada"
          :chapas="chapasCriadas"
          :key="updateKey"
        />
      </v-row>
      <v-row>
        <ChapaCriarPartidos
          v-model="chapasCriadas"
          :cidade="cidadeSelecionada"
          :key="cidadeSelecionada.id"
        />
      </v-row>
      <v-row id="coeficiente" class="mt-7">
        <ChapaCoeficiente
          :cidade-selecionada="cidadeSelecionada"
          v-model="chapasCriadas"
          :key="cidadeSelecionada.id"
        />
      </v-row>
      <div id="compartilhando">
        <v-row class="bg-blue-lighten-4">
          <!-- Usando uma cor suave que se integra ao tema -->
          <v-col cols="9" class="d-flex align-center">
            <v-icon color="accent">mdi-share</v-icon>
            Compartilhe sua análise!
          </v-col>
          <v-col cols="3" class="d-flex justify-end align-center">
            <v-btn text color="secondary" @click="shareAnalysis">
              <!-- Botão como texto na cor secundária -->
              Compartilhar
              <v-icon right>mdi-send</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import type { Chapa, Cidade } from '~/types'
  import { useStorage, StorageSerializers } from '@vueuse/core'
  const d = new useDirectus()
  const u = new useUtils()
  const busca = ref('')
  const cidades = ref<Cidade[]>([])
  const cidadeSelecionada = ref<Cidade | null>(null)
  const chapasCriadas = useStorage<Chapa[]>('chapas-criadas', [], undefined, {
    serializer: StorageSerializers.object,
  })
  const updateKey = ref(0)

  watch(
    chapasCriadas,
    () => {
      updateKey.value++
    },
    { deep: true }
  )

  function debounce(fn: (...args: any[]) => void, delay: number) {
    let timeoutId: any
    return (...args: any[]) => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => fn(...args), delay)
    }
  }
  function onSearchChange(newValue: string) {
    busca.value = newValue
    debouncedCarregarCidades()
  }

  async function carregarCidades() {
    if (busca.value.length < 3) return

    const response = await d.getItems('votantes', {
      search: busca.value,
      fields: [
        'id',
        'cidade',
        'uf',
        'total_eleitores',
        'total_comparecimento',
        'vereadores',
      ],
      limit: 10,
    })

    cidades.value = response.map((item: any) => ({
      id: item.id,
      nome: `${item.cidade} - ${item.uf}`,
      uf: item.uf,
      totalEleitores: item.total_eleitores,
      totalComparecimento: item.total_comparecimento,
      vereadores: item.vereadores,
    }))
  }
  const salvarChapasNoDirectus = async (chapas: Chapa[]) => {
    try {
      const chapaData = {
        cidadeId: cidadeSelecionada.value.id,
        chapas: chapas,
      }

      // const resultado = await d.createItem('chapas', chapaData)
      const codigoUnique = u.codificarPermalink(
        cidadeSelecionada.value,
        chapasCriadas.value
      )
      console.log('Chapa salva com sucesso:', codigoUnique)
    } catch (error) {
      console.error('Erro ao salvar chapa:', error)
    }
  }
  const shareAnalysis = () => {
    console.log('Compartilhando análise...')
  }
  const debouncedCarregarCidades = debounce(carregarCidades, 500)
</script>
