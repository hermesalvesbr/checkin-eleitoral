import { writeFile } from 'node:fs/promises'
import path from 'node:path'

async function fetchAndSaveData() {
    try {
        const response = await fetch('https://divulgacandcontas.tse.jus.br/divulga/rest/v1/eleicao/eleicao-atual?idEleicao=2045202024')

        if (!response.ok) {
            throw new Error(`Erro ao buscar dados: ${response.statusText}`)
        }

        const data = await response.json()

        // Definir o caminho do arquivo onde salvar os dados
        const filePath = path.resolve('./public', 'eleicao_atual.json')

        // Salvar os dados no arquivo eleicao_atual.json
        await writeFile(filePath, JSON.stringify(data, null, 2))

        console.log('Dados salvos com sucesso em eleicao_atual.json!')
    }
    catch (error) {
        console.error('Erro ao buscar ou salvar os dados:', error)
    }
}

fetchAndSaveData()
