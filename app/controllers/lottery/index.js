const lotteryService = require('../../services/lottery-service')
const { calculateWinnings } = require('./lottery-calculation')
const { verifyRequestBody } = require("./validation")
 /**
 * 
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function intersection(a, b) {
    var result = new Set()
    a.forEach(function (value) {
        if (b.has(value)) {
            result.add(value)
        }
    })
    return result
}

const getPickWithWinnings = (pick, draw) => {
 
    const matching = intersection(pick.numbers, draw.numbers)
    const matchCount = matching.size

    const doesPowerballMatch = pick.powerball === draw.powerball

    const isJackpot = matchCount === 5 && doesPowerballMatch
    const winnings = calculateWinnings(matchCount, doesPowerballMatch)
    const isWinner = winnings > 0 || isJackpot

    return {
        numbers: [...pick.numbers],
        powerball: pick.powerball,
        isWinner,
        isJackpot,
        winnings
    }
}

const getTicketWithWinnings = (picks, draw) => {
    const newPicks = picks.map(
        (p) => {
            return getPickWithWinnings(p, draw)
        }
    )

    const hasWinner = newPicks.some((p) => p.isWinner)
    const hasJackpot = newPicks.some((p) => p.isJackpot)

    const nonJackpotWinnings = newPicks.reduce(
        (acc, cur) => acc + cur.winnings,
        0
    )

    return {
        date: draw.date,
        hasWinner,
        hasJackpot,
        nonJackpotWinnings,
        picks: newPicks
    }
}

exports.verifyBody = function (req, res, next) {
    try {
        verifyRequestBody(req.body)
    } catch (error) {
        return res.status(422).json({message: error.message})       
    }
    return next()
}

exports.lotteryWinningCalculation = async function (req, res) {
    const { date, picks } = req.body

    const ticket = {
        date,
        picks: picks.map(
            (p) => ({
                numbers: new Set(p.numbers),
                powerball: p.powerball
            })
        )
    }

    const draw = await lotteryService.getDraw(ticket.date)

    if (!draw) {
        console.error(`No draw found for date "${date}"`)
        res.status(404).json(`No draw found for date "${date}"`)
    } else {
        const ResTicket = getTicketWithWinnings(ticket.picks, draw)
        res.status(200).json(ResTicket)
    }
}

