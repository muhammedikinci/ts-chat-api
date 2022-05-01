var db = connect("mongodb://chatapi:chatapi@localhost:27017/admin");

db = db.getSiblingDB('chatapp'); // we can not use "use" statement here to switch db

db.createUser(
    {
        user: "admin",
        pwd: "12356",
        roles: [ { role: "readWrite", db: "chatapp"} ],
        passwordDigestor: "server",
    }
)