---
title: 4. Ce qui avait accroché
description: Le jour de l'examen, 13 h 40 · Réviser pour l'examen
noindex: true
conversation: true
---

**Le jour de l'examen, 13 h 40 · Réviser pour l'examen**

> [!ulysse] Ulysse · message vocal
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
> >
> > ![[tuteur-rangee-de-quatre-cases.svg|Deux jetons noirs, un jeton blanc, une case vide.]]
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
> > [!page] Question · la règle de la ligne 3
> >
> > | Ligne | Énoncé | Justification |
> > |---|---|---|
> > | 1 | pluie(Québec) | Hypothèse |
> > | 2 | froid(Québec) | Hypothèse |
> > | E | ∀x (pluie(x) ∧ froid(x) → verglas(x)) | Hypothèse |
> > | 3 | pluie(Québec) ∧ froid(Québec) | [ ? ] : 1, 2 |
> > | 4 | verglas(Québec) | Modus Ponens : 3, E, avec x unifiée avec Québec |
> >
> > - Conjonction
> > - Simplification
> > - Modus Ponens
> > - Modus Tollens

> [!ulysse] Ulysse · touche « Conjonction »
>
> > [!page] Question · la règle de la ligne 3
> >
> > | Ligne | Énoncé | Justification |
> > |---|---|---|
> > | 1 | pluie(Québec) | Hypothèse |
> > | 2 | froid(Québec) | Hypothèse |
> > | E | ∀x (pluie(x) ∧ froid(x) → verglas(x)) | Hypothèse |
> > | 3 | pluie(Québec) ∧ froid(Québec) | [Conjonction] : 1, 2 |
> > | 4 | verglas(Québec) | Modus Ponens : 3, E, avec x unifiée avec Québec |
> >
> > - Conjonction
> > - Simplification
> > - Modus Ponens
> > - Modus Tollens

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

[[tuteur|← Le tuteur socratique]]
