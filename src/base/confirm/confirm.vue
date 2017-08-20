<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="flag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div class="operate-btn left" @click="cancel">取消</div>
            <div class="operate-btn" @click="confirm">清空</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        flag: false
      }
    },
    methods: {
      show() {
        this.flag = true
      },
      hide() {
        this.flag = false
      },
      cancel() {
        this.hide();
        this.$emit('cancel')
      },
      confirm() {
        this.hide();
        this.$emit('confirm')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .confirm
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 998
    background-color: $color-background-d
    &.confirm-fade-enter-active
      animation: confirm-fadein 0.3s
      .confirm-content
        animation: confirm-zoom 0.3s
    .confirm-wrapper
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      z-index: 999
      .confirm-content
        width: 270px
        border-radius: 2px
        background: $color-highlight-background
        box-shadow:7px 12px 17px $color-text-d
        .text
          padding: 15px 15px 0
          line-height: 22px
          font-size: $font-size-medium
          color: $color-text-l
        .operate
          margin-left:50%
          width: 50%
          height: 56px
          display: flex
          align-items: center
          text-align: center
          font-size: $font-size-small
          color: $color-play
          .operate-btn
            flex: 1
            line-height: 22px
            padding: 10px 0

  @keyframes confirm-fadein
    0%
      opacity: 0
    100%
      opacity: 1

  @keyframes confirm-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>