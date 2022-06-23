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
            console.log(1)
            let cookies = (cookie.parse(req.headers.cookie || ''))
            let nameCookie = '';
            if (cookies.cookie_user) {
                nameCookie = (JSON.parse(cookies.cookie_user)).session_name_file
                fs.exists('./session/' + nameCookie + '.txt', (exists) => {
                    if (exists) {
                        console.log(exists)
                        res.writeHead(301, {location: '/trangchuAdmin'});
                        res.end();
                    } else {
                        this.showPage(req, res, './views/login.html')
                    }
                });

            } else {

                this.showPage(req, res, './views/login.html')
            }
            // this.showPage(req, res, './views/login.html');

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
        console.log(1)
        // let urlPath = url.parse(req.url,true).pathname;
        let cookies = (cookie.parse(req.headers.cookie || ''))
        let nameCookie = (JSON.parse(cookies.cookie_user)).session_name_file
        console.log(nameCookie)
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
        this.userModel.showDataBase().then(result => {
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
                        table += `</tr>`
                    })
                    data = data.replace('{list-student}', table);
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    res.end();
                }
            })
        })

        // this.showPage(req, res, './views/trangchuAdmin.html')
    };

    showPageTrangchuMember(req, res) {
        this.showPage(req, res, './views/trangchuMember.html')
    }

    showPageNotFound(req, res) {
        this.showPage(req, res, './views/notfound.html')
    }

}

module.exports = UserController;