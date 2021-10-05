<template>
  <div class="ice-loading">
    <!-- ice loading -->
    <div class="ice-loading__logo">
      <img
        src="@/assets/ice-logo.svg"
        alt="logo"
      >
      <div class="ice-loading__text">
        正在加载中...
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Loading',
  components: {},
  props: {},
  emits: {},

  setup(props, ctx) {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.ice-loading {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;

  background-color: #fcfcfc;

  &__logo {
    position: absolute;
    top: 50%;
    left: 50%;
    // 向上偏移一些，加上文本后视觉居中
    transform: translate(-50%, calc(-50% - 24px));
  }

  &__text {
    position: absolute;

    color: #959ea6;
    font-size: 14px;

    bottom: 0px;
    left: 50%;
    // 与 `cocos ice` 文字对齐
    transform: translate(calc(-50% - 10px), 0);
  }
}
</style>
