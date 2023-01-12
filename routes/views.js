const express = require("express");
const { isSuperUser } = require("../middlewares");

// On crée le router des vues
const viewsRouter = express.Router();

// On veut que lorsque l'utilisateur aille sur http://localhost:3000/home le serveur lui renvoie la vue testWebsocket.ejs.ejs dans le dossier views
viewsRouter.get('/home', function (req, res) {
    res.render('home.ejs');
});

// On veut que lorsque l'utilisateur aille sur http://localhost:3000/login le serveur lui renvoie la vue testWebsocket.ejs.ejs dans le dossier views
viewsRouter.get('/login', function (req, res) {
    res.render('login');
});

// On veut que lorsque l'utilisateur aille sur http://localhost:3000/signup le serveur lui renvoie la vue testWebsocket.ejs.ejs dans le dossier views
viewsRouter.get('/signup', function (req, res) {
    res.render('signUp');
});

// On veut que lorsque l'utilisateur aille sur http://localhost:3000/mainpage le serveur lui renvoie la vue testWebsocket.ejs.ejs dans le dossier views
viewsRouter.get('/mainpage', function (req, res) {
    res.render('mainpage');
});

// On veut que lorsque l'utilisateur aille sur http://localhost:3000/createthread le serveur lui renvoie la vue testWebsocket.ejs.ejs dans le dossier views
viewsRouter.get('/createthread', function (req, res) {
    res.render('createthread');
});

// On veut que lorsque l'utilisateur aille sur http://localhost:3000/thread le serveur lui renvoie la vue testWebsocket.ejs.ejs dans le dossier views
viewsRouter.get('/thread', function (req, res) {
    res.render('thread');
});

// On veut que lorsque l'utilisateur aille sur http://localhost:3000/moderate le serveur lui renvoie la vue testWebsocket.ejs.ejs dans le dossier views
viewsRouter.get('/moderate', isSuperUser, function (req, res) {
    res.render('moderate');
});

// On exporte seulement le router
module.exports = viewsRouter;