<template>
  <div class="music-list">
    <div class="back" @click="back"><i class="icon-back"></i></div>
    <h1 class="title" v-html="title"></h1>
    
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <h1 class="desctitle" v-html="desctitle"></h1>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
      <div>
        <div class="play-wrapper border-1px">
        <div class="play" v-show="songs.length>0" ref="backicon" @click="play">
          <i class="icon-play"></i>
          <span class="text">播放全部( 共{{songs.length}}首 )</span>
        </div>
      </div>
       <div class="song-list-wrapper">
        <song-list :rank="rank" @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
      </div>
     
    </scroll>
  </div>
</template>

<script>
  import Scroll from '../../base/scroll/scroll.vue'
  import SongList from '../../base/song-list/song-list.vue'
  import {prefixStyle} from '../../common/js/dom.js'
  import Loading from '../../base/loading/loading.vue'
  import {mapActions} from 'vuex'
  import {playlistMixin} from '../../common/js/mixin.js'

  const transform = prefixStyle('transform');
  const backdrop = prefixStyle('backdrop-filter')

  export default {
    mixins: [playlistMixin],
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      desctitle: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scrollY: 0
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.$refs.list.$el.style.top = `${this.imageHeight}px`;
      this.minTranslateY = -this.imageHeight + 40
    },
    created() {
      this.probeType = 3;
      this.listenScroll = true;
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      scroll(pos) {
        this.scrollY = pos.y;
      },
      back() {
        this.$router.back();
      },
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      play() {
        this.selectPlay({
          list: this.songs,
          index: 0
        })
      },
      ...mapActions([
        'selectPlay'
      ])
    },
    watch: {
      scrollY(newY) {
        let zindex = 0
        let translateY = Math.max(this.minTranslateY, newY);
        let scale = 1;
        let blur = 0;
        const percent = Math.abs(newY / this.imageHeight);
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
        // this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`;
        // this.$refs.layer.style['webkitTransform'] = `translate3d(0,${translateY}px,0)`;
        if(newY > 0) {
          scale = 1 + percent;
          zindex = 10;
        }else {
          blur = Math.min(20 * percent, 20)
        }
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        // this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
        // this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
        if(newY < this.minTranslateY) {
          zindex = 10;
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.bgImage.style.height = 40 + 'px';
          this.$refs.backicon.style.display = 'none'
        }else {
          // zindex = 0;
          this.$refs.bgImage.style.paddingTop = '70%';
          this.$refs.bgImage.style.height = 0;
          this.$refs.backicon.style.display = ''
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`;
        // this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`;
        this.$refs.bgImage.style.zIndex = zindex;
      }
    },
    components: {
      Scroll,
      SongList,
      Loading
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-text
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .desctitle
        position: absolute
        bottom: 0
        padding: 0 40px
        z-index: 40
        width: 80%
        no-wrap()
        text-align: center
        line-height: 40px
        font-size: $font-size-medium-x
        color: $color-text
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .play-wrapper
        width: 100%
        border-1px($color-text-d)
        height: 45px
        line-height: 45px
        margin-left: 20px
        .play
          box-sizing: border-box
          padding: 0 7px
          color: $color-text-d_
          font-size: $font-size-medium
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
          .text
            display: inline-block
            vertical-align: middle
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>