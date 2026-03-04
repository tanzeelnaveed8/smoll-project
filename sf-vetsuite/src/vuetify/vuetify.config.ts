import { createVuetify } from 'vuetify'
import { theme } from './theme.config'
import { md2 } from 'vuetify/blueprints'
import { aliases } from './icon.config'
import { VDateInput } from 'vuetify/labs/components'

export const config: Parameters<typeof createVuetify>[0] = {
  defaults: {
    global: {
      ripple: false
    },
    VBtn: {
      rounded: 'pill'
    },
    VTextField: {
      variant: 'solo-filled',
      elevation: 0,
      flat: true,
      density: 'comfortable',
      persistentHint: true
    },
    VSelect: {
      variant: 'solo-filled',
      flat: true,
      elevation: 0,
      density: 'comfortable'
    },
    VCombobox: {
      variant: 'solo-filled',
      flat: true,
      elevation: 0,
      density: 'comfortable'
    },

    VTextarea: {
      variant: 'solo-filled',
      flat: true
    },
    VTab: {
      variant: 'plain'
    },
    VDateInput:{
      variant: 'solo-filled',
      elevation: 0,
      flat: true,
      density: 'comfortable',
      persistentHint: true
    }
  },
  blueprint: md2,
  icons: {
    aliases
  },
  theme: {
    themes: {
      light: theme
    }
  },
  components:{
    VDateInput,
  }
}
