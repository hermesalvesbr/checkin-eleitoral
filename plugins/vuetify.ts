// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const brasilLightTheme = {
    dark: false,
    colors: {
      'background': '#FFFFFF', // Branco para fundo geral
      'surface': '#FDFDFD', // Uma variação sutil de branco para superfícies
      'surface-bright': '#FFFFFF',
      'surface-light': '#EEEEEE',
      'surface-variant': '#005CA9', // Azul para variantes de superfície
      'on-surface-variant': '#FDFDFD',
      'primary': '#009B3A', // Verde da bandeira para a cor primária
      'primary-darken-1': '#007229', // Uma variação mais escura do verde para hover e foco
      'secondary': '#FFDF00', // Amarelo da bandeira para a cor secundária
      'secondary-darken-1': '#DBB300', // Uma variação mais escura do amarelo
      'error': '#B00020',
      'info': '#2196F3',
      'success': '#4CAF50',
      'warning': '#FB8C00',
      // Adicionando azul da esfera da bandeira como uma cor adicional
      'accent': '#3E9ECF', // Um azul claro que lembra a esfera da bandeira
    },
    variables: {
      'border-color': '#000000',
      'border-opacity': 0.12,
      'high-emphasis-opacity': 0.87,
      'medium-emphasis-opacity': 0.6,
      'disabled-opacity': 0.38,
      'idle-opacity': 0.04,
      'hover-opacity': 0.04,
      'focus-opacity': 0.12,
      'selected-opacity': 0.08,
      'activated-opacity': 0.12,
      'pressed-opacity': 0.12,
      'dragged-opacity': 0.08,
      'theme-kbd': '#212529',
      'theme-on-kbd': '#FFFFFF',
      'theme-code': '#F5F5F5',
      'theme-on-code': '#000000',
      'table-header-font-weight': 'bold',
    },
  }
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'brasilLightTheme',
      themes: {
        brasilLightTheme,
      },
    },
  })
  app.vueApp.use(vuetify)
})
