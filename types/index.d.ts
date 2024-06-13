export interface Pessoa {
  nome: string
  votos: number
}
export interface Chapa {
  cidadeId: number
  nome: string
  valor: string
  logo: string
  id: number
  pessoas: Pessoa[]
}
export interface Cidade {
  bandeira?: any
  id: number
  nome?: string
  cidade?: string
  uf: string
  totalEleitores?: number
  totalComparecimento?: number
  chapa?: string
  vereadores?: number | null
}
