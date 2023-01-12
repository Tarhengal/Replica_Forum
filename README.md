# Replica_Forum

## Itroduction

Ce projet Full Stack a pour but de reproduire un forum du type Twitter ou Redit.
On Peut y créer un compte, puis poster des threads et réagir à ceux des autres.

## Instalation 

```bash
git clone https://github.com/Tarhengal/Replica_Forum.git
```

ouvrir un terminal dans la root du proje et entez les commandes suivantes :

```bash
docker run -d --name mongo-bdd -p 27017:27017 mongo
docker run -d --name redis-bdd -p 6379:6379 redis
npm install
npm run dev
```
Veuillez ensuite vous endre sur la page : http://localhost:3000/home

## Le Forum 

![](public\images\homepage.png)

Pendant toute la navigation sur le site, si vous cliquez sur le logo en haut à gauche, celui-ci vous redirigeras sur la page principale.

À partir de celle-ci vous pouvez vous créer un compte si vous n'en avez pas, où vous connectez si c'est déjà le cas.
Après inscription le site vous redirigeras automatiquement vers la page de connexion.
Connectez-vous et le site vous redirige vers la main page.
Vous pouvez aussi vous connecter en tant qu'administrateur (admin/admin) pour avoir accès à la page de modération.

Une fois sur la mainpage, 

![](public\images\mainpage.png)

On peut directement voir les threads créés, et par qui ils ont été postés.

On va pouvoir dans un premier temps créer son propre thread en cliquant sur le bouton prévu à cet effet,
il faut rentrer un titre et le contenu du thread et cliquer sur poster.
Quand on retourne sur la page principale, on voit bien que le thread a été créé.

On va ensuite pouvoir réagir aux threads des autres utilisateurs. Pour cela il suffit de cliquer sur le thread qui nous intéresse, le site nous renvoie sur la page du thread.

![](public\images\thread.png)

Ici on peut voir les réactions des autres utilisateurs sur ce thread, et on peut decider de réagir nous aussi.
Il suffit d'écrire son message et de cliquer sur poster message.
Ensuite si on refresh la page, on voit bien que le message a été posté.

Finalement, si on retourne sur la main page, et que l'on est connecté en tant qu'administrateur, on peut accéder à la page modération.

![](public\images\moderate.png)

Ici on peut récupérer tous les utilisateurs et les threads et les supprimer grace à leurs ID.

## Améliorations

Étant donné que j'ai eu des problèmes avec NextJs j'ai dû recommencer le projet après plusieurs heures de travail et donc ce projet n'est pas forcément abouti comme je le souhaitais, par manque de temps.

Dans un premier temps je pourrai améliorer le front end qui est très basique pour le moment.

Il y aurait ensuite quelques modifications à apporter à la page de modération comme modifier des utilisateurs ou des threads, mais aussi pour donner les privilèges administrateurs à un utilisateur. Il serait bien aussi de pouvoir supprimer un message de réponse à un thread.

J'aurai aussi aimé implementer un système de like pour les threads, et pourquoi ne pas afficher les threads les plus likés en premier sur la main page.

J'aimerais aussi qu'il y ait une page de profil utilisateur où on peut voir les threads postés par cet utilisateur et le follow, pour que ses threads soient mis en avant.