const { StateManager, FileManager } = require('../dist/index.js')
const expect = require('expect.js')

describe("# Arrays (store, retrieve, and manipulate) Tests:", function() {
  let db = null;
  
  const mockUsesrs = [
    {
      id: "asdf23145",
      name: "Halbirt",
      age: 45
    },
  ]

  const mockPosts = [
    {
      id: "H1",
      title: "New Post Title",
      content: "Some long text that doesn't start with lorum!..."
    },
    {
      id: "H2",
      title: "New Post Title 2",
      content: "Some long text that may start with lorum!..."
    },
    {
      id: "H3",
      title: "New Post Title 3",
      content: "Some long text that may or may not... perhabs start with lorum!..."
    }
  ]

  before(function() {
    db = new StateManager('db', new FileManager({}))
    const users = db.add("users", "userspassword")

    users.extendUnitType({
      id: 'string',
      name: 'string',
      age: 'number',
      posts: {
        length: "number",
        id: 'string',
        title: 'string',
        content: 'string'
      }
    })
    
    users.setLimit(3)
  })

  after(function() {
    db.delete("users", "userspassword")
  })

  it("should fail to store a user with no posts array field", function() {
    const users = db.get("users")
    expect(users.add).withArgs(mockUsesrs[0]).to.throwError()
  })

  it("should successfully store user with posts array field", function() {
    const users = db.get("users")
    const usrObj = {
      ...mockUsesrs[0],
      posts: mockPosts
    }
    expect(users.add).withArgs(usrObj).to.be.ok()
    users.add(usrObj)
  })

  it("should successfully retrieve user posts array", function() {
    const users = db.get("users")
    const usr = users.get(0)
    expect(usr.posts).to.be.an("array")
    expect(usr.posts).to.have.length(3)
    expect(usr.posts[0]).to.eql(mockPosts[0])
  })

  it("should NOT update user posts array with invalid data types", function() {
    const users = db.get("users")
    const builder_func = _ => ({posts: [{...mockPosts[0], test: "this should fail"}]})
    expect(users.update).withArgs(0, builder_func).to.throwError()
  })

  it("should update user posts array with new data", function() {
    const users = db.get("users")
    const builder_func = _ => ({posts: mockPosts.slice(0, 2)})
    expect(users.update).withArgs(0, builder_func).to.be.ok()
    users.update(0, builder_func)
    const usr = users.get(0)
    expect(usr.posts).to.be.an("array")
    expect(usr.posts).to.have.length(2)
  })

  it("should successfully extend the type of posts array units", function() {
    const users = db.get("users")
    users.extendUnitType({posts: {test: "string"}})
    const builder_func = _ => ({posts: [{...mockPosts[0], test: "this should work"}]})
    expect(users.update).withArgs(0, builder_func).to.be.ok()
    users.update(0, builder_func)
    const usr = users.get(0)
    expect(usr.posts).to.be.an("array")
    expect(usr.posts).to.have.length(1)
    expect(usr.posts[0].test).to.eql("this should work")
  })
})
