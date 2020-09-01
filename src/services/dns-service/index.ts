/*
 * Copyright 2020 CJWW Development
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

import { logger } from '../../lib/logger'
import axios from 'axios'
import dns from 'dns'

export const lookupUrl = (url: string, fn: (ip: string | null) => void) => {
  logger.info(`[lookupUrl] - Looking up IP address for ${url}`)
  dns.lookup(url, (err: NodeJS.ErrnoException | null, addresses: string, family: number) => {
    if(!!err) {
      logger.error(`[lookupUrl] - There was a problem looking up the url for ${url}`, err)
      return fn(null)
    }
    logger.info(`[lookupUrl] - Completed lookup of IP address for ${url}, found ${addresses}`)
    return fn(addresses)
  })
}

export const updateDDNS = (ip: string): any => {
  const user = process.env.DDNS_USER || ''
  const pass = process.env.DDNS_PASS || ''
  const ddnsUrl = process.env.DDNS_UPDATE_URL || ''
  const serverUrl = process.env.LOOKUP_ADDR || ''
  const url = `https://${user}:${pass}@${ddnsUrl}?hostname=${serverUrl}&myip=${ip}`
  console.log(url)
  return axios.get(url).then(resp => {
    logger.info('[updateDDNS] - Sent update request to DDNS service')
    logger.info(resp.data)
    return resp.data
  })
}

