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

import { buildUrlDetails, isUrlDetails } from '../../src/lib/parser'
import { UrlDetails } from '../../src/orchestrator'

describe('buildUrlDetails', () => {
  it('should return an array of UrlDetails', () => {
    const input: string = '[' +
      '{ "url": "test.com", "credentials": { "username": "test", "password": "test" } },' +
      '{ "url": "test.com", "credentials": { "username": "test", "password": "test" } }' +
    ']'

    const expected: UrlDetails[] = [
      { url: 'test.com', credentials: { username: 'test', password: 'test' } },
      { url: 'test.com', credentials: { username: 'test', password: 'test' } },
    ]

    const result = buildUrlDetails(input)
    expect(result).toEqual(expected)
  })

  it('should return an error if passed a completely malformed string', () => {
    const input: string = '[' +
      '{ "ul": "test.com", "credentials": { "urname": "test", "password": "test" } },' +
      '{ "url": "test.com", "credennntials": { "username": "test", "passsssword": "test" } }' +
    ']'

    const expected: UrlDetails[] = []

    const result = buildUrlDetails(input)
    expect(result).toEqual(expected)
  })

  it('should return an error if passed a completely malformed string', () => {
    const input: string = '[}'

    const expected: UrlDetails[] = []

    const result = buildUrlDetails(input)
    expect(result).toEqual(expected)
  })
})

describe('isUrlDetails', () => {
  it('should return true when all objects in the array conform to the UrlDetailsInterface', () => {
    const input = [
      { url: 'test.com', credentials: { username: 'test', password: 'test' } },
      { url: 'test.com', credentials: { username: 'test', password: 'test' } },
    ]

    const result = isUrlDetails(input)
    expect(result).toEqual(true)
  })

  it('should return false when not all objects in the array conform to the UrlDetailsInterface', () => {
    const input = [
      { urllll: 'test.com', credtials: { usernameeee: 'test', password: 'test' } },
      { urrrrrrrrl: 'test.com', credentttttials: { usrname: 'test', passssword: 'test' } },
    ]

    const result = isUrlDetails(input)
    expect(result).toEqual(false)
  })
})
