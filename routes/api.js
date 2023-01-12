const express = require("express");
const {printSession} = require("../middlewares/index.js");
const {createUser, deleteUser, readAllUsers, readUser, updateUser, logInUser} = require("../controllers/users.js");
const {getUserData, signUpUser} = require("../controllers/accounts");
const {createThread, readAllThreads, readThread, updateThread, deleteThread} = require("../controllers/thread");
const {isUserAuthenticated, checkUserNotAlreadyAuthenticated, isSuperUser, isUserAsking} = require("../middlewares");

// On crée le router de l'api
const apiRouter = express.Router();

/**
 * Route ping où on ajoute le middleware qui va nous montrer ce qu'il y a dans la session
 */
apiRouter.get('/ping', printSession, function (req, res) {
    res.json({
        status: "OK",
        timestamp: (new Date()).getTime()
    });
});

/**
 * Créer un utilisateur
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 * @middleware isSuperUser: Seul un super utilisateur a le droit d'accéder à cet endpoint
 */
apiRouter.post('/user', async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await createUser(req.body));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * Récupère un utilisateur par rapport à son id
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 */
apiRouter.get('/user/:userId', isUserAuthenticated, async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await readUser(req.params.userId));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * Modifie un utilisateur par rapport à son id et le contenu de la requête
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 * @middleware isUserAsking: Seul l'utilisateur connecté OU un super utilisateur a le droit d'accéder à cet endpoint
 */
apiRouter.put('/user/:userId', isUserAuthenticated, isUserAsking, async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await updateUser(req.params.userId, req.body));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * Supprime un utilisateur par rapport à son id
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 * @middleware isSuperUser: Seul un super utilisateur a le droit d'accéder à cet endpoint
 */
apiRouter.delete('/user/:userId', isSuperUser, async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await deleteUser(req.params.userId));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * Récupère tous les utilisateurs
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 */
apiRouter.get('/users', async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await readAllUsers());
    } catch (e) {
        res.status(500).send(e.message);
    }
});


apiRouter.get('/session', (req, res) => {
    res.json(req.session);
});
 

/**
 * Détruis la session
 */
/* On supprime cette route, car elle sera en collision avec celle pour se déconnecter
apiRouter.delete('/session', (req, res) => {

    // S'il n'y a pas de session, on renvoie un message
    if (req.session === undefined) {
        res.json("Il n'y a pas de session à détuire")
    }

    // Si elle est existe alors on peut la détruire
    else {
        req.session.destroy()
        res.json("La session a été détruite !");
    }
});
*/

/**
 * La route pour que l'utilisateur se connecte
 */
/*
apiRouter.get('/login', async (req, res) => {

    try {
        // On récupère le login et le mot de passe du header
        const b64auth = (req.headers.authorization || '').split(' ')[1] || '';

        // On essaye de connecter l'utilisateur
        const result = await logInUser(b64auth);

        // On veut stocker des informations dans la session
        req.session.userId = result.userId;
        req.session.email = result.email;
        req.session.isSuperUser = result.isSuperUser;

        // On renvoie le résultat
        res.json(result);
    }

        // Si on attrape une erreur, on renvoie un code HTTP disant que l'utilisateur n'a pas pu se connecter (Unauthorized)
    catch (e) {
        res.status(401).send(e.message);
    }
});
*/

apiRouter.post('/login', async (req, res) => {
    try{
        //const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
        const result = await logInUser(req.body);

        req.session.userId = result.userId;
        req.session.username = result.username;
        req.session.isSuperUser = result.isSuperUser;
        res.json(result);
    }
    catch(e){
        res.status(401).send(e.message);
    }
});

/**
 * on déconnecte l'utilisateur
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 */
apiRouter.delete('/logout', isUserAuthenticated, async (req, res) => {

    // On détruit la session
    try {
        await req.session.destroy();
    } catch (e) {
    }

    // On enlève le cookie (même si ça doit se faire tout seul, on sait jamais...)
    res.clearCookie("connect.sid");

    res.end("La session a été détruite");
});

/**
 * On récupère la donnée de l'utilisateur actuel
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 */
apiRouter.get('/userdata', isUserAuthenticated, async (req, res) => {

    // On essaye de faire la requête et s'il y a une erreur, on la renvoie avec un code d'erreur
    try {
        res.json(await getUserData(req.session.userId));
    } catch (e) {

        // On renvoie l'erreur avec un code 500 (Internal Server Error)
        res.status(500).send(e.message)
    }
});

/**
 * On regarde si l'utilisateur est connecté
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 */
apiRouter.get('/authenticated', isUserAuthenticated, async (req, res) => {

    // Comme le router fait foi que l'utilisateur est connecté on sait que si l'on retourne quelque chose alors c'est parce qu'il est connecté
    res.json({
        isUserLogged: true,
        isSuperUser: req.session.isSuperUser === true
    })
});

/**
 * Permet de créer un compte utilisateur
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 * @middleware isSuperUser: Seul un super utilisateur a le droit d'accéder à cet endpoint
 */
apiRouter.post('/signup', isUserAuthenticated, isSuperUser, async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await signUpUser(req.body.email, req.body.password, req.body.isSuperUser, req.body.user));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * Créer un thread
 */
apiRouter.post('/thread', async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await createThread(req.body));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * Récupère tous les threads
 */
apiRouter.get('/threads', async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await readAllThreads());
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * Récupère un thread par rapport à son id
 */
apiRouter.get('/thread/:threadId',  async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await readThread(req.params.threadId));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * crer un message 
 */
apiRouter.put('/thread/:threadId', async (req, res) => {
    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await updateThread(req.params.threadId, req.body));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * Supprime un thread par rapport à son id
 * @middleware isSuperUser: Seul un super utilisateur a le droit d'accéder à cet endpoint
 */
apiRouter.delete('/thread/:threadId', isSuperUser, async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await deleteThread(req.params.threadId));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// On exporte seulement le router
module.exports = apiRouter;