const dotenv = require('dotenv')
dotenv.config()
const result = dotenv.config()
if (result.error) {
  throw result.error
}
const { parsed: envs } = result

module.exports = {
  url: envs.URL,
  date_format: envs.DATE_FORMAT,
  min_time_stmp: envs.MIN_TIME_STAMP
}