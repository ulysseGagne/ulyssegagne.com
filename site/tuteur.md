---
title: Le tuteur socratique
description: J'ai bâti ce tuteur pour moi dans Claude Code, d'Anthropic, et j'étudie avec lui depuis novembre 2025, dans presque tous mes cours.
noindex: true
conversation: true
---

> [!warning] En chantier
> Un brouillon : la démo est en cours d'écriture, et elle va changer. Les passages surlignés en jaune ont un commentaire, à côté.

J'ai bâti ce tuteur pour moi dans [Claude Code](https://claude.com/product/claude-code), d'Anthropic, et j'étudie avec lui depuis novembre 2025, dans presque tous mes cours. Il explique, je redis dans mes mots, il me montre ce qui cloche, et on recommence jusqu'à ce que ce soit juste. Voici une séance type, écrite à partir de vraies séances.

## 1. Chercher sans se perdre

**Un mardi soir de septembre · Apprendre la matière**

> [!ulysse] Ulysse · dicté
> Salut. J'ai eu le cours sur la recherche dans un espace d'états cet après-midi, mais honnêtement, j'ai décroché vers la moitié. J'ai à peu près deux heures ce soir. On peut le reprendre depuis le début ?

> [!claude] Claude
> Oui, on le reprend depuis le début. Voici le plan pour tes deux heures.
>
> **Ce soir · Recherche dans un espace d'états**
> 1. Le problème, {==dans les mots de ta prof==}{>>Le tuteur ne remplace pas le cours, il le découpe. Les enregistrements sont transcrits et alignés sur les diapos : il sait à quelle seconde elle explique quoi, et ouvre la notion avec sa voix.<<} : un extrait de deux minutes de son cours.
> 2. Trois diapos, que je t'explique une à une. Après chacune, {==une petite question==}{>>Une question qui se règle en une phrase, à voix haute : chaque diapo est vérifiée, et un malentendu se corrige avant de faire boule de neige. Le contraire d'un cours magistral de trois heures.<<} à laquelle tu peux répondre à voix haute.
> 3. Un exercice : la trace de la recherche en largeur d'abord.
>
> On commence par son extrait.

> [!video] ▶ Extrait du cours enregistré
> Recherche dans un espace d'états, de 12:40 à 14:35. « Comment chercher un chemin jusqu'au but, quand on ne voit jamais tout l'espace d'un coup. »

> [!claude] Claude
> Question rapide, d'après l'extrait : pour poser un problème de recherche, qu'est-ce qu'il te faut ?

> [!ulysse] Ulysse · dicté
> Euh… un état de départ, un état but… puis les opérateurs. Les actions qui te font passer d'un état à un autre.

> [!claude] Claude
> ✅ Les trois y sont. Mis ensemble, ils forment un graphe : chaque état est un nœud, chaque opérateur une flèche. Chercher, c'est trouver un chemin dans ce graphe.
>
>
> > [!diapo] Diapo 1 sur 3 · Complément · non officiel
> > **Pourquoi chercher ?**
> >
> > Un graphe, du départ jusqu'au but : un état de départ, des opérateurs, un but.
>
>
> **Pourquoi ça compte.** Un GPS qui trouve ta route, un robot qui range un entrepôt, un programme qui résout un Rubik's Cube : ils font tous la même chose. Ils partent d'un état et cherchent une suite d'actions qui mène au but. Le problème, c'est la taille : un Rubik's Cube a plus de {==43 milliards de milliards==}{>>Le pourquoi vient avant la méthode, et il est large : pas « c'est à l'examen », mais à quoi ça sert dans le monde. Le problème d'abord, la solution ensuite.<<} d'états, impossible de tous les essayer. Toute la question du chapitre est là : **dans quel ordre explorer**, pour trouver le but sans tout visiter.
>
> À voix haute : pourquoi on ne peut pas juste essayer tous les états, un après l'autre ?

> [!ulysse] Ulysse · dicté
> Parce qu'il y en a trop. Ça prendrait genre une éternité.

