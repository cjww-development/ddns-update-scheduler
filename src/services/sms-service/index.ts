/*
 * Copyright 2021 CJWW Development
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

import AWS from 'aws-sdk'
import { logger } from '../../lib/logger'
AWS.config.update({region: process.env.AWS_REGION});

const sns = new AWS.SNS({apiVersion: '2010-03-31'})

export const sendSmsUpdate = (destination: string, message: string): Promise<string | null | undefined> => {
  const smsMessage = {
    Message: message,
    PhoneNumber: destination,
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID': {'DataType': 'String', 'StringValue': process.env.SMS_ORIGINATOR},
      'AWS.SNS.SMS.SMSType': {'DataType': 'String', 'StringValue': 'Transactional'}
    }
  }

  return sns.publish(smsMessage).promise().then((data) => {
    logger.info(`[sendSmsUpdate] - Sent SMS with messageId ${data.MessageId}`)
    return data.MessageId
  }).catch(err => {
    logger.error(err)
    return null
  })
}
