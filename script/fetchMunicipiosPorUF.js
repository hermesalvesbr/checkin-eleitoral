// script/fetchMunicipiosPorUF.js

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

// Função para carregar os estados do arquivo eleicao_atual.json
async function carregarEstados() {
    const filePath = path.resolve('./public', 'eleicao_atual.json')
    const data = await readFile(filePath, 'utf-8')
    const parsedData = JSON.parse(data)
    return parsedData.ues.map(estado => estado.sigla)
}

// Função para buscar os municípios por UF
async function buscarMunicipiosPorUF(uf) {
    const url = `https://divulgacandcontas.tse.jus.br/divulga/rest/v1/eleicao/buscar/${uf}/2045202024/municipios`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Erro ao buscar municípios para ${uf}: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    }
    catch (error) {
        console.error(`Erro ao buscar municípios para ${uf}:`, error)
        return null
    }
}

// Função para gerar JSONs dos municípios por UF
async function gerarMunicipiosPorUF() {
    try {
        const estados = await carregarEstados()

        for (const uf of estados) {
            console.log(`Buscando municípios para o estado ${uf}...`)

            const municipios = await buscarMunicipiosPorUF(uf)

            if (municipios) {
                const filePath = path.resolve('./public', `municipios_${uf}.json`)
                await writeFile(filePath, JSON.stringify(municipios, null, 2))
                console.log(`Municípios de ${uf} salvos em ${filePath}`)
            }
            else {
                console.log(`Não foi possível salvar municípios de ${uf}`)
            }
        }

        console.log('Processo concluído!')
    }
    catch (error) {
        console.error('Erro ao gerar os arquivos de municípios:', error)
    }
}

gerarMunicipiosPorUF()
