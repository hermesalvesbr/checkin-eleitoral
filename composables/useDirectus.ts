import {
  createDirectus,
  createItem,
  createUser,
  importFile,
  passwordRequest,
  passwordReset,
  readFile,
  readItem,
  readItems,
  readUsers,
  rest,
  staticToken,
  updateItem,
  uploadFiles,
} from '@directus/sdk'
import useUtils from './useUtils'

class useDirectus {
  directus: any
  config: any = useRuntimeConfig()
  utils: any = new useUtils()

  constructor() {
    const config = this.config
    try {
      this.directus = createDirectus(config.public.apiBase)
        .with(staticToken(config.public.apiToken))
        .with(rest())
    }
    catch (error) {
      console.error('Erro ao criar instância do Directus:', error)
    }
  }

  async getItems(
    collection: string,
    query_object?: any,
    retryCount = 3,
  ): Promise<any> {
    try {
      const response = await this.directus.request(
        readItems(collection as never, query_object),
      )
      return response
    }
    catch (error: any) {
      console.error('Erro ao obter itens:', error.errors)
      if (
        error?.errors[0]?.extensions?.code === 'INTERNAL_SERVER_ERROR'
        && retryCount > 0
      ) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(this.getItems(collection, query_object, retryCount - 1))
          }, 500)
        })
      }
      return null
    }
  }

  async getItem(
    collection: string,
    item_id: number | string,
    query_object?: any,
  ): Promise<any> {
    try {
      const response = await this.directus.request(
        readItem(collection as never, item_id, query_object),
      )

      return response
    }
    catch (error) {
      console.error('Erro ao obter 1 item:', error)

      return null
    }
  }

  async makeFileUrl(file: any) {
    return `${this.config.public.apiBase}/assets/${file}.webp?format=auto&quality=80`
  }

  async createItem(collection: string, data: object): Promise<any> {
    try {
      const response = await this.directus.request(
        createItem(collection as never, data as never),
      )

      return response
    }
    catch (error) {
      console.error('Erro ao criar itens:', error)
      return null
    }
  }

  async createUser(user_object: object): Promise<any> {
    try {
      const response = await this.directus.request(createUser(user_object))
      return response
    }
    catch (error: any) {
      const msg = error?.errors[0]?.message
      switch (msg) {
        case 'Validation failed for field "password". Value doesn\'t have the correct format.':
          this.utils.notifyError(
            'A senha deve conter no mínimo 8 caracteres, pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
          )
          break
        case 'Value for field "email" in collection "directus_users" has to be unique.':
          this.utils.notifyError('O valor para o campo "email" deve ser único.')
          break
        default:
          this.utils.notifyError(msg)
      }
      console.error('Error createUser:', msg)
      return false
    }
  }

  async uploadFile(file: never | any): Promise<any> {
    try {
      const response = await this.directus.request(uploadFiles(file))

      return response?.id
    }
    catch (error) {
      console.error('Erro ao criar itens:', error)

      return null
    }
  }

  async importAFile(file_url: string, file_object?: any) {
    const result = await this.directus.request(importFile(file_url, file_object))
    return result
  }

  async readFiles(fileID: string) {
    const result = await this.directus.request(readFile(fileID, {
    }))
    return result
  }

  async requestPassword(email: string): Promise<any> {
    console.log('Email:', email)
    // eslint-disable-next-line regexp/no-unused-capturing-group
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-z]{2,7}$/i
    if (!emailRegex.test(email)) {
      console.error('Email inválido:', email)
      return null
    }
    try {
      const response = await this.directus.request(passwordRequest(email))
      return response
    }
    catch (error) {
      console.error('Erro requestPassword:', error)
      return null
    }
  }

  async resetPassword(reset_token: string, password: string): Promise<any> {
    try {
      const response = await this.directus.request(
        passwordReset(reset_token, password),
      )
      return response
    }
    catch (error) {
      console.error('Erro resetPassword:', error)
      return null
    }
  }

  async consultaCPF(cpfInput: string) {
    try {
      const filter = {
        servidor: {
          cpf: {
            _eq: cpfInput,
          },
        },
      }
      const query = {
        fields: ['*', 'usuario.*', 'servidor.*'],
        filter,
      }
      const [acesso] = await this.getItems('acesso', query)
      if (acesso?.id?.length === 0) {
        return null
      }
      return acesso
    }
    catch (error) {
      console.error(error)
    }
  }

  async emailExists(email: string): Promise<boolean> {
    if (!email)
      return false
    try {
      const filter = {
        email: {
          _eq: email,
        },
      }
      const query = {
        filter,
      }
      const [usuario] = await this.directus.request(readUsers(query))
      if (!usuario || usuario?.id?.length === 0) {
        return false
      }
      return true
    }
    catch (error) {
      console.error(error)
      return false
    }
  }

  async getUserByEmail(email: string) {
    if (!email)
      return null
    try {
      const filter = {
        email: {
          _eq: email,
        },
      }
      const query = {
        filter,
      }
      const [usuario] = await this.directus.request(readUsers(query))
      if (!usuario || usuario?.id?.length === 0) {
        return null
      }
      return usuario
    }
    catch (error) {
      console.error(error)
      return null
    }
  }

  async updateItem(
    collection: string,
    key: string,
    data: object,
  ): Promise<any> {
    try {
      const response = await this.directus.request(
        updateItem(collection as never, key, data as never),
      )
      return response
    }
    catch (error) {
      console.error('Erro ao criar itens:', error)
      return null
    }
  }
}
export default useDirectus
