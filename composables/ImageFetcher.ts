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
      const { data, error: fetchError } = await useFetch(`https://www.googleapis.com/customsearch/v1`, {
        params: {
          q: query,
          cx: this.CX,
          key: this.API_KEY,
        },
      })

      if (fetchError.value) {
        this.error.value = fetchError.value.message
        return null
      }
      else if (data.value && data.value.items && data.value.items.length > 0) {
        const firstItem = data.value.items[0]
        const metatags = firstItem.pagemap.metatags
        const cse_image = firstItem.pagemap.cse_image

        if (metatags && metatags.length > 0 && metatags[0]['og:image']) {
          this.image.value = metatags[0]['og:image']
          return this.image.value
        }
        else if (cse_image && cse_image.length > 0 && cse_image[0].src) {
          this.image.value = cse_image[0].src
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
