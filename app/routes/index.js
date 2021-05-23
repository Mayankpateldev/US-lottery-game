const express = require('express')
const { root } = require('../controllers/root')
const { notFound } = require('../controllers/notfound')
const { verifyBody, lotteryWinningCalculation } = require('../controllers/lottery')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../docs/swagger.json')

const router = express.Router()

// Routes
router.get('/', root)

router.post("/lottery", verifyBody, lotteryWinningCalculation)

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Fall Through Route
router.use(notFound)

module.exports = router