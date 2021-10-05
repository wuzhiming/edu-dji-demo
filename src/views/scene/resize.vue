<template>
  <div
    ref="rootEl"
    class="resize-frame"
    :class="{
      'is-disabled': disabled,
    }"
  >
    <!--  -->
    <slot />

    <template v-if="!disabled">
      <div
        v-for="(point) in points"
        :key="`point_${point}`"
        :class="`resize-frame__${point}`"
        :style="getPointStyles(point)"
        @pointerdown="onMousedown($event, point)"
      />
    </template>

    <teleport to="body">
      <div
        v-show="isDragging"
        class="resize-frame-mask"
      />
    </teleport>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  watch,
  watchEffect,
  onUnmounted,
  CSSProperties,
} from 'vue';
import { useEventListener } from '@vueuse/core';

const noop = () => {};

export default defineComponent({
  name: 'Resizeable',
  components: {},
  props: {
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },

    left: {
      type: Number,
      default: 0,
    },
    top: {
      type: Number,
      default: 0,
    },

    frameStyle: {
      type: Object,
      // required: true,
      default: () => ({}),
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    'update:width': null,
    'update:height': null,
    'update:left': null,
    'update:top': null,
  },

  setup(props, ctx) {
    const rootEl = ref<HTMLElement | null>(null);
    const isDragging = ref(false);

    const startSize = ref({
      width: 0,
      height: 0,
    });

    const startPos = ref({
      left: 0,
      top: 0,
    });

    let cleanup = noop;

    const onPointerdown = (e: PointerEvent, point: string) => {
      const { clientX: startX, clientY: startY, currentTarget } = e;

      if (!currentTarget) return;

      isDragging.value = true;

      startPos.value = {
        left: props.left,
        top: props.top,
      };

      startSize.value = {
        height: props.height,
        width: props.width,
      };

      const isLeft = /l/.test(point);
      const isRight = /r/.test(point);
      const isTop = /t/.test(point);
      const isBottom = /b/.test(point);

      const onPointermove = (e: PointerEvent) => {
        const { clientX, clientY } = e;

        const distX = clientX - startX;
        const distY = clientY - startY;

        const pos = {
          ...startPos.value,
        };

        let { width: newWidth, height: newHeight } = startSize.value;

        if (isTop) {
          newHeight += -distY;

          pos.top += distY;
        } else if (isBottom) {
          newHeight += distY;
        }

        if (isLeft) {
          newWidth += -distX;

          pos.left += distX;
        } else if (isRight) {
          newWidth += distX;
        }

        // todo: 合并 props 属性?
        ctx.emit('update:width', newWidth);
        ctx.emit('update:height', newHeight);
        ctx.emit('update:left', pos.left);
        ctx.emit('update:top', pos.top);
      };

      const onPointerup = (e: PointerEvent) => {
        cleanup();
        isDragging.value = false;
      };

      cleanup = () => {
        document.removeEventListener('pointerup', onPointerup, true);
        document.removeEventListener('pointermove', onPointermove, true);
      };

      document.addEventListener('pointerup', onPointerup, true);
      document.addEventListener('pointermove', onPointermove, true);
    };

    const getPointStyles = (point: string): CSSProperties => {
      return {
        display: props.disabled ? 'none' : 'block',
      };
    };

    onMounted(() => {
      startSize.value = {
        height: props.height,
        width: props.width,
      };
    });

    onUnmounted(() => {
      cleanup();
      cleanup = noop;
    });

    return {
      rootEl,
      points: ['t', 'b', 'l', 'r', 'lt', 'rt', 'lb', 'rb'],

      isDragging,
      size: startSize,

      getPointStyles,

      onMousedown: onPointerdown,
    };
  },
});
</script>

<style lang="scss" scoped>
@use 'sass:string';
@use 'sass:selector';

$border-width: 4px;

@mixin dot($elements) {
  @include unit-shared($elements) {
    position: absolute;

    width: $border-width;
    height: $border-width;

    // background-color: lightgreen;

    @content;
  }

  @each $el, $styles in $elements {
    #{&}__#{$el} {
      @each $d in (top, left, bottom, right) {
        @if (map-has-key($map: $styles, $key: $d)) {
          #{$d}: map-get($map: $styles, $key: $d);
        }
      }
    }
  }
}

@mixin line($dir, $elements) {
  @include unit-shared($elements) {
    position: absolute;

    // background-color: lightcoral;

    @if ($dir == 'h') {
      left: 0;
      width: 100%;
      height: $border-width;
    } @else if($dir == 'v') {
      top: 0;
      width: $border-width;
      height: 100%;
    }

    @content;
  }

  @each $el, $styles in $elements {
    #{&}__#{$el} {
      @each $d in (top, left, bottom, right) {
        @if (map-has-key($map: $styles, $key: $d)) {
          #{$d}: map-get($map: $styles, $key: $d);
        }
      }
    }
  }
}

@mixin unit-shared($elements) {
  $el-selectors: '';

  @each $el, $styles in $elements {
    $el-selectors: '__#{$el}, #{$el-selectors}';
  }

  $selector: selector-append(&, $el-selectors);

  // @debug $selector;

  @at-root #{$selector} {
    @content;
  }
}

.resize-frame {
  position: relative;

  @include line(
    $dir: v,
    $elements: (
      'l': (
        left: 0,
      ),
      'r': (
        right: 0,
      ),
    )
  ) {
    cursor: ew-resize;
  }

  @include line(
    $dir: h,
    $elements: (
      t: (
        top: 0,
      ),
      b: (
        bottom: 0,
      ),
    )
  ) {
    cursor: ns-resize;
  }

  @include dot(
    $elements: (
      'lt': (
        top: 0,
        left: 0,
      ),
      'rb': (
        right: 0,
        bottom: 0,
      ),
    )
  ) {
    cursor: nwse-resize; //
  }

  @include dot(
    $elements: (
      rt: (
        right: 0,
        top: 0,
      ),
      lb: (
        left: 0,
        bottom: 0,
      ),
    )
  ) {
    cursor: nesw-resize; //
  }

  &-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    opacity: 0;

    z-index: 1;
  }
}
</style>
