<template>
  <div>
    <div id="search-tool">
      <div id="search-tool-contents">
        <div id="app">
          <EnvironmentsBox @updateEnv="updateEnv" />
          <SubcategoriesBox
            :subcategories="layers"
            @updateSubCat="updateSubCat"
          />
          <SpeciesBox
            @updateSpecies="updateSpecies"
            @updatePrediction="updatePrediction"
            @updateObservation="updateObservation"
            @updateNameConvention="updateNameConvention"
          />
          <ExtraControls
            @updateOverlays="updateOverlays"
            :env.sync="env"
            :observation.sync="observation"
            :overlays.sync="overlays"
            :prediction.sync="prediction"
            :species.sync="species"
            :subcat.sync="subcat"
            :naming.sync="naming"
          />
        </div>
      </div>
    </div>
    <SpeciesDensity />
  </div>
</template>

<script>
import SpeciesDensity from "./components/SpeciesDensity.vue";
import EnvironmentsBox from "./components/EnvironmentsBox.vue";
import SubcategoriesBox from "./components/SubcategoriesBox.vue";
import SpeciesBox from "./components/SpeciesBox.vue";
import ExtraControls from "./components/ExtraControls";

export default {
  name: "app",
  components: {
    SpeciesDensity,
    EnvironmentsBox,
    SubcategoriesBox,
    SpeciesBox,
    ExtraControls,
  },
  data: function () {
    return {
      layers: [1, 2, 3, 4],
      overlays: [],
      env: "",
      subcat: [],
      species: "",
      prediction: true,
      observation: false,
      naming: "common",
    };
  },
  mounted: function () {
    let index,
      url = window.location.href;
    if ((index = url.search("#")) !== -1) {
      try {
        var settings = JSON.parse(decodeURI(url.substr(index + 1)));
      } catch (e) {
        alert("The url you entered is not valid!");
        return;
      }

      setTimeout(() => {
        this.loadEnvSettings(settings);
      }, 2000);
    }
  },
  methods: {
    loadEnvSettings(settings) {
      if (!NPMap.config.L) {
        return setTimeout(() => this.loadEnvSettings(settings), 100);
      }
      let envSettings = {};
      let errMsg = "We found some things we couldn't load:\n";

      if (typeof settings.env !== "undefined") {
        envSettings.env = settings.env;
      } else {
        envSettings.env = null;
        errMsg += "The environmental layer\n";
      }

      if (typeof settings.overlays !== "undefined") {
        envSettings.overlays = settings.overlays;
      } else {
        envSettings.overlays = null;
        errMsg += "The map overlays\n";
      }

      if (typeof settings.prediction !== "undefined") {
        envSettings.prediction = settings.prediction;
      } else {
        envSettings.prediction = null;
        errMsg += "The prediction setting\n";
      }

      if (typeof settings.observation !== "undefined") {
        envSettings.observation = settings.observation;
      } else {
        envSettings.observation = null;
        errMsg += "The observation setting\n";
      }

      if (typeof settings.naming !== "undefined") {
        envSettings.naming = settings.naming;
      } else {
        envSettings.naming = null;
        errMsg += "The naming convention";
      }

      /* TODO convert this to Vue pipeline */
      if (settings.blending === false) {
        toggleBlending();
      }

      if (typeof settings.bounds !== "undefined") {
        NPMap.config.L.fitBounds([
          settings.bounds._southWest,
          settings.bounds._northEast,
        ]);
      } else {
        envSettings.bounds = null;
        errMsg += "The map bounds";
      }

      if (typeof settings.subcat !== "undefined") {
        envSettings.subcat = settings.subcat;
      } else {
        envSettings.subcat = null;
        errMsg += "The subcategory options\n";
      }

      if (typeof settings.species !== "undefined") {
        envSettings.species = settings.species;
      } else {
        envSettings.species = null;
        errMsg += "The species selection\n";
      }

      /* TODO display to user at some point */
      if (errMsg.length > 39) {
        console.log(errMsg);
      }

      this.$emit("settingsLoaded", envSettings);
    },
    updateEnv: function (selectedEnv) {
      this.env = selectedEnv;
    },
    updateSubCat: function (selectedSubCat) {
      this.subcat = selectedSubCat;
    },
    updateSpecies: function (selectedSpecies) {
      this.species = selectedSpecies;
    },
    updateOverlays: function (selectedOverlays) {
      this.overlays = selectedOverlays;
    },
    updatePrediction: function (selectedPrediction) {
      this.prediction = selectedPrediction;
    },
    updateObservation: function (selectedObservation) {
      this.observation = selectedObservation;
    },
    updateNameConvention: function (namingConvention) {
      this.naming = namingConvention;
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#search-tool-contents {
  width: 1050px;
}
</style>