> [!claude] Claude
> ✅ Exactement : le nombre d'états explose. D'où la question de l'ordre.
>
>
> > [!diapo] Diapo 2 sur 3 · Complément · non officiel
> > **Largeur d'abord.**
> >
> > Un arbre : A ; B et C ; D et E sous B, F sous C ; les niveaux 0, 1 et 2 en bandes. « OUVERTS est une file : premier arrivé, premier servi. »
>
>
> **L'idée.** On explore niveau par niveau : d'abord tous les états à une action du départ, puis tous ceux à deux actions, et ainsi de suite, comme une tache d'encre qui s'étend {==(analogie de Claude)==}{>>Les images du tuteur sont marquées comme les siennes : l'étudiant sait toujours ce qui vient du cours et ce qui n'en vient pas.<<}.
>
> **Comment.** Deux listes :
> - **OUVERTS**, les états découverts mais pas encore explorés ;
> - **FERMÉS**, les états déjà explorés.
>
> À chaque tour, on prend le **premier** état d'OUVERTS, on le ferme, et on ajoute ses enfants **à la fin** d'OUVERTS. Premier arrivé, premier servi : OUVERTS est une **file**.
>
> À voix haute : sur l'arbre de la diapo, on a fermé A, puis B. Lequel est exploré juste après B ?

> [!ulysse] Ulysse · dicté
> {==D, je pense ?==}{>>Une réponse dite en une seconde, et déjà un malentendu visible. Sans la question, il serait passé inaperçu jusqu'à l'exercice.<<} C'est le premier enfant de B.

> [!claude] Claude
> ❌ Pas tout à fait. Quand on ferme B, ses enfants D et E vont **à la fin** d'OUVERTS, derrière C, qui attendait déjà. OUVERTS vaut donc [C, D, E] : le prochain, c'est **C**. C'est ce qui donne « niveau par niveau » : C est au niveau 1, D au niveau 2.
>
> Prendre D tout de suite, c'est une autre stratégie. Justement, c'est la diapo suivante.

> [!claude] Claude
>
> > [!diapo] Diapo 3 sur 3 · Complément · non officiel
> > **Profondeur d'abord.**
> >
> > Le même arbre, un trait qui plonge de A vers B puis D. « OUVERTS est une pile : dernier arrivé, premier servi. »
>
>
> **L'idée.** {==Ton réflexe de tantôt==}{>>L'erreur de l'étudiant devient l'entrée en matière de la diapo suivante : rien n'est perdu, et la différence entre les deux stratégies se voit d'elle-même.<<}, c'est exactement ça : on plonge dans une branche jusqu'au bout avant d'essayer la suivante.
>
> **Comment.** Une seule différence avec la largeur d'abord : les enfants vont **au début** d'OUVERTS. Dernier arrivé, premier servi : OUVERTS devient une **pile**.
>
> Avant l'exercice, une question pour fixer l'idée. La largeur d'abord trouve toujours le chemin qui a le moins d'actions. Qu'est-ce qu'elle paie pour ça ?

> [!ulysse] Ulysse · dicté
> Ben, elle explore tout, niveau par niveau. Fait que si le but est loin, ça fait vraiment beaucoup d'états avant d'y arriver.

> [!claude] Claude
> ✅ C'est ça : elle est sûre, mais elle coûte cher. {==Garde ce problème en tête==}{>>Chaque notion finit sur le problème que la suivante va régler : la raison d'apprendre la prochaine est là avant même qu'elle arrive.<<} : c'est celui que règle le prochain cours, la recherche heuristique.
>
> 📝 **Exercice · La trace de la largeur d'abord**
>
> La trace, c'est ce que contiennent les deux listes à chaque tour. Remplis le tableau, de A jusqu'à ce que le but G soit choisi. Les enfants se prennent dans l'ordre alphabétique.
>
>
> > [!figure] Le graphe
> > A mène à B et C ; B à D et E ; C à E et F ; E à G, le but.

