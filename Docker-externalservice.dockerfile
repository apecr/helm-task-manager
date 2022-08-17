FROM node:12.16.1

WORKDIR /app

COPY /app/externalservice/package.json .
COPY /app/externalservice/package-lock.json .

# install wait-for-it
RUN curl https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o /usr/bin/wait-for-it.sh
RUN chmod +x /usr/bin/wait-for-it.sh

RUN npm ci


COPY /app/externalservice/ .

ENTRYPOINT ["node", "src/server.js" ]

