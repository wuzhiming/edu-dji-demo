<template>
  <div class="ice-scene">
    <header class="ice-scene__header ice-scene-header">
      <button class="button is-small is-white">
        <LeftOutlined />
      </button>

      <div class="tw-flex-1 tw-text-center">
        {{ 'title222' }}
      </div>

      <button
        class="button is-small is-white tw-mr-2"
        @click="minimizeMain = !minimizeMain"
      >
        <FullscreenOutlined v-if="minimizeMain" />
        <FullscreenExitOutlined v-else />
      </button>

      <button
        class="button is-small is-white"
        @click="onExpandClick"
      >
        <MenuFoldOutlined v-if="!expandedRight" />
        <MenuUnfoldOutlined v-else />
      </button>
    </header>

    <main
      ref="mainEl"
      class="ice-scene__main ice-scene-main"
    >
      <div
        v-show="minimizeMain"
        class="ice-scene-webview"
      >
        <div class="ice-webview-layout">
          <div
            class="ice-webview-layout__wrap"
            style=""
          >
            <iframe
              src="https://edu.dji.com/CodeMaster/index.html?t=121#/?type=tello"
              class="ice-webview-layout__view"
            />
          </div>

          <div
            v-show="expandedRight"
            class="ice-webview-layout__wrap"
            style=""
          >
            <iframe
              src="https://www.cocos.com"
              class="ice-webview-layout__view"
              style=""
            />
          </div>
        </div>
      </div>

      <MiniContainer
        :get-drag-container="getMainEl"
        :minimized="minimizeMain"
        class="ice-scene-webview"
      >
        <template #default="{}">
          <iframe
            src="https://docs.cocos.com/ice/manual/zh/"
            class="ice-webview-layout__view"
            style=""
          />
        </template>
      </MiniContainer>
    </main>

    <footer class="ice-scene__footer ice-scene-footer">
      <div class="tw-flex tw-items-center">
        <button class="button is-small is-white">
          <StepBackwardOutlined />
        </button>

        <button class="button is-small is-white">
          <CaretLeftOutlined />
        </button>

        <input type="text">

        <button class="button is-small is-white">
          <CaretRightOutlined />
        </button>

        <button class="button is-small is-white">
          <StepForwardOutlined />
        </button>
      </div>
    </footer>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

import MiniContainer from './mini-container.vue';

export default defineComponent({
  name: 'MainScene',
  components: {
    MiniContainer,
  },
  props: {},
  emits: {},

  setup(props, ctx) {
    const mainEl = ref(null);
    const expandedRight = ref(false);
    const minimizeMain = ref(false);

    const onExpandClick = () => {
      expandedRight.value = !expandedRight.value;
    };

    const getMainEl = () => mainEl.value;

    return {
      mainEl,
      getMainEl,
      minimizeMain,

      expandedRight,
      onExpandClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.ice-scene {
  display: flex;
  flex-direction: column;

  &__header,
  &__footer {
    flex: none;
  }

  &__main {
    flex: 1;
    min-width: 0;
    min-height: 0;
  }
}

.ice-scene-header {
  @apply tw-flex tw-items-center  tw-py-4 tw-px-4 tw-bg-gray-2;
}

.ice-scene-footer {
  @apply tw-flex tw-items-center tw-justify-center tw-px-4 tw-py-2;
}

.ice-scene-main {
  @apply tw-relative;

  &__webview {
    @apply tw-absolute;
  }
}

.ice-scene-webview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.ice-webview-layout {
  display: flex;

  height: 100%;

  &__view {
    height: 100%;
    width: 100%;
  }

  &__wrap {
    flex: 1 1 50%;
    height: 100%;
  }
}
</style>
