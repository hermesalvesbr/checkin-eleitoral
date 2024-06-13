class ImageFetcher {
  private API_KEY: string
  private CX: string
  public image: Ref<string | null>
  public error: Ref<string | null>

  constructor() {
    const config = useRuntimeConfig()
    this.API_KEY = config.public.googleapis
    this.CX = config.public.googlecx
    this.image = ref<string | null>(null)
    this.error = ref<string | null>(null)
  }

  public async fetchImage(query: string): Promise<string | null> {
    try {
      console.log('fetchImage', query)
      const { data, error: fetchError }: { data: any, error: any } = await useLazyAsyncData(`fetchImage-${query}`, () =>
        $fetch(`https://www.googleapis.com/customsearch/v1`, {
          params: {
            q: query,
            cx: this.CX,
            key: this.API_KEY,
            searchType: 'image',
          },
        }))

      if (fetchError.value) {
        this.error.value = fetchError.value.message
        return null
      }

      if (data.value && data.value.items && data.value.items.length > 0) {
        const firstItem = data.value.items[0]
        const imageLink = firstItem.link

        if (imageLink) {
          this.image.value = imageLink
          return this.image.value
        }
        else {
          this.error.value = 'Imagem não encontrada.'
          return null
        }
      }
      else {
        this.error.value = 'Nenhuma imagem encontrada.'
        return null
      }
    }
    catch (e) {
      this.error.value = 'Erro ao buscar imagens.'
      console.error(e)
      return null
    }
  }
}

export default ImageFetcher
