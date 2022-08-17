FROM rabbitmq:management-alpine
COPY rabbitmq.config /etc/rabbitmq/rabbitmq.config
COPY definitions.json /opt/definitions.json

