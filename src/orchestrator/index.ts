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

import { IpResponse, lookupARecord, updateGoogleDDNS } from "../services/dns-service"
import { sendSmsUpdate } from '../services/sms-service'
import { getPublicIP } from "../services/ip-service"
import { logger } from '../lib/logger'

export interface Credentials {
  username: string,
  password: string
}

export interface UrlDetails {
  url: string,
  credentials: Credentials
}

export interface UpdateResponse {
  url: string
  ip: string,
  publicIp: string,
  updated: boolean
}

export const updateDDNSEntries = (urlDetails: UrlDetails[], smsDestination: string): Promise<UpdateResponse[]> => {
  return Promise
    .all(urlDetails.map(async urlDetail => updateDDNS(urlDetail)))
    .then(resps => {
      const message: string = resps.map(resp => resp.updated ? `\u2022 ${resp.url} to ${resp.publicIp}\n` : '').join('').trim()
      const mainMessage: string = `Your internet connection has a new IP Address. Updating DNS A records for\n${message}`
      if(process.env.SMS_NOTIFICATIONS == 'true' && message.length != 0) {
        return sendSmsUpdate(smsDestination, mainMessage).then(id => {
          logger.info(`[updateDDNSEntries] - Sent update sms with messageId ${id}`)
          return resps
        })
      } else {
        return resps
      }
    })
}

export const updateDDNS = async (urlDetails: UrlDetails): Promise<UpdateResponse> => {
  try {
    const ipAddress: IpResponse = await lookupARecord(urlDetails.url)
    const publicIp: string = await getPublicIP()

    return ipAddress.ip === publicIp
      ? handleAbortedUpdate(ipAddress, urlDetails, publicIp)
      : handleSuccessfulUpdate(ipAddress, urlDetails, publicIp)
  } catch (err) {
    logger.warn('[updateDDNS] - There was a problem either looking up the DNS or getting the public IP', err)
    return { url: urlDetails.url, ip: '-', publicIp: '-', updated: false }
  }
}

const handleSuccessfulUpdate = (ipAddress: IpResponse, urlDetails: UrlDetails, publicIp: string) => {
  logger.warn(`[updateDDNS] - The IP address for ${urlDetails.url} has changed to ${publicIp}, updating`)
  return updateGoogleDDNS(publicIp, urlDetails.url, urlDetails.credentials.username, urlDetails.credentials.password).then(() => {
    logger.info(`[updateDDNS] - Updated IP address for ${urlDetails.url} updated to ${publicIp}`)
    return { url: urlDetails.url, ip: ipAddress.ip, publicIp, updated: true }
  })
}

const handleAbortedUpdate = (ipAddress: IpResponse, urlDetails: UrlDetails, publicIp: string) => {
  logger.info(`[updateDDNS] - The IP address for ${urlDetails.url} has not changed, not updating`)
  return { url: urlDetails.url, ip: ipAddress.ip, publicIp, updated: false }
}
