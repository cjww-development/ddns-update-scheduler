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

import { updateDDNS, updateDDNSEntries } from '../../src/orchestrator'
import * as orchestrator from '../../src/orchestrator'
import * as dnsService from '../../src/services/dns-service'
import * as ipService from '../../src/services/ip-service'
import * as smsService from '../../src/services/sms-service'

const testInput = {
  url: 'test.com',
  credentials: {
    username: 'testUser',
    password: 'testPass'
  }
}

const testError = {
  errno: 616,
  code: '616',
  path: '/var/test',
  syscall: 'lookup',
  stack: 'qwerty',
  name: 'DNSLookupError',
  message: 'There was a problem performing the DNS lookup'
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('updateDDNS', () => {
  it('should update the DNS record if the public IP changes', async () => {
    const expected = {
      url: 'test.com',
      ip: '1.1.1.1',
      publicIp: '1.0.0.1',
      updated: true
    }

    const lookupUrlMock = jest.spyOn(dnsService, 'lookupARecord')
    lookupUrlMock.mockResolvedValue({ url: 'test.com', ip: '1.1.1.1', family: 4 })

    const getPublicIPMock = jest.spyOn(ipService, 'getPublicIP')
    getPublicIPMock.mockResolvedValue('1.0.0.1')

    const updateGoogleDDNSMock = jest.spyOn(dnsService, 'updateGoogleDDNS')
    updateGoogleDDNSMock.mockResolvedValue(200)

    const result = await updateDDNS(testInput)
    expect(result).toEqual(expected)
  })

  it('should return a not updated response when there was a problem updating google DDNS', async () => {
    const expected = {
      url: 'test.com',
      ip: '-',
      publicIp: '-',
      updated: false
    }

    const lookupUrlMock = jest.spyOn(dnsService, 'lookupARecord')
    lookupUrlMock.mockResolvedValue({ url: 'test.com', ip: '1.1.1.1', family: 4 })

    const getPublicIPMock = jest.spyOn(ipService, 'getPublicIP')
    getPublicIPMock.mockResolvedValue('1.0.0.1')

    const updateGoogleDDNSMock = jest.spyOn(dnsService, 'updateGoogleDDNS')
    updateGoogleDDNSMock.mockImplementationOnce(() => {
      console.log('Failed to update google DDNS lookup')
      throw testError
    })

    const result = await updateDDNS(testInput)
    expect(result).toEqual(expected)
  })

  it('should return a not updated response when the current IP and public IP are still the same', async () => {
    const expected = {
      url: 'test.com',
      ip: '1.1.1.1',
      publicIp: '1.1.1.1',
      updated: false
    }

    const lookupUrlMock = jest.spyOn(dnsService, 'lookupARecord')
    lookupUrlMock.mockResolvedValue({ url: 'test.com', ip: '1.1.1.1', family: 4 })

    const getPublicIPMock = jest.spyOn(ipService, 'getPublicIP')
    getPublicIPMock.mockResolvedValue('1.1.1.1')

    const result = await updateDDNS(testInput)
    expect(result).toEqual(expected)
  })

  it('should return a not updated response when there was an issue looking up the current IP', async () => {
    const expected = {
      url: 'test.com',
      ip: '-',
      publicIp: '-',
      updated: false
    }

    const lookupUrlMock = jest.spyOn(dnsService, 'lookupARecord')
    lookupUrlMock.mockRejectedValue(testError)

    const result = await updateDDNS(testInput)
    expect(result).toEqual(expected)
  })

  it('should return a not updated response when there was an issue getting the current public IP', async () => {
    const expected = {
      url: 'test.com',
      ip: '-',
      publicIp: '-',
      updated: false
    }

    const lookupUrlMock = jest.spyOn(dnsService, 'lookupARecord')
    lookupUrlMock.mockResolvedValue({ url: 'test.com', ip: '1.1.1.1', family: 4 })

    const getPublicIPMock = jest.spyOn(ipService, 'getPublicIP')
    getPublicIPMock.mockImplementation(() => {
      console.log('Failed getting public IP')
      throw new Error()
    })

    const result = await updateDDNS(testInput)
    expect(result).toEqual(expected)
  })
})

describe('updateDDNSEntries', () => {
  it('should return an array of UpdateResponses when sms notifications are enabled', async () => {
    process.env.SMS_NOTIFICATIONS = 'true'

    const input = [
      { url: 'test.com', credentials: { username: 'testUsername', password: 'testPassword' } },
      { url: 'test.com', credentials: { username: 'testUsername', password: 'testPassword' } }
    ]

    const expected = [
      { url: 'test.com', ip: '1.1.1.1', publicIp: '1.0.0.1', updated: true },
      { url: 'test.com', ip: '1.1.1.1', publicIp: '1.0.0.1', updated: true }
    ]

    const updateDDNSMock = jest.spyOn(orchestrator, 'updateDDNS')
    updateDDNSMock.mockResolvedValue({ url: 'test.com', ip: '1.1.1.1', publicIp: '1.0.0.1', updated: true })

    const sendSmsUpdateMock = jest.spyOn(smsService, 'sendSmsUpdate')
    sendSmsUpdateMock.mockResolvedValue('testMessageId')

    const result = await updateDDNSEntries(input, 'testDestination')
    expect(result).toEqual(expected)
  })

  it('should return an array of UpdateResponses when sms notifications are enabled and no urls are updated', async () => {
    process.env.SMS_NOTIFICATIONS = 'true'

    const input = [
      { url: 'test.com', credentials: { username: 'testUsername', password: 'testPassword' } },
      { url: 'test.com', credentials: { username: 'testUsername', password: 'testPassword' } }
    ]

    const expected = [
      { url: 'test.com', ip: '1.1.1.1', publicIp: '1.0.0.1', updated: false },
      { url: 'test.com', ip: '1.1.1.1', publicIp: '1.0.0.1', updated: false }
    ]

    const updateDDNSMock = jest.spyOn(orchestrator, 'updateDDNS')
    updateDDNSMock.mockResolvedValue({ url: 'test.com', ip: '1.1.1.1', publicIp: '1.0.0.1', updated: false })

    const result = await updateDDNSEntries(input, 'testDestination')
    expect(result).toEqual(expected)
  })

  it('should return an array of UpdateResponses when sms notifications are disabled', async () => {
    process.env.SMS_NOTIFICATIONS = 'false'

    const input = [
      { url: 'test.com', credentials: { username: 'testUsername', password: 'testPassword' } },
      { url: 'test.com', credentials: { username: 'testUsername', password: 'testPassword' } }
    ]

    const expected = [
      { url: 'test.com', ip: '1.1.1.1', publicIp: '1.0.0.1', updated: true },
      { url: 'test.com', ip: '1.1.1.1', publicIp: '1.0.0.1', updated: true }
    ]

    const updateDDNSMock = jest.spyOn(orchestrator, 'updateDDNS')
    updateDDNSMock.mockResolvedValue({ url: 'test.com', ip: '1.1.1.1', publicIp: '1.0.0.1', updated: true })

    const result = await updateDDNSEntries(input, 'testDestination')
    expect(result).toEqual(expected)
  })
})
