<template>
  <div class="auth-container">
    <va-card :bordered="false" class="auth-card">
      <va-card-title>
        <va-tabs v-model="currentTab">
          <va-tab name="login">Login</va-tab>
          <va-tab name="signup">Sign Up</va-tab>
        </va-tabs>
      </va-card-title>

      <va-card-content>
        <!-- Login Tab -->
        <div v-if="currentTab === 'login'">
          <va-input 
            v-model="email" 
            label="Email" 
            class="mb-3"
          />
          <va-input 
            v-model="password" 
            label="Password" 
            type="password" 
            class="mb-3"
          />
          <va-button 
            @click="handleLogin" 
            :disabled="!isLoginValid"
          >
            Login
          </va-button>
        </div>

        <!-- Signup Tab -->
        <div v-else-if="currentTab === 'signup'">
          <va-input 
            v-model="signupEmail" 
            label="Email" 
            class="mb-3"
          />
          <va-input 
            v-model="signupPassword" 
            label="Password" 
            type="password" 
            class="mb-3"
          />
          <va-input 
            v-model="confirmPassword" 
            label="Confirm Password" 
            type="password" 
            class="mb-3"
          />
          <va-button 
            @click="handleSignup" 
            :disabled="!isSignupValid"
          >
            Sign Up
          </va-button>
        </div>
      </va-card-content>

      <va-card-content v-if="errorMessage" class="text-danger">
        {{ errorMessage }}
      </va-card-content>
    </va-card>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'

export default {
  name: 'Auth',
  data() {
    return {
      currentTab: 'login',
      email: '',
      password: '',
      signupEmail: '',
      signupPassword: '',
      confirmPassword: '',
      errorMessage: ''
    }
  },
  computed: {
    isLoginValid() {
      return this.email && this.password
    },
    isSignupValid() {
      return this.signupEmail && 
             this.signupPassword && 
             this.confirmPassword && 
             this.signupPassword === this.confirmPassword
    }
  },
  methods: {
    async handleLogin() {
      try {
        const user = await Auth.signIn(this.email, this.password)
        await this.checkIfLoggedIn(user)
      } catch (error) {
        this.errorMessage = error.message || 'Login failed'
        console.error('Login error:', error)
      }
    },

    async handleSignup() {
      try {
        await Auth.signUp({
          username: this.signupEmail,
          password: this.signupPassword,
          attributes: {
            email: this.signupEmail
          }
        })
        this.errorMessage = 'Signup successful. Please verify your email.'
        this.currentTab = 'login'
      } catch (error) {
        this.errorMessage = error.message || 'Signup failed'
        console.error('Signup error:', error)
      }
    },

    async checkIfLoggedIn() {
      try {
        const session = await Auth.currentSession()
        
        // Check admin group if applicable
        if (this.$adminApp) {
          const groups = session.getIdToken().payload['cognito:groups']
          if (!groups || !groups.includes('admin')) {
            await Auth.signOut()
            this.errorMessage = "Insufficient privileges"
            return
          }
        }

        this.emitter.emit('authStateChanged', { 
          loggedIn: true, 
          authData: session 
        })
      } catch (error) {
        console.error('Login check error:', error)
        this.errorMessage = "Authentication failed"
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.auth-card {
  width: 100%;
  max-width: 400px;
}

.text-danger {
  color: red;
}
</style>