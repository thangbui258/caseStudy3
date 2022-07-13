let mysql = require('mysql');

class Database{
    constructor(){
    }
    // connect(){
    //     return mysql.createConnection({
    //         host: "127.0.0.1",
    //         user: "root",
    //         password: "25081996",
    //         database: "QuanLyHS"
    //     })
    // }
    connect(){
        return mysql.createPool({
            host: "us-cdbr-east-06.cleardb.net",
            user: "b75b1d7dd622a7",
            password: "0e33abea",
            database: "heroku_05f8dfb1bed61es"
        })
    }
}

module.exports = Database;
