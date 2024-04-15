<template>
  <v-card class="mx-auto" max-width="344" title="Cadastro de Usuário">
    <v-container>
      <v-row>
        <v-col cols="12">
          <!-- Botão para login com Google usando Vuetify SSO componente -->
          <v-btn color="red" @click="signInWithGoogle" block large>
            <v-icon left>mdi-google</v-icon>
            Entrar com Google
          </v-btn>

          <!-- Link para mostrar formulário de cadastro caso necessário -->
          <v-btn color="primary" @click="showForm = !showForm" block>
            {{ showForm ? 'Ocultar Formulário' : 'Ou cadastre-se manualmente' }}
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
                v-model="sobrenome"
                color="primary"
                label="Sobrenome"
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
  </v-card>
</template>

<script setup lang="ts">
  const nome = ref('')
  const sobrenome = ref('')
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
      sobrenome: sobrenome.value,
      email: email.value,
      senha: senha.value,
      bairro: bairro.value,
      dataNascimento: dataNascimento.value,
      termos: termos.value,
    })
  }
</script>
