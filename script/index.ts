import { createDirectus, createItem, createItems, readItems, rest, staticToken } from '@directus/sdk'

const apiToken: any = process.env.NUXT_PUBLIC_API_TOKEN
const apiBase: any = process.env.NUXT_PUBLIC_API_BASE

const client = createDirectus(apiBase)
  .with(staticToken(apiToken))
  .with(rest())

async function getCidade(cidade: string, uf: string) {
  const cidadeData = await client.request(readItems('candidatos', {
    filter: {
      NM_UE: cidade,
      SG_UF: uf,
    },
  }))
  console.log(cidadeData)
  return cidadeData
}

getCidade('ARARIPINA', 'PE')
