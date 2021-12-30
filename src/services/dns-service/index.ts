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

import {logger} from '../../lib/logger'
import axios from 'axios'
import dns from 'dns'

export interface IpResponse {
  url: string,
  ip: string
  family: number
}

export const lookupARecord = (url: string): Promise<IpResponse> => {
  return new Promise((resolve, reject) => {
    dns.lookup(url, (err: NodeJS.ErrnoException | null, addresses: string, family: number) => {
      if(!!err) {
        logger.error(`[lookupUrl] - There was a problem performing the dns lookup`)
        return reject(err)
      } else {
        logger.info(`[lookupUrl] - Completed lookup of IP address for ${url}, found ${addresses}`)
        return resolve({ url, ip: addresses, family })
      }
    })
  })
}

export const updateGoogleDDNS = (ip: string, url: string, username: string, password: string): Promise<number> => {
  const updateUrl = `https://${username}:${password}@domains.google.com/nic/update?hostname=${url}&myip=${ip}`
  return axios.get(updateUrl).then(resp => {
    logger.info('[updateDDNS] - Sent update request to the Google DDNS service')
    return resp.status
  })
}
