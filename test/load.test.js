const { StateManager, FileManager } = require('../dist/index.js')
const expect = require('expect.js')

describe("# Loading Cracks Tests:", function() {
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
    users.setLimit(3)
    for (let user of mockUsesrs) {
      users.add(user)
    }
    // reload the database so that only one crack is loaded from users
    db = new StateManager('db', new FileManager({}))
  })

  after(function() {
    db.delete("users", "userspassword")
  })

  it("should successfully load one crack", function() {
    const users = db.get('users')
    expect(users.len()).to.equal((mockUsesrs.length % 3))
    users.loadOne()
    expect(users.len()).to.equal((mockUsesrs.length % 3) + 3)
  })

  it("should successfully unload one crack", function() {
    const users = db.get('users')
    expect(users.len()).to.equal((mockUsesrs.length % 3) + 3)
    users.unloadOne()
    expect(users.len()).to.equal((mockUsesrs.length % 3))
  })

  it("should successfully load all cracks at once", function() {
    const users = db.get('users')
    expect(users.len()).to.equal((mockUsesrs.length % 3))
    users.loadAll()
    expect(users.len()).to.equal((mockUsesrs.length))
  })
})
