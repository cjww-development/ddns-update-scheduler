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

import Agenda from 'agenda'
import { lookupUrl, updateDDNS }  from '../services/dns-service'
import { getPublicIP } from '../services/ip-service'
import { logger } from '../lib/logger'
import * as sms from '../services/sms-service'

const mongoUrl = process.env.MONGO_URL || ''
const serverUrl = process.env.LOOKUP_ADDR || ''

const SMS_DESTINATION = process.env.SMS_DESTINATION || ''

export const agenda = new Agenda({ db: { address: mongoUrl }})

const updateDDNSJob = async (job: Agenda.Job) => {
  lookupUrl(serverUrl, async (ip: string | null) => {
    const publicIp = await getPublicIP()
    if(ip === publicIp) {
      logger.info('[updateDDNSJob] - The public IP has not changed, aborting return')
    } else {
      logger.warn(`[updateDDNSJob] - There has been a change in the public IP, updating DDNS service`)
      if(ip !== null || publicIp !== null) {
        updateDDNS(`${publicIp}`).then(() => {
          const updateMessage: string = `Your internet connection has a new IP Address. Settings DNS A Record for ${serverUrl} to ${publicIp}`
          if(process.env.SMS_NOTIFICATIONS == 'true') sms.sendSmsUpdate(SMS_DESTINATION, updateMessage)
        })
      } else {
        logger.warn('[updateDDNSJob] - One of the IP addresses was null aborting run')
      }
    }
  })
}

agenda.define('update-ddns', updateDDNSJob)
