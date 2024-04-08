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
    <v-row v-if="cidadeSelecionada">
      {{ cidadeSelecionada }}
      <ChapaCriarPartidos v-model="chapasCriadas" />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  interface Pessoa {
    nome: string
    votos: number
  }
  interface Chapa {
    nome: string
    valor: string
    logo: string
    id: number
    pessoas: Pessoa[]
  }
  interface Cidade {
    id: number
    nome: string
    uf: string
    totalEleitores: number
    totalComparecimento: number
  }
  const d = new useDirectus()
  const busca = ref('')
  const cidades = ref<Cidade[]>([])
  const cidadeSelecionada = ref<Cidade | null>(null)
  const chapasCriadas = ref<Chapa[]>([])

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
      fields: ['id', 'cidade', 'uf', 'total_eleitores', 'total_comparecimento'],
      limit: 10,
    })

    cidades.value = response.map((item: any) => ({
      id: item.id,
      nome: `${item.cidade} - ${item.uf}`,
      uf: item.uf,
      totalEleitores: item.total_eleitores,
      totalComparecimento: item.total_comparecimento,
    }))
  }
  const debouncedCarregarCidades = debounce(carregarCidades, 500)
</script>
