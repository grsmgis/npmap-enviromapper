<template>
  <div class="subcat-slide box">
    &nbsp;
    <multiselect
      v-if="mutableType !== 'continuous'"
      class="subcat1"
      :class="{ 'subcat-selected': selected1 !== '' && selected1 !== null }"
      v-model="selected1"
      :options="mutableSubcategories"
      :close-on-select="true"
      placeholder="Select a subtype"
      label="fullname"
      track-by="fullname"
      :show-labels="false"
      :showPointer="false"
      :disabled="!populated"
    />

    <multiselect
      v-if="mutableType !== 'continuous'"
      class="subcat2"
      :class="{ 'subcat-selected': selected2 !== '' && selected2 !== null }"
      v-model="selected2"
      :options="mutableSubcategories"
      :close-on-select="true"
      placeholder="Select another subtype"
      label="fullname"
      track-by="fullname"
      :show-labels="false"
      :showPointer="false"
      :disabled="!populated"
    />

    <span v-if="mutableType == 'continuous'">
      <div id="continuous-spectrum">
        <div
          class="label continuous-block"
          style="
            background-color: rgb(231, 115, 163);
            border-radius: 3px 3px 0 0;
          "
        >
          <input type="checkbox" v-model="range1" />{{ mutableRanges[0] }}
        </div>
        <div
          class="label continuous-block"
          style="background-color: rgb(180, 51, 139); border-radius: 0"
        >
          <input type="checkbox" v-model="range2" />{{ mutableRanges[1] }}
        </div>
        <div
          class="label continuous-block"
          style="
            background-color: rgb(110, 23, 119);
            border-radius: 0 0 3px 3px;
          "
        >
          <input type="checkbox" v-model="range3" />{{ mutableRanges[2] }}
        </div>
      </div>
    </span>
  </div>
</template>

<script>
import InfoBox from "./InfoBox.vue";
import Multiselect from "vue-multiselect";

