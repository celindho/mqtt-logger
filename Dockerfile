FROM arm32v7/node:14.19.0

RUN apt-get update \
    && apt-get upgrade -y

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

ENV logging_file=/data/mqtt.log

COPY *.js ./

CMD ["node", "index.js"]
