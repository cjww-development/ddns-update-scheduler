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

const axios = require('axios')
const { getPublicIP } = require('../../src/services/ip-service')

jest.mock('axios')

describe('getPublicIP', () => {
  it('should return the public IP for the current connection', async () => {
    const mockedData = { data: { ip: '127.0.0.1' } }
    axios.get.mockImplementationOnce(() => Promise.resolve(mockedData))

    const result = await getPublicIP()

    expect(result).toEqual('127.0.0.1')
  })

  it('should return an err is there was a problem getting the public IP', async () => {
    const mockedData = new Error()
    axios.get.mockImplementationOnce(() => Promise.reject(mockedData))
    let thrownError;

    try {
      await getPublicIP()
    }
    catch(error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(mockedData)
  })
})
