---
title: 3. Une famille, puis une liste
description: Trois semaines plus tard · Pratiquer les exercices
noindex: true
conversation: true
---

**Trois semaines plus tard · Pratiquer les exercices**

> [!ulysse] Ulysse · message vocal
> Salut. On fait les exercices de Prolog, sur la récursion.

> [!claude] Claude
> 📝 **Exercice 1 · {==Un prédicat récursif==}{>>Le tuteur a pour consigne de nommer les variables par ce qu'elles sont : ANCETRE, ENFANT, plutôt que X, Y et Z. Le programme se lit presque comme une phrase.<<}**
>
> ```prolog
> parent(paul, marie).
> parent(marie, luc).
> parent(luc, lea).
>
> ancetre(ANCETRE, DESC) :- parent(ANCETRE, DESC).
> ancetre(ANCETRE, DESC) :- parent(ANCETRE, ENFANT), ancetre(ENFANT, DESC).
> ```
>
> Que répond Prolog à `?- ancetre(paul, lea).` ?

> [!ulysse] Ulysse · message vocal
> Euh, OK, attends. Je comprends pas comment il sait quand s'arrêter. La deuxième règle appelle ancetre, qui rappelle ancetre… pourquoi ça boucle pas à l'infini ?

> [!claude] Claude
> C'est la bonne question : c'est le cœur de la récursion. On va la voir sur un exemple plus facile à suivre, {==ta famille==}{>>Avec des gens qu'on connaît, qui est le parent de qui va de soi. Il ne reste qu'une chose à suivre : la récursion.<<}. Donne-moi ton père, ton grand-père et ton arrière-grand-père, et je refais le même programme avec eux.

> [!ulysse] Ulysse · message vocal
> Mon père, c'est Pierre. Son père, c'est Georges, puis le père de Georges, c'est Maxime. Si jamais t'en as besoin, ma mère, c'est Myrto, puis j'ai un frère, Raoul, puis une petite sœur, Indiana.

> [!claude] Claude
> Merci. Le même programme, avec ta famille :
>
> ```prolog
> parent(maxime, georges).
> parent(georges, pierre).
> parent(pierre, ulysse).
>
> ancetre(ANCETRE, DESC) :- parent(ANCETRE, DESC).
> ancetre(ANCETRE, DESC) :- parent(ANCETRE, ENFANT), ancetre(ENFANT, DESC).
> ```
>
> En mots : la règle 1 dit que ton parent est ton ancêtre. La règle 2 dit qu'ANCETRE est aussi ton ancêtre s'il est le parent de quelqu'un, ENFANT, qui est lui-même ton ancêtre.
>
> Pour voir où ça s'arrête, {==donne-moi la trace de l'algorithme==}{>>Le tuteur pourrait expliquer pourquoi ça s'arrête. Il fait plutôt dérouler la trace par l'étudiant : c'est en la disant qu'il va le voir.<<} pour `?- ancetre(maxime, ulysse).` : à chaque étape, la règle que Prolog essaie, puis ce qu'il cherche ensuite. Tu peux me la dire à voix haute.

