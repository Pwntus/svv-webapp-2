import { Auth } from 'aws-amplify'

export const API_NAME = 'StartIoT'
export const MIC_USERNAME = ''
export const MIC_PASSWORD = ''
export const MIC_THING_TYPE = 191

export const AWS_EXPORTS = {
  Auth: {
    mandatorySignIn: false,
    region: 'eu-west-1',
    userPoolId: 'eu-west-1_jKaY6EGjT',
    identityPoolId: 'eu-west-1:360ad910-a783-4887-8607-6495e2c2031c',
    userPoolWebClientId: '4ff11oo3ehurg6s6sq00jtrune'
  },
  API: {
    endpoints: [
      {
        name: 'StartIoT',
        endpoint: 'https://qvx6ay1eog.execute-api.eu-west-1.amazonaws.com/prod',
        custom_header: async () => {
          return {
            Authorization: (await Auth.currentSession()).idToken.jwtToken,
            identityId: (await Auth.currentCredentials())._identityId
          }
        }
      }
    ]
  }
}
