const { StateManager, FileManager } = require('../dist/index.js')
const expect = require('expect.js')

describe("# Retrieve Tests:", function() {
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
  ]

  const mockPosts = [
    {
      id: "H1",
      user_id: "asdf23145",
      title: "New Post Title",
      content: "Some long text that doesn't start with lorum!..."
    },
    {
      id: "H2",
      user_id: "asdf23145",
      title: "New Post Title 2",
      content: "Some long text that may start with lorum!..."
    },
    {
      id: "H3",
      user_id: "asdf23145",
      title: "New Post Title 3",
      content: "Some long text that may or may not... perhabs start with lorum!..."
    },
    {
      id: "S1",
      user_id: "@1asd34",
      title: "Some Title",
      content: "Some long text that doesn't start with lorum!..."
    },
    {
      id: "S2",
      user_id: "@1asd34",
      title: "Facny Title",
      content: "Some long text that doesn't start with lorum!..."
    },
    {
      id: "B1",
      user_id: "123Fsad",
      title: "Hahaha",
      content: "Some long text that doesn't start with lorum!..."
    },
    {
      id: "J1",
      user_id: "@12f34",
      title: "Nothing",
      content: "Nothing to be done... nothing to say... just leave yourself to the..."
    }
  ]

  before(function() {
    db = new StateManager('db', new FileManager({}))
    const users = db.add("users", "userspassword")
    const posts = db.add("posts", "postspassword")

    users.extendUnitType({
      id: 'string',
      name: 'string',
      age: 'number'
    })

    posts.extendUnitType({
      id: 'string',
      user_id: 'string',
      title: 'string',
      contect: 'string'
    })
    
    users.setLimit(3)
    posts.setLimit(3)

    for (let user of mockUsesrs) {
      users.add(user)
    }

    for (let post of mockPosts) {
      posts.add(post)
    }
  })

  after(function() {
    db.delete("users", "userspassword")
    db.delete("posts", "postspassword")
  })

  describe("## Retrieving certian data units tests:", function() {
    it("should retrieve data unit with its index.", function() {
      const users = db.get("users")
      const user = users.get(0)
      expect(user).to.be.ok()
      expect(user).to.eql(mockUsesrs[4])
    })

    it("should retrieve data unit with index exceeding the limit.", function() {
      const users = db.get("users")
      const user = users.get(4)
      expect(user).to.be.ok()
      expect(user).to.eql(mockUsesrs[0])
    })

    it("should retrieve a data unit that applies to certain condition.", function() {
      const users = db.get("users")
      const user = users.getWhere(obj => obj.name === "bob")
      expect(user).to.be.ok()
      expect(user).to.eql(mockUsesrs[2])
    })

    it("should only retrieve the first user that applies to the condition.", function() {
      const users = db.get("users")
      const user = users.getWhere(obj => obj.age <= 20)
      expect(user).to.be.ok()
      expect(user).to.eql(mockUsesrs[3])
    })
    
  })

  describe("## Retrieving collection of data units tests:", function() {
    it("should retrieve list of data units within two indexes.", function() {
      const users = db.get("users")
      const usersList = users.getList(1, 3)
      expect(usersList).to.be.ok()
      expect(usersList).to.eql([mockUsesrs[3], mockUsesrs[2]])
    })

    it("should retrieve list of all data units when the index exceeds the boundary.", function() {
      const users = db.get("users")
      const usersList = users.getList(0, 100)
      expect(usersList).to.be.ok()
      expect(usersList).to.eql(mockUsesrs.reverse())
    })
    
    it("should retrieve list of indexes of data units that apply to a condition.", function() {
      const users = db.get("users")
      const user = users.getIndexOf(obj => obj.age <= 20)
      expect(user).to.be.ok()
      expect(user).to.eql([1, 4])
    })

    it("should retrieve list of data units that apply to a condition.", function() {
      const users = db.get("users")
      const posts = db.get("posts")
      const userId = users.getWhere(obj => obj.name === "Halbirt").id
      const postsList = posts.getListWhere(obj => obj.user_id === userId)
      expect(postsList).to.be.ok()
      expect(postsList).to.have.length(3)
      expect(postsList).to.eql(mockPosts.slice(0, 3).reverse())
    })
  })
})
