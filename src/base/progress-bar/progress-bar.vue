<template>
  <div class="progress-bar" ref="progressBar" @click="clickProgress">
    <!-- 走过部分 -->
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
       <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      > 
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {prefixStyle} from '../../common/js/dom.js'
  
  const transform = prefixStyle('transform')
  const BtnWidth = 16;
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      progressTouchStart(e) {
        this.touch.init = true;
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        if(!this.touch.init) {
          return;
        }
        // 偏移量
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - BtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      progressTouchEnd(e) {
        this.touch.init = false;
        this.change()
      },
      change() {
        const barwidth = this.$refs.progressBar.clientWidth - BtnWidth;
        const percent = this.$refs.progress.clientWidth / barwidth;
        this.$emit('percentChange', percent)
      },
      clickProgress(e) {
        const rect = this.$refs.progressBar.getBoundingClientRect();
        const offsetWidth = e.pageX - rect.left;
        this._offset(offsetWidth)
        // this._offset(e.offsetX);
        this.change()
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    watch: {
      percent(newPercent) {
        if(newPercent >= 0 && !this.touch.init) {
          const barwidth = this.$refs.progressBar.clientWidth - BtnWidth;
          const offsetWidth = newPercent * barwidth;
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 2px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 15px
          height: 15px
          border-radius: 50%
          background: $color-text
</style>