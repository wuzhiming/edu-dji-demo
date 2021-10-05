<template>
  <div
    ref="rootEl"
    class="mini-container"
    :class="rootElClass"
    :style="dragElStyle"
  >
    <ResizeFrame
      :disabled="!minimizable || !minimized"
      :width="width"
      :height="height"
      :left="left"
      :top="top"
      class="mini-container__frame"
      @update:height="onUpdateHeight"
      @update:width="onUpdateWidth"
      @update:left="onUpdateLeft"
      @update:top="onUpdateTop"
    >
      <slot :dragging="isDragging" />

      <div
        ref="dragEl"
        class="mini-container__ctrl mini-container-ctrl"
      >
        <button
          class="button is-dark is-size-5 mini-container-ctrl__expand"
          @click="onExpandClick"
        >
          <FullscreenOutlined />
        </button>
      </div>

      <teleport to="body">
        <div
          v-show="isDragging"
          class="mini-container-mask"
        />
      </teleport>
    </ResizeFrame>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  unref,
  onMounted,
  watch,
  watchEffect,
} from 'vue';
import { useDraggable } from '@vueuse/core';

import { defaultSize } from './util';

import ResizeFrame from './resize.vue';

const px = (val: number) => `${val}px`;
const getDefaultDragContainer = () => document.body;

export default defineComponent({
  name: 'MiniContainer',
  components: {
    ResizeFrame,
  },
  props: {
    minimized: {
      type: Boolean,
      default: false,
    },
    minimizable: {
      type: Boolean,
      default: false,
    },

    // todo: 整合 width, height, top, left
    // 小窗的宽、高
    width: {
      type: [Number],
      default: defaultSize.width,
    },
    height: {
      type: [Number],
      default: defaultSize.height,
    },

    top: {
      type: [Number],
      default: 0,
    },
    left: {
      type: [Number],
      default: 0,
    },

    getDragContainer: {
      type: Function,
      default: getDefaultDragContainer,
    },
  },
  emits: {
    'update:minimized': null,

    'update:width': null,
    'update:height': null,

    'update:top': null,
    'update:left': null,
  },

  setup(props, ctx) {
    const dragEl = ref<HTMLElement | null>(null);
    const rootEl = ref<HTMLElement | null>(null);

    // 拖动限制值
    const dragPosLimits = ref({
      topMin: 0,
      topMax: 0,

      leftMin: 0,
      leftMax: 0,
    });

    const calcPositionLimits = () => {
      const el = props.getDragContainer();

      if (el == null) return;

      const {
        top,
        left,
        width: elWidth,
        height: elHeight,
      } = el.getBoundingClientRect();

      dragPosLimits.value = {
        topMin: top,
        topMax: top + elHeight - props.height,

        leftMin: left,
        leftMax: left + elWidth - props.width,
      };
    };

    const {
      //
      position,
      isDragging,
    } = useDraggable(dragEl, {
      initialValue: {
        x: Number.isFinite(props.left) ? props.left : 0,
        y: Number.isFinite(props.top) ? props.top : 0,
      },

      onStart: (pos, e) => {
        calcPositionLimits();
      },

      onMove: (pos, e) => {
        ctx.emit('update:left', pos.x);
        ctx.emit('update:top', pos.y);
      },
    });

    // fix me: can we remove this watch ?
    watch([() => props.left, () => props.top], ([x, y]) => {
      position.value = {
        x,
        y,
      };
    });

    const rootElClass = computed(() => {
      return {
        minimized: props.minimizable && props.minimized,
        dragging: isDragging.value,
      };
    });

    const dragElStyle = computed(() => {
      if (props.minimizable && (props.minimized || isDragging.value)) {
        const pos = unref(position);
        const limits = unref(dragPosLimits);

        let left = pos.x;
        let top = pos.y;

        left = Math.max(limits.leftMin, left);
        top = Math.max(limits.topMin, top);

        left = Math.min(limits.leftMax, left);
        top = Math.min(limits.topMax, top);

        return {
          width: px(props.width),
          height: px(props.height),

          left: px(left),
          top: px(top),
        };
      }

      return {};
    });

    // resize frame
    const onUpdateWidth = (val: number) => {
      ctx.emit('update:width', val);
    };
    const onUpdateHeight = (val: number) => {
      ctx.emit('update:height', val);
    };
    const onUpdateLeft = (val: number) => {
      position.value = {
        ...position.value,
        x: val,
      };
    };
    const onUpdateTop = (val: number) => {
      position.value = {
        ...position.value,
        y: val,
      };
    };

    const onExpandClick = () => {
      ctx.emit('update:minimized', false);
    };

    onMounted(() => {
      calcPositionLimits();
    });

    return {
      rootEl,
      dragEl,
      position,
      isDragging,
      dragPosLimits,

      rootElClass,
      dragElStyle,

      onExpandClick,

      onUpdateWidth,
      onUpdateHeight,
      onUpdateLeft,
      onUpdateTop,
    };
  },
});
</script>

<style lang="scss" scoped>
$prefixCls: mini-container;
$z-index: 1;

.#{$prefixCls} {
  // position: relative;

  &.minimized {
    position: fixed;
    z-index: $z-index;
  }

  &.minimized:hover,
  &.dragging {
    .#{$prefixCls}__ctrl {
      display: block;
    }
  }

  // 作用在全局的 mask，拖动时遮挡页面上的其它元素，避免干扰 pointer events
  &-mask {
    position: fixed;
    z-index: $z-index - 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    opacity: 0;
  }

  &__ctrl {
    display: none;

    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  &-ctrl {
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;

    &:hover {
      cursor: move;
    }

    &__expand {
      position: absolute;
      right: 16px;
      bottom: 16px;

      padding: 8px;
      height: auto;
    }
  }

  &__frame {
    height: 100%;
    width: 100%;
  }
}
</style>
