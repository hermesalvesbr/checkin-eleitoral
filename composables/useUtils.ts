import { toast } from 'vue3-toastify'
import { DateTime } from 'luxon'

class UtilsEduprime {
  router: any
  constructor() {}

  notifySuccess = (msg = 'Operação realizada com sucesso!') => {
    toast.success(msg, {
      autoClose: 3000,
    })
  }
  notifyError = (msg = 'Erro no registro da operação') => {
    toast.error(msg, {
      autoClose: 3000,
    })
  }
  notifyWarning = (msg = 'Atenção, fez algo') => {
    toast.warning(msg, {
      autoClose: 1500,
    })
  }

  validateCPF(cpf: string): boolean | string {
    cpf = cpf.replace(/[^\d]/g, '') // Remove caracteres não numéricos

    // Verifica se o CPF tem o tamanho correto
    if (cpf.length !== 11) {
      return 'Opa! Esse CPF tá curtinho demais!'
    }

    // Verifica se o CPF não é uma sequência de números iguais
    if (/^(\d)\1+$/.test(cpf)) {
      return 'Hmm... Esse CPF não está batendo!'
    }

    // Função para calcular um dígito verificador
    function calcularDigito(cpf: string, factor: number): number {
      let sum = 0
      for (let i = 0; i < factor - 1; i++) {
        sum += parseInt(cpf.charAt(i)) * (factor - i)
      }
      let remainder = (sum * 10) % 11
      return remainder >= 10 ? 0 : remainder
    }

    // Verifica o primeiro dígito verificador
    const firstDigit = calcularDigito(cpf, 10)
    if (firstDigit !== parseInt(cpf.charAt(9))) {
      return 'Hmm... Esse CPF não está batendo!'
    }

    // Verifica o segundo dígito verificador
    const secondDigit = calcularDigito(cpf, 11)
    if (secondDigit !== parseInt(cpf.charAt(10))) {
      return 'Hmm... Esse CPF não está batendo!'
    }

    return true
  }
  isValidPassword(password: string): boolean {
    // Verifica sequências numéricas simples
    if (
      /(\d{2,})/.test(password) &&
      password
        .match(/(\d{2,})/g)!
        .some((seq) => '01234567890123456789'.includes(seq))
    ) {
      return false
    }

    // Verifica sequências de letras (tanto maiúsculas quanto minúsculas)
    if (
      /[a-zA-Z]{2,}/.test(password) &&
      password
        .toLowerCase()
        .match(/([a-z]{2,})/g)!
        .some((seq) =>
          'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'.includes(seq)
        )
    ) {
      return false
    }

    // Verifica repetições de caracteres
    if (/(.)\1{2,}/.test(password)) {
      return false
    }

    // Verifica padrões de teclado comuns
    const keyboardPatterns = ['qwerty', 'asdfg', 'zxcvb', 'qwertz', 'azerty']
    for (let pattern of keyboardPatterns) {
      if (password.toLowerCase().includes(pattern)) {
        return false
      }
    }

    // Se passou por todas as verificações, a senha é válida
    return true
  }

 
 

  maskEmail(email: string): string {
    let partes = email?.split('@')
    if (partes?.length !== 2) {
      return email // Retorna o e-mail original se não estiver no formato correto
    }

    let [nomeUsuario, dominio] = partes
    let nomeUsuarioMascarado =
      nomeUsuario?.length > 4
        ? nomeUsuario.slice(0, 3) + '*'.repeat(nomeUsuario.length - 3)
        : nomeUsuario
    let partesDominio = dominio.split('.')
    let dominioMascarado = partesDominio
      .map((parte: string, index: number) => {
        if (index === 0) {
          return parte.length > 3
            ? parte.slice(0, 3) + '*'.repeat(parte.length - 3)
            : parte
        }
        return parte
      })
      .join('.')

    return `${nomeUsuarioMascarado}@${dominioMascarado}`
  }
  maskCpf(cpf: string): string {
    // Verifica se o CPF tem o tamanho esperado de 11 caracteres
    if (cpf.length !== 11) {
      return cpf // Retorna o CPF original se não estiver no formato esperado
    }
    // Mantém os três primeiros e os dois últimos dígitos visíveis
    return `${cpf.slice(0, 3)}*****${cpf.slice(-2)}`
  }

  utilRemoveDuplicates(data: any[]): any[] {
    const uniqueItems = new Set(data.map((item) => JSON.stringify(item)))
    return Array.from(uniqueItems).map((item) => JSON.parse(item))
  }
 
  async utilSleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  removeNullProperties(obj: any) {
    const newObj: any = Array.isArray(obj) ? [] : {}
    for (const [key, value] of Object.entries(obj)) {
      if (value === null) continue
      newObj[key] =
        value instanceof Object ? this.removeNullProperties(value) : value
    }
    return newObj
  }
  isValidUUID(uuid: string) {
    const regex =
      /^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-4[0-9a-fA-F]{3}\-(8|9|a|b)[0-9a-fA-F]{3}\-[0-9a-fA-F]{12}$/
    return regex.test(uuid)
  }

  formatName(nome: string): string {
    return nome
      .toLowerCase()
      .split(' ')
      .map((palavra: string) =>
        palavra === 'dos'
          ? palavra
          : palavra.length >= 3
            ? palavra.charAt(0).toUpperCase() + palavra.slice(1)
            : palavra
      )
      .join(' ')
  }
 

  daysAgo(date: Date) {
    return DateTime.fromISO(`${date}`).setLocale('pt').toRelative()
  }

  formatDate(dateString: string) {
    try {
      const formattedDate = DateTime.fromISO(dateString)
        .setLocale('pt-BR')
        .toFormat("dd 'de' LLLL 'de' yyyy")
      return formattedDate
    } catch (error: any | unknown) {
      throw new Error(`Failed to format date: ${error.message}`)
    }
  }
  /**
   * Filtra os dados fornecidos com base na etapa especificada transformando uma string, ex: "1,2" em um array,
   * em seguida filtra se a etapa atual está presente nas etapas utilizadas.
   * @param data - Os dados a serem filtrados.
   * @param etapa - A etapa pela qual filtrar.
   * @returns Os dados filtrados.
   */
  filtrarPorEtapasUtilizadas(data: any[] | undefined, etapa: number): any[] {
    if (data === undefined) {
      return []
    } else {
      return data.filter((item: any) => {
        if (item.etapas_utilizadas) {
          const etapas = item.etapas_utilizadas.split(',').map(Number)
          return etapas.includes(etapa)
        } else {
          return false
        }
      })
    }
  }

  extractAlias(nome: string): string {
    const sigla = nome
      .split(' ')
      .filter((palavra) => palavra.length > 3)
      .map((palavra) => palavra[0].toUpperCase())
      .join('')

    return sigla.substring(0, 3)
  }
 
  debounce(
    func: { (): Promise<void>; apply?: any },
    delay: number | undefined
  ) {
    let debounceTimeout: NodeJS.Timeout | undefined
    return (...args: any) => {
      if (debounceTimeout) clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => {
        func.apply(undefined, args)
      }, delay)
    }
  }
}
export default UtilsEduprime