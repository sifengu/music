 <template> 
  <!-- ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。 -->
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
        <!-- 被插过来的结构 -->
        <!-- <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="">
              </a>
            </div> -->
      </slot>
    </div>
     <div class="dots"> 
       <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span> 
     </div> 
  </div>
</template>

<script>
  import {addClass} from '../../common/js/dom'
  import BScroll from 'better-scroll'

  export default {
    name: 'slider',
    props: {
      // 循环轮播
      loop: {
        type: Boolean,
        default: true
      },
      // 自动轮播
      autoPlay: {
        type: Boolean,
        default: true
      },
      // 轮播间隔
      interval: {
        type: Number,
        default: 4000
      }
    },
      data() {
        return {
          dots: [],
          currentPageIndex: 0
        }
      },
    // domready时初始化
    mounted() {
      // 浏览器刷新一般是17毫秒刷新一次
      setTimeout(() => {
              this._setSliderWidth();
              this._initDots();
              this._initSlider();
              // 自动播放
              if (this.autoPlay) {
                this._play();
              }
      }, 20)
      // 监听窗口改变事件，改变宽度
          window.addEventListener('resize', () => {
            if (!this.slider) {
              return;
            }
            this._setSliderWidth(true);
            this.slider.refresh();
          })
        // },
      //   activated() {
      //     if (this.autoPlay) {
      //       this._play();
      //     }
      //   },
      //   deactivated() {
      //     clearTimeout(this.timer)
      //   },
      //   beforeDestroy() {
      //     clearTimeout(this.timer)
        },
      methods: {
        // 横向滚动设置宽度
        // 是不是resize过来
        _setSliderWidth(isResize) {
          // $refs 只在组件渲染完成后才填充
          // 获得父容器下的个数
                this.children = this.$refs.sliderGroup.children;

                let width = 0;
                let sliderWidth = this.$refs.slider.clientWidth;
                for (let i = 0; i < this.children.length; i++) {
                  let child = this.children[i];
                  addClass(child, 'slider-item');
                  child.style.width = sliderWidth + 'px';
                  width += sliderWidth;
                }
                // 如果循环切换
                if (this.loop && !isResize) {
                  width += 2 * sliderWidth;
                }
                this.$refs.sliderGroup.style.width = width + 'px';
        },
        // 初始化slider
        _initSlider() {
                this.slider = new BScroll(this.$refs.slider, {
                  scrollX: true,
                  scrollY: false,
                  momentum: false,
                  snap: true,
                  snapLoop: this.loop,
                  snapThreshold: 0.3,
                  snapSpeed: 400
                });
                // 滚动完毕时触发事件
                this.slider.on('scrollEnd', () => {
                  let pageIndex = this.slider.getCurrentPage().pageX;
                  // 循环模式下会添加拷贝
                  if (this.loop) {
                    pageIndex -= 1;
                  }
                  this.currentPageIndex = pageIndex;

                  // if (this.autoPlay) {
                  //   this._play()
                  // }
                })

                // this.slider.on('beforeScrollStart', () => {
                  // 拖动时，清空定时器
                  if (this.autoPlay) {
                    clearTimeout(this.timer)
                  }
                // })
        },
            _initDots() {
              this.dots = new Array(this.children.length);
            },
            _play() {
              let pageIndex = this.currentPageIndex + 1
              if (this.loop) {
                pageIndex += 1
              }
              this.timer = setTimeout(() => {
                this.slider.goToPage(pageIndex, 0, 400);
              }, this.interval);
            }
      },
      destroyed() {
        clearTimeout(this.timer);
      }
    }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>