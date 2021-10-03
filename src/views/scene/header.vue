<template>
  <header class="ice-scene-header">
    <button class="button is-small is-white">
      <LeftOutlined />
    </button>

    <div class="tw-flex-1 tw-text-center">
      {{ title }}
    </div>

    <button
      class="button is-small is-white tw-mr-2"
      @click="onMinimizeClick"
    >
      <FullscreenOutlined v-if="minimized" />
      <FullscreenExitOutlined v-else />
    </button>

    <button
      class="button is-small is-white"
      @click="onExpandClick"
    >
      <MenuFoldOutlined v-if="!expanded" />
      <MenuUnfoldOutlined v-else />
    </button>
  </header>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SceneHeader',
  components: {},
  props: {
    minimized: {
      type: Boolean,
      default: false,
    },

    expanded: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: 'Title',
    },
  },
  emits: {
    'update:expanded': null,
    'update:minimized': null,
  },

  setup(props, ctx) {
    const onExpandClick = () => {
      ctx.emit('update:expanded', !props.expanded);
    };

    const onMinimizeClick = () => {
      ctx.emit('update:minimized', !props.minimized);
    };

    return {
      onExpandClick,
      onMinimizeClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.ice-scene-header {
  @apply tw-flex tw-items-center  tw-py-4 tw-px-4 tw-bg-gray-2;
}
</style>
