FROM docker

RUN apk add --update nodejs npm
RUN npm install --global yarn
RUN apk add --update python3 py3-pip

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["sh"]