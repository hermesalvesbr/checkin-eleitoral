<template>
  <v-autocomplete
    clearable
    :items="cidades"
    v-model="cityUser"
    @update:search="onSearchChange"
    item-title="nome"
    :return-object="true"
    class="mx-auto"
    placeholder="Digite sua CIDADE"
    outlined
    dense
    auto-select-first
    :hide-no-data="true"
  ></v-autocomplete>
</template>

<script setup lang="ts">
  interface Cidade {
    id: string
    nome: string
    uf: string
  }

  const props = defineProps<{
    cidade: Cidade | null
    initialCityId: string | null
  }>()
  const emit = defineEmits<{
    (e: 'update:cidade', cidade: Cidade | null): void
  }>()

  const busca = ref('')
  const cidades = ref<Cidade[]>([])
  const cityUser = ref<Cidade | null>(props.cidade)
  const d = new useDirectus()

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
      ],
      limit: 10,
    })

    cidades.value = response.map((item: any) => ({
      id: item.id,
      nome: `${item.cidade} - ${item.uf}`,
      uf: item.uf,
    }))
  }
  const debouncedCarregarCidades = debounce(carregarCidades, 500)

  async function carregarCidadeInicial(id: string) {
    const response = await d.getItems('votantes', {
      filter: { id: { _eq: id } },
      fields: [
        'id',
        'cidade',
        'uf',
      ],
      limit: 1,
    })

    if (response.length > 0) {
      const cidade = response[0]
      cityUser.value = {
        id: cidade.id,
        nome: `${cidade.cidade} - ${cidade.uf}`,
        uf: cidade.uf,
      }
      emit('update:cidade', cityUser.value)
    }
  }

  onMounted(() => {
    if (props.initialCityId) {
      carregarCidadeInicial(props.initialCityId)
    }
  })

  watch(cityUser, (newVal) => {
    if (newVal) {
      emit('update:cidade', newVal)
    }
  })
</script>
