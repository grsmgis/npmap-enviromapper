<template>
  <div>
    <div class="label environment-info">
      {{ mutableInfo }}
    </div>

    <span
      style="display: block"
      v-if="false && (subcatExists1 || subcatExists2)"
    >
      <transition name="info-slide">
        <div v-show="categoricalOpen" class="info-box">
          <transition name="info-box-subcat-1">
            <div
              :class="{
                'info-box-subcat-title-1': true,
                'info-box-subcat-title-1-inactive': !subcatActive1,
              }"
              v-show="subcatExists1"
              @click="
                subcatActive1 = true;
                subcatActive2 = false;
              "
            >
              {{ subcatName1 }}
            </div>
          </transition>
          <transition name="info-box-subcat-2">
            <div
              :class="{
                'info-box-subcat-title-2': true,
                'info-box-subcat-title-2-inactive': !subcatActive2,
              }"
              v-show="subcatExists2"
              @click="
                subcatActive1 = false;
                subcatActive2 = true;
              "
            >
              {{ subcatName2 }}
            </div>
          </transition>
          <div style="" class="info-box-image environment-image">
            <img
              v-if="subcatImg1 !== '' && subcatActive1"
              :src="subcatImg1"
              @click="
                largeImageSource = subcatImg1;
                showLargeImage = true;
              "
            />
            <img
              v-else-if="subcatImg2 !== '' && subcatActive2"
              :src="subcatImg2"
              @click="
                largeImageSource = subcatImg2;
                showLargeImage = true;
              "
            />
            <i
              v-if="subcatImg1 !== '' && subcatActive1"
              class="fa fa-search-plus species-info-box-image-magnifier"
              aria-hidden="true"
              @click="
                largeImageSource = subcatImg1;
                showLargeImage = true;
              "
            />
            <i
              v-if="subcatImg2 !== '' && subcatActive2"
              class="fa fa-search-plus species-info-box-image-magnifier"
              aria-hidden="true"
              @click="
                largeImageSource = subcatImg2;
                showLargeImage = true;
              "
            />
          </div>
          <div class="info-box-info" v-if="subcatInfo1 !== '' && subcatActive1">
            {{ subcatInfo1 }}
          </div>
          <div
            class="info-box-info"
            v-else-if="subcatInfo2 !== '' && subcatActive2"
          >
            {{ subcatInfo2 }}
          </div>
        </div>
      </transition>
      <div
        @click="categoricalOpen = !categoricalOpen"
        class="info-toggle"
        style="margin-left: 200px; margin-top: -2px"
      >
        <div
          :class="{
            'triangle-closed': !categoricalOpen,
            'triangle-open': categoricalOpen,
          }"
          class="triangle"
        ></div>
      </div>
    </span>
    <span style="display: block" v-else-if="false && type == 'continuous'">
      <transition name="info-slide">
        <div v-show="continousOpen" class="info-box">
          <div class="info-box-cont-title">{{ name }}</div>
          <div style="" class="info-box-image environment-image">
            <img
              src="http://via.placeholder.com/150x150"
              @click="
                largeImageSource = 'http://via.placeholder.com/150x150';
                showLargeImage = true;
              "
            />
            <i
              class="fa fa-search-plus species-info-box-image-magnifier"
              aria-hidden="true"
              @click="
                largeImageSource = 'http://via.placeholder.com/150x150';
                showLargeImage = true;
              "
            />
          </div>
          <div class="info-box-info">Placeholder text about {{ name }}</div>
        </div>
      </transition>
      <div
        @click="continousOpen = !continousOpen"
        class="info-toggle"
        style="margin-left: 200px; margin-top: -2px"
      >
        <div
          :class="{
            'triangle-closed': !continousOpen,
            'triangle-open': continousOpen,
          }"
          class="triangle"
        ></div>
      </div>
    </span>
    <LargeImage
      :url.sync="largeImageSource"
      :show.sync="showLargeImage"
      @toggleImage="showLargeImage = false"
    />
  </div>
</template>
<script>
import LargeImage from "./LargeImage.vue";

export default {
  name: "InfoBox",
  components: {
    LargeImage,
  },
  props: {
    info: {
      default: "",
      type: String,
    },
  },
  data: function () {
    return {
      categoricalOpen: false,
      continousOpen: false,
      mutableInfo: this.info,
      name: "",
      subcatName1: "",
      subcatName2: "",
      subcatImg1: "",
      subcatImg2: "",
      subcatInfo1: "",
      subcatInfo2: "",
      subcatActive1: false,
      subcatActive2: false,
      subcatExists1: false,
      subcatExists2: false,
      selected: "",
      type: null,
      largeImageSource: "",
      showLargeImage: false,
    };
  },
  mounted: function () {
    this.$root.$on("layerChanged", (data) => {
      if (data == "removeLayer" || data.name !== this.name) {
        this.toggleActive(false, false);
        this.subcatExists1 = false;
        this.subcatExists2 = false;
        this.selected = null;
        this.type = null;
        this.mutableInfo = "";
        if (data == "removeLayer") return;
      }
      this.layer = data;
      this.type = data.type;
      this.name = data.name;
      this.mutableInfo = data.info;
    });
    this.$root.$on("subcatChanged", (subcatName, subcatNumber) => {
      let name = subcatName;
      if (subcatNumber == 1) {
        if (name == "null") {
          name = "";
          this.subcatExists1 = false;
          this.toggleActive(false, true);
          return;
        }
        this.toggleActive(true, false);
        this.subcatName1 = name;
        if (typeof this.layer !== "undefined") {
          let subcat = this.layer.subcategories;
          for (let key in subcat) {
            if (subcatName == subcat[key].name) {
              this.subcatImg1 = subcat[key].img;
              this.subcatInfo1 = subcat[key].info;
              this.subcatExists1 = true;
              break;
            }
          }
        }
      }
      if (subcatNumber == 2) {
        if (name == "null") {
          name = "";
          this.subcatExists2 = false;
          this.toggleActive(true, false);
          return;
        }
        this.toggleActive(false, true);
        this.subcatName2 = name;
        if (typeof this.layer !== "undefined") {
          let subcat = this.layer.subcategories;
          for (let key in subcat) {
            if (subcatName == subcat[key].name) {
              this.subcatImg2 = subcat[key].img;
              this.subcatInfo2 = subcat[key].info;
              this.subcatExists2 = true;
              break;
            }
          }
        }
      }
    });
  },
  methods: {
    toggleActive: function (subcatActive1, subcatActive2) {
      this.subcatActive1 = subcatActive1;
      this.subcatActive2 = subcatActive2;
    },
  },
  watch: {
    info: function () {
      this.mutableInfo = this.info;
    },
  },
};
</script>

