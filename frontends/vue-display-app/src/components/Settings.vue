<template>
  <div class="row parent">
    <div class="flex md6 lg6">
      <va-card :bordered="false" style="margin-top: 20px;">
        <va-card-title>Add your backend settings</va-card-title>
        <va-card-content>
          Enter the environment variables and stack parameters from your backend.
        </va-card-content>

        <!-- Input Fields -->
        <div class="row flex" style="margin: 20px;">
          <va-input
            style="font-size: 24px;"
            label="Region (e.g. us-east-1)"
            v-model.trim="region"
          />
        </div>

        <div class="row flex" style="margin: 20px;">
          <va-input
            style="font-size: 24px;"
            label="User Pool Id"
            v-model.trim="userPoolId"
          />
        </div>

        <div class="row flex" style="margin: 20px;">
          <va-input
            style="font-size: 24px;"
            label="User Pool Web Client Id"
            v-model.trim="userPoolWebClientId"
          />
        </div>

        <div class="row flex" style="margin: 20px;">
          <va-input
            style="font-size: 24px;"
            label="Identity Pool Id"
            v-model.trim="identityPoolId"
          />
        </div>

        <div class="row flex" style="margin: 20px;">
          <va-input
            style="font-size: 24px;"
            label="Order Manager Endpoint"
            v-model.trim="orderManagerEndpoint"
          />
        </div>

        <div class="row flex" style="margin: 20px;">
          <va-input
            style="font-size: 24px;"
            label="Validator Service Endpoint"
            v-model.trim="APIGWEndpointValidatorService"
          />
        </div>

        <div class="row flex" style="margin: 20px;">
          <va-input
            style="font-size: 24px;"
            label="Config Service Endpoint"
            v-model.trim="APIGWEndpointConfigService"
          />
        </div>

        <div class="row flex" style="margin: 20px;">
          <va-input
            style="font-size: 24px;"
            label="IoT Host"
            v-model.trim="IoTHost"
          />
        </div>

        <!-- Save Button -->
        <div class="row flex" style="margin: 20px;">
          <va-button
            :rounded="false"
            @click="saveLocalStorage"
            class="mr-2">
            Save and reload
          </va-button>
        </div>
      </va-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      region: '',
      userPoolId: '',
      userPoolWebClientId: '',
      identityPoolId: '',
      orderManagerEndpoint: '',
      APIGWEndpointValidatorService: '',
      APIGWEndpointConfigService: '',
      IoTHost: ''
    }
  },
  async mounted () {
     const params = new URLSearchParams(window.location.search)
     const UIstate = localStorage.UIstate ? JSON.parse(localStorage.UIstate) : {}
     this.region = params.get('region') || UIstate.region || ''
     this.userPoolId = params.get('userPoolId') || UIstate.userPoolId || ''
     this.userPoolWebClientId = params.get('userPoolWebClientId') || UIstate.userPoolWebClientId || ''
     this.identityPoolId = params.get('identityPoolId') || UIstate.identityPoolId || ''
     this.orderManagerEndpoint = params.get('orderManagerEndpoint') || UIstate.orderManagerEndpoint || ''
     this.APIGWEndpointValidatorService = params.get('APIGWEndpointValidatorService') || UIstate.APIGWEndpointValidatorService || ''
     this.APIGWEndpointConfigService = params.get('APIGWEndpointConfigService') || UIstate.APIGWEndpointConfigService || ''
     this.IoTHost = params.get('IoTHost') || UIstate.IoTHost || ''
  },
  methods: {
    saveLocalStorage () {
      const UIstate = {
        region: this.region,
        userPoolId: this.userPoolId,
        userPoolWebClientId: this.userPoolWebClientId,
        identityPoolId: this.identityPoolId,
        orderManagerEndpoint: this.orderManagerEndpoint,
        APIGWEndpointValidatorService: this.APIGWEndpointValidatorService,
        APIGWEndpointConfigService: this.APIGWEndpointConfigService,
        IoTHost: this.IoTHost
      }
      localStorage.UIstate = JSON.stringify(UIstate)
      location.reload()
    }
  }
}
</script>
