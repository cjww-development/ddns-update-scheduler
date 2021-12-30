[![Apache-2.0 license](http://img.shields.io/badge/license-Apache-brightgreen.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

ddns-update-scheduler
=====================

Scheduling service to update Google's DDNS service with the current internet connections public IP address.

## Prerequistes
- NodeJS 12.x
- Yarn
- Mongo

## Environment variables
| Variable              | Description                                                                                                                                                           |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AWS_REGION            | AWS Region you will be sending SMS messages from                                                                                                                      |
| AWS_ACCESS_KEY_ID     | AWS access key for the IAM user sending SMS messages                                                                                                                  |
| AWS_SECRET_ACCESS_KEY | AWS secret key for the IAM user sending SMS messages                                                                                                                  |
| JOB_NAME              | Name of DDNS update job                                                                                                                                               |
| JOB_FREQUENCY         | How often a check and update should (Set at 15 mins in the docker compose)                                                                                            |
| MONGO_URL             | The url for MongoDB where agenda is managed. Format is `mongodb://<MONGO HOST>/agenda`                                                                                |
| SERVER_SETTINGS       | The urls and required credentials for updating its DDNS entry. Should be in the format `[ { url: string, credentials: { username: string, password: string } }, ... ]` |
| SMS_NOTIFICATIONS     | Should SMS Updates be sent? true/false (variables below this can be omitted if this is true)                                                                          |
| SMS_DESTINATION       | What phone number to send SMS update to (only tested with UK phone number so far)                                                                                     |
| SMS_ORIGINATOR        | Where the SMS update says it comes from                                                                                                                               |
| INITIAL_MESSAGE       | The message that's sent out when booting                                                                                                                              |
                 
These variables should be edited in the `docker-compose.yml` file.
         
## SMS Updates
To send SMS updates you will require an AWS Account as this service sends SMS messages via AWS SNS (Simple Notification Service).
You will need to create an IAM user with the following IAM permissions and configure this service with that users access key and secret key.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DDNSUpdater",
            "Effect": "Allow",
            "Action": "sns:Publish",
            "Resource": "*"
        }
    ]
}
```

## How to run
Run a mongo instance in docker
```shell script
docker run -d -v ~/data:/data/db --network host mongo
```

Install dependencies
```shell script
yarn install
```

Run in development mode with nodemon
````shell script
yarn dev
````

Build typescript into the dist dir
```shell script
yarn build
```

Run from dist
```shell script
yarn start
```

Run the tests
```shell script
yarn test
```

## Dockerising
First build the docker image
```shell script
docker build -t cjww-development/ddns-update-scheduler .
```

Boot up mongo and ddns-update-scheduler with the compose file
```shell script
docker-compose up -d
```

## Building with Jenkins
This repositories build can be automated using Jenkins. The included Jenkinsfile can automate the build. The Jenkinsfile uses a docker build agent to package the builds dependencies. This agent need to be built prior to running. On the jenkins host build the agent image by running
```shell
cd jenkins-agent
docker build --rm -t docker-in-docker-nodejs .
```

License
=======
This code is open sourced licensed under the Apache 2.0 License
