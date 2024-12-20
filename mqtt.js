"use strict";
const mqtt = require("mqtt");

const logger = require("./globals").logger;

var mqtt_client;

function publish(topic, message, options) {
  mqtt_client.publish(topic, message, options);
}

function publishRetain(topic, message) {
  mqtt_client.publish(topic, message, { retain: true });
}

function subscribe(topic) {
  logger.info(`Subscribing to topic(s) '${topic}'.`);
  mqtt_client.subscribe(topic)
}

function registerListener(messageCallback) {
  mqtt_client.on("message", messageCallback);
}

function createMqttClient(mqtt_host, mqtt_port) {
  if (!mqtt_client) {
    logger.info("MQTT connecting to %s:%d.", mqtt_host, mqtt_port);
    mqtt_client = mqtt.connect({
      host: mqtt_host,
      port: mqtt_port,
      connectTimeout: 60 * 1000,
      clientId: "ruuvi2mqtt_" + Math.floor(Math.random() * 1000),
    });
    mqtt_client.on("connect", () => {
      logger.info("MQTT connected to. %s:%d.", mqtt_host, mqtt_port);
    });
    mqtt_client.on("error", (e) => {
      logger.error("MQTT Error, exiting program: ", e.message);
      process.exit(1);
    });
  }
}

module.exports = function (mqtt_host, mqtt_port) {
  createMqttClient(mqtt_host, mqtt_port)
  return {
    publish: publish,
    publishRetain: publishRetain,
    subscribe: subscribe,
    registerListener: registerListener
  };
};
