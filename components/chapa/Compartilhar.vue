<template>
  <div id="compartilhando">
    <v-container>
      <v-row class="bg-blue-lighten-4">
        <!-- Usando uma cor suave que se integra ao tema -->
        <v-col cols="9" class="d-flex align-center">
          <v-icon color="accent">mdi-share</v-icon>
          Compartilhe sua análise!
        </v-col>
        <v-col cols="3" class="d-flex justify-end align-center">
          <v-btn color="secondary" @click="shareAnalysis">
            <!-- Botão como texto na cor secundária -->
            Compartilhar
            <v-icon right>mdi-send</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
  const d = new useDirectus()
  const u = new useUtils()
  const salvarChapasNoDirectus = async (chapas: Chapa[]) => {
    try {
      const chapaData = {
        cidadeId: cidadeSelecionada.value.id,
        chapas: chapas,
      }

      // const resultado = await d.createItem('chapas', chapaData)
      const codigoUnique = u.codificarPermalink(
        cidadeSelecionada.value,
        chapasCriadas.value
      )
      console.log('Chapa salva com sucesso:', codigoUnique)
    } catch (error) {
      console.error('Erro ao salvar chapa:', error)
    }
  }
  const shareAnalysis = () => {
    console.log('Compartilhando análise...')
  }
</script>

<style></style>
