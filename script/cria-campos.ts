import { createDirectus, createField, rest, staticToken } from '@directus/sdk'

const apiToken: any = process.env.NUXT_PUBLIC_API_TOKEN
const apiBase: any = process.env.NUXT_PUBLIC_API_BASE

const client = createDirectus(apiBase)
  .with(staticToken(apiToken))
  .with(rest())

// Função para criar as colunas na tabela candidatos
async function createFields() {
  const fields = [
    { field: 'DT_GERACAO', type: 'string', display: 'Data de Geração', schema: { is_nullable: true } },
    { field: 'HH_GERACAO', type: 'string', display: 'Hora de Geração', schema: { is_nullable: true } },
    { field: 'ANO_ELEICAO', type: 'string', display: 'Ano da Eleição', schema: { is_nullable: true } },
    { field: 'CD_TIPO_ELEICAO', type: 'string', display: 'Código Tipo de Eleição', schema: { is_nullable: true } },
    { field: 'NM_TIPO_ELEICAO', type: 'string', display: 'Nome Tipo de Eleição', schema: { is_nullable: true } },
    { field: 'NR_TURNO', type: 'string', display: 'Número do Turno', schema: { is_nullable: true } },
    { field: 'CD_ELEICAO', type: 'string', display: 'Código da Eleição', schema: { is_nullable: true } },
    { field: 'DS_ELEICAO', type: 'string', display: 'Descrição da Eleição', schema: { is_nullable: true } },
    { field: 'DT_ELEICAO', type: 'string', display: 'Data da Eleição', schema: { is_nullable: true } },
    { field: 'TP_ABRANGENCIA_ELEICAO', type: 'string', display: 'Tipo de Abrangência da Eleição', schema: { is_nullable: true } },
    { field: 'SG_UF', type: 'string', display: 'UF', schema: { is_nullable: true } },
    { field: 'SG_UE', type: 'string', display: 'Sigla UE', schema: { is_nullable: true } },
    { field: 'NM_UE', type: 'string', display: 'Nome UE', schema: { is_nullable: true } },
    { field: 'CD_CARGO', type: 'string', display: 'Código do Cargo', schema: { is_nullable: true } },
    { field: 'DS_CARGO', type: 'string', display: 'Descrição do Cargo', schema: { is_nullable: true } },
    { field: 'SQ_CANDIDATO', type: 'bigstring', display: 'Sequência do Candidato', schema: { is_nullable: true } },
    { field: 'NR_CANDIDATO', type: 'string', display: 'Número do Candidato', schema: { is_nullable: true } },
    { field: 'NM_CANDIDATO', type: 'string', display: 'Nome do Candidato', schema: { is_nullable: true } },
    { field: 'NM_URNA_CANDIDATO', type: 'string', display: 'Nome na Urna do Candidato', schema: { is_nullable: true } },
    { field: 'NM_SOCIAL_CANDIDATO', type: 'string', display: 'Nome Social do Candidato', schema: { is_nullable: true } },
    { field: 'NR_CPF_CANDIDATO', type: 'string', display: 'CPF do Candidato', schema: { is_nullable: true } },
    { field: 'DS_EMAIL', type: 'string', display: 'Email do Candidato', schema: { is_nullable: true } },
    { field: 'CD_SITUACAO_CANDIDATURA', type: 'string', display: 'Código Situação Candidatura', schema: { is_nullable: true } },
    { field: 'DS_SITUACAO_CANDIDATURA', type: 'string', display: 'Descrição Situação Candidatura', schema: { is_nullable: true } },
    { field: 'TP_AGREMIACAO', type: 'string', display: 'Tipo de Agremiação', schema: { is_nullable: true } },
    { field: 'NR_PARTIDO', type: 'string', display: 'Número do Partido', schema: { is_nullable: true } },
    { field: 'SG_PARTIDO', type: 'string', display: 'Sigla do Partido', schema: { is_nullable: true } },
    { field: 'NM_PARTIDO', type: 'string', display: 'Nome do Partido', schema: { is_nullable: true } },
    { field: 'NR_FEDERACAO', type: 'string', display: 'Número da Federação', schema: { is_nullable: true } },
    { field: 'NM_FEDERACAO', type: 'string', display: 'Nome da Federação', schema: { is_nullable: true } },
    { field: 'SG_FEDERACAO', type: 'string', display: 'Sigla da Federação', schema: { is_nullable: true } },
    { field: 'DS_COMPOSICAO_FEDERACAO', type: 'string', display: 'Composição da Federação', schema: { is_nullable: true } },
    { field: 'SQ_COLIGACAO', type: 'bigstring', display: 'Sequência da Coligação', schema: { is_nullable: true } },
    { field: 'NM_COLIGACAO', type: 'string', display: 'Nome da Coligação', schema: { is_nullable: true } },
    { field: 'DS_COMPOSICAO_COLIGACAO', type: 'string', display: 'Composição da Coligação', schema: { is_nullable: true } },
    { field: 'SG_UF_NASCIMENTO', type: 'string', display: 'UF de Nascimento', schema: { is_nullable: true } },
    { field: 'DT_NASCIMENTO', type: 'string', display: 'Data de Nascimento', schema: { is_nullable: true } },
    { field: 'NR_TITULO_ELEITORAL_CANDIDATO', type: 'string', display: 'Título Eleitoral', schema: { is_nullable: true } },
    { field: 'CD_GENERO', type: 'string', display: 'Código de Gênero', schema: { is_nullable: true } },
    { field: 'DS_GENERO', type: 'string', display: 'Descrição do Gênero', schema: { is_nullable: true } },
    { field: 'CD_GRAU_INSTRUCAO', type: 'string', display: 'Código Grau de Instrução', schema: { is_nullable: true } },
    { field: 'DS_GRAU_INSTRUCAO', type: 'string', display: 'Grau de Instrução', schema: { is_nullable: true } },
    { field: 'CD_ESTADO_CIVIL', type: 'string', display: 'Código Estado Civil', schema: { is_nullable: true } },
    { field: 'DS_ESTADO_CIVIL', type: 'string', display: 'Estado Civil', schema: { is_nullable: true } },
    { field: 'CD_COR_RACA', type: 'string', display: 'Código Cor/Raça', schema: { is_nullable: true } },
    { field: 'DS_COR_RACA', type: 'string', display: 'Cor/Raça', schema: { is_nullable: true } },
    { field: 'CD_OCUPACAO', type: 'string', display: 'Código de Ocupação', schema: { is_nullable: true } },
    { field: 'DS_OCUPACAO', type: 'string', display: 'Ocupação', schema: { is_nullable: true } },
    { field: 'CD_SIT_TOT_TURNO', type: 'string', display: 'Código Situação Total do Turno', schema: { is_nullable: true } },
    { field: 'DS_SIT_TOT_TURNO', type: 'string', display: 'Situação Total do Turno', schema: { is_nullable: true } },
  ]

  for (const field of fields) {
    try {
      const result = await client.request(
        createField('candidatos', {
          field: field.field,
          type: field.type,
          meta: {
            display: field.display,
          },
        }),
      )
      console.log(`Campo ${field.field} criado com sucesso:`, result)
    }
    catch (error) {
      console.error(`Erro ao criar o campo ${field.field}:`, error)
    }
  }
}

createFields()
