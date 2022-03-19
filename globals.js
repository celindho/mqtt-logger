function getLogger() {
  const winston = require("winston");
  const { splat, combine, timestamp, printf } = winston.format;

  // meta param is ensured by splat()
  const myFormat = printf(({ timestamp, level, message, meta }) => {
    return `${timestamp};${level};${message};${
      meta ? JSON.stringify(meta) : ""
    }`;
  });

  const logger = winston.createLogger({
    level: "info",
    format: combine(timestamp(), splat(), myFormat),
    transports: [new winston.transports.Console()],
  });
  return logger;
}

function getSettings() {
  const commandLineArgs = require("command-line-args");

  const argsDefinitions = [
    { name: "mqtt_host", alias: "h", type: String, defaultValue: "localhost" },
    { name: "mqtt_port", alias: "p", type: Number, defaultValue: 1883 },
    {
      name: "mqtt_topic_to_log",
      alias: "t",
      type: String,
      defaultValue: "#",
    },
    {
      name: "logging_file",
      alias: "f",
      type: String,
      defaultValue: "./mqtt.log",
    }
  ];

  const args = commandLineArgs(argsDefinitions);

  //override with environment variables if available
  argsDefinitions.forEach((def) => {
    if (process.env[def.name]) {
      args[def.name] = process.env[def.name];
    }
  });

  if(args["mqtt_topic_to_log"]) {
    args["mqtt_topic_to_log"] = args["mqtt_topic_to_log"].split(",");
  }
  

  return args;
}

module.exports = {
  logger: getLogger(),
  settings: getSettings(),
};
