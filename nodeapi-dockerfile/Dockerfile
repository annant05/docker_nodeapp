# our base image
FROM alpine:3.10

RUN apk update 
# install nodejs LTS
RUN apk add iputils nodejs vim
RUN mkdir /home/nodeappfiles

# install Python modules needed by the Python app
ADD finalnodeapp.tar.gz /home/nodeappfiles
# RUN pip install --no-cache-dir -r /usr/src/app/requirements.txt

# copy files required for the app to run
# COPY app.py /usr/src/app/
# COPY templates/index.html /usr/src/app/templates/

# tell the port number the container should expose
EXPOSE 8039

# run the application
CMD ["node","/home/nodeappfiles/app.js"]