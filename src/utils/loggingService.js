import bunyan from "bunyan";

const streams = [];
const name = `TALK-APP-${process.env.ENV || ""}`.toUpperCase();

if (process.env.ENV === "production") {
  streams.push({
    stream: process.stdout,
    level: "debug",
  });
} else {
  streams.push({
    stream: process.stdout,
    level: "debug",
  });
}

export default bunyan.createLogger({
  name,
  streams,
  serializers: bunyan.stdSerializers,
});
