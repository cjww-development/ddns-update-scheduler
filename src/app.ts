/*
 * Copyright 2022 CJWW Development
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

import Agenda from 'agenda'
import dotenv from 'dotenv'
import * as sms from './services/sms-service'
import { logger } from "./lib/logger";
import { buildUrlDetails } from "./lib/parser";
import { updateDDNSEntries } from './orchestrator'

dotenv.config()

const smsDestination: string = process.env.SMS_DESTINATION || ''
const jobFrequency: string = process.env.JOB_FREQUENCY || '1 hour'
const jobName: string = process.env.JOB_NAME || ''
const mongoUrl: string = process.env.MONGO_URL || ''
const servers: string = process.env.SERVER_SETTINGS || ''
const initialMessage: string = process.env.INITIAL_MESSAGE || ''

const agenda = new Agenda({ db: { address: mongoUrl } })

if(process.env.SMS_NOTIFICATIONS == 'true') {
  sms.sendSmsUpdate(smsDestination, initialMessage).then(id => {
    logger.info(`[app] - Sent initial SMS notification with messageId ${id}`)
  })
} else {
  logger.warn('[app] - SMS Notifications are currently disabled')
}

const startJobs = async (): Promise<void> => {
  const urlDetails = buildUrlDetails(servers)
  if(urlDetails.length != 0) {
    logger.info('[app] - Defining and starting DDNS updater')
    agenda.define(jobName, () => updateDDNSEntries(urlDetails, smsDestination))
    await agenda.start()
    await agenda.every(jobFrequency, jobName)
  } else {
    logger.error('[app] - There was a problem with the SERVER_SETTINGS env var, ensure its in the correct format')
  }
}

startJobs().then(() => {
  logger.info('[app] - Started defined jobs')
})