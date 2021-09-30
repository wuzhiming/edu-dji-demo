<template>
  <div
    ref="rootEl"
    class="mini-wrap"
    :class="rootElClass"
    :style="dragElStyle"
  >
    <slot />

    <div
      ref="dragEl"
      class="mini-wrap__ctrl"
    >
      <button class="">
        <FullscreenOutlined />
      </button>
    </div>
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
      default: 400,
    },
    height: {
      type: [Number],
      default: 200,
    },

    getDragContainer: {
      type: Function,
      default: getDefaultDragContainer,
    },
  },
  emits: {},

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
    };
  },
});
</script>

<style lang="scss" scoped>
.mini-wrap {
  // position: relative;

  &.minimized {
    position: fixed;
  }

  &.minimized:hover,
  &.dragging {
    .mini-wrap__ctrl {
      display: block;
    }
  }

  &__ctrl-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }

  &__ctrl {
    display: none;

    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;

    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    &:hover {
      cursor: move;
    }
  }
}
</style>
