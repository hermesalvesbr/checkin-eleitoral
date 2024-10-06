// script/separarCSVPorUFEmJSON.js

import { createReadStream, createWriteStream, promises as fsPromises } from 'node:fs'
import { resolve } from 'node:path'
import readline from 'node:readline'

const MAX_FILE_SIZE = 24 * 1024 * 1024

// Função principal para separar o CSV por UF e gerar arquivos JSON
async function separarCSVPorUFEmJSON() {
    const inputFilePath = resolve('./public/locais', 'eleitorado_local_votacao_2024.csv')

    // Certifique-se de que o diretório de saída existe
    const outputDir = resolve('./public/locais')
    try {
        await fsPromises.access(outputDir)
    }
    catch {
        await fsPromises.mkdir(outputDir, { recursive: true })
    }

    const readStream = createReadStream(inputFilePath)
    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity,
    })

    const outputStreams = new Map()
    let headerColumns = []

    // Encontra o índice da coluna SG_UF no cabeçalho
    let SG_UF_index = -1

    // Função auxiliar para criar um novo stream de arquivo
    function createNewOutputStream(SG_UF, partNumber) {
        const outputFilePath = resolve(outputDir, `eleitorado_local_votacao_2024_${SG_UF}_part${partNumber}.json`)
        const outputStream = createWriteStream(outputFilePath, { flags: 'w' })
        outputStream.write('[\n') // Abre o array JSON
        return outputStream
    }

    // Função auxiliar para fechar o arquivo JSON corretamente
    function closeOutputStream(outputStreamInfo) {
        if (outputStreamInfo.stream) {
            outputStreamInfo.stream.write('\n]')
            outputStreamInfo.stream.end()
        }
    }

    for await (const line of rl) {
        if (!headerColumns.length) {
            // Esta é a linha de cabeçalho
            headerColumns = parseCSVLine(line)
            SG_UF_index = headerColumns.findIndex(col => col === 'SG_UF')
            if (SG_UF_index === -1) {
                console.error('Coluna SG_UF não encontrada no cabeçalho')
                process.exit(1)
            }
            continue
        }

        // Divide a linha em colunas
        const columns = parseCSVLine(line)

        // Verifica se as colunas foram extraídas corretamente
        if (!columns) {
            console.error('Erro ao analisar a linha:', line)
            continue
        }

        // Obtém o valor de SG_UF da linha
        const SG_UF = columns[SG_UF_index]

        // Obtém ou cria o stream de saída para este UF
        let outputStreamInfo = outputStreams.get(SG_UF)
        if (!outputStreamInfo) {
            outputStreamInfo = {
                partNumber: 1,
                stream: createNewOutputStream(SG_UF, 1),
                size: 0,
                isFirstLine: true
            }
            outputStreams.set(SG_UF, outputStreamInfo)
        }

        // Converte as colunas em um objeto
        const dataObject = {}
        for (let i = 0; i < headerColumns.length; i++) {
            const key = headerColumns[i]
            const value = columns[i] || ''
            dataObject[key] = value
        }

        const jsonString = JSON.stringify(dataObject, null, 2)

        // Verifica se o tamanho do arquivo atingiu o limite
        const jsonSize = Buffer.byteLength(jsonString, 'utf-8')
        if (outputStreamInfo.size + jsonSize > MAX_FILE_SIZE) {
            // Fecha o stream atual
            closeOutputStream(outputStreamInfo)

            // Incrementa o número da parte e cria um novo arquivo
            outputStreamInfo.partNumber++
            outputStreamInfo.stream = createNewOutputStream(SG_UF, outputStreamInfo.partNumber)
            outputStreamInfo.size = 0
            outputStreamInfo.isFirstLine = true
        }

        // Escreve a vírgula se não for o primeiro objeto
        if (!outputStreamInfo.isFirstLine) {
            outputStreamInfo.stream.write(',\n')
        } else {
            outputStreamInfo.isFirstLine = false
        }

        // Escreve o objeto JSON no arquivo e atualiza o tamanho
        outputStreamInfo.stream.write(jsonString)
        outputStreamInfo.size += jsonSize
    }

    // Fecha todos os streams de saída
    for (const [, outputStreamInfo] of outputStreams) {
        closeOutputStream(outputStreamInfo)
    }

    console.log('Processo concluído!')
}

// Função para analisar uma linha CSV considerando aspas e delimitador ;
function parseCSVLine(line) {
    const regex = /(?:"((?:[^"]|"")*)"|([^";]*))(?:;|$)/g
    const columns = []
    let match
    let previousIndex = -1

    while ((match = regex.exec(line)) !== null) {
        // Verifica se o índice avançou para evitar loops infinitos
        if (regex.lastIndex === previousIndex) {
            console.error('Regex não avançou na posição', regex.lastIndex)
            break
        }
        previousIndex = regex.lastIndex

        let column
        if (match[1] !== undefined) {
            // Campo entre aspas
            column = match[1].replace(/""/g, '"')
        } else {
            // Campo não entre aspas
            column = match[2]
        }
        columns.push(column)
    }

    return columns
}

// Executa a função principal
separarCSVPorUFEmJSON().catch((error) => {
    console.error('Erro ao processar o arquivo:', error)
})
