let app = new Vue({
  el: "#app",
  data: {
    nomNouvelleTache: '',
    taches: [
      {
        id: 1,
        nom: 'Acheter du pain',
        terminee: false
      },
      {
        id: 2,
        nom: 'Nettoyer le frigo',
        terminee: false
      },
      {
        id: 3,
        nom: 'Faire tuto Vue Mastery',
        terminee: true
      },
      {
        id: 4,
        nom: 'Envoyer des fleurs',
        terminee: false
      },

    ]
  },
  methods: {
    /**
     * Génère un nouvel id à partir de l'id actule le plus grand (max)
     * @returns {Number}
     */
    genererId: function () {
      let max = 0;
      for(let tache of this.taches) {
        if (tache.id > max) {
          max = tache.id;
        }
      }
      return max + 1;
    },
    /**
     * Méthode appelée par le formulaire d'ajout
     * Créer une nouvelle tâche et l'ajoute au tableau des tâches
     */
    ajouterTache: function () {
      // Création d'une nouvelle tâche
      let tache = {
        id: this.genererId(),
        nom: this.nomNouvelleTache,
        terminee: false
      };
      // Ajout de la nouvelle tâche à la fin du tableau des tâches
      this.taches.push(tache);
      // Réinitialise le nomNouvelleTache (et le champ du formulaire)
      this.nomNouvelleTache = '';
    },
    /**
     * Inverse le status de la tâche en paramètre (en cours / terminée)
     * @param tache {Object}
     */
    toggleTache: function (tache) {
      // Inverse le status de la tâche
      tache.terminee = !tache.terminee
    },
    /**
     * Supprime la tâche passée en paramètre du tableau des tâches
     * @param idTache {Number}
     */
    supprimerTache: function (idTache) {
      // Filtre le tableau en gardant les éléments dont l'id est
      // différent de l'id de la tâche à supprimer
      this.taches = this.taches.filter( tache => tache.id !== idTache );
    }
  },
  computed: {
    /**
     * Retourne le tableau des tâches triées par nom ASC
     * @returns {Array}
     */
    triTachesNom: function () {
      /*return this.taches.sort((a, b) => {
        return b.nom < a.nom;
      });*/
      // Trie les tâches par nom en prenant en compte la langue française
      // Résoud le problème du tri des accents
      return this.taches.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
    },
    /**
     * Retourne le tableau des tâches en cours triées par nom ASC
     * @returns {Array}
     */
    tachesEnCours: function () {
      // Filtre le tableau des tâches triées par nom.
      // Ne garde que les tâches en cours (non terminées)
      return this.triTachesNom.filter( tache => tache.terminee === false);
    },
    /**
     * Retourne le tableau des tâches terminées triées par nom ASC
     * @returns {Array}
     */
    tachesTerminees: function () {
      // Filtre le tableau des tâches triées par nom.
      // Ne garde que les tâches terminées
      return this.triTachesNom.filter( tache => tache.terminee === true);
    }
  },
});
