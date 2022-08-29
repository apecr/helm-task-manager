FROM maven:3.6.3-jdk-8-slim as builder

WORKDIR /src

#cache packages
COPY ./app/worker/pom.xml .
COPY ./app/worker/src/main/proto ./src/main/proto/
RUN mvn verify clean --fail-never 

#package
COPY ./app/worker/src/ ./src/
COPY ./app/worker/pom.xml .

RUN mvn -o package

# ARG JAR_FILE=target/*.jar
# COPY ${JAR_FILE} app.jar
# ENTRYPOINT ["java","-jar","/app.jar"]

#run image
FROM openjdk:8-jre

#install wait-for-it
RUN curl https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o /usr/bin/wait-for-it.sh
RUN chmod +x /usr/bin/wait-for-it.sh

WORKDIR /app
COPY --from=builder ./src/target/*.jar .
CMD java -jar p3-worker-0.0.2-SNAPSHOT.jar
