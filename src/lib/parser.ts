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

import { UrlDetails } from '../orchestrator'

export const isUrlDetails = (arg: any[]): arg is UrlDetails[] => {
  return arg.map(obj => {
    return obj
      && obj.url && typeof(obj.url) == 'string'
      && obj.credentials.username && typeof(obj.credentials.username) == 'string'
      && obj.credentials.password && typeof(obj.credentials.password) == 'string'
  }).every(bool => bool === true)
}

export const buildUrlDetails = (envValue: string): UrlDetails[] => {
  try {
    const jsonObj = JSON.parse(envValue)
    isUrlDetails(jsonObj)
    return jsonObj
  } catch {
    return []
  }
}
