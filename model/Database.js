let mysql = require('mysql');

class Database{
    constructor(){
    }
    connect(){
        return mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "25081996",
            database: "QuanLyHS"
        })
    }
}

module.exports = Database;