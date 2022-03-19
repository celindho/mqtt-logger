"use strict";

const { logger, settings } = require("./globals");


const mqtt = require("./mqtt")(settings.mqtt_host, settings.mqtt_port);

function getFileWriter(filename){
  const winston = require("winston");
  const { splat, combine, timestamp, printf } = winston.format;

  // meta param is ensured by splat()
  const myFormat = printf(({ timestamp, level, message, meta }) => {
    return `${timestamp}\t${message}`;
  });

  const fileWriter = winston.createLogger({
    level: 'debug',
    format: combine(timestamp(), splat(), myFormat),
    transports: [
        new winston.transports.File({ filename: filename, maxsize: 10*1024*1024})
    ],
  });

  return fileWriter;
}

const fileWriter = getFileWriter(settings.logging_file)

logger.info("Starting the MQTT logger.");
logger.info("Settings: " + JSON.stringify(settings));

function logListener(topic, payload, packet){
  fileWriter.debug(`${topic}${packet.retain ? ' [R]': ''}\t${payload}\t`);
}

mqtt.registerListener(logListener);
mqtt.subscribe(settings.mqtt_topic_to_log);