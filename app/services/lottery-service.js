
const { format, isAfter, isFuture, parse}  = require('date-fns')
const axios = require('axios')

const URL = "https://data.ny.gov/resource/d6yy-54nr.json"
const DATE_FORMAT = "YYYY-MM-DD"
const MIN_TIME_STAMP = -8640000000000000


const getDistantPast = () => new Date(MIN_TIME_STAMP)
//stroing data in cache
let cache = new Map()
let latestCached = getDistantPast()
/**
 * This code is use for to fetch data from api
 * @returns api result
 */
exports.getDrawResultFromURL = async function () { 
  const result = await axios.default.get(URL)
  return result.data
}
/**
 * This code is use for update latest draw data from API
 */
exports.updateCache = async function () {
    const fetchedDrawsData = await this.getDrawResultFromURL()

    fetchedDrawsData.forEach((draw) => {
      const drawDate = parse(draw.draw_date)
      const key = format(drawDate, DATE_FORMAT)

      if (isAfter(drawDate, latestCached)) {
        latestCached = drawDate
      }

      const winningNumbers = draw.winning_numbers
        .split(" ")
        .map((str) => +str)

      const value = {
        date: key,
        numbers: new Set(winningNumbers.slice(0, 5)),
        powerball: winningNumbers[5]
      }

      cache.set(key, value)
    })
}
/**
 * This code is use for check if there is 
 * @param {*} date 
 * @returns 
 */
exports.getDraw = async function (date) {
  const hasDate = cache.has(date)
  const inFuture = isFuture(date)
  const afterLatest = isAfter(date, latestCached)
  const shouldRefreshCache = !hasDate && !inFuture && afterLatest
  
  if (shouldRefreshCache) {
    await this.updateCache()
  }

  return cache.get(date)
}
