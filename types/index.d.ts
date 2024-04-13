export type Pessoa = {
  nome: string
  votos: number
}
export type Chapa = {
  cidadeId: number
  nome: string
  valor: string
  logo: string
  id: number
  pessoas: Pessoa[]
}
export type Cidade = {
  id: number
  nome: string
  uf: string
  totalEleitores: number
  totalComparecimento: number
  chapa: string
}
