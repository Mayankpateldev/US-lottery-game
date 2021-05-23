const verifyDate = (date) => {
    if (!date) {
        throw new Error('Please provide date in request.')
    }

    const drawDate = new Date(date)
    if(isNaN(drawDate.getTime())) {
        const message = `Provideed Date ${date} is not in valid format (ISO-8601)`
        throw new Error(message)
    }
}

const verifyPickPowerball = (powerball) => {
    if (!powerball && powerball !== 0) {
        throw new Error('lottery pick must have a powerball')
    }

    if (!Number.isInteger(powerball)) {
        throw new TypeError('lottery pick powerball must be an integer')
    }

    if (powerball < 1 || powerball > 26) {
        throw new Error(
            'lottery pick powerball must be in range [1, 26]'
        )
    }
}

const verifyPickNumber = (lotteryNumber) => {
    if (!Number.isInteger(lotteryNumber)) {
        throw new TypeError(
            'lottery pick numbers must be an array of numbers'
        )
    }

    if (lotteryNumber < 1 || lotteryNumber > 69) {
        throw new Error('lottery pick numbers must be in range [1, 69]')
    }
}

const verifyPick = (pick) => {
    if (!pick.numbers || !Array.isArray(pick.numbers)) {
        throw new Error(
            'an array of lottery pick numbers must be provided'
        )
    }

    if (pick.numbers.length !== 5) {
        throw new Error("lottery pick must have exactly 5 numbers")
    }

    pick.numbers.forEach(verifyPickNumber)
    verifyPickPowerball(pick.powerball)

    const numbers = new Set(pick.numbers)

    if (numbers.size !== pick.numbers.length) {
        throw new Error('lottery pick numbers must not have duplicates')
    }
}

const verifyPicks = (picks) => {
    if (!picks || !Array.isArray(picks)) {
        throw new Error('an array of lottery picks must be provided')
    }

    if (picks.length === 0) {
        throw new Error("lottery must have at least one pick")
    }

    picks.forEach(verifyPick)
}


exports.verifyRequestBody = function (body) {
    const { date, picks } = body

    verifyDate(date)
    verifyPicks(picks)
}