> [!ulysse] Ulysse · message vocal
> OK. Donc il essaie la règle un : est-ce que Maxime est le parent d'Ulysse ? Non, ça marche pas. Fait qu'il passe à la règle deux. Il faut que Maxime soit le parent de quelqu'un… ENFANT, c'est Georges. Puis là, il faut que Georges soit un ancêtre d'Ulysse, fait qu'il recommence avec Georges. Règle un : Georges, parent d'Ulysse ? Non. Règle deux : Georges, parent de Pierre, puis il recommence avec Pierre. Règle un : Pierre, parent d'Ulysse ? Oui ! Ah. {==Ah, OK. C'est là qu'il arrête==}{>>Le déclic vient de l'étudiant, pas du tuteur : en déroulant la trace à voix haute, il trouve seul la clause d'arrêt. Parler coûte moins qu'écrire, et tout le raisonnement est là pour le tuteur.<<}, quand la règle un marche. Chaque fois, il monte… ben, il descend d'une génération, jusqu'à tomber sur un parent direct.

> [!claude] Claude
> ✅ C'est exactement ça. À chaque appel, la question porte sur une génération de moins, jusqu'à ce que la règle 1 réponde : c'est elle, la **clause d'arrêt**. Sans elle, la règle 2 s'appellerait à l'infini.
>
> 💬 Question rapide, {==facultative==}{>>Marquée facultative : trop facile, l'étudiant la saute. Le tuteur a pour consigne de lire une question sautée comme « évident », jamais comme « je ne sais pas ».<<} : dans l'autre sens, est-ce qu'Ulysse est un ancêtre de Maxime ? Autrement dit, `?- ancetre(ulysse, maxime).`

> [!ulysse] Ulysse
> false. ulysse est le parent de personne

> [!claude] Claude
> ✅ false. Et ton exercice du début : que répond Prolog à `?- ancetre(paul, lea).` ?

> [!ulysse] Ulysse
> true. paul, marie, luc, puis luc est le parent de lea

> [!claude] Claude
> ✅ true, par le même chemin que de Maxime jusqu'à toi. Dernière chose : en une phrase, dans tes mots, c'est quoi, un ancêtre, pour Prolog ?

> [!ulysse] Ulysse · message vocal
> Ben, quelqu'un de plus vieux que toi dans ta famille.

> [!claude] Claude
> ⚠️ C'est le sens de tous les jours, mais Prolog ne connaît pas l'âge : nulle part le programme ne dit qui est plus vieux que qui. Il ne connaît que les faits parent.

> [!ulysse] Ulysse · message vocal
> Ah. OK, donc c'est ton parent… ou le parent de ton parent… En fait, c'est ton parent, ou le parent de n'importe lequel de tes ancêtres.

> [!claude] Claude
> ✅ {==Ta phrase, c'est exactement les deux règles==}{>>Chaque notion se termine sur une phrase de l'étudiant, dans ses mots. S'il peut la dire, c'est compris ; sinon, le tuteur voit tout de suite ce qui manque, et le dit sans donner la réponse.<<} : « ton parent », c'est la règle 1 ; « le parent d'un de tes ancêtres », la règle 2. Définir une chose à partir d'elle-même, en plus petit, avec un cas où l'on s'arrête : c'est ça, la récursion. Elle sert partout où les choses s'emboîtent : un arbre généalogique, des dossiers dans des dossiers, une liste.
>
> 📝 **Exercice 2 · Compter dans une liste**
>
> Écris `compte(LISTE, ELEMENT, N)` : N est le nombre de fois qu'ELEMENT apparaît dans LISTE.
>
> Exemple : `?- compte([pierre, myrto, pierre], pierre, N).` donne `N = 2`.

> [!ulysse] Ulysse
> ```prolog
> compte([], E, 0).
> compte([E|R], E, N) :- compte(R, E, M), N is M + 1.
> compte([P|R], E, N) :- compte(R, E, N).
> ```

> [!claude] Claude
> {==J'ai lancé ton programme==}{>>Plutôt que de dire où est l'erreur, le tuteur montre ce que le programme fait vraiment. Les réponses en trop sont le contre-exemple : à l'étudiant de comprendre d'où elles viennent.<<} dans SWI-Prolog, sur l'exemple de l'énoncé, en demandant toutes les réponses :
>
> ```text
> ?- compte([pierre, myrto, pierre], pierre, N).
> N = 2 ;
> N = 1 ;
> N = 1 ;
> N = 0.
> ```
>
> La première réponse est la bonne. D'où viennent les trois autres ?

> [!ulysse] Ulysse
> {==idk==}{>>L'étudiant voudrait passer. Le tuteur ne donne pas la réponse pour autant : c'est sa consigne, quel que soit l'étudiant, fatigué ou découragé. Il rapetisse la question jusqu'à ce qu'elle se réponde en un mot.<<}

> [!claude] Claude
> Pas de souci, on la prend plus petite. Oublie la liste de trois : prends juste `[pierre]`, et on cherche pierre.
>
> Ta troisième clause commence par `compte([P|R], E, N)`. Ici, que vaut P ?

> [!ulysse] Ulysse
> pierre

> [!claude] Claude
> « Oui. Et rien, dans ta troisième clause, n'empêche P d'être pierre. Pour Prolog, « passer par-dessus un pierre sans le compter » est donc une réponse permise : c'est elle qui donne les N en trop. »

> [!ulysse] Ulysse · message vocal
> Ah, OK. Faut que je dise que P, c'est pas la même chose que E. Comme ça :
> ```prolog
> compte([P|R], E, N) :- P \= E, compte(R, E, N).
> ```

> [!claude] Claude
> ✅ Juste. J'ai relancé l'exemple : seulement `N = 2`, maintenant.
>
> Il t'a fallu de l'aide pour trouver cette condition : {==je note l'exercice==}{>>« Difficile » ne veut pas dire raté : la notion a eu besoin d'aide. Le tuteur l'écrit dans le fichier d'exercices du cours, et c'est cette liste qui bâtira la révision avant l'examen.<<} **difficile**. Je te reposerai la même idée plus tard, dans un autre exercice, pour vérifier qu'elle tient.

**Séance suivante : [[4-ce-qui-avait-accroche|4. Ce qui avait accroché]]**

[[tuteur|← Le tuteur socratique]]
