# our base image
FROM mysql:8.0

COPY ./userdb.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
