let TachesDetail = Vue.component('taches-tache', {
  props: {
    tache: {
      type: Object,
      required: true
    }
  },
  methods: {
    toggle: function () {
      this.tache.terminee = !this.tache.terminee
    },
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
  components: {
    TachesDetail
  },
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
  data: function () {
    return {
        nom: ''
    }
  },
  methods: {
    envoyer: function () {
      this.$emit('envoyer', this.nom )
    }
  },
  template: `<div class="field has-addons">
                <div class="control">
                    <input v-model="nom" 
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
  components: {
    TachesListe, TachesForm
  },
  data: {
    taches: Data.taches
  },
  methods: {
    genererId: function () {
      let max = 0;
      for(let tache of this.taches) {
        if (tache.id > max) {
          max = tache.id;
        }
      }
      return max + 1;
    },
    ajouterTache: function (nom) {
      let tache = {};
      tache.id = this.genererId();
      tache.nom = nom;
      tache.terminee = false;
      this.taches.push(tache);
    },
    supprimerTache: function (idTache) {
      this.taches = this.taches.filter( el => el.id !== idTache );
    }
  },
  computed: {
    triTachesNom: function () {
      return this.taches.sort((a, b) => {
        return b.nom - a.nom;
      });
    },
    tachesEnCours: function () {
      return this.triTachesNom.filter( el => el.terminee === false);
    },
    tachesTerminees: function () {
      return this.triTachesNom.filter( el => el.terminee === true);
    }
  },
});
