<template>
  <div class="recommend" ref="recommend">

    <div class="recommend">
      <scroll ref="scroll" class="recommend-content" :data="discList">
        <!-- better-scroll实现定区滚动 -->
        <div>
          <!-- v-if  渲染后 -->
          <div v-if="recommends.length" class="slider-wrapper">
            <slider>
              <!-- 里面的标签将被插到slider的solt插槽中 -->
              <div v-for="item in recommends">
                <a :href="item.linkUrl">
                  <!-- 需要click，fastclick不会拦截 -->
                  <img class="needsclick" @load="loadImage" :src="item.picUrl" alt="">
                </a>
              </div>
            </slider>
          </div>
          <div class="recommend-list">
            <h1 class="list-title"><span class="now">| </span>推荐歌单
              <i class="icon-right"></i>
            </h1>
            <ul>
              <li @click="selectItem(item)" v-for="item in discList" class="item ">
                <div class="icon">
                  <img v-lazy="item.imgurl" alt="">
                </div>
                <div class="text border-1px">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul> 
          </div>
        </div>
        <div class="loading-container" v-show="!discList.length">
          <loading></loading>
        </div>
      </scroll>
    </div>
    <!-- 挂载歌单详情 -->
    <router-view></router-view> 
  </div>
</template>

<script>
   import Slider from '../../base/slider/slider'
  import Loading from '../../base/loading/loading'
  import Scroll from '../../base/scroll/scroll'
  import {getRecommend,
          getDiscList
         }from '../../api/recommend'
  import {playlistMixin} from '../../common/js/mixin'
  import {ERR_OK} from '../../api/config'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    created() {
      this._getRecommend()

      this._getDiscList()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      loadImage() {
        if (!this.checkloaded) {
          this.checkloaded = true;
          this.$refs.scroll.refresh();
        }
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
            // console.log(res.data.slider)
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      Slider,
      Loading,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
   @import "../../common/stylus/variable" 
  @import "../../common/stylus/mixin.styl"
  .recommend
    background: $color-background-t
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        ul
          -moz-column-count: 2
          column-count: 2
        .list-title
          height: 65px
          line-height: 65px
          // text-align: center
          font-size: $font-size-medium
          color: $color-text-d_
          .now
            color:$color-theme
        .item
          display: flex
          box-sizing: border-box
          position:relative
          /* 垂直居中 */
          align-items: center
          padding-bottom:20px
          flex-direction: column
          -webkit-column-break-inside: avoid
          .icon
            img
              width:100%
              height:100%
              filter: grayscale(0.2)
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            /* border-1px(#222, after) */
            overflow: hidden
            font-size: $font-size-small
            .name
              color: #fff
              position: absolute
              bottom: 70px
              left: 10px
              color: $color-text
            .desc
              color: $color-text-d_
              height: 40px
      .loading-container
        position: absolute
        width: 100%
        /* 垂直居中 */
        top: 50%
        transform: translateY(-50%)
</style>