> [!ulysse] Ulysse · {==dans la page du tableau==}{>>Le tableau est une petite page dans la conversation : l'étudiant clique dans les cases et écrit, ou dicte, au choix. Le tuteur lit ce qui est écrit, case par case.<<}
>
> | Tour | OUVERTS | FERMÉS |
> |---|---|---|
> | 0 | [A] | [] |
> | 1 | [B, C] | [A] |
> | 2 | [C, D, E] | [A, B] |
> | 3 | [D, E, E, F] | [A, B, C] |
> | 4 | [E, E, F] | [A, B, C, D] |

> [!claude] Claude
> ⚠️ Presque. Ligne 3 : E est déjà dans OUVERTS, arrivé par B. Ta trace l'ajoute une deuxième fois : {==E serait exploré deux fois==}{>>Le tuteur ne récite pas la règle : il dit ce que la trace entraînerait. Sur un grand graphe, les doublons font exploser la recherche, et c'est le piège classique des traces faites à la main.<<}, et tout ce qui vient après lui aussi.

> [!ulysse] Ulysse · dicté
> Ah oui. On l'ajoute pas s'il est déjà dedans. Je corrige.

> [!ulysse] Ulysse · le tableau corrigé, dans la page du tableau
>
> | Tour | OUVERTS | FERMÉS |
> |---|---|---|
> | 0 | [A] | [] |
> | 1 | [B, C] | [A] |
> | 2 | [C, D, E] | [A, B] |
> | 3 | [D, E, F] | [A, B, C] |
> | 4 | [E, F] | [A, B, C, D] |
> | 5 | [F, G] | [A, B, C, D, E] |
> | 6 | [G] | [A, B, C, D, E, F] |
> | 7 | G est choisi : c'est le but. | |

> [!claude] Claude
> ✅ Ta trace est juste, jusqu'à G. Il reste un quart d'heure sur tes deux heures : on s'arrête là. {==Je note où tu en es==}{>>Rien ne se perd entre deux séances : le tuteur écrit où reprendre dans le dossier du cours, avec ce qui a accroché. La séance suivante repart de là.<<} : la matière est vue, l'exercice est fait, et les doublons ont accroché une fois. La prochaine fois, on s'attaque au problème de tantôt : chercher sans tout explorer.

## 2. Ce que coûte le chemin

**Une semaine plus tard · Pratiquer les exercices**

> [!ulysse] Ulysse
> on fait les exercices sur l'heuristique

> [!claude] Claude
> On y va. Pour te réchauffer, un rappel de la semaine passée, sur un plus gros graphe.
>
> 📝 **Exercice 1 · La largeur d'abord, sur un gros graphe**
>
> Donne la suite des états visités, de S jusqu'à X, en largeur d'abord. Les enfants se prennent de gauche à droite.
>
>
> > [!figure] Le graphe, en quatre niveaux
> > S ; K, B, M ; D et F sous K, F aussi et H sous B, J et P sous M ; L sous D, N et Q sous F, R sous J, T et X sous P. Le but est X.

> [!ulysse] Ulysse · une image
> *L'image du graphe, avec {==un trait rouge par-dessus les états==}{>>Quinze lettres à écrire dans l'ordre, ou un trait à tracer : répondre en dessinant ne coûte presque rien, et un exercice qu'on aurait sauté se fait.<<} : S, K, B, M, D, F, H, J, P, L, N, Q, R, T, X.*

