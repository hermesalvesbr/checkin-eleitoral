import fs from 'node:fs'
import csv from 'csv-parser'
import {
  createItem,
} from '@directus/sdk'

interface Eleitorado {
  UF: string
  Cidade: string
  Codigo: string
  TotalEleitores: string
  TotalComparecimento: string
}

const results: Eleitorado[] = []

fs.createReadStream('../public/eleitorado.csv')
  .pipe(csv())
  .on('data', (data) => {
    results.push({
      UF: data.UF,
      Cidade: data.Cidade,
      // Garantir que o código é um inteiro
      Codigo: Number.parseInt(data.Codigo, 10),
      // Arredondar o TotalEleitores para o inteiro mais próximo
      TotalEleitores: Math.round(Number(data.TotalEleitores)),
      // Arredondar o TotalComparecimento para o inteiro mais próximo
      TotalComparecimento: Math.round(Number(data.TotalComparecimento)),
    })
  })
  .on('end', () => {
    console.log('Dados do Eleitorado:')
    results.forEach(async (eleitor) => {
      console.log(
        `${eleitor.UF} - ${eleitor.Cidade} | Código: ${eleitor.Codigo} | Total Eleitores: ${eleitor.TotalEleitores} | Total Comparecimento: ${eleitor.TotalComparecimento}`,
      )
      const modelo = {
        codigo: eleitor.Codigo,
        cidade: eleitor.Cidade,
        uf: eleitor.UF,
        total_eleitores: eleitor.TotalEleitores,
        total_comparecimento: eleitor.TotalComparecimento,
      }
      // Removido setTimeout para simplificar, você pode ajustar conforme necessário
      try {
        const result = await directus.request(createItem('votantes', modelo))
        console.log(result)
      }
      catch (error) {
        console.error('Erro ao inserir item:', error)
      }
    })
  })
