import { createApp } from 'vue'
import App from './App.vue'
import { VuesticPlugin } from 'vuestic-ui'
import 'vuestic-ui/dist/vuestic-ui.css'
import mitt from 'mitt'
import Amplify from 'aws-amplify'
import VueTelInput from 'vue3-tel-input'
import 'vue3-tel-input/dist/vue3-tel-input.css'

const emitter = mitt()
const app = createApp(App)

app.use(VuesticPlugin, {
  components: {
    VaChip: { outline: true, rounded: false, size: 'large', color: '#000' },
    VaCard: { stripe: false, stripeColor: "black", square: false },
    VaButton: { color: "#08c18a" },
    VaButtonGroup: { color: "#08c18a" }
  },
}).use(VueTelInput)

app.config.globalProperties.emitter = emitter

app.config.globalProperties.$appLogo = 'https://assets.serverlesscoffee.com/images/serverlesspresso-large.png'
app.config.globalProperties.$appName = 'Validator'
app.config.globalProperties.$adminApp = true

const defaults = {
  region: '',
  userPoolId: '',
  userPoolWebClientId: '',
  identityPoolId: '',
  orderManagerEndpoint: '',
  APIGWEndpointValidatorService: '',
  APIGWEndpointConfigService: '',
  IoTHost: '',
}

const UIstate = localStorage.UIstate ? JSON.parse(localStorage.UIstate) : {}
const config = { ...defaults, ...UIstate }

// Assign global properties
Object.entries(config).forEach(([key, value]) => {
  app.config.globalProperties[`$${key}`] = value
})

// Validate required variables
const requiredVars = Object.values(config)
const hasAllVars = requiredVars.every(val => val && val !== '')

app.config.globalProperties.$init = false

if (hasAllVars) {
  try {
    Amplify.configure({
      Auth: {
        region: config.region,
        identityPoolRegion: config.region,
        userPoolId: config.userPoolId,
        userPoolWebClientId: config.userPoolWebClientId,
        mandatorySignIn: false,
        endpoint: "https://localhost.localstack.cloud:4566",
      }
    })
    app.config.globalProperties.$init = true
  } catch (err) {
    console.error('Amplify configuration error:', err)
  }
} else {
  console.warn('Missing configuration variables:', config)
}

app.mount('#app')