<style>
.info-toggle {
  cursor: pointer;
  -webkit-transform: translate(0, 8px);
  -ms-transform: translate(0, 8px);
  transform: translate(0, 8px);
}
.info-box-cont-title {
  font-weight: bold;
  border-bottom: 5px solid black;
  width: 100px;
  max-width: 100px;
  padding: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
  float: left;
  cursor: pointer;
  text-align: center;
}
.info-box-subcat-title-1 {
  font-weight: bold;
  border-bottom: 5px solid magenta;
  width: 100px;
  max-width: 100px;
  padding: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
  float: left;
  cursor: pointer;
  text-align: center;
}
.info-box-subcat-title-1-inactive {
  border-bottom: none;
}
.info-box-subcat-1-enter {
  width: 0%;
}
.info-box-subcat-1-enter-to {
  width: 100%;
  -webkit-transition: all 1s linear;
  -o-transition: all 1s linear;
  transition: all 1s linear;
}
.info-box-subcat-1-leave-to {
  width: 0%;
  -webkit-transition: all 1s linear;
  -o-transition: all 1s linear;
  transition: all 1s linear;
  padding-left: 0px;
  padding-right: 0px;
  margin-right: 0px;
}
.info-box-subcat-1-enter-active,
.info-box-subcat-1-leave-active {
  overflow: hidden;
  white-space: nowrap;
}
.info-box-subcat-title-2 {
  font-weight: bold;
  border-bottom: 5px solid #ff9933;
  width: 100px;
  max-width: 100px;
  padding: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
  float: left;
  cursor: pointer;
  text-align: center;
}
.info-box-subcat-title-2-inactive {
  border-bottom: none;
}
.info-box-subcat-2-enter {
  width: 0%;
}
.info-box-subcat-2-enter-to {
  width: 100%;
  -webkit-transition: all 1s linear;
  -o-transition: all 1s linear;
  transition: all 1s linear;
}
.info-box-subcat-2-leave-to {
  width: 0%;
  -webkit-transition: all 1s linear;
  -o-transition: all 1s linear;
  transition: all 1s linear;
  padding-left: 0px;
  padding-right: 0px;
  margin-right: 0px;
}
.info-box-subcat-2-enter-active,
.info-box-subcat-2-leave-active {
  overflow: hidden;
  white-space: nowrap;
}

.info-box-image {
  text-align: center;
  clear: both;
}
.info-box {
  background-color: #eaeaea;
  width: 470px;
  height: 300px;
  position: relative;
  z-index: 10000;
  color: #333;
  -webkit-box-shadow: 0 0 5px #777, inset 0 6px 3px -5px #777;
  box-shadow: 0 0 5px #777, inset 0 6px 3px -5px #777;
  border: 1px solid #999;
  border-top: 0;
  -webkit-transform: translate(0, 8px);
  -ms-transform: translate(0, 8px);
  transform: translate(0, 8px);
}
.info-slide-enter {
  height: 0;
}
.info-slide-enter-to {
  -webkit-transition: height 1s ease-out;
  -o-transition: height 1s ease-out;
  transition: height 1s ease-out;
  height: 300px;
}
.info-slide-leave-to {
  height: 0;
  -webkit-transition: height 1s ease-out;
  -o-transition: height 1s ease-out;
  transition: height 1s ease-out;
}
.triangle-closed {
  -webkit-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transform-origin: 50% 40%;
  -ms-transform-origin: 50% 40%;
  transform-origin: 50% 40%;
  -webkit-transition: -webkit-transform 1s ease-out;
  transition: -webkit-transform 1s ease-out;
  -o-transition: transform 1s ease-out;
  transition: transform 1s ease-out;
  transition: transform 1s ease-out, -webkit-transform 1s ease-out;
}
.triangle-open {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
  -webkit-transform-origin: 50% 40%;
  -ms-transform-origin: 50% 40%;
  transform-origin: 50% 40%;
  -webkit-transition: -webkit-transform 1s ease-out;
  transition: -webkit-transform 1s ease-out;
  -o-transition: transform 1s ease-out;
  transition: transform 1s ease-out;
  transition: transform 1s ease-out, -webkit-transform 1s ease-out;
}
</style>
