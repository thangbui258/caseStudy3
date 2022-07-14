let http = require('http');
let fs = require('fs');
let url = require('url');
let UserController = require('./controller/UserController');
let userController = new UserController()

let dtBase = require('./model/Database')
let dttBase = new dtBase()
let handlers = {};


const mimeTypes = {
    "html": "text/html",
    "js": "text/javascript",
    "css": "text/css",
    "png": "image/png",
    "svg": "image/svg+xml"
};


let serverHttp = http.createServer((req, res) => {

    let parseUrl = url.parse(req.url);
    let path = parseUrl.pathname;


    const filesDefences = req.url.match(/\.js$|\.css$|\.png$|\.svg/);
    if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        res.writeHead(200, {'Content-Type': extension});
        fs.createReadStream(__dirname + req.url).pipe(res)
    } else {
        let trimPath = path.replace(/^\/+|\/+$/g, '');
        let chosenHandler = (typeof (router[trimPath]) !== 'undefined') ? router[trimPath] : handlers.notfound;
        chosenHandler(req, res);
    }
});
serverHttp.listen(process.env.PORT ||3000);

handlers.notfound = function (req, res) {
    userController.showPageNotFound(req, res)
}

handlers.login = function (req, res) {
    userController.login(req, res)
};
handlers.trangchuAdmin = function (req, res) {
    userController.showPageTrangchuAdmin(req, res)
};
handlers.trangchuMember = function (req, res) {
    userController.showPageTrangchuMember(req, res)
};
handlers.logout = function (req, res) {
    userController.outLogin(req, res)
}
handlers.addstudent = function (req, res) {
    userController.insertStudent(req, res)
}
handlers.addScore = function (req, res) {
    userController.addScores(req, res)
}
handlers.deleteStudent = function (req, res) {
    userController.deleteListStudent(req, res)
}
handlers.listGeneral = function (req,res){
    userController.listGeneral(req,res)
}
handlers.editScore = function (req,res){
    userController.editScore(req,res)
}
let router = {
    'login': handlers.login,
    'trangchuAdmin': handlers.trangchuAdmin,
    'trangchuMember': handlers.trangchuMember,
    'notfound': handlers.notfound,
    'logout': handlers.logout,
    'addstudent': handlers.addstudent,
    'addScore': handlers.addScore,
    'deleteliststudent': handlers.deleteStudent,
    'listGeneral': handlers.listGeneral,
    'editScore': handlers.editScore
}
