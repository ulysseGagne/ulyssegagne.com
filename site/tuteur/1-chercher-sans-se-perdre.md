---
title: 1. Chercher sans se perdre
description: Un mardi soir de septembre · Apprendre la matière
noindex: true
conversation: true
---

**Un mardi soir de septembre · Apprendre la matière**

> [!ulysse] Ulysse · message vocal
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

> [!ulysse] Ulysse · message vocal
> Euh… un état de départ, un état but… puis les opérateurs. Les actions qui te font passer d'un état à un autre.

> [!claude] Claude
> ✅ Les trois y sont. Mis ensemble, ils forment un graphe : chaque état est un nœud, chaque opérateur une flèche. Chercher, c'est trouver un chemin dans ce graphe.
>
>
> > [!diapo] Diapo 1 sur 3 · Complément · non officiel
> > **Pourquoi chercher ?**
> >
> > ![[tuteur-diapo-1-pourquoi-chercher.svg|Un graphe, du départ jusqu'au but : un état de départ, des opérateurs, un but.]]
> >
> > Un état de départ · des opérateurs · un but
>
>
> **Pourquoi ça compte.** Un GPS qui trouve ta route, un robot qui range un entrepôt, un programme qui résout un Rubik's Cube : ils font tous la même chose. Ils partent d'un état et cherchent une suite d'actions qui mène au but. Le problème, c'est la taille : un Rubik's Cube a plus de {==43 milliards de milliards==}{>>Le pourquoi vient avant la méthode, et il est large : pas « c'est à l'examen », mais à quoi ça sert dans le monde. Le problème d'abord, la solution ensuite.<<} d'états, impossible de tous les essayer. Toute la question du chapitre est là : **dans quel ordre explorer**, pour trouver le but sans tout visiter.
>
> À voix haute : pourquoi on ne peut pas juste essayer tous les états, un après l'autre ?

> [!ulysse] Ulysse · message vocal
> Parce qu'il y en a trop. Ça prendrait genre une éternité.

> [!claude] Claude
> ✅ Exactement : le nombre d'états explose. D'où la question de l'ordre.
>
>
> > [!diapo] Diapo 2 sur 3 · Complément · non officiel
> > **Largeur d'abord**
> >
> > ![[tuteur-diapo-2-largeur-d-abord.svg|Un arbre : A ; B et C ; D et E sous B, F sous C ; les niveaux 0, 1 et 2 en bandes.]]
> >
> > OUVERTS est une file : premier arrivé, premier servi
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

> [!ulysse] Ulysse · message vocal
> {==D, je pense ?==}{>>Une réponse dite en une seconde, et déjà un malentendu visible. Sans la question, il serait passé inaperçu jusqu'à l'exercice.<<} C'est le premier enfant de B.

> [!claude] Claude
> ❌ Pas tout à fait. Quand on ferme B, ses enfants D et E vont **à la fin** d'OUVERTS, derrière C, qui attendait déjà. OUVERTS vaut donc [C, D, E] : le prochain, c'est **C**. C'est ce qui donne « niveau par niveau » : C est au niveau 1, D au niveau 2.
>
> Prendre D tout de suite, c'est une autre stratégie. Justement, c'est la diapo suivante.

> [!claude] Claude
>
> > [!diapo] Diapo 3 sur 3 · Complément · non officiel
> > **Profondeur d'abord**
> >
> > ![[tuteur-diapo-3-profondeur-d-abord.svg|Le même arbre, un trait qui plonge de A vers B puis D.]]
> >
> > OUVERTS est une pile : dernier arrivé, premier servi
>
>
> **L'idée.** {==Ton réflexe de tantôt==}{>>L'erreur de l'étudiant devient l'entrée en matière de la diapo suivante : rien n'est perdu, et la différence entre les deux stratégies se voit d'elle-même.<<}, c'est exactement ça : on plonge dans une branche jusqu'au bout avant d'essayer la suivante.
>
> **Comment.** Une seule différence avec la largeur d'abord : les enfants vont **au début** d'OUVERTS. Dernier arrivé, premier servi : OUVERTS devient une **pile**.
>
> Avant l'exercice, une question pour fixer l'idée. La largeur d'abord trouve toujours le chemin qui a le moins d'actions. Qu'est-ce qu'elle paie pour ça ?

> [!ulysse] Ulysse · message vocal
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
> >
> > ![[tuteur-graphe-de-a-a-g.svg|A mène à B et C ; B à D et E ; C à E et F ; E à G, le but.]]

> [!ulysse] Ulysse · {==dans la page du tableau==}{>>Le tableau est une petite page dans la conversation : l'étudiant clique dans les cases et écrit, ou dicte, au choix. Le tuteur lit ce qui est écrit, case par case.<<}
>
> > [!page] Trace · largeur d'abord
> >
> > | Tour | OUVERTS | FERMÉS |
> > |---|---|---|
> > | 0 | [A] | [] |
> > | 1 | [B, C] | [A] |
> > | 2 | [C, D, E] | [A, B] |
> > | 3 | [D, E, E, F] | [A, B, C] |
> > | 4 | [E, E, F] | [A, B, C, D] |

> [!claude] Claude
> ⚠️ Presque. Ligne 3 : E est déjà dans OUVERTS, arrivé par B. Ta trace l'ajoute une deuxième fois : {==E serait exploré deux fois==}{>>Le tuteur ne récite pas la règle : il dit ce que la trace entraînerait. Sur un grand graphe, les doublons font exploser la recherche, et c'est le piège classique des traces faites à la main.<<}, et tout ce qui vient après lui aussi.

> [!ulysse] Ulysse · message vocal
> Ah oui. On l'ajoute pas s'il est déjà dedans. Je corrige.

> [!ulysse] Ulysse · le tableau corrigé, dans la page du tableau
>
> > [!page] Trace · largeur d'abord
> >
> > | Tour | OUVERTS | FERMÉS |
> > |---|---|---|
> > | 0 | [A] | [] |
> > | 1 | [B, C] | [A] |
> > | 2 | [C, D, E] | [A, B] |
> > | 3 | [D, E, F] | [A, B, C] |
> > | 4 | [E, F] | [A, B, C, D] |
> > | 5 | [F, G] | [A, B, C, D, E] |
> > | 6 | [G] | [A, B, C, D, E, F] |
> > | 7 | G est choisi : c'est le but. | |

> [!claude] Claude
> ✅ Ta trace est juste, jusqu'à G. Il reste un quart d'heure sur tes deux heures : on s'arrête là. {==Je note où tu en es==}{>>Rien ne se perd entre deux séances : le tuteur écrit où reprendre dans le dossier du cours, avec ce qui a accroché. La séance suivante repart de là.<<} : la matière est vue, l'exercice est fait, et les doublons ont accroché une fois. La prochaine fois, on s'attaque au problème de tantôt : chercher sans tout explorer.

**Séance suivante : [[2-ce-que-coute-le-chemin|2. Ce que coûte le chemin]]**

[[tuteur|← Le tuteur socratique]]
