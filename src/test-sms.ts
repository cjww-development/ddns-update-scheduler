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

import dotenv from 'dotenv'
import { sendSmsUpdate } from './services/sms-service'
import {UpdateResponse} from './orchestrator'

dotenv.config()

const smsDestination: string = process.env.SMS_DESTINATION || ''

const updateResponses: UpdateResponse[] = [
  { url: 'test.com', ip: '1.1.1.1', publicIp: '1.1.1.1', updated: false },
  { url: 'testing.com', ip: '8.8.8.8', publicIp: '8.8.8.8', updated: false },
  { url: 'qwerty.com', ip: '5.5.5.5', publicIp: '5.5.5.5', updated: false },
  { url: 'asdfgh.com', ip: '4.4.4.4', publicIp: '4.4.4.4', updated: false },
]

const message: string = updateResponses.map(resp => resp.updated ? `\u2022 ${resp.url} to ${resp.publicIp}\n` : '').join('').trim()
const mainMessage: string = `Your internet connection has a new IP Address. Updating DNS A records for\n${message}`

if(process.env.SMS_NOTIFICATIONS == 'true' && message.length != 0) {
  sendSmsUpdate(smsDestination, mainMessage)
}