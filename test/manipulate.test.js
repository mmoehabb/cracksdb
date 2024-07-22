const { StateManager, FileManager } = require('../dist/index.js')
const expect = require('expect.js')

describe("# Manipulation Tests:", function() {
  let db = null;
  
  before(function() {
    db = new StateManager('db', new FileManager({}))
    const users = db.add("users", "userspassword")

    users.extendUnitType({
      id: 'string',
      name: 'string',
      age: 'number'
    })
    users.setSimul(true)
 })

  after(function() {
    db.delete("users", "userspassword")
  })

  describe("## Adding data units tests:", function() {
    it("should add data units that applies utterly to the unittype of the StateFile", function() {
      const users = db.get('users')
      const userObj = {
        id: "someid",
        name: "john",
        age: 26
      }
      users.add(userObj)
      const addedUser = users.get(0)
      expect(addedUser).to.be.ok()
      expect(addedUser).to.eql(userObj)
    })

    it("should add data units that has more fields upon the ones declared in the unittype", function() {
      const users = db.get('users')
      const userObj = {
        id: "user123",
        name: "Joe",
        age: 30,
        job: "actor"
      }
      users.add(userObj)
      // index 0 as cracksdb unshifts (rather than pushing) added units.
      const addedUser = users.get(0)
      expect(addedUser).to.be.ok()
      expect(addedUser).to.eql(userObj)
    })

    it("shoud add data units although exceeding the limit specified for the crack file, with auto-sealing", function() {
      const users = db.get('users')
      const userObj = {
        id: "newuser",
        name: "Bell",
        age: 22
      }
      
      users.setLimit(2)
      expect(users.len()).to.equal(2)

      users.add(userObj)
      expect(users.len()).to.equal(3)

      db = new StateManager('db', new FileManager({}))
      const reloadedUsers = db.get('users')
      expect(reloadedUsers.len()).to.equal(1)
      expect(reloadedUsers.get(0)).to.eql(userObj)
    })

    it("should NOT add data units with partial appliance to the unittype", function() {
      const users = db.get('users')
      const userObj = {
        name: "Robert"
      }
      expect(users.add).withArgs(userObj).to.throwError()
      expect(users.get(0).name).to.not.equal("Robert")
    })

    it("should NOT add data units with no any appliance to the unittype", function() {
      const users = db.get('users')
      const userObj = {}
      expect(users.add).withArgs(userObj).to.throwError()
      expect(users.get(0)).to.have.property("name")
    })
  })

  describe("## Updating data units tests:", function() {
    it("should update the data unit specified by an index with some new data that the unittype applies to", function() {
      const users = db.get('users')
      const newdata = { age: users.get(2).age + 1 }
      users.update(2, () => newdata)
      expect(users.get(2).age).to.equal(newdata.age)
    })

    it("should NOT update the data unit if the new data doesn't apply to the unittype", function() {
      const users = db.get('users')
      const newdata = { age: users.get(1).age + 1, job: "teacher" }
      expect(users.update).withArgs(1, () => newdata).to.throwError()
      expect(users.get(1).job).to.not.equal(newdata.job)
    })

    it("should throw an error when the index of the data unit is out of bound", function() {
      const users = db.get('users')
      const newdata = { name: "Jeff" }
      expect(users.update).withArgs(-1, () => newdata).to.throwError()
      expect(users.update).withArgs(10, () => newdata).to.throwError()
    })

    it("should update data units that apply to a certian condition", function() {
      const users = db.get('users')
      const before = users.getListWhere(user => user.age < 30)
      const expectedRes = []; for (let _ of before) expectedRes.push(true)

      const newdata_builder = (prev) => ({ age: prev.age + 1 })
      const res = users.updateWhere(user => user.age < 30, newdata_builder)
      const after = users.getListWhere(user => user.age < 30)

      expect(res).to.be.ok()
      expect(res).to.eql(expectedRes)
      expect(before).to.not.eql(after)
      expect(before[0].age).to.be.equal(after[0].age - 1)
    })

    it("should NOT update data units that apply to the condition if the data doesn't apply to the unittype", function() {
      const users = db.get('users')
      const builder = () => ({ job: "" })
      const res = users.updateWhere(() => true, builder)
      expect(res).to.be.ok()
      expect(res).to.be.an('array')
      expect(res.length).to.be.greaterThan(0)
      expect(res).to.not.contain(true)
    })
  })

  describe("## Removing data units tests:", function() {
    it("should remove the data unit specified by an index", function() {
      const users = db.get('users')
      const nextId = users.get(1).id
      users.remove(0)
      expect(users.get(0)).to.be.ok()
      expect(users.get(0).id).to.equal(nextId)
    })

    it("should throw an error in case the index is out of the bounds", function() {
      const users = db.get('users')
      expect(users.remove).withArgs(-1).to.throwError()
      expect(users.remove).withArgs(5).to.throwError()
    })
    
    it("should remove a collection of data units that apply to a condition", function() {
      const users = db.get('users')
      const res = users.removeWhere(() => true)
      expect(res).to.be.ok()
      expect(res).to.be.an('array')
      expect(res).to.not.contain(false)
      expect(users.getListWhere(() => true)).to.have.length(0)
    })
  })
})
