<template>
  <MainScene
    id="iceScene"
    class=""
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MainScene from '@/views/scene/index.vue';

export default defineComponent({
  components: {
    MainScene,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss">
body,
#iceScene {
  position: absolute;

  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  overflow: hidden;
}
</style>
