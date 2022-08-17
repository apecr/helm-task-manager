FROM node:12.16.1

WORKDIR /app

# install wait-for-it
RUN curl https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o /usr/bin/wait-for-it.sh
RUN chmod +x /usr/bin/wait-for-it.sh

COPY /app/server/package.json .
COPY /app/server/package-lock.json .

RUN npm ci


COPY /app/server/ .

#Docker will execute the given command directly, without involving a shell (no variable expansion)
#https://stackoverflow.com/questions/40454470/how-can-i-use-a-variable-inside-a-dockerfile-cmd
CMD ["sh","-c","wait-for-it.sh $RABBITMQ_SERVER:5672 -s -t 45 -- wait-for-it.sh $MONGO_SERVER:27017 -s -t 45 -- node src/server.js"]