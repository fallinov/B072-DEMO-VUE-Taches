let TachesDetail = Vue.component('taches-tache', {
  // Propriétés (permettent au parent de passer des données) Parent => Fils
  props: {
    tache: {
      type: Object,
      required: true
    }
  },
  methods: {
    /**
     * Inverse le status de la tâche (en cours / terminée)
     */
    toggle: function () {
      this.tache.terminee = !this.tache.terminee
    },
    /**
     * Emmet un événment "bouton-supprimer" avec l'id de la tâche en paramètre
     *
     * Permet de communiquer avec le parent. Fils => Parent
     * Le parent va écouter l'événement du fils :
     *     <taches-tache v-on:bouton-supprimer="nomMéthode" />
     */
    supprimer: function () {
      this.$emit('bouton-supprimer', this.tache.id)
    }
  },
  template: `<a class="panel-block" @click="toggle">
                <div>{{ tache.nom }}</div>

                <button @click="supprimer" class="button is-danger is-outlined">
                    <span class="icon is-small">
                       <i class="far fa-trash-alt"></i>
                    </span>
                </button>
            </a>`
});

let TachesListe = Vue.component('taches-liste', {
  // Composants utilisés par TachesListe
  components: {
    TachesDetail
  },
  // Propriétés (permettent au parent de passer des données) Parent => Fils
  props: {
    titre: {
      type: String,
      default: "Liste des tâches"
    },
    couleur: {
      type: String,
      default: "#ededed"
    },
    taches: {
      type: Array,
      required: true
    },
  },
  methods: {
    /**
     * Emmet un événment "supprimer-tache" avec id de la tâche en paramètre
     *
     * Permet de communiquer avec le parent. Fils => Parent
     * Le parent va écouter l'événement du fils :
     *     <taches-liste v-on:supprimer-tache="nomMéthode" />
     * @param idTache {Number}
     */
    supprimerTache: function (idTache) {
      this.$emit('supprimer-tache', idTache)
    }
  },
  template: `<article class="panel" >
                <p :style="'background-color:' + couleur" class="panel-heading">
                    {{ titre }} ({{ taches.length }})
                </p>

                <taches-tache
                        v-for="tache in taches"
                        :key="tache.id"
                        :tache="tache"
                        v-on:bouton-supprimer="supprimerTache"
                />
            </article>`
});

let TachesForm = Vue.component('taches-form', {
  // Dans les composants, les données sont retournées via une fonction.
  data: function () {
    return {
        nom: ''
    }
  },
  methods: {
    /**
     * Emmet un événement "envoyer" avec le nom de la tâche en paramètre
     * et réinitialise le formulaire
     *
     * Permet de communiquer avec le parent. Fils => Parent
     * Le parent va écouter l'événement du fils :
     *     <taches-form v-on:envoyer="nomMéthode" />
     */
    envoyer: function () {
      this.$emit('envoyer', this.nom )
      this.nom = ''
    }
  },
  template: `<div class="field has-addons">
                <div class="control">
                    <input  v-model="nom"
                            @keyup.enter="envoyer"
                            class="input"
                            type="text"
                            placeholder="Saisir une tâche" />
                </div>
                <div class="control">
                    <a @click="envoyer" class="button is-primary has-text-weight-bold">
                        Ajouter
                    </a>
                </div>
             </div>`
});

let app = new Vue({
  el: "#app",
  // Composants utilisés par app
  components: {
    TachesListe, TachesForm
  },
  data: {
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
      }
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
     * Créer une nouvelle tâche à partir du nom passé en paramètre
     * et l'ajoute au tableau des tâches
     * @param nom {String} - Nom de la nouvelle tâche
     */
    ajouterTache: function (nom) {
      // Création d'une nouvelle tâche
      let tache = {
        id: this.genererId(),
        nom: nom,
        terminee: false
      };
      // Ajout de la nouvelle tâche à la fin du tableau des tâches
      this.taches.push(tache);
    },
    supprimerTache: function (idTache) {
      this.taches = this.taches.filter( el => el.id !== idTache );
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
