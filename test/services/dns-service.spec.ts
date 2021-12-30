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

import {lookupARecord, updateGoogleDDNS} from '../../src/services/dns-service'
import dns from 'dns'

const axios = require('axios')

const testError = {
  errno: 616,
  code: '616',
  path: '/var/test',
  syscall: 'lookup',
  stack: 'qwerty',
  name: 'DNSLookupError',
  message: 'There was a problem performing the DNS lookup'
}

jest.mock('axios')
jest.mock('dns', () => ({
  lookup: (hostname: string, callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void) => {
    hostname === 'test.com' ? callback(null, '1.1.1.1', 5) : callback(testError, '', 0)
  }
}))

describe('lookupARecord', () => {
  it('should return the IP for the url', async () => {
    const url: string = 'test.com'
    const ip: string = '1.1.1.1'
    const family: number = 5

    const result = await lookupARecord('test.com')
    expect(result).toEqual({ url, ip, family })
  })

  it('should return an error if there was a problem performing the dns lookup', async () => {
    let thrownError;

    try {
      await lookupARecord('testing.com')
    }
    catch(error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(testError);
  })
})

describe('updateGoogleDDNS', () => {
  it('should return a 200 response', async () => {
    const mockedData = { status: 200, statusText: 'Ok' }
    axios.get.mockImplementationOnce(() => Promise.resolve(mockedData));

    const result = await updateGoogleDDNS('1.1.1.1', 'test.com', 'test', 'test')
    expect(result).toEqual(200)
  })

  it('should return a 400 response', async () => {
    const mockedData = { status: 400, statusText: 'Bad Request' }
    axios.get.mockImplementationOnce(() => Promise.resolve(mockedData));

    const result = await updateGoogleDDNS('1.1.1.1', 'test.com', 'test', 'test')
    expect(result).toEqual(400)
  })

  it('should return a 500 response', async () => {
    const mockedData = { status: 500, statusText: 'Internal Server Error' }
    axios.get.mockImplementationOnce(() => Promise.resolve(mockedData));

    const result = await updateGoogleDDNS('1.1.1.1', 'test.com', 'test', 'test')
    expect(result).toEqual(500)
  })
})
