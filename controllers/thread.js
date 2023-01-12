const {getKeysNotProvided, isObjectIdStringValid} = require("../utils");
const {Thread} = require("../models");

/**
 * Créer un thread
 * @param thread thread à créer
 * @returns Le thread crée crée
 */
async function createThread(thread) {

    // On regarde déjà si tous les champs du thread sont présents
    const neededKeys = ["titre", "contenu"];
    const keysNotGiven = getKeysNotProvided(neededKeys, thread);

    // Si une ou plusieurs clefs ne sont pas données alors on renvoie un message d'erreur
    if (keysNotGiven.length !== 0) {
        throw new Error(`Les informations suivantes ne sont pas fournies ou vides: '${keysNotGiven.join(', ')}'`);
    }

    // On peut essayer de créer le thread
    try {

        // On crée un thread avec le model de MongoDB et les informations du thread
        const threadToCreate = new Thread(thread);

        // Puis on le sauvegarde en n'oubliant pas le mot clef await qui va nous permettre d'attendre que le thread
        // soit sauvegarder pour nous le renvoyer
        return await threadToCreate.save();
    }

        // S'il y a une erreur lors du processus alors on renvoie un message d'erreur
    catch (e) {
        throw new Error("Une erreur s'est produite lors de la création du thread");
    }
}

/**
 * Récupère TOUS les threads depuis la base de données
 */
async function readAllThreads() {

    // On essaye de récupérer TOUS les threads (donc on ne met pas de conditions lors de la recherche, juste un object vide)
    try {
        return await Thread.find({})
    }

        // S'il y a une erreur, on renvoie un message
    catch (e) {
        throw new Error("Il y a eu une erreur lors de la recuperation des threads");
    }
}

/**
 * Lire un thread par son id unique créé par MongoDB
 * @param threadId L'identifiant du thread à lire
 * @returns Le thread trouvé
 */
async function readThread(threadId) {

    // Vérifier si le threadId existe et est un id MongoBD valide
    if (threadId === undefined || !isObjectIdStringValid(threadId)) {
        throw new Error("L'id du thread n'existe pas ou n'est pas un id MongoDB");
    }


    // On veut chercher un object dans la collection "Thread" par son identifiant MongoDB
    const threadFound = await Thread.findById(threadId);

    // Si le thread trouvé est null c'est qu'il n'existe pas dans la base de données
    if (threadFound === null) {
        throw new Error("Le thread n'existe pas");
    }

    // Sinon c'est qu'il existe et on le renvoie
    return threadFound;
}

/**
 * Mettre à jour un thread
 * @param threadId L'id du thread à mettre à jour
 * @param threadToUpdate Les éléments du thread à mettre à jour
 * @returns Le thread modifié
 */
async function updateThread(threadId, threadToUpdate) {

    // Vérifier si le threadId existe et est un id MongoBD valide
    if (threadId === undefined || !isObjectIdStringValid(threadId)) {
        throw new Error("L'id du thread n'existe pas ou n'est pas un id MongoDB");
    }

    // Petite chose TRES importante, dans le doute où dans l'object userToUpdate se trouve une clef _id qui a été modifié par une personne malveillante
    // il faut la supprimer de l'object, car _id est un id généré automatiquement et il ne doit pas changer !

    // Attention vu qu'on ne peut pas faire confiance à l'utilisateur il faut vérifier si les champs qu'on veut modifier on bien de la donnée et qu'elle soit non vide,
    // sinon on pourrait remplacer de la donnée importante...
    if (threadToUpdate.titre === "") {
        delete threadToUpdate.titre;
    }

    if (threadToUpdate.contenu === "") {
        delete threadToUpdate.contenu;
    }

    if (threadToUpdate.nom_createur === "") {
        delete threadToUpdate.nom_createur;
    }

    if (threadToUpdate.messages === "") {
        delete threadToUpdate.messages;
    }


    // On demande à MongoDB de modifier les couples clefs/valeurs présents dans l'object threadToUpdate de l'object qui a pour identifiant unique MongoDB 'threadId'
    // Noter l'option {new: true} qui veut dire que MongoDB nous renverra l'object modifié et non l'object avant sa modification (car on veut renvoyer le thread modifié à l'utilisateur)
    const oldThread = await Thread.findById(threadId);
    let oldMessages = oldThread.messages;
    oldMessages.push(threadToUpdate.messages);
    threadToUpdate.messages = oldMessages;
    const threadUpdated = await Thread.findByIdAndUpdate(threadId, threadToUpdate, {new: true});

    // Si le thread trouvé est null c'est qu'il n'existe pas dans la base de données
    if (threadUpdated === null) {
        throw new Error("Le thread n'existe pas et n'a donc pas pû être modifié");
    }

    // Sinon c'est qu'il existe et on le renvoie
    return threadUpdated;
}

/**
 * Supprime un thread
 * @param threadId L'identifiant du thread à supprimer
 * @returns Le thread qui vient d'être supprimé
 */

async function deleteThread(threadId) {

    // Vérifier si le threadId existe et est un id MongoBD valide
    if (threadId === undefined || !isObjectIdStringValid(threadId)) {
        throw new Error("L'id du thread n'existe pas ou n'est pas un id MongoDB")
    }

    // On demande à MongoDB de supprimer le thread qui a comme identifiant unique MongoDB 'threadId'
    const threadDeleted = await Thread.findByIdAndDelete(threadId);

    // Si le thread trouvé est null c'est qu'il n'existe pas dans la base de données
    if (threadDeleted === null) {
        throw new Error("Le thread n'existe pas et n'a donc pas pû être supprimé");
    }

    // Attention maintenant on veut aussi supprimer le compte associé à l'utilisateur quand on supprime un utilisateur
    //await Account.findOneAndDelete({user: userId});

    // Sinon c'est qu'il existe et on le renvoie
    return threadDeleted;
}

// On exporte les modules
module.exports = {
    createThread: createThread,
    readAllThreads: readAllThreads,
    readThread: readThread,
    updateThread: updateThread,
    deleteThread: deleteThread
}