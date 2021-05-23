const { root } = require('../../../app/controllers/root')
const { notFound } = require('../../../app/controllers/notfound')
const request = require('supertest')
const app  = require('../../../app/app')

test('Hello World Controller', () => {
  const res = { json: jest.fn() }
  root({}, res)
  expect(res.json.mock.calls[0][0]).toEqual({ message: "Hello World" })
})

test('Not Found Route', () => {
  expect(notFound).toThrow("Route Not Found")
})

const validTicket = {
  date: "2010-02-03",
  picks: [
    {
      numbers: [17, 22, 36, 37, 52],
      powerball: 1
    }
  ]
}

test('without a date', async () => {
    const response = await request(app)
    .post("/lottery")
    .send({
      ...validTicket,
      date: undefined
    })
  expect(response.status).toBe(422)
  expect(response.body.message).toBe('Please provide date in request.')
})

test('without a picks', async () => {
    const response = await request(app)
    .post("/lottery")
    .send({
      ...validTicket,
      picks: undefined
    })

  expect(response.status).toBe(422)
  expect(response.body.message).toBe('an array of lottery picks must be provided')
})

test('with non array pick', async () => {
    const response = await request(app)
    .post("/lottery")
    .send({
      ...validTicket,
      picks: "No Data"
    })

  expect(response.status).toBe(422)
  expect(response.body.message).toBe('an array of lottery picks must be provided')
})

test('with empty picks', async () => {
    const response = await request(app)
    .post("/lottery")
    .send({
      ...validTicket,
      picks: "No Data"
    })
  expect(response.status).toBe(422)
  expect(response.body.message).toBe('an array of lottery picks must be provided')
})

test('with a pick with missing numbers', async () => {
    const response = await request(app)
    .post("/lottery")
    .send({
      ...validTicket,
      picks: [
        ...validTicket.picks,
        {
          powerball: 2
        }
      ]
    })

  expect(response.status).toBe(422)
  expect(response.body.message).toBe('an array of lottery pick numbers must be provided')
})

test('with a pick without a powerball', async () => {
    const response = await request(app)
    .post("/lottery")
    .send({
      ...validTicket,
      picks: [
        ...validTicket.picks,
        {
          numbers: [3, 5, 1, 25, 9]
        }
      ]
    })

  expect(response.status).toBe(422)
  expect(response.body.message).toBe('lottery pick must have a powerball')
})

test('with a pick with non array numbers', async () => {
    const response = await request(app)
    .post("/lottery")
    .send({
      ...validTicket,
      picks: [
        ...validTicket.picks,
        {
          numbers: "No Data",
          powerball: 5
        }
      ]
    })

  expect(response.status).toBe(422)
  expect(response.body.message).toBe('an array of lottery pick numbers must be provided')
})

test('with a pick with non-number powerball', async () => {
    const response = await request(app)
    .post("/lottery")
    .send({
      ...validTicket,
      picks: [
        ...validTicket.picks,
        {
            numbers: [5, 26, 19, 2, 9],
            powerball: "No Number"
        }
      ]
    })

  expect(response.status).toBe(422)
  expect(response.body.message).toBe('lottery pick powerball must be an integer')
})

test('with a pick with non-number numbers', async () => {
    const response = await request(app)
    .post("/lottery")
    .send({
      ...validTicket,
      picks: [
        ...validTicket.picks,
        {
            numbers: [5, 26, 19, 2, "20"],
            powerball: 9
        }
      ]
    })

  expect(response.status).toBe(422)
  expect(response.body.message).toBe('lottery pick numbers must be an array of numbers')
})

test('with a pick with too many numbers', async () => {
  const response = await request(app)
  .post("/lottery")
  .send({
    ...validTicket,
    picks: [
      ...validTicket.picks,
      {
          numbers: [5, 26, 19, 2, 24,21],
          powerball: 9
      }
    ]
  })
expect(response.status).toBe(422)
expect(response.body.message).toBe('lottery pick must have exactly 5 numbers')
})

test('with a pick with not enough numbers', async () => {
  const response = await request(app)
  .post("/lottery")
  .send({
    ...validTicket,
    picks: [
      ...validTicket.picks,
      {
          numbers: [5, 26, 19, 2],
          powerball: 9
      }
    ]
  })
expect(response.status).toBe(422)
expect(response.body.message).toBe('lottery pick must have exactly 5 numbers')
})

test('with a pick with numbers duplicates', async () => {
  const response = await request(app)
  .post("/lottery")
  .send({
    ...validTicket,
    picks: [
      ...validTicket.picks,
      {
          numbers: [5, 5, 19, 2,23],
          powerball: 9
      }
    ]
  })
expect(response.status).toBe(422)
expect(response.body.message).toBe('lottery pick numbers must not have duplicates')
})

test('with a pick number less than 1', async () => {
  const response = await request(app)
  .post("/lottery")
  .send({
    ...validTicket,
    picks: [
      ...validTicket.picks,
      {
          numbers: [0, 1, 2, 3, 4],
          powerball: 9
      }
    ]
  })
expect(response.status).toBe(422)
expect(response.body.message).toBe('lottery pick numbers must be in range [1, 69]')
})

test('with a pick number greater than 69', async () => {
  const response = await request(app)
  .post("/lottery")
  .send({
    ...validTicket,
    picks: [
      ...validTicket.picks,
      {
          numbers: [70, 21, 12, 13, 14],
          powerball: 9
      }
    ]
  })
expect(response.status).toBe(422)
expect(response.body.message).toBe('lottery pick numbers must be in range [1, 69]')
})

test('with a pick powerball less than 1', async () => {
  const response = await request(app)
  .post("/lottery")
  .send({
    ...validTicket,
    picks: [
      ...validTicket.picks,
      {
          numbers: [2, 21, 12, 13, 14],
          powerball: 0
      }
    ]
  })
expect(response.status).toBe(422)
expect(response.body.message).toBe('lottery pick powerball must be in range [1, 26]')
})

test('with a pick powerball greater than 26', async () => {
  const response = await request(app)
  .post("/lottery")
  .send({
    ...validTicket,
    picks: [
      ...validTicket.picks,
      {
          numbers: [2, 21, 12, 13, 14],
          powerball: 67
      }
    ]
  })
expect(response.status).toBe(422)
expect(response.body.message).toBe('lottery pick powerball must be in range [1, 26]')
})

test('with an invalid date', async () => {
  const response = await request(app)
  .post("/lottery")
  .send({
    ...validTicket,
    date: "not a date"
  })
expect(response.status).toBe(422)
expect(response.body.message).toBe('Provideed Date not a date is not in valid format (ISO-8601)')
})