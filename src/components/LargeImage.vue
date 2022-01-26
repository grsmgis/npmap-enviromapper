<template>
  <div
    class="large-image-box"
    :class="{
      'large-image-closed': !showLargeImage,
      'large-image-open': showLargeImage,
    }"
  >
    <span class="close" @click="toggleImage">&times;</span>
    <img :src="mutableUrl" class="large-image" />
  </div>
</template>

<script>
export default {
  name: "LargeImage",
  props: {
    url: {
      default: "",
      type: String,
    },
    show: {
      default: false,
      type: Boolean,
    },
  },
  data: function () {
    return {
      mutableUrl: "",
      showLargeImage: false,
    };
  },
  methods: {
    toggleImage: function () {
      this.showLargeImage = false;
      this.$emit("toggleImage");
    },
  },
  watch: {
    url: function () {
      this.mutableUrl = this.url;
    },
    show: function () {
      this.showLargeImage = this.show;
    },
  },
};
</script>
<style>
.large-image-closed {
  display: none;
}

.large-image {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 700px;
  border-radius: 5px;
  -webkit-animation-name: zoom;
  -webkit-animation-duration: 0.6s;
  animation-name: zoom;
  animation-duration: 0.6s;
}

.large-image-open {
  padding-top: 100px;
  z-index: 15001;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.9);
}
@-webkit-keyframes zoom {
  from {
    -webkit-transform: scale(0);
  }
  to {
    -webkit-transform: scale(1);
  }
}

@keyframes zoom {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
.close {
  position: absolute;
  top: 15px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
}

.close:hover,
.close:focus {
  color: #bbb;
  text-decoration: none;
  cursor: pointer;
}
</style>