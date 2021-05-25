/*
 * Copyright 2021 CJWW Development
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import dotenv from 'dotenv'
import * as sms from './services/sms-service'
dotenv.config()

import { agenda } from './jobs'
import {logger} from "./lib/logger";

const SMS_DESTINATION = process.env.SMS_DESTINATION || ''

const jobFrequency: string = process.env.JOB_FREQUENCY || '1 hour'
const JOB_NAME = process.env.JOB_NAME || ''

const initialMessage = "The DDNS updater service has just started or restarted. DDNS updates are in operation."
if(process.env.SMS_NOTIFICATIONS == 'true') {
  sms.sendSmsUpdate(SMS_DESTINATION, initialMessage)
} else {
  logger.warn('SMS Notifications are currently disabled')
}

const startJobs = async () => {
  await agenda.start()
  await agenda.every(jobFrequency, JOB_NAME)
}

startJobs().then(r => console.log('Jobs Started'))