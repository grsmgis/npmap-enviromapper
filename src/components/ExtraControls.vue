<template>
  <div class="box" style="border-right: none">
    <div id="search-options" class="bordered">
      <div id="search-options-left">
        <div id="options-label label" style="color: #efefef">MAP CONTROLS</div>
        <multiselect
          class="controls"
          :multiple="true"
          v-model="selectedOverlayOptions"
          :options="mapOverlayOptions"
          :close-on-select="false"
          placeholder="Map Overlays"
          @select="selectOverlay"
          @remove="selectOverlay"
          :show-labels="false"
          :searchable="false"
          :showPointer="false"
          data-intro="Show extra map features."
          data-position="right"
        >
          <template slot="tag" slot-scope="props">
            <span class="multiselect__single">Map Overlays</span>
          </template>
        </multiselect>
      </div>
    </div>

    <div id="search-tool-extra-controls">
      <div
        id="search-banner-help-share"
        class="bordered"
        tooltip="Get a shareable link"
      >
        <button
          id="search-banner-env-share-button"
          class="control-btn"
          alt="Get a shareable link."
        >
          <i class="fa fa-share-square fades show"></i>
          <i class="fa fa-check-circle fades hide"></i>
        </button>
      </div>
      <div
        id="search-banner-help-link"
        class="bordered"
        tooltip="Get help using the tool"
      >
        <button
          id="search-banner-help-link-button"
          class="control-btn"
          onclick="showHelp();"
          alt="Show the help overlay."
        >
          <i class="fa fa-question-circle"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExtraControls",
  components: {},
  props: {
    msg: String,
    env: String,
    observation: Boolean,
    prediction: Boolean,
    overlays: Array,
    species: String,
    subcat: Array,
    naming: String,
  },
  data: function () {
    return {
      a: true,
      layers: [],
      selectedOverlayOptions: "",
      mapOverlayOptions: [
        "Trails",
        "Visitor Centers",
        "Shelters",
        "Roads",
        "Campsites",
      ],
      mapOverlayOptionState: [0, 0, 0, 0, 0],
    };
  },
  mounted: function () {
    this.setupShareButton();
    this.$parent.$on("settingsLoaded", this.loadSettings);
  },
  methods: {
    selectOverlay: function (option) {
      toggleOverlay(this.mapOverlayOptions.indexOf(option));
    },
    exportEnvSettings: function () {
      let settings = {};

      settings.env = this.env;
      settings.prediction = this.prediction;
      settings.observation = this.observation;
      settings.naming = this.naming;
      settings.subcat = this.subcat;
      settings.overlays = this.overlays;
      settings.species = this.species;

      if (!blendingActive) {
        settings.blending = false;
      }

      settings.bounds = NPMap.config.L.getBounds();

      return settings;
    },
    setupShareButton: function () {
      let self = this;
      let envShareButton = document.getElementById(
        "search-banner-env-share-button"
      );
      new Clipboard(envShareButton, {
        text: function (trigger) {
          let settings = self.exportEnvSettings();
          let hash = "#" + encodeURI(JSON.stringify(settings));
          return location.href.split("#")[0] + hash;
        },
      }).on("success", function () {
        let shareIcon = document.getElementsByClassName("fa-share-square")[0];
        let shareCircle = document.getElementsByClassName("fa-check-circle")[0];
        let notice = document.getElementById("clipboard-notice");

        shareIcon.classList.toggle("hide");
        shareIcon.classList.toggle("show");
        envShareButton.classList.toggle("hide");
        envShareButton.classList.toggle("show");

        setTimeout(function () {
          shareIcon.style.display = "none";
          envShareButton.style.display = "none";
          shareCircle.style.display = "inline-block";
          shareCircle.classList.toggle("hide");
          shareCircle.classList.toggle("show");
          envShareButton.style.display = "inline-block";
          envShareButton.classList.toggle("hide");
          envShareButton.classList.toggle("show");
          notice.style.opacity = 0.4;
        }, 310);

        setTimeout(function () {
          shareCircle.classList.toggle("hide");
          shareCircle.classList.toggle("show");
          envShareButton.classList.toggle("hide");
          envShareButton.classList.toggle("show");
          notice.style.opacity = 0.0;
        }, 310 + 1000);

        setTimeout(function () {
          shareCircle.style.display = "none";
          envShareButton.style.display = "none";
          shareIcon.style.display = "inline-block";
          shareIcon.classList.toggle("hide");
          shareIcon.classList.toggle("show");
          envShareButton.style.display = "inline-block";
          envShareButton.classList.toggle("hide");
          envShareButton.classList.toggle("show");
        }, 310 + 1000 + 310);
      });
    },
    loadSettings: function (envSettings) {
      if (envSettings.overlays !== null) {
        this.selectedOverlayOptions = envSettings.overlays;
        for (let i = 0; i < envSettings.overlays.length; i++) {
          this.selectOverlay(envSettings.overlays[i]);
        }
      }
    },
  },
  watch: {
    selectedOverlayOptions: function () {
      this.$emit("updateOverlays", this.selectedOverlayOptions);
    },
  },
};
</script>
<style>
.multiselect.controls
  > .multiselect__content-wrapper
  > .multiselect__content
  > .multiselect__element
  > .multiselect__option.multiselect__option--selected:before {
  content: "✔ ";
}
.multiselect.controls
  > .multiselect__tags
  > .multiselect__tags-wrap
  > .multiselect__single
  ~ .multiselect__single {
  display: none;
}
.multiselect.controls > .multiselect__tags > .multiselect__single,
.multiselect.controls > .multiselect__tags > span > .multiselect__single,
.multiselect.controls
  > .multiselect__tags
  > .multiselect__tags-wrap
  > .multiselect__single {
  width: 80%;
}

#clipboard-notice {
  transition: opacity 1.5s;
}
</style>
