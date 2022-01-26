<template>
  <div
    class="box"
    style="border: none"
    data-intro="Pick an environmental attribute to view it on the map. The attribute may have additional subtypes or ranges."
    data-position="bottom"
  >
    <div class="label" style="width: 500px">
      1. Select an environmental attribute and view its subtype or range
    </div>
    <multiselect
      v-model="selected"
      :options="layersArray"
      placeholder="Select an attribute"
      @input="layerChanged"
      label="label"
      track-by="label"
      :showLabels="false"
      :showPointer="false"
    />
    <InfoBox />
  </div>
</template>

<script>
import InfoBox from "./InfoBox.vue";

export default {
  name: "EnvironmentsBox",
  components: {
    InfoBox,
  },
  data: function () {
    return {
      layersArray: [],
      layersObject: {},
      selected: "",
    };
  },
  methods: {
    layerChanged: function () {
      this.$root.$emit("speciesChanged", false);
      if (this.selected == null || this.selected.label == "Clear Selection") {
        this.selected = null;
        this.$root.$emit("layerChanged", "removeLayer", null);
        this.$emit("updateEnv", "");
        return;
      }
      let selected;
      for (let key in this.layersArray) {
        if (this.layersArray[key].name == this.selected.name) {
          selected = key;
          break;
        }
      }
      for (let key in this.layersObject) {
        if (this.layersArray[selected].name == this.layersObject[key].name) {
          this.$root.$emit("layerChanged", this.layersArray[selected], key);
          this.$emit("updateEnv", this.layersArray[selected].name);
          break;
        }
      }
    },
    loadSettings: function (envSettings) {
      if (envSettings.env !== null) {
        for (let i = 0; i < this.layersArray.length; i++) {
          if (this.layersArray[i].name == envSettings.env) {
            this.selected = this.layersArray[i];
            this.layerChanged();
            break;
          }
        }
      }
    },
    loadData: function (data) {
      this.layersArray = Object.values(data);
      this.layersObject = data;
      for (let key in this.layersArray) {
        let layer = this.layersArray[key];
        if (layer.hasOwnProperty("remove") && layer.remove == "true") {
          delete this.layersArray[key];
          continue;
        }

        if (layer.subcategories.length > 0 || layer.type == "continuous") {
          this.layersArray[key].label = layer.name;
        }
        if (layer.subcategories.length == 0 && layer.type == "categorical") {
          this.layersArray[key].label = "-" + layer.name;
        }
      }
      this.layersArray.unshift({ label: "Clear Selection" });
    },
  },
  mounted: function () {
    axios
      .get("data.json")
      .then((response) => {
        this.loadData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });

    this.$parent.$on("settingsLoaded", this.loadSettings);
  },
};
</script>
<style>
.multiselect--disabled > .multiselect__tags,
.multiselect--disabled > .multiselect__tags > .multiselect__single,
.multiselect--disabled > .multiselect__tags > span > .multiselect__single {
  background: gray !important;
}

.multiselect,
.multiselect .subcat1 {
  min-height: 18px;
  margin-bottom: 7px;
  font-size: 10pt !important;
  border: black;
  color: #f5faf2;
  max-height: none;
}
.multiselect__tags {
  padding: 0;
  min-height: 18px;
  max-height: 20px;
  border-radius: 3px;
  background-color: rgb(64, 64, 61);
  border: black;
  color: #f5faf2;
  cursor: text;
}
.multiselect__select {
  padding: 0;
  height: 20px;
  -webkit-transition: -webkit-transform 0.5s ease;
  transition: -webkit-transform 0.5s ease;
  -o-transition: transform 0.5s ease;
  transition: transform 0.5s ease;
  transition: transform 0.5s ease, -webkit-transform 0.5s ease;
  display: block;

  -webkit-transform-origin: 50% 40%;
  -ms-transform-origin: 50% 40%;
  transform-origin: 50% 40%;
}
.multiselect--active .multiselect__select {
  -webkit-transform: rotateZ(-180deg);
  -ms-transform: rotate(-180deg);
  transform: rotateZ(-180deg);
}
.multiselect__select:before {
  top: 12px;
  margin: 0 auto;
  color: white;
  border-color: white transparent transparent;
}
.multiselect__input,
.multiselect__single {
  width: 85%;
  color: #f5faf2;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 10pt;
  font-style: italic;
  font-weight: 600;
  line-height: 18px;
  min-height: 18px;
}

.multiselect--disabled > .multiselect__tags > span > .multiselect__single {
  width: 100%;
}
.multiselect__element {
  height: 20px;
  margin: 0px;
  cursor: pointer;
  font-size: 10pt;
  font-style: italic;
  line-height: 18px;
  color: #f5faf2 !important;
}
.multiselect__option {
  min-height: 20px;
  margin: 0px;
  cursor: pointer;
  color: #f5faf2;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 10pt;
  font-style: italic;
  font-weight: 600;
  padding: 0px;
  padding-left: 5px;
  border-top: 1px dotted #f5faf2;
  background: rgb(64, 64, 61);
}
.multiselect__option--highlight {
  background: rgb(64, 64, 61);
}
.multiselect__content-wrapper {
  max-height: 300px;
  border: black;
}
.multiselect__single {
  background: rgb(64, 64, 61);
  color: #f5faf2;
  max-height: 18px;
  overflow: hidden;
  line-height: 18px;
}
.multiselect__input {
  background: rgb(64, 64, 61);
  color: #f5faf2;
  line-height: 18px;
}
.multiselect--disabled {
  background: rgb(64, 64, 61);
  border-radius: 3px;
}
.multiselect--disabled .multiselect__select {
  background: transparent;
}
.multiselect-enter-active {
  -webkit-transition: max-height 1s ease;
  -o-transition: max-height 1s ease;
  transition: max-height 1s ease;
  overflow: hidden;
}
.multiselect-enter,
.multiselect-leave-active {
  max-height: 0px !important;
  overflow: hidden;
}
.multiselect-leave-active {
  -webkit-transition: max-height 0.1s ease;
  -o-transition: max-height 0.1s ease;
  transition: max-height 0.1s ease;
}
.multiselect-enter-to {
  max-height: 300px;
}
.multiselect-leave-to {
  max-height: 0px;
}
</style>
