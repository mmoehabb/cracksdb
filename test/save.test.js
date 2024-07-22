const { StateManager, FileManager } = require('../dist/index.js')
const expect = require('expect.js')

describe("# Saving Cracks Tests:", function() {
  let db = null;
  
  const mockUsesrs = [
    {
      id: "@131234",
      name: "jack",
      age: 20
    },
    {
      id: "@12f34",
      name: "john",
      age: 22
    },
    {
      id: "123Fsad",
      name: "bob",
      age: 35
    },
    {
      id: "@1asd34",
      name: "steve",
      age: 18
    },
    {
      id: "asdf23145",
      name: "Halbirt",
      age: 45
    },
    {
      id: "332151",
      name: "Charly",
      age: 32,
    },
    {
      id: "asdsae213",
      name: "Sara",
      age: 29
    }
  ]

  before(function() {
    db = new StateManager('db', new FileManager({}))
    const users = db.add("users", "userspassword")
    users.extendUnitType({
      id: 'string',
      name: 'string',
      age: 'number'
    })
    for (let user of mockUsesrs) {
      users.add(user)
    }
  })

  after(function() {
    db.delete("users", "userspassword")
  })

  it("should successfully split, seal, and save the last crack", function() {
    expect(db.get('users').len()).to.equal(7)
    // split method will invoke seal and seal will invoke save. 
    // So if split works well, all shall as well.
    db.get('users').split();
    // reload the database
    db = new StateManager('db', new FileManager({}))
    expect(db.get('users').len()).to.equal(3)
    db.get('users').loadOne()
    expect(db.get('users').len()).to.equal(7)
  })
})
