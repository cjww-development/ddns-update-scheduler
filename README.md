[![Apache-2.0 license](http://img.shields.io/badge/license-Apache-brightgreen.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

ddns-update-scheduler
=====================

Scheduling service to update Google's DDNS service with the current internet connections public IP address.

## Prerequistes
- NodeJS 12.x
- Yarn
- Mongo

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

License
=======
This code is open sourced licensed under the Apache 2.0 License
