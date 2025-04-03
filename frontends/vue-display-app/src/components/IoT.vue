<template>
  <div></div>
</template>

<script>
  /*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
  *  SPDX-License-Identifier: MIT-0
  */

  'use strict'
  /* eslint-disable */
  import axios from "axios"
  const AWS = require('aws-sdk')
  const AWSIoTData = require('aws-iot-device-sdk')
  import { mqtt, iot, auth } from "aws-iot-device-sdk-v2";


  const topics = [
     'serverlesspresso-admin',
     'serverlesspresso-config'
  ]

export default {
  name: 'IoT',
  mounted: async function () {
    // console.log('IoT mounted start')
    const that = this
    this.emitter.on('authStateChanged', async function(detail) {
      console.log("IoT::mounted::authStateChanged: ", detail)
      if (detail.loggedIn) {
        console.log('Mounting websocket')
        that.mountIoT()
        // user signed in
      } else {
        // user signed out
      }
    }),
    this.emitter.on('subscribe', async (topic) => {
      console.log('Request subcription to: ', topic)
      mqttClient.subscribe(topic)
    })
  },
  methods: {
    async getCreds () {
      console.log('getCreds called')
      const cognitoIdentity = new AWS.CognitoIdentity({endpoint:"https://localhost.localstack.cloud:4566"})

      return new Promise((resolve, reject) => {
        AWS.config.credentials.get(function (err) {
          if (!err) {
            console.log('Retrieved identity: ' + AWS.config.credentials.identityId)
            const params = {
              IdentityId: AWS.config.credentials.identityId
            }
            cognitoIdentity.getCredentialsForIdentity(params, function (err, data) {
              console.log('Creds: ', data)
              if (!err) {
                resolve(data)
              } else {
                console.log('Error retrieving credentials: ' + err)
                reject(err)
              }
            })
          } else {
            console.log('Error retrieving identity:' + err)
            reject(err)
          }
        })
      })
    },
    async mountIoT () {
      const that = this
      const AWSConfiguration = {
        poolId: this.$identityPoolId,
        host: this.$IoTHost,
        region: this.$region,
        endpoint: 'https://localhost.localstack.cloud:4566'

      }

      const clientId = 'serverlesspresso-' + (Math.floor((Math.random() * 100000) + 1))
      AWS.config.region = AWSConfiguration.region
      AWS.config.endpoint=AWSConfiguration.endpoint
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: AWSConfiguration.poolId
      })

      const creds = await this.getCreds()
      
      const { data: caCert } = await axios.get('https://localhost.localstack.cloud:4566/_aws/iot/LocalStackIoTRootCA.pem', {
        responseType: 'text'
      });

      console.log(caCert)
      let host = AWSConfiguration.host.split(":")[0]
      let port = Number(AWSConfiguration.host.split(":")[1])
    const mqttclient = AWSIoTData.device({
        region: AWS.config.region,
        host,
        port,
        clientId: clientId,
        protocol: 'wss',
        maximumReconnectTimems: 8000,
        debug: true,
        accessKeyId: "test",
        secretKey: "test",
        sessionToken: "test",
        caCert
      })

      // when first connected, subscribe to the topics we are interested in.
      mqttclient.on('connect', function () {
        console.log('mqttclient connected')
        topics.map((topic) => mqttclient.subscribe(topic))
      })
      // attempt to reconnect in the event of any error
      mqttclient.on('error', async function (err) {
        console.log('mqttclient error:', err)

        // update creds
        const data = await that.getcreds()
        mqttclient.updatewebsocketcredentials(data.credentials.accesskeyid,
          data.credentials.secretkey,
          data.credentials.sessiontoken)
      })

      // a message has arrived - parse to determine topic
      mqttclient.on('message', function (topic, payload) {
        const payloadenvelope = json.parse(payload.tostring())
        console.log('iot::onmessage: ', topic, payloadenvelope)
        that.emitter.emit('message', payloadenvelope)
      })
      //   let provider = {
      //     aws_credentials: {
      //        aws_region: 'us-east-1',
      //         aws_access_id : "test",
      //         aws_secret_key: "test",
      //         aws_sts_token: "test"
      //     }
      //   }      

      
      //  let config = iot.AwsIotMqttConnectionConfigBuilder.new_websocket_builder()
      //     .with_clean_session(true)
      //     .with_credentials("us-east-1", "test", "test")
      //     .with_port(4510)
      //     .with_endpoint(host)
      //     .with_custom_authorizer()
      //     .build()

      // console.log("Connecting websocket...", config);
      // const client = new mqtt.MqttClient();

      // const connection = client.new_connection(config);
      // connection.on("connect", (session_present) => {
      //   resolve(connection);
      // });
      // connection.on("interrupt", (error) => {
      //   console.log(`Connection interrupted: error=${error}`);
      // });
      // connection.on("resume", (return_code, session_present) => {
      //   console.log(`Resumed: rc: ${return_code} existing session: ${session_present}`);
      // });
      // connection.on("disconnect", () => {
      //   console.log("Disconnected");
      // });
      // connection.on("error", (error) => {
      //   reject(error);
      // });
      // connection.connect();
      
    }
  }
}
</script>