<template>
  <div class="ice-scene">
    <SceneHeader
      v-model:minimized="minimizedMain"
      v-model:expanded="expandedRight"
      :minimizable="minimizable"
      class="ice-scene__header"
    >
      <!--  -->
    </SceneHeader>

    <main
      ref="mainEl"
      class="ice-scene__main ice-scene-main"
    >
      <MiniContainer
        v-model:minimized="minimizedSub"
        v-model:width="miniStyle.width"
        v-model:height="miniStyle.height"
        v-model:left="miniStyle.x"
        v-model:top="miniStyle.y"
        :minimizable="minimizable"
        :get-drag-container="getMainEl"
        class="ice-scene-webview"
      >
        <div class="ice-webview-layout">
          <div
            class="ice-webview-layout__wrap"
            style=""
          >
            <iframe
              src="https://edu.dji.com/CodeMaster/index.html?t=121#/?type=tello"
              class="ice-scene-webview__view"
            />
          </div>

          <div
            v-show="expandedRight"
            class="ice-webview-layout__wrap"
            style=""
          >
            <iframe
              src="https://www.cocos.com"
              class="ice-scene-webview__view"
              style=""
            />
          </div>
        </div>
      </MiniContainer>

      <MiniContainer
        v-model:minimized="minimizedMain"
        v-model:width="miniStyle.width"
        v-model:height="miniStyle.height"
        v-model:left="miniStyle.x"
        v-model:top="miniStyle.y"
        :minimizable="minimizable"
        :get-drag-container="getMainEl"
        class="ice-scene-webview"
      >
        <template #default="{}">
          <iframe
            id="iceWindow"
            src="https://demo-edu.cocos.com/dji-demo/index.html"
            class="ice-scene-webview__view"
            style=""
          />
        </template>
      </MiniContainer>
    </main>

    <SceneNav
      class="ice-scene__nav"
      :current="iFrameBridge.pageInfo.current"
      :total="iFrameBridge.pageInfo.total"
      @previous="preClick"
      @stepBackward="firstClick"
      @next="nextClick"
      @stepForward="lastClick"
    >
      <!--  -->
    </SceneNav>

    <teleport to="body">
      <IceLoading
        v-show="!iFrameBridge.loaded"
        class="ice-scene__loading"
      />
    </teleport>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  provide,
  computed,
  onMounted,
  onUnmounted,
} from 'vue';

import MiniContainer from './mini-container.vue';

import { IFrameBridge, EduClientMode } from '@/sync/IFrameBridge';

import { defaultSize } from './util';

import IceLoading from './loading.vue';
import SceneNav from './nav.vue';
import SceneHeader from './header.vue';

export default defineComponent({
  name: 'MainScene',
  components: {
    MiniContainer,
    SceneNav,
    SceneHeader,
    IceLoading,
  },
  props: {},
  emits: {},

  setup(props, ctx) {
    const mainEl = ref(null);
    const expandedRight = ref(false);

    const iFrameBridge = reactive(new IFrameBridge());
    iFrameBridge.setup(); // after making bridge reactive, call `setup`

    const minimizedMain = ref(true);
    const minimizedSub = computed({
      get: () => !minimizedMain.value,
      set: (val) => {
        minimizedMain.value = !val;
      },
    });
    const miniStyle = ref({
      width: defaultSize.width,
      height: defaultSize.height,
      x: 0,
      y: 0,
    });

    const minimizable = computed(() => {
      return iFrameBridge.curMode === EduClientMode.exec;
    });

    const onExpandClick = () => {
      expandedRight.value = !expandedRight.value;
    };

    const preClick = () => {
      iFrameBridge.prePage();
    };

    const nextClick = () => {
      iFrameBridge.nextPage();
    };

    const lastClick = () => {
      iFrameBridge.goPage(iFrameBridge.pageInfo.total);
    };

    const firstClick = () => {
      iFrameBridge.goPage(1);
    };

    const getMainEl = () => mainEl.value;

    onMounted(() => {
      // todo: pass `iframe` element into `iframeBridge`
    });

    onUnmounted(() => {
      iFrameBridge.teardown();
    });

    return {
      mainEl,
      getMainEl,

      miniStyle,
      minimizedMain,
      minimizedSub,
      minimizable,

      iFrameBridge,

      expandedRight,
      onExpandClick,
      preClick,
      nextClick,
      lastClick,
      firstClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.ice-scene {
  display: flex;
  flex-direction: column;

  position: relative;

  &__header {
    flex: none;
  }

  &__main {
    flex: 1;
    min-width: 0;
    min-height: 0;

    position: relative;
  }

  &__nav {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translate(-50%, 0);

    z-index: 1;
  }

  &__loading {
    z-index: 99;
  }
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

  &__view {
    height: 100%;
    width: 100%;
  }
}

.ice-webview-layout {
  display: flex;

  height: 100%;

  &__wrap {
    flex: 1 1 50%;
    height: 100%;
  }
}
</style>


