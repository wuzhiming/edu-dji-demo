<template>
  <div
    ref="rootEl"
    class="mini-container"
    :class="rootElClass"
    :style="dragElStyle"
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
        class="mini-container-mask"
        :style="{
          display: isDragging ? 'block' : 'none',
        }"
      />
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, unref, onMounted } from 'vue';
import { useDraggable } from '@vueuse/core';

const px = (val: number) => `${val}px`;
const getDefaultDragContainer = () => document.body;

export default defineComponent({
  name: 'MiniContainer',
  components: {},
  props: {
    minimized: {
      type: Boolean,
      default: false,
    },

    // 小窗的宽、高
    width: {
      type: [Number],
      default: 576,
    },
    height: {
      type: [Number],
      default: 324,
    },

    getDragContainer: {
      type: Function,
      default: getDefaultDragContainer,
    },
  },
  emits: {
    'update:minimized': null,
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
        x: 0,
        y: 0,
      },

      onStart: (pos, e) => {
        calcPositionLimits();
      },
    });

    const rootElClass = computed(() => {
      return {
        minimized: props.minimized,
        dragging: isDragging.value,
      };
    });

    const dragElStyle = computed(() => {
      if (props.minimized || isDragging.value) {
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
    };
  },
});
</script>

<style lang="scss" scoped>
$prefixCls: mini-container;
$z-index: 2;

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
}
</style>
