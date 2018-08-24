import { API } from 'aws-amplify'
import { API_NAME } from '@/config'

export default {
  async post (path, body) {
    try {
      return await API.post(API_NAME, path, {
        body,
        headers: {
          'x-api-key': 'oy0yDJfZdQkQ52LLCugD6IQNiC8l1Xcacm89kg44'
        }
      })
    } catch (e) {
      throw e
    }
  },
  async get (path, queryStringParameters) {
    try {
      return await API.get(API_NAME, path, {
        queryStringParameters,
        headers: {
          'x-api-key': 'oy0yDJfZdQkQ52LLCugD6IQNiC8l1Xcacm89kg44'
        }
      })
    } catch (e) {
      throw e
    }
  }
}
