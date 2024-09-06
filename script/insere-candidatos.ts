import { createDirectus, createItem, createItems, readItems, rest, staticToken } from '@directus/sdk'

const apiToken: any = process.env.NUXT_PUBLIC_API_TOKEN
const apiBase: any = process.env.NUXT_PUBLIC_API_BASE

const client = createDirectus(apiBase)
  .with(staticToken(apiToken))
  .with(rest())
async function createCandidatos(itemsArray: any[]) {
  try {
    const result = await client.request(createItems('candidatos', itemsArray))
    console.log('Item criado com sucesso:', result)
  }
  catch (error) {
    console.error('Erro ao criar item:', error)
  }
}
function cleanString(value: string) {
  return value.replace(/"/g, '').trim() // Remove aspas e espaços
}

function parseValue(value: string, fieldType: string) {
  value = cleanString(value) // Limpa as aspas duplas e espaços

  if (value === '#NULO#' || value === '' || value === '-4' || value === '-1') {
    return null
  }

  if (fieldType === 'integer') {
    const num = Number.parseInt(value, 10)
    return Number.isNaN(num) ? null : num
  }
  else if (fieldType === 'datetime' || fieldType === 'time') {
    return value // Já está em formato de string apropriado
  }
  else if (fieldType === 'string') {
    return value
  }

  return value // Retorna o valor original se não precisar de parsing
}
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function processCSV(filePath: string) {
  const buffer = await Bun.file(filePath).arrayBuffer()
  const textDecoder = new TextDecoder('latin1') // Decodificar em latin1
  const fileContent = textDecoder.decode(buffer)

  const lines = fileContent.split('\n') // Dividir o conteúdo em linhas
  let counter = 0
  let itemsBatch: any[] = []
  for (const line of lines.slice(1)) {
    const columns = line.split(';')
    if (columns.length > 1) {
      const itemObject = {
        DT_GERACAO: parseValue(columns[0], 'datetime'),
        HH_GERACAO: parseValue(columns[1], 'time'),
        ANO_ELEICAO: parseValue(columns[2], 'integer'),
        CD_TIPO_ELEICAO: parseValue(columns[3], 'integer'),
        NM_TIPO_ELEICAO: parseValue(columns[4], 'string'),
        NR_TURNO: parseValue(columns[5], 'integer'),
        CD_ELEICAO: parseValue(columns[6], 'integer'),
        DS_ELEICAO: parseValue(columns[7], 'string'),
        DT_ELEICAO: parseValue(columns[8], 'datetime'),
        TP_ABRANGENCIA_ELEICAO: parseValue(columns[9], 'string'),
        SG_UF: parseValue(columns[10], 'string'),
        SG_UE: parseValue(columns[11], 'string'),
        NM_UE: parseValue(columns[12], 'string'),
        CD_CARGO: parseValue(columns[13], 'integer'),
        DS_CARGO: parseValue(columns[14], 'string'),
        SQ_CANDIDATO: parseValue(columns[15], 'integer'),
        NR_CANDIDATO: parseValue(columns[16], 'integer'),
        NM_CANDIDATO: parseValue(columns[17], 'string'),
        NM_URNA_CANDIDATO: parseValue(columns[18], 'string'),
        NM_SOCIAL_CANDIDATO: parseValue(columns[19], 'string'),
        NR_CPF_CANDIDATO: parseValue(columns[20], 'string'),
        DS_EMAIL: parseValue(columns[21], 'string'),
        CD_SITUACAO_CANDIDATURA: parseValue(columns[22], 'integer'),
        DS_SITUACAO_CANDIDATURA: parseValue(columns[23], 'string'),
        TP_AGREMIACAO: parseValue(columns[24], 'string'),
        NR_PARTIDO: parseValue(columns[25], 'integer'),
        SG_PARTIDO: parseValue(columns[26], 'string'),
        NM_PARTIDO: parseValue(columns[27], 'string'),
        NR_FEDERACAO: parseValue(columns[28], 'integer'),
        NM_FEDERACAO: parseValue(columns[29], 'string'),
        SG_FEDERACAO: parseValue(columns[30], 'string'),
        DS_COMPOSICAO_FEDERACAO: parseValue(columns[31], 'string'),
        SQ_COLIGACAO: parseValue(columns[32], 'integer'),
        NM_COLIGACAO: parseValue(columns[33], 'string'),
        DS_COMPOSICAO_COLIGACAO: parseValue(columns[34], 'string'),
        SG_UF_NASCIMENTO: parseValue(columns[35], 'string'),
        DT_NASCIMENTO: parseValue(columns[36], 'datetime'),
        NR_TITULO_ELEITORAL_CANDIDATO: parseValue(columns[37], 'string'),
        CD_GENERO: parseValue(columns[38], 'integer'),
        DS_GENERO: parseValue(columns[39], 'string'),
        CD_GRAU_INSTRUCAO: parseValue(columns[40], 'integer'),
        DS_GRAU_INSTRUCAO: parseValue(columns[41], 'string'),
        CD_ESTADO_CIVIL: parseValue(columns[42], 'integer'),
        DS_ESTADO_CIVIL: parseValue(columns[43], 'string'),
        CD_COR_RACA: parseValue(columns[44], 'integer'),
        DS_COR_RACA: parseValue(columns[45], 'string'),
        CD_OCUPACAO: parseValue(columns[46], 'integer'),
        DS_OCUPACAO: parseValue(columns[47], 'string'),
        CD_SIT_TOT_TURNO: parseValue(columns[48], 'integer'),
        DS_SIT_TOT_TURNO: parseValue(columns[49], 'string'),
      }

      itemsBatch.push(itemObject)
      counter++

      if (itemsBatch.length === 350) {
        await createCandidatos(itemsBatch)
        itemsBatch = []
        console.log(`Inseridos ${counter} candidatos, aguardando 1 segundo...`)
        await delay(1000)
      }
    }
  }
}
processCSV('../public/consulta_cand_2024_BRASIL.csv')
