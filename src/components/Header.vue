<template>
  <div>
    <div class="left">
      <a
        id="title"
        href="https://www.nps.gov/grsm/learn/nature/index.htm"
        style="text-decoration: none"
        target="_blank"
      >
        <h1>Great Smoky Mountains National Park</h1>
      </a>
      <div
        style="
          padding-left: 1px;
          color: #bdbdbd;
          letter-spacing: 1px;
          display: inline-block;
          font-size: 19px;
          font-family: 'Source Sans Pro';
        "
      >
        ATLAS OF THE SMOKIES:
      </div>
      <div style="margin-left: 230px; margin-top: 18px" id="atlas-app-changer">
        <multiselect
          class="header-selector"
          v-model="selected"
          :options="options"
          :close-on-select="true"
          placeholder="ENVIROMAPPER"
          :show-labels="false"
          @input="appSelect"
        />
      </div>
    </div>
    <div class="right">
      <h2>National Park Service<br />U.S. Department of the Interior</h2>
      <span class="arrowhead"></span>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";

export default {
  name: "Header",
  components: {
    Multiselect,
  },
  data: function () {
    return {
      options: ["Species Mapper"],
      selected: "",
    };
  },
  methods: {
    appSelect: function (selection) {
      if (selection == "Species Mapper")
        window.location = "https://science.nature.nps.gov/parks/grsm/species/";
    },
  },
};
</script>
<style>
.header-selector {
  width: 170px;
  display: inline-block;
  position: relative;
  top: -7px;
  letter-spacing: 1px;
}
.header-selector .multiselect__tags {
  background-color: #40403d;
  border: none;
  color: #bdbdbd;
  max-height: 20px;
}
.header-selector .multiselect__single {
  background-color: #40403d;
  border-radius: 3px 0 0 3px;
  border-right: 1px solid #5b5b5b;
  width: 125px;
}
.header-selector .multiselect__select:before {
  top: 13px;
}

.multiselect--active {
  z-index: 1000000000;
}
.multiselect--active > .multiselect__content-wrapper {
  margin-top: 0px;
}
header .left h1,
header .left div {
  overflow: visible !important;
}
</style>
