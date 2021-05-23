exports.calculateWinnings = function (matchCount, doesPowerballMatch) {
    switch (matchCount) {
        case 0:
        case 1:
            return doesPowerballMatch ? 4 : 0
        case 2:
            return doesPowerballMatch ? 7 : 0
        case 3:
            return doesPowerballMatch ? 100 : 7
        case 4:
            return doesPowerballMatch ? 50000 : 100
        case 5:
            return doesPowerballMatch ? 0 : 1000000
        default:
            return 0
    }
}
