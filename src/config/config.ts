import "dotenv/config";

const isTestEnvironment = process.env.NODE_ENV === "test";

export default {
  environment: process.env.NODE_ENV || "development",
  port:
    (isTestEnvironment ? process.env.TEST_APP_PORT : process.env.APP_PORT) ||
    "6060",
  auth: {
    secretKey: process.env.JWT_SECRET_KEY || "4C31F7EFD6857D91E729165510520424",
    adminSecretKey:
      process.env.ADMIN_JWT_SECRET_KEY || "4C31F7EFD6857D91E729165510520424"
  },
  db: {
    hostUrl: isTestEnvironment
      ? process.env.TEST_MONGODB_URL
      : process.env.MONGODB_URL
  },
  superAdmin: {
    username: process.env.ADMIN_USERNAME || "qiuzhi99",
    password: process.env.ADMIN_PASSWORD || "12345678"
  },
  basicAdmin: {
    username: process.env.ADMIN_USERNAME || "hfpp2012",
    password: process.env.ADMIN_PASSWORD || "12345678"
  },
  logging: {
    dir: process.env.LOGGING_DIR || "logs",
    level: process.env.LOGGING_LEVEL || "debug"
  }
};