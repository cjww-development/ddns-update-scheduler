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

import {AWSError, SNS} from 'aws-sdk'
import { sendSmsUpdate } from '../../src/services/sms-service'

jest.mock('aws-sdk', () => {
  const mSNS = {
    publish: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return { SNS: jest.fn(() => mSNS) };
});

describe('sendSmsUpdate', () => {
  // @ts-ignore
  let sns
  beforeEach(() => {
    sns = new SNS();
  })
  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should return a MessageId', async () => {
    const mockedResponseData = {
      MessageId: 'testId'
    };

    // @ts-ignore
    sns.publish().promise.mockResolvedValueOnce(mockedResponseData);

    const result = await sendSmsUpdate('testDestination', 'Test message string')
    expect(result).toEqual('testId')
  })

  it('should return a MessageId', async () => {
    const mockedAWSError: AWSError = {
      code: "333",
      message: "error",
      name: "testName",
      time: new Date()
    };

    // @ts-ignore
    sns.publish().promise.mockRejectedValueOnce(mockedAWSError);

    const result = await sendSmsUpdate('testDestination', 'Test message string')
    expect(result).toEqual(null)
  })
})
