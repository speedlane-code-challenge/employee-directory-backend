const dotenv = require("dotenv");

module.exports = async ({ options, resolveConfigurationProperty }) => {
  const envVars = dotenv.config({
    path: `.env.${process.env.NODE_ENV}`,
  }).parsed;
  return Object.assign({}, envVars);
};