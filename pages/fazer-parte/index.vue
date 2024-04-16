<template>
  <v-card class="ma-4 pa-2" variant="elevated">
    <v-card-item>
      <v-card-title class="pa-2 pl-4 bg-primary">
        <v-icon left size="small">mdi-vote</v-icon>
        Fazer parte da campanha</v-card-title
      >
      <v-card-subtitle>
        <FazerParteLocalidade />
      </v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <v-col cols="12">
        <div class="text-subtitle-1">Demonstre seu apoio!</div>
        <div class="text-caption">
          Registre-se e fortaleça nossa jornada por uma comunidade melhor. É
          rápido e faz toda a diferença!</div
        >
      </v-col>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-btn color="white" class="google-sign-in-btn" outlined>
              <v-img src="/google.png" class="google-logo" alt="Google login" />
              Entrar com Google
            </v-btn>
            <v-divider class="px-3 pa-2"></v-divider>
            <!-- Link para mostrar formulário de cadastro caso necessário -->
            <v-btn color="primary" @click="showForm = !showForm" outlined>
              {{
                showForm ? 'Ocultar Formulário' : 'Ou cadastre-se manualmente'
              }}
            </v-btn>

            <!-- Formulário de cadastro ocultado inicialmente -->
            <v-fade-transition>
              <div v-if="showForm">
                <v-text-field
                  v-model="nome"
                  color="primary"
                  label="Nome"
                  variant="underlined"
                ></v-text-field>
                <v-text-field
                  v-model="email"
                  color="primary"
                  label="E-mail"
                  variant="underlined"
                ></v-text-field>
                <v-text-field
                  v-model="senha"
                  color="primary"
                  label="Senha"
                  placeholder="Digite sua senha"
                  variant="underlined"
                  type="password"
                ></v-text-field>
                <v-text-field
                  v-model="bairro"
                  color="primary"
                  label="Bairro na cidade"
                  variant="underlined"
                ></v-text-field>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="dataNascimento"
                      label="Data de nascimento"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dataNascimento"
                    no-title
                    @input="menu = false"
                  ></v-date-picker>
                </v-menu>

                <v-checkbox
                  v-model="termos"
                  color="secondary"
                  label="Concordo com os termos e condições do site"
                ></v-checkbox>

                <v-btn color="success" @click="completeRegistration" block>
                  Completar Cadastro
                  <v-icon right>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </v-fade-transition>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  const nome = ref('')
  const email = ref('')
  const senha = ref('')
  const bairro = ref('')
  const dataNascimento = ref('')
  const termos = ref(false)
  const showForm = ref(false)
  const menu = ref(false)

  const signInWithGoogle = () => {
    console.log('Entrando com Google...')
  }

  const completeRegistration = () => {
    console.log('Dados do usuário:', {
      nome: nome.value,
      email: email.value,
      senha: senha.value,
      bairro: bairro.value,
      dataNascimento: dataNascimento.value,
      termos: termos.value,
    })
  }
</script>
<style scoped>
  .google-sign-in-btn {
    color: #4285f4; /* Cor do texto do Google */
    border-color: #4285f4; /* Cor da borda do Google */
  }

  .google-logo {
    background-color: #ffffff; /* Fundo branco para o ícone */
    padding: 8px; /* Espaçamento ao redor do ícone */
    margin-right: 10px; /* Espaço entre o ícone e o texto */
    border-radius: 50%; /* Para tornar o ícone circular */
  }
</style>
