const { createPerson } = require('../index.logic')
const { deletePerson } = require('../index.logic')
const { updatePerson } = require('../index.logic')

describe('createPerson', function() {
  it('create', function() {
    assert.equal(createPerson('78', 'xxxx', 'xxxx', '1').length, 1)
  })
  it('create', function() {
    assert.equal(createPerson('25', 'aaaa', 'aaaa', '7').length, 2)
  })
  it('create', function() {
    assert.equal(createPerson('5', 'ttt', 'uuu', '12').length, 3)
  })
  it('create', function() {
    assert.equal(createPerson('35', 'ttt', 'uuu', '12').length, 4)
  })
})

describe('updatePerson', function() {
  it('update', function() {
    assert.deepEqual(updatePerson('78', 'aaaa', 'bbbb', '78'), {
      id: '78',
      firstname: 'aaaa',
      lastname: 'bbbb',
      age: '78',
    })
  })
  it('update', function() {
    assert.deepEqual(updatePerson('35', 'aaaa', 'bbbb', '78'), {
      id: '35',
      firstname: 'aaaa',
      lastname: 'bbbb',
      age: '78',
    })
  })
  it('update', function() {
    assert.deepEqual(updatePerson('78', 'q', 'w', '20'), {
      id: '78',
      firstname: 'q',
      lastname: 'w',
      age: '20',
    })
  })
})

describe('deletePerson', function() {
  it('delete', function() {
    assert.equal(deletePerson('78').length, 3)
  })
  it('delete', function() {
    assert.equal(deletePerson('5').length, 2)
  })
  it('delete', function() {
    assert.equal(deletePerson('25').length, 1)
  })
})
