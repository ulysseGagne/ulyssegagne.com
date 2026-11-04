---
title: Guide de style
description: Tous les éléments du site, et le Markdown qui les produit.
noindex: true
date: 2026-11-04
statut: première version
---

Chaque page du site est un fichier Markdown, avec ses images à côté. Voici chaque élément, suivi du Markdown qui le produit.

## Les faits sous le titre

Les propriétés en haut du fichier deviennent les faits sous le titre de la page. Celles de cette page :

```md
---
title: Guide de style
date: 2026-11-04
statut: première version
---
```

## Les titres

### Un titre de section

#### Un sous-titre

```md
### Un titre de section
#### Un sous-titre
```

## Le texte

Un paragraphe en **gras**, en *italique*, ==surligné==, avec du `code` et [un lien vers une page du site](/guide-de-style). Un lien qui sort du site finit par une flèche : [le site de Steph Ango](https://stephango.com).

```md
Un paragraphe en **gras**, en *italique*, ==surligné==, avec du `code` et [un lien](/guide-de-style).
Un lien qui sort du site : [le site de Steph Ango](https://stephango.com).
```

## Les listes

- Trouver une cachette
  - Un banc
  - Une sculpture
- Répondre aux questions

1. Se cacher
   1. Choisir un lieu
   2. Attendre
2. Chercher

- [x] Réserver le Grand Axe
- [ ] Imprimer l'affiche

```md
- Trouver une cachette
  - Un banc

1. Se cacher
   1. Choisir un lieu

- [x] Réserver le Grand Axe
- [ ] Imprimer l'affiche
```

## Un pli

> [!note]- Hide & Stalk, 2026. Un cache-cache sur tout le campus.
> Une app web comme maître du jeu, inspirée de Jet Lag: The Game ; jouée le 5 octobre 2026.

```md
> [!note]- Hide & Stalk, 2026. Un cache-cache sur tout le campus.
> Une app web comme maître du jeu, inspirée de Jet Lag: The Game.
```

## Un encadré

> [!note] À savoir
> Une partie dure deux heures.

```md
> [!note] À savoir
> Une partie dure deux heures.
```

## Une citation

> on a joué l'autre jour pour tester et c'était INSANE

```md
> on a joué l'autre jour pour tester et c'était INSANE
```

## Du code

```sh
npm install
npm run dev
```

````md
```sh
npm install
npm run dev
```
````

## Un séparateur

Avant.

---

Après.

```md
---
```

## Les sources

Le jeu s'inspire de Jet Lag: The Game[^1].

[^1]: Une série YouTube de Wendover Productions.

```md
Le jeu s'inspire de Jet Lag: The Game[^1].

[^1]: Une série YouTube de Wendover Productions.
```

## Une image

![L'affiche du souper d'accueil du Club d'IA](./images/2026-09-10-reminder-post-image.png)
*2026-09-10-reminder-post-image.png*

```md
![L'affiche du souper d'accueil](./images/2026-09-10-reminder-post-image.png)
*2026-09-10-reminder-post-image.png*
```

## Plusieurs captures

![L'écran d'accueil de Hide & Stalk](./images/hide-and-stalk-1-home-screen.png) ![Choisir une question](./images/hide-and-stalk-2-pick-a-question.png) ![La carte du campus et ses stations](./images/hide-and-stalk-3-map-nearest-avelo-station.png)

```md
![L'écran d'accueil](./images/hide-and-stalk-1-home-screen.png) ![Choisir une question](./images/hide-and-stalk-2-pick-a-question.png) ![La carte](./images/hide-and-stalk-3-map-nearest-avelo-station.png)
```
