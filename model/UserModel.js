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

    showDB() {
        return new Promise(((resolve, reject) => {
            let sql = `SELECT * FROM DanhSachHS;`
            this.con.query(sql, (err, result) => {
                if (err) {
                    reject(err.message)
                }
                resolve(result)
            })

        }))
    }

    showDBketQua(id){
        return new Promise(((resolve, reject) => {
            let sql = `select DanhSachHS.Name, KetQua.ID_HS, KetQua.Score
                        from KetQua
                        inner join DanhSachHS on KetQua.ID_HS = DanhSachHS.ID_HS 
                        where KetQua.ID_HS = '${id}';`
            this.con.query(sql, (err, result) => {
                if (err) {
                    reject(err.message)
                }
                resolve(result)
            })

        }))
    }

    insertDBdanhSachHS(name, email, phone) {
        return new Promise((resolve, reject) => {
            let sql = `insert into DanhSachHS (Name,Email,Phone) values ('${name}','${email}','${phone}');`
            this.con.query(sql, (err, result) => {
                if (err) {
                    reject(err.message)
                }
                resolve()
            })
        })
    }

    insertDBketQua(ID_HS, DToan, DVan, DAnh) {
        return new Promise((resolve, reject) => {
            let sql = `insert into KetQua (ID_HS,ID_subject,Score) values ('${ID_HS}',1,'${DToan}'),('${ID_HS}',2,'${DVan}'),('${ID_HS}',3,'${DAnh}')`;
            this.con.query(sql, (err, result) => {
                if (err) {
                    reject(err.message)
                }
                resolve()
            })
        })
    }

    editDBketQua(DToan,DVan,DAnh,ID_HS){
        return new Promise((resolve, reject)=>{
            let sql = `call update_Score(${DToan},${DVan},${DAnh},${ID_HS})`
            this.con.query(sql, (err, result) => {
                if (err) {
                    reject(err.message)
                }
                resolve()
            })
        })
    }

    findDB(tableName, field, nameFind) {
        return new Promise(((resolve, reject) => {
            let sql = `SELECT * FROM ${tableName} WHERE ${field} = '${nameFind}';`;
            this.con.query(sql, (err, result) => {
                if (err) {
                    reject(err.message);
                }
                resolve(result)
            })
        }))
    }

    deleteDBdanhSachHS(id) {
        return new Promise((resolve, reject) => {
            let sql = `CALL delete_list_student(${id});`
            this.con.query(sql, (err, result) => {
                if (err) {
                    reject(err.message);
                }
                resolve()
            })
        })
    }

    DBlistGeneral() {
        return new Promise((resolve, reject) => {
            let sql = `select DanhSachHS.ID_HS, DanhSachHS.Name, Subject.Subject, KetQua.Score
                   from KetQua
                   inner join DanhSachHS on KetQua.ID_HS = DanhSachHS.ID_HS
                   inner join Subject on KetQua.ID_subject = Subject.ID_subject;`

            this.con.query(sql, (err, result) => {
                if (err) {
                    reject(err.message);
                }
                resolve(result);
            })
        })
    }


}

module.exports = UserModel;
