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

import dotenv from 'dotenv'
dotenv.config()

import { agenda } from './jobs'

const jobFrequency: string = process.env.JOB_FREQUENCY || '1 hour'

const startJobs = async () => {
  await agenda.start()
  await agenda.every(jobFrequency, 'update-ddns')
}

startJobs().then(r => console.log('Jobs Started'))