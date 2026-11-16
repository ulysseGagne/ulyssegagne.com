---
title: 2. Ce que coûte le chemin
description: Une semaine plus tard · Pratiquer les exercices
noindex: true
conversation: true
---

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
> >
> > ![[tuteur-graphe-de-s-a-x.svg|S ; K, B, M ; D et F sous K, F aussi et H sous B, J et P sous M ; L sous D, N et Q sous F, R sous J, T et X sous P. Le but est X.]]

> [!ulysse] Ulysse · une image
> {==![[tuteur-graphe-de-s-a-x-trace-en-rouge.svg|L'image du graphe, avec un trait rouge par-dessus les états : S, K, B, M, D, F, H, J, P, L, N, Q, R, T, X.]]==}{>>Quinze lettres à écrire dans l'ordre, ou un trait à tracer : répondre en dessinant ne coûte presque rien, et un exercice qu'on aurait sauté se fait.<<}

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
> >
> > ![[tuteur-carte-de-s-a-g.svg|Les routes S–A 2, S–B 4, A–C 3, A–D 4, C–E 2, E–G 3, B–G 7 ; dans les cercles, h : S 8, A 7, B 4, C 5, D 6, E 3, G 0.]]

> [!ulysse] Ulysse · message vocal
> Ouf. Réécrire OUVERTS au complet à chaque tour, avec tous les f… c'est long, puis c'est juste des additions. Je sais comment ça marche. Tu peux le faire pour moi ?

> [!claude] Claude
> {==Oui, mais avec ta méthode==}{>>Le tuteur prend volontiers le travail répétitif, mais il fait d'abord expliquer la méthode. Sinon, il ferait l'exercice à la place de l'étudiant.<<}. Dis-moi en gros comment tu t'y prends : comment tu calcules f, quel état tu fermes à chaque tour, et quand tu t'arrêtes. Je ferai les calculs {==exactement comme tu me le dis==}{>>Le calcul passe au tuteur, la méthode reste à l'étudiant : c'est elle, la notion à apprendre. Et si elle a un défaut, le tableau va le montrer.<<}, et je remplirai le tableau.

> [!ulysse] Ulysse · message vocal
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

> [!ulysse] Ulysse · message vocal
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

> [!ulysse] Ulysse · message vocal
> Parce que h, c'est juste ce qui reste. Si tu regardes juste ça, B a l'air proche, mais ça t'a déjà coûté cher pour te rendre là. g, c'est ce que t'as déjà payé.

> [!claude] Claude
> ✅ Exactement. {==Avec h seul==}{>>La séance se termine sur la réponse au « et alors ? » : pourquoi f = g + h plutôt que h. L'étudiant l'a dite dans ses mots, le tuteur la relie à la stratégie qu'il connaît déjà.<<}, c'est la recherche meilleur d'abord : elle aurait foncé par B et payé 11. A* compte aussi le chemin déjà fait, et trouve le moins cher. Une application de navigation raisonne pareil (analogie de Claude) : le trajet déjà fait, plus une estimation de ce qui reste.

**Séance suivante : [[3-une-famille-puis-une-liste|3. Une famille, puis une liste]]**

[[tuteur|← Le tuteur socratique]]