export default {
  name: "SubcategoriesBox",
  components: {
    InfoBox,
    Multiselect,
  },
  props: ["subcategories", "type", "ranges", "firstflag"],
  data: function () {
    return {
      selected1: "",
      oldSelected1: "",
      selected2: "",
      oldSelected2: "",
      maps: {},
      populated: false,
      mutableSubcategories: this.subcategories,
      mutableType: this.type,
      mutableRanges: this.ranges,
      range1: null,
      range2: null,
      range3: null,
    };
  },
  methods: {
    findSubcatIndex(fullname) {
      for (let i in this.mutableSubcategories) {
        if (this.mutableSubcategories[i].fullname == fullname) {
          return this.mutableSubcategories[i];
        }
      }
      return -1;
    },
    subcatChange: function (value, subcatNumber) {
      let swap = ["2", "1"];
      let elements = document.querySelectorAll(
        ".subcat" +
          swap[subcatNumber - 1] +
          "> .multiselect__content-wrapper > .multiselect__content > .multiselect__element > .multiselect__option > span"
      );
      if (value !== null && value.fullname !== "Clear Selection") {
        value = value.fullname;
        for (let i = 0; i < elements.length; i++) {
          if (value == elements[i].innerText.trim()) {
            elements[i].style.opacity = "0.5";
            elements[i].parentNode.parentNode.style.pointerEvents = "none";
          } else {
            elements[i].style.opacity = "1";
            elements[i].parentNode.parentNode.style.pointerEvents = "auto";
          }
        }
      } else {
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.opacity = "1";
          elements[i].parentNode.parentNode.style.pointerEvents = "auto";
        }
      }
      if (value == null) value = { fullname: "null" };
      this.$root.$emit("subcatChanged", value.fullname, subcatNumber);
      let s1 = this.selected1 == null ? "" : this.selected1.fullname;
      let s2 = this.selected2 == null ? "" : this.selected2.fullname;
      this.$emit("updateSubCat", [s1, s2]);
    },
    subcatChanged1: function (value) {
      let clear = false;
      if (value !== null && value.fullname == "Clear Selection") {
        clear = true;
        value = null;
      }
      this.subcatChange(value, 1);
      let index, name;
      if (this.oldSelected1 !== "") {
        index = this.findSubcatIndex(this.oldSelected1.fullname).index;
        name = this.selected_layer_name + "_" + index + "_1";
        this.updateLayer(name, false);
      }
      let fullname =
        value == null ? this.oldSelected1.fullname : this.selected1.fullname;
      index = this.findSubcatIndex(fullname).index;
      name = this.selected_layer_name + "_" + index + "_1";
      let add = value == null ? false : true;
      if (index !== undefined) this.updateLayer(name, add);
      if (value !== null) this.oldSelected1 = this.selected1;
      if (clear) this.selected1 = "";
    },
    subcatChanged2: function (value) {
      let clear = false;
      if (value !== null && value.fullname == "Clear Selection") {
        clear = true;
        value = null;
      }
      this.subcatChange(value, 2);
      let index, name;
      if (this.oldSelected2 !== "") {
        index = this.findSubcatIndex(this.oldSelected2.fullname).index;
        name = this.selected_layer_name + "_" + index + "_2";
        this.updateLayer(name, false);
      }
      let fullname =
        value == null ? this.oldSelected2.fullname : this.selected2.fullname;
      index = this.findSubcatIndex(fullname).index;
      name = this.selected_layer_name + "_" + index + "_2";
      let add = value == null ? false : true;
      if (index !== undefined) this.updateLayer(name, add);
      if (value !== null) this.oldSelected2 = this.selected2;
      if (clear) this.selected2 = "";
    },
    updateLayer: function (environment, add) {
      if (add) {
        console.log(environment);
        let geoJSON = undefined;
        console.log('Attempting to fetch species mbtiles... id is:', environment);
        $.ajax({
          url: `https://atlas-stg.geoplatform.gov/v4/atlas-user.${environment}.json?access_token=pk.eyJ1IjoiYXRsYXMtdXNlciIsImEiOiJjazFmdGx2bjQwMDAwMG5wZmYwbmJwbmE2In0.lWXK2UexpXuyVitesLdwUg`,
          type : "get",
          async: false,
          success : function(response) {
            geoJSON = response;
          },
          error: function() {
            console.log(`Could not find tiles for ${environment}`);
          }
        });
        if (!geoJSON) {
          console.warn(`Could not find tiles for ${environment}`);
          return;
        }
        let temp = L.npmap.layer.mapbox({
          name: environment,
          opacity: 0.5, //blendingActive ? .5 : 1,
          tileJson: geoJSON
        });
        this.maps[environment] = temp.addTo(NPMap.config.L);
      } else {
        NPMap.config.L.removeLayer(this.maps[environment]);
      }
    },
    loadSettings: function (envSettings) {
      if (envSettings.subcat !== null) {
        for (let i = 0; i < this.mutableSubcategories.length; i++) {
          let subcat = this.mutableSubcategories[i];
          if (subcat.fullname == envSettings.subcat[0]) this.selected1 = subcat;
          if (subcat.fullname == envSettings.subcat[1]) this.selected2 = subcat;
        }
      }
    },
  },
  watch: {
    range1: function (val) {
      if (val == null) return;
      this.updateLayer(this.selected_layer_name + "_0", val);
    },
    range2: function (val) {
      if (val == null) return;
      this.updateLayer(this.selected_layer_name + "_1", val);
    },
    range3: function (val) {
      if (val == null) return;
      this.updateLayer(this.selected_layer_name + "_2", val);
    },
    subcategories: function () {
      this.mutableSubcategories = this.subcategories;
    },
    type: function () {
      this.mutableType = this.type;
    },
    range: function () {
      this.mutableRanges = this.ranges;
    },
    selected1: function (val) {
      setTimeout(() => this.subcatChanged1(val), 25);
    },
    selected2: function (val) {
      setTimeout(() => this.subcatChanged2(val), 25);
    },
  },
  mounted: function () {
    this.$root.$on("layerChanged", (data, id) => {
      if (data == "removeLayer") {
        this.populated = false;
      }
      this.selected1 = null;
      this.selected2 = null;
      this.oldSelected1 = "";
      this.oldSelected2 = "";
      if (data == "removeLayer") return;

      // for example "con_slope"
      this.selected_layer_name = id;
      if (data.type == "categorical") {
        this.mutableSubcategories = data.subcategories.map(function (d, i) {
          return {
            name: d.name.substring(0, 30) + "...",
            fullname: d.name,
            index: i,
            remove: "remove" in d ? d.remove : "false",
          };
        });
        this.mutableSubcategories = this.mutableSubcategories.filter(function (
          d
        ) {
          return d.remove != "true";
        });
        this.mutableSubcategories.unshift({ fullname: "Clear Selection" });
      } else {
        this.mutableRanges = data.ranges; //data.ranges;
      }
      this.mutableType = data.type;
      for (let i in this.maps) {
        NPMap.config.L.removeLayer(this.maps[i]);
        this.range1 = this.range2 = this.range3 = null;
      }

      this.populated = true;
    });

    this.$parent.$on("settingsLoaded", this.loadSettings);
  },
};
</script>
<style>
.subcat {
  background: black;
}
.subcat1 {
  background: black;
}
.subcat2 {
  background: black;
}
.subcat1.subcat-selected > .multiselect__tags {
  border: 1px solid black;
  background: #c41c8e;
}
.subcat1.subcat-selected > .multiselect__tags > .multiselect__single,
.subcat1.subcat-selected > .multiselect__tags > span > .multiselect__single,
.subcat1.subcat-selected > .multiselect__tags > .multiselect__input {
  background: #c41c8e;
}
.subcat2.subcat-selected > .multiselect__tags {
  border: 1px solid black;
  background: #fd8e1f;
}
.subcat2.subcat-selected > .multiselect__tags > .multiselect__single,
.subcat2.subcat-selected > .multiselect__tags > span > .multiselect__single,
.subcat2.subcat-selected > .multiselect__tags > .multiselect__input {
  background: #fd8e1f;
}
.continuous-block {
  text-align: left;
}
</style>
