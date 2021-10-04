<template>
  <div class="ice-scene-nav">
    <button
      :disabled="current <= 1"
      class="button is-text ice-scene-nav__btn"
      @click="stepBackward"
    >
      <StepBackwardOutlined />
    </button>

    <button
      :disabled="current <= 1"
      class="button is-text ice-scene-nav__btn"
      @click="previous"
    >
      <CaretLeftOutlined />
    </button>

    <div class="ice-scene-nav__page">
      {{ current }} / {{ total }}
    </div>

    <button
      :disabled="current >= total"
      class="button is-text ice-scene-nav__btn"
      @click="next"
    >
      <CaretRightOutlined />
    </button>

    <button
      :disabled="current >= total"
      class="button is-text ice-scene-nav__btn"
      @click="stepForwared"
    >
      <StepForwardOutlined />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SceneNav',
  components: {},
  props: {
    total: {
      type: Number,
      default: 0,
    },

    current: {
      type: Number,
      default: 0,
    },
  },
  emits: {
    next: null,
    stepForwared: null,

    previous: null,
    stepBackward: null,
  },

  setup(props, ctx) {
    const next = () => {
      ctx.emit('next');
    };

    const previous = () => {
      ctx.emit('previous');
    };

    const stepForwared = () => {
      ctx.emit('stepForwared');
    };

    const stepBackward = () => {
      ctx.emit('stepBackward');
    };

    return {
      noop: () => {},

      next,
      previous,
      stepForwared,
      stepBackward,
    };
  },
});
</script>

<style lang="scss" scoped>
@use 'sass:color';

.ice-scene-nav {
  width: 372px;
  height: 68px;

  background-color: rgba(241, 242, 243, 1);
  box-shadow: 0px 4px 17px 0px rgba(0, 0, 0, 0.25);

  border-radius: 8px;

  @apply tw-flex tw-items-center tw-justify-center tw-py-3;

  &__page {
    @apply tw-mx-4 tw-select-none;
  }

  &__btn.is-text {
    height: auto;
    padding: 12px;

    background-color: transparent;
    color: #000;

    &:focus:not(:disabled) {
      box-shadow: none !important;
    }

    &:hover:not(:disabled) {
      background-color: #fff;
    }

    &:active:not(:disabled) {
      background-color: darken(#fff, 2.5%);
    }
  }
}
</style>
