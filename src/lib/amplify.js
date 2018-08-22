import Amplify from 'aws-amplify'
import { AWS_EXPORTS } from '@/config'

Amplify.Logger.LOG_LEVEL = process.env.NODE_ENV === 'development'
  ? 'INFO'
  : 'ERROR'

Amplify.configure(AWS_EXPORTS)
