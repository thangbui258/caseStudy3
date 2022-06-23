let Database = require('./Database');
let db = new Database()


class UserModel {
    constructor() {
        this.con = db.connect();
    }

    checkAcount(email, password) {
        return new Promise((resolve, reject) => {
            let sql = `select Name, Roll from UserLogin where Email = '${email}' and Pass = '${password}'`;
            this.con.query(sql, (err, result) => {
                if (err) {
                    reject(err.message);
                }
                resolve(result)
            })
        })
    }

    showDataBase() {
        return new Promise(((resolve, reject) => {
            let sql = `SELECT * FROM QuanLyHocSinh.DanhSachHS;`
            this.con.query(sql, (err, result) => {
                if (err) {
                    reject(err.message)
                }
                resolve(result)
            })

        }))
    }
}

module.exports = UserModel;