> [!claude] Claude
> Je lis ton tracé : S, K, B, M, D, F, H, J, P, L, N, Q, R, T, X.
>
> ✅ Juste, du premier coup. Et tu n'es pas repassé par F, qu'on atteint à la fois par K et par B : {==les doublons de la semaine passée==}{>>Le tuteur se souvient de ce qui avait accroché la semaine d'avant, et le vérifie au passage, sans en faire un exercice de plus.<<}, c'est réglé.
>
> Note le prix, par contre : quinze états visités pour atteindre X. C'est le problème de la semaine passée, et l'heuristique sert à le régler.

> [!claude] Claude
> **Rappel.** On donne à chaque état une estimation h de ce qui reste à parcourir jusqu'au but. A* ferme toujours l'état d'OUVERTS qui a le plus petit **f = g + h** : g, le coût déjà payé depuis le départ ; h, ce qui reste, estimé.
>
> 📝 **Exercice 2 · A\* sur une carte**
>
> Donne l'ordre dans lequel A* ferme les états, de S jusqu'à G, puis le chemin trouvé. La trace se note ainsi : # · OUVERTS (n, f(n), parent) · FERMÉS. Le chiffre dans chaque cercle est h ; celui sur chaque route, son coût.
>
>
> > [!figure] La carte
> > routes S–A 2, S–B 4, A–C 3, A–D 4, C–E 2, E–G 3, B–G 7 ; dans les cercles, h : S 8, A 7, B 4, C 5, D 6, E 3, G 0.

> [!ulysse] Ulysse · dicté
> Ouf. Réécrire OUVERTS au complet à chaque tour, avec tous les f… c'est long, puis c'est juste des additions. Je sais comment ça marche. Tu peux le faire pour moi ?

> [!claude] Claude
> {==Oui, mais avec ta méthode==}{>>Le tuteur prend volontiers le travail répétitif, mais il fait d'abord expliquer la méthode. Sinon, il ferait l'exercice à la place de l'étudiant.<<}. Dis-moi en gros comment tu t'y prends : comment tu calcules f, quel état tu fermes à chaque tour, et quand tu t'arrêtes. Je ferai les calculs {==exactement comme tu me le dis==}{>>Le calcul passe au tuteur, la méthode reste à l'étudiant : c'est elle, la notion à apprendre. Et si elle a un défaut, le tableau va le montrer.<<}, et je remplirai le tableau.

> [!ulysse] Ulysse · dicté
> Ben, f, c'est g plus h. g, c'est le coût du chemin depuis S, t'additionnes les routes, puis h, c'est le chiffre dans le cercle. À chaque tour, je ferme celui qui a le plus petit f. Si je retrouve un état avec un g plus petit, je garde le plus petit. Puis j'arrête dès que G est dans OUVERTS.

> [!claude] Claude
> Voici ta méthode, appliquée :
>
>
> | Tour | OUVERTS | FERMÉS |
> |---|---|---|
> | 0 | (S, 8, –) | – |
> | 1 | (B, 8, S) (A, 9, S) | S |
> | 2 | (A, 9, S) (G, 11, B) | S, B |
>
>
> Au tour 2, G vient d'entrer dans OUVERTS : {==ta règle d'arrêt dit que c'est fini==}{>>L'étudiant a donné sa méthode, pas seulement une réponse : le tuteur voit exactement quelle règle corriger. « S, B, G », tout seul, aurait juste été faux.<<}, avec le chemin S, B, G, qui coûte 11.
>
> ⚠️ Tout le reste de ta méthode est juste. Mais au tour 2, A attend encore dans OUVERTS, avec f = 9 : par A, il y a peut-être un chemin qui coûte moins que 11. En s'arrêtant là, ta méthode garde le premier chemin trouvé, pas le moins cher.

> [!ulysse] Ulysse · dicté
> Ah, OK. Faut qu'il soit fermé, pas juste dedans. Donc j'arrête quand c'est G que je ferme, quand c'est lui le plus petit.

> [!claude] Claude
> ✅ C'est la bonne règle. La voici, appliquée :
>
>
> | Tour | OUVERTS | FERMÉS |
> |---|---|---|
> | 0 | (S, 8, –) | – |
> | 1 | (B, 8, S) (A, 9, S) | S |
> | 2 | (A, 9, S) (G, 11, B) | S, B |
> | 3 | (C, 10, A) (G, 11, B) (D, 12, A) | S, B, A |
> | 4 | (E, 10, C) (G, 11, B) (D, 12, A) | S, B, A, C |
> | 5 | (G, 10, E) (D, 12, A) | S, B, A, C, E |
> | 6 | (D, 12, A) | S, B, A, C, E, G |
>
>
> Au tour 5, en fermant E, on retrouve G par un autre chemin : g = 10 au lieu de 11. J'ai gardé le plus petit, comme ta méthode le dit. Au tour 6, G a le plus petit f : on le ferme, et c'est fini.
>
> Ordre de fermeture : S, B, A, C, E, G. Chemin : S, A, C, E, G, qui coûte 10, contre 11 par B.
>
> Dernière question, à voix haute : pourquoi A* regarde g + h, et pas seulement h ?

> [!ulysse] Ulysse · dicté
> Parce que h, c'est juste ce qui reste. Si tu regardes juste ça, B a l'air proche, mais ça t'a déjà coûté cher pour te rendre là. g, c'est ce que t'as déjà payé.

> [!claude] Claude
> ✅ Exactement. {==Avec h seul==}{>>La séance se termine sur la réponse au « et alors ? » : pourquoi f = g + h plutôt que h. L'étudiant l'a dite dans ses mots, le tuteur la relie à la stratégie qu'il connaît déjà.<<}, c'est la recherche meilleur d'abord : elle aurait foncé par B et payé 11. A* compte aussi le chemin déjà fait, et trouve le moins cher. Une application de navigation raisonne pareil (analogie de Claude) : le trajet déjà fait, plus une estimation de ce qui reste.

## 3. Une famille, puis une liste

**Trois semaines plus tard · Pratiquer les exercices**

> [!ulysse] Ulysse · dicté
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

> [!ulysse] Ulysse · dicté
> Euh, OK, attends. Je comprends pas comment il sait quand s'arrêter. La deuxième règle appelle ancetre, qui rappelle ancetre… pourquoi ça boucle pas à l'infini ?

> [!claude] Claude
> C'est la bonne question : c'est le cœur de la récursion. On va la voir sur un exemple plus facile à suivre, {==ta famille==}{>>Avec des gens qu'on connaît, qui est le parent de qui va de soi. Il ne reste qu'une chose à suivre : la récursion.<<}. Donne-moi ton père, ton grand-père et ton arrière-grand-père, et je refais le même programme avec eux.

> [!ulysse] Ulysse · dicté
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

> [!ulysse] Ulysse · dicté
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

> [!ulysse] Ulysse · dicté
> Ben, quelqu'un de plus vieux que toi dans ta famille.

> [!claude] Claude
> ⚠️ C'est le sens de tous les jours, mais Prolog ne connaît pas l'âge : nulle part le programme ne dit qui est plus vieux que qui. Il ne connaît que les faits parent.

> [!ulysse] Ulysse · dicté
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

> [!ulysse] Ulysse · dicté
> Ah, OK. Faut que je dise que P, c'est pas la même chose que E. Comme ça :
> ```prolog
> compte([P|R], E, N) :- P \= E, compte(R, E, N).
> ```

> [!claude] Claude
> ✅ Juste. J'ai relancé l'exemple : seulement `N = 2`, maintenant.
>
> Il t'a fallu de l'aide pour trouver cette condition : {==je note l'exercice==}{>>« Difficile » ne veut pas dire raté : la notion a eu besoin d'aide. Le tuteur l'écrit dans le fichier d'exercices du cours, et c'est cette liste qui bâtira la révision avant l'examen.<<} **difficile**. Je te reposerai la même idée plus tard, dans un autre exercice, pour vérifier qu'elle tient.

## 4. Ce qui avait accroché

**Le jour de l'examen, 13 h 40 · Réviser pour l'examen**

> [!ulysse] Ulysse · dicté
> Salut. C'est l'examen ce soir, à 18 h 30. J'ai deux heures pour réviser, après faut que je mange, puis que je dorme un peu avant de partir.

> [!claude] Claude
> Deux heures, c'est assez pour revoir ce qui a accroché depuis septembre. J'ai préparé la liste à partir de ce que j'ai noté difficile, {==de la notion la moins comprise à la plus solide==}{>>La révision ne refait pas tout : elle reprend seulement ce qui a accroché, le plus fragile d'abord, et toujours sous une forme nouvelle.<<} :
> 1. La structure d'un état
> 2. Une condition dans une liste
> 3. Le dernier « false » de Prolog
> 4. La forme clausale
> 5. Traduire une phrase en logique
> 6. Une preuve
>
> On garde la fin pour revenir sur ce qui aura accroché aujourd'hui. On commence.

> [!claude] Claude
> **1 · La structure d'un état**
>
> Une rangée de 4 cases contient 2 jetons noirs (N), 1 jeton blanc (B) et 1 case vide (_). Les jetons glissent d'une case à l'autre.
>
>
> > [!figure] Une rangée de quatre cases
> > deux jetons noirs, un jeton blanc, une case vide.
>
>
> Donne la structure d'un état.

> [!ulysse] Ulysse
> (C1, C2, C3, C4), avec Ci ∈ {N, B, _}

> [!claude] Claude
> Avec ta définition, {==(N, N, N, N) est un état valide==}{>>Pas de correction, pas de question : le tuteur montre seulement ce que la définition laisse passer. L'absurde se voit tout seul, et l'étudiant trouve lui-même ce qui manque.<<} : quatre jetons noirs, alors qu'il n'y en a que deux.

> [!ulysse] Ulysse
> ah oui ok. il manque la contrainte : exactement 2 N, 1 B et 1 _

> [!claude] Claude
> ✅ C'est ça. Une structure d'état a trois morceaux : la **forme** (le tuple), le **domaine** de chaque case, et la **contrainte** sur l'ensemble. C'est la contrainte qui manquait : on y revient à la fin.
>
> **2 · {==Une condition dans une liste==}{>>Un exercice neuf, construit pour viser exactement ce qui avait manqué à compte, trois semaines plus tôt : la condition de la troisième clause. Si elle n'était pas comprise, c'est ici qu'elle casserait.<<}**
>
> Écris `retire(LISTE, ELEMENT, RESTE)` : RESTE est LISTE sans aucun ELEMENT.
>
> Exemple : `?- retire([myrto, pierre, myrto], myrto, R).` donne `R = [pierre]`.

> [!ulysse] Ulysse
> ```prolog
> retire([], E, []).
> retire([E|R], E, R2) :- retire(R, E, R2).
> retire([P|R], E, [P|R2]) :- P \= E, retire(R, E, R2).
> ```

> [!claude] Claude
> ✅ Du premier coup, condition comprise. Je l'ai lancé : seulement `R = [pierre]`. Celle-là est réglée.

> [!ulysse] Ulysse
> c'est quoi le local de l'examen déjà

> [!claude] Claude
> Ton nom de famille commence par G, donc **{==Pouliot-2501==}{>>Le tuteur connaît aussi ce qui entoure le cours : le local, l'heure, le plan de la journée. La question se règle en une ligne, et la révision reprend.<<}**, au 2e étage (de A à J ; de K à Z, c'est le 2700). L'examen va de 18 h 30 à 21 h 20. Pars vers 18 h, comme prévu.

> [!scene] ⏱ Les étapes 3 et 4 · une heure

> [!claude] Claude
> {==Il te reste 30 minutes==}{>>Le temps vient de l'étudiant, qui a dit au début qu'il avait deux heures. Le tuteur le compte pour lui, et ajuste ce qui reste à faire.<<} sur tes deux heures : deux questions, puis on revient sur la structure d'un état.
>
> **5 · Traduire une phrase**
>
> Symboles : Membre, Invité, Accompagné, Salle (« peut entrer dans la salle »).
>
> Traduis : « La salle du club est réservée aux membres et aux invités accompagnés. »

> [!ulysse] Ulysse
> Membre ∧ (Invité ∧ Accompagné) → Salle

> [!claude] Claude
> Avec ta formule, {==ton frère Raoul==}{>>Raoul vient de la séance sur Prolog, trois semaines plus tôt. Une vraie personne, dans un cas concret : l'erreur de la formule se voit sans explication.<<}, membre du club et venu seul, ne peut pas entrer : il lui faudrait aussi être un invité, et accompagné. Pourtant, d'après la phrase, il entre.

> [!ulysse] Ulysse
> ah ok c'est un ou : Membre ∨ (Invité ∧ Accompagné) → Salle

> [!claude] Claude
> ✅ En français, le « et » d'une liste de cas permis veut dire **∨** : un seul cas suffit. C'est un piège qui revient souvent ; s'il n'est pas sur ta feuille, ajoute-le.
>
> **6 · Une preuve**
>
> Il manque la règle de la ligne 3. {==Choisis-la==}{>>Une question posée comme sur Codecademy : la preuve sous les yeux, une case vide, des choix à toucher. Rien à recopier : l'attention va à la seule règle qui compte.<<}.
>
>
> | Ligne | Énoncé | Justification |
> |---|---|---|
> | 1 | pluie(Québec) | Hypothèse |
> | 2 | froid(Québec) | Hypothèse |
> | E | ∀x (pluie(x) ∧ froid(x) → verglas(x)) | Hypothèse |
> | 3 | pluie(Québec) ∧ froid(Québec) | [ ? ] : 1, 2 |
> | 4 | verglas(Québec) | Modus Ponens : 3, E, avec x unifiée avec Québec |
>
> **Choix :** Conjonction · Simplification · Modus Ponens · Modus Tollens

> [!ulysse] Ulysse · touche « Conjonction »
>
> | Ligne | Énoncé | Justification |
> |---|---|---|
> | 1 | pluie(Québec) | Hypothèse |
> | 2 | froid(Québec) | Hypothèse |
> | E | ∀x (pluie(x) ∧ froid(x) → verglas(x)) | Hypothèse |
> | 3 | pluie(Québec) ∧ froid(Québec) | [Conjonction] : 1, 2 |
> | 4 | verglas(Québec) | Modus Ponens : 3, E, avec x unifiée avec Québec |
>
> **Choix :** Conjonction · Simplification · Modus Ponens · Modus Tollens

> [!claude] Claude
> ✅ Conjonction. Le Modus Ponens de la ligne 4 a besoin de toute sa condition sur une seule ligne, pluie(Québec) ∧ froid(Québec) : la ligne 3 la réunit d'abord.

> [!ulysse] Ulysse
> il me reste genre 5 min

> [!claude] Claude
> Alors on finit avec {==celle qui a accroché au début==}{>>La question ratée au début revient à la fin de la même séance, changée : même notion, autre situation. Juste cette fois, elle est comprise, pas apprise par cœur.<<}. Même idée, autre situation :
>
> Une rangée de 5 cases contient 2 jetons rouges (R), 2 jetons bleus (B) et 1 case vide (_). Donne la structure d'un état.

> [!ulysse] Ulysse
> (C1, C2, C3, C4, C5), Ci ∈ {R, B, _}, avec exactement 2 R, 2 B et 1 _

> [!claude] Claude
> ✅ La forme, le domaine et la contrainte, du premier coup. Tout est noté. Va manger : Pouliot-2501, 18 h 30. Bonne chance !

> [!scene] 🎙 Mode vocal, 18 h 07, sur le chemin de l'examen

> [!ulysse] Ulysse · vocal
> Pose-moi trois questions rapides sur la recherche.

> [!claude] Claude · vocal
> Largeur d'abord : OUVERTS, c'est une file ou une pile ?

> [!ulysse] Ulysse · vocal
> Une file.

> [!claude] Claude · vocal
> Et profondeur d'abord ?

> [!ulysse] Ulysse · vocal
> Une pile.

> [!claude] Claude · vocal
> {==A* s'arrête quand le but entre dans OUVERTS==}{>>Les trois questions reprennent les deux pièges des semaines d'avant : la file contre la pile, puis l'arrêt de A\*. Une dernière vérification de ce qui avait accroché.<<}, ou quand il est fermé ?

> [!ulysse] Ulysse · vocal
> Quand il est fermé. Pas juste quand il rentre dedans.

> [!claude] Claude · vocal
> Trois sur trois. Bonne chance !
