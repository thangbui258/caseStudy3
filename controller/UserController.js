let fs = require('fs');
let qs = require('qs');
let cookie = require('cookie')
let UserModel = require('../model/UserModel')
let url = require('url');

class UserController {
    constructor() {
        this.userModel = new UserModel();
    }

    showPage(req, res, pathFile) {
        fs.readFile(pathFile, 'utf-8', (err, data) => {
            if (err) {
                throw new Error(err.message);
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            }
        })
    }

    login(req, res) {
        if (req.method === 'GET') {
            let cookies = (cookie.parse(req.headers.cookie || ''))
            let nameCookie = '';
            if (cookies.cookie_user) {
                nameCookie = (JSON.parse(cookies.cookie_user)).session_name_file
                fs.exists('./session/' + nameCookie + '.txt', (exists) => {
                    if (exists) {
                        fs.readFile('./session/' + nameCookie + '.txt', 'utf-8',(err, data) => {
                            if(JSON.parse(data).data_user_login.Roll === 'admin'){
                                res.writeHead(301, {location: '/trangchuAdmin'});
                            } else{
                                res.writeHead(301, {location: '/trangchuMember'});
                            }
                            res.end();
                        })
                    } else {
                        this.showPage(req, res, './views/login.html')
                    }
                });

            } else {

                this.showPage(req, res, './views/login.html')
            }

        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk
            });
            req.on('end', () => {
                let Data = qs.parse(data);
                this.userModel.checkAcount(Data.email, Data.pass).then(result => {
                    if (result.length > 0) {
                        //tao luu file session
                        let nameFile = Date.now();
                        //tao session login
                        let sessionLogin = {
                            'session_name_file': nameFile,
                            'data_user_login': result[0]
                        };
                        //ghi file
                        fs.writeFile('./session/' + nameFile + '.txt', JSON.stringify(sessionLogin), err => {
                            if (err) {
                                throw new Error(err.message);
                            }
                        })
                        //tao cookie
                        let cookieLogin = {
                            'session_name_file': nameFile
                        }
                        res.setHeader('Set-Cookie', cookie.serialize('cookie_user', JSON.stringify(cookieLogin)));
                        if (result[0].Roll === 'admin') {
                            res.writeHead(301, {location: '/trangchuAdmin'})
                        } else if (result[0].Roll === 'member') {
                            res.writeHead(301, {location: '/trangchuMember'})
                        }
                        res.end();

                    } else {
                        fs.readFile('./views/login.html', 'utf-8', (err, data) => {
                            if (err) {
                                throw new Error(err.message);
                            } else {
                                res.writeHead(200, {'Content-Type': 'text/html'});
                                data = data.replace('hidden', '')
                                res.write(data);
                                res.end();
                            }
                        })
                    }
                })

            })
        }
    }

    outLogin(req, res) {
        // let urlPath = url.parse(req.url,true).pathname;
        let cookies = (cookie.parse(req.headers.cookie || ''))
        let nameCookie = (JSON.parse(cookies.cookie_user)).session_name_file
        fs.unlink('./session/' + nameCookie + '.txt', err => {
            if (err) {
                throw new Error(err.message);
            }
            nameCookie = "";
        });
        res.writeHead(301, {location: '/login'});
        return res.end();
    }

    showPageTrangchuAdmin(req, res) {
        this.userModel.showDB().then(result => {
            let cookies = (cookie.parse(req.headers.cookie || ''))
            let nameCookie = '';
            if (cookies.cookie_user) {
                nameCookie = (JSON.parse(cookies.cookie_user)).session_name_file
                fs.exists('./session/' + nameCookie + '.txt', (exists) => {
                    if (exists) {
                        fs.readFile('./views/trangchuAdmin.html', 'utf-8', (err, data) => {
                            if (err) {
                                throw new Error(err.message);
                            } else {
                                let table = '';
                                result.forEach((item) => {
                                    table += `<tr>`
                                    table += `<td>${item.ID_HS}</td>`
                                    table += `<td>${item.Name}</td>`
                                    table += `<td>${item.Email}</td>`
                                    table += `<td>${item.Phone}</td>`
                                    table += `<td><a href="/addScore?id=${item.ID_HS}">Add Score</a></td>`
                                    table += `<td><a href="/deleteliststudent?id=${item.ID_HS}">Delete</a></td>`
                                    table += `</tr>`
                                })
                                data = data.replace('{list-student}', table);
                                res.writeHead(200, {'Content-Type': 'text/html'});
                                res.write(data);
                                res.end();
                            }
                        })
                    } else {
                        res.writeHead(301, {Location: '/login'})
                        return res.end();
                    }
                });

            } else {

                res.writeHead(301, {Location: '/login'})
                return res.end();
            }
        })
    };

    showPageTrangchuMember(req, res) {
        this.userModel.DBlistGeneral()
            .then(result => {
                fs.readFile('./views/trangchuMember.html', 'utf-8', (err, data) => {
                    if (err) {
                        throw new Error(err.message);
                    } else {
                        let arr = [];
                        let status = '';
                        let member = '';
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].Name === status) {
                                member.push(result[i].Score)
                            } else {
                                arr.push(member);
                                status = result[i].Name
                                member = [];
                                member.push(result[i].ID_HS)
                                member.push(result[i].Name);
                                member.push(result[i].Score);
                            }
                        }
                        arr.push(member);
                        arr.splice(0, 1);

                        //in bang list danh sach ra man hinh
                        let html = '';
                        for (let i = 0; i < arr.length; i++) {
                            html += `<tr>`
                            for (let j = 1; j < arr[i].length; j++) {
                                html += `<td>${arr[i][j]}</td>`
                            }
                            html += `</tr>`
                        }
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        data = data.replace('{list}', html);
                        res.write(data);
                        res.end();
                    }
                })

            })
    }

    showPageNotFound(req, res) {
        this.showPage(req, res, './views/notfound.html')
    }

    insertStudent(req, res) {
        if (req.method === 'GET') {
            this.showPage(req, res, './views/addstudent.html')
        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk
            });
            req.on('end', () => {
                let Data = qs.parse(data);
                this.userModel.insertDBdanhSachHS(Data.name, Data.email, Data.phone)
                    .then(() => {
                        res.writeHead(301, {Location: '/trangchuAdmin'})
                        res.end();
                    })
                    .catch(err => {
                        res.end(err);
                    })
            })

        }
    }

    addScores(req, res) {
        let id = url.parse(req.url, true).query.id;
        let DanhSachHS = 'DanhSachHS';
        let ID_HS = 'ID_HS'
        if (req.method === 'GET') {
            //hien form them diem, day la buoc hien thi ten.
            this.userModel.findDB(DanhSachHS, ID_HS, id).then(result => {
                fs.readFile('./views/addScore.html', 'utf-8', (err, data) => {
                    if (err) {
                        throw new Error(err.message);
                    } else {
                        res.writeHead(200, 'utf-8', {'Content-Type': 'text/html'});
                        data = data.replace('{name}', result[0].Name);
                        res.write(data);
                        res.end();
                    }
                })
            })

        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                let Data = qs.parse(data);
                this.userModel.insertDBketQua(id, Data.toan, Data.van, Data.anh)
                    .then(() => {
                        res.writeHead(301, {Location: '/trangchuAdmin'})
                        res.end();
                    })
            })
        }
    }

    editScore(req, res) {
        let id = url.parse(req.url, true).query.id;
        //lay form bang diem hien tai ra
        if (req.method === 'GET') {
            this.userModel.showDBketQua(id)
                .then(result => {
                    fs.readFile('./views/editscore.html', 'utf-8', (err, data) => {
                        data = data.replace('{name}', result[0].Name);
                        data = data.replace('{toan}', result[0].Score);
                        data = data.replace('{van}', result[1].Score);
                        data = data.replace('{anh}', result[2].Score);
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write(data);
                        res.end();
                    })
                })
        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', () => {
                let Data = qs.parse(data);
                this.userModel.editDBketQua(Data.toan, Data.van, Data.anh, id)
                    .then(result => {
                        res.writeHead(301, {Location: 'http://localhost:8080/listGeneral'})
                        res.end();
                    })
            })

        }
    }

    deleteListStudent(req, res) {
        let id = url.parse(req.url, true).query.id
        this.userModel.deleteDBdanhSachHS(id)
            .then(() => {
                res.writeHead(301, {Location: '/trangchuAdmin'})
                res.end();
            })
    }

    listGeneral(req, res) {
        this.userModel.DBlistGeneral()
            .then(result => {
                fs.readFile('./views/listgeneral.html', 'utf-8', (err, data) => {
                    if (err) {
                        throw new Error(err.message);
                    } else {
                        let arr = [];
                        let status = '';
                        let member = '';
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].Name === status) {
                                member.push(result[i].Score)
                            } else {
                                arr.push(member);
                                status = result[i].Name
                                member = [];
                                member.push(result[i].ID_HS)
                                member.push(result[i].Name);
                                member.push(result[i].Score);
                            }
                        }
                        arr.push(member);
                        arr.splice(0, 1);

                        //in bang list danh sach ra man hinh
                        let html = '';
                        for (let i = 0; i < arr.length; i++) {
                            html += `<tr>`
                            for (let j = 1; j < arr[i].length; j++) {
                                html += `<td>${arr[i][j]}</td>`
                            }
                            html += `<td><a href="/editScore?id=${arr[i][0]}">EDIT</a></td>`
                            html += `</tr>`
                        }
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        data = data.replace('{list}', html);
                        res.write(data);
                        res.end();
                    }
                })

            })

    }

}

module.exports = UserController;