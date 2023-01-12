const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Ce schema sera utilisé pour stocker les utilisateurs
 * @schema : User
 */
const UserSchema = new Schema({

    /**
     * Le nom de l'utilisateur
     */
    nom: {
        type: Schema.Types.String,
        required: true
    },

    /**
     * Le prénom de l'utilisateur
     */
    prenom: {
        type: Schema.Types.String,
        required: true
    },

    /**
     * L'age de l'utilisateur
     */
    age: {
        type: Schema.Types.Number,
        required: true
    },

    username: {
        type: Schema.Types.String,
        required: true
    },

    password: {
        type: Schema.Types.String,
        required: true
    },

    isSuperUser: {
        type: Schema.Types.Boolean,
        required: true
    },

    /**
     * Ce champ sera pour savoir quand un utilisateur a été ajouté la base de données
     * Le fait de mettre 'default: Date.now' permettra de créer ce champ sans devoir le renseigner et sera la date au moment de l'ajout du document
     */
    createdAt: {
        type: Schema.Types.Date,
        default: Date.now
    }
});

/**
 * Ce schema sera utilisé pour stocker les Threads
 * @schema : Thread
 */
const ThreadSchema = new Schema(
    {

    /**
     * Le titre du thread
     */
    titre: {
        type: Schema.Types.String,
        required: true
    },

    /**
     * Le contenu du thread
     */
      contenu: {
        type: Schema.Types.String,
        required: true
    },

    /**
     * Le nom du createur du thread
     */
      nom_createur: {
        type: Schema.Types.String,
        required: true
    },
    
    /**
     * messages du thread
     */
      messages: {
        type: Schema.Types.Array,
        default: []
    },
    
    /**
     * Ce champ sera pour savoir quand un utilisateur a été ajouté la base de données
     * Le fait de mettre 'default: Date.now' permettra de créer ce champ sans devoir le renseigner et sera la date au moment de l'ajout du document
     */
    createdAt: {
        type: Schema.Types.Date,
        default: Date.now
    }

    });

// On exporte le model
module.exports = {

    // On dit que le Model User est créé à partir du Schema UserSchema et le Model sera stocké dans la base de donnée MongoDB sous le nom "user"
    User: mongoose.model('user', UserSchema),

    // On dit que le Model Thread est créé à partir du Schema ThreadSchema et le Model sera stocké dans la base de donnée MongoDB sous le nom "thread"
    Thread: mongoose.model('thread', ThreadSchema)
    
}