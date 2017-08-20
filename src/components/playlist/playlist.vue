<template>
  <transition name="list-fade">
    <div class="playlist" v-show="flag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header border-1px">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text"></span>
            <span class="clear" @click="confirm"><i class="icon-clear"> 清空</i></span>
          </h1>
        </div>
        <Scroll ref="playlistContent" :data="sequenceList" class="list-content">
          <!-- <transition-group ref="list" name="list" tag="ul"> -->
            <ul>
            <li class="item" ref="playlistItem" v-for="(item, index) in sequenceList" @click="selectItem(item, index)">
              
              <p class="text border-1px">
                <i class="current" :class="currentSong.id == item.id ? 'icon-play icon-now' : ''"></i>
                <span class="name">
                <span :class="currentSong.id == item.id ? 'color' : ''">{{item.name}}</span>
                <span :class="currentSong.id == item.id ? 'color' : ''" class="singer">  -  {{item.singer}}</span>
                </span>
              <span class="delete" @click.stop="delete(item)">
                <i class="icon-delete"></i>
              </span>
              </p>
              <span class="like"><i></i></span>
              
            </li></ul>
          <!-- </transition-group> -->
        </Scroll>
        <!-- <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div> -->
        <!-- <div class="list-close">
          <span>关闭</span>
        </div> -->
      </div>
       <!-- <confirm ref="confirm" text="确定要清空播放列表？"></confirm> -->
      <!-- <add-song ref="addSong"></add-song>  -->
    </div>
  </transition>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {playMode} from '../../common/js/config'
  import Scroll from '../../base/scroll/scroll'
  import Confirm from '../../base/confirm/confirm'
  // import AddSong from 'components/add-song/add-song'
  // import {playerMixin} from 'common/js/mixin'

  export default {
    data() {
      return {
        flag: false
      }
    },
    computed: {
      ...mapGetters([
        'sequenceList',
        'currentSong',
        'playlist',
        'mode'
      ])
    },
    methods: {
      show() {
        this.flag = true;
        setTimeout(() => {
          this.$refs.playlistContent.refresh();
          this.ScrollToCurrent(this.currentSong)
        }, 40)
      },
      hide() {
        this.flag = false;
      },
      selectItem(item, index) {
        if(this.mode === playMode.random) {
          index = this.playlist.findIndex((song) => {
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      },
      ScrollToCurrent(item) {
        const index = this.sequenceList.findIndex((song) => {
          return song.id === item.id
        })
        this.$refs.playlistContent.scrollToElement(this.$refs.playlistItem[index - 3], 300)
      },
      confirm() {
      },
      delete(item) {
        this.deleteSong(item);
        if(!this.playlist.length) {
          this.hide()
        }
      },
      ...mapMutations({
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayingState: 'SET_PLAYING_STATE'
      }),
      ...mapActions([
        'deleteSong'
      ])
    },
    watch: {
      currentSong(newSong, oldSong) {
        if(!this.flag || newSong.id === oldSong.id) {
          return
        }
        this.ScrollToCurrent(newSong)
      }
    },
    components: {
      Scroll,
      Confirm
    }
  //   mixins: [playerMixin],
  //   data() {
  //     return {
  //       showFlag: false,
  //       refreshDelay: 120
  //     }
  //   },
  //   computed: {
  //     modeText() {
  //       return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
  //     }
  //   },
  //   methods: {
  //     show() {
  //       this.showFlag = true
  //       setTimeout(() => {
  //         this.$refs.listContent.refresh()
  //         this.scrollToCurrent(this.currentSong)
  //       }, 20)
  //     },
  //     hide() {
  //       this.showFlag = false
  //     },
  //     showConfirm() {
  //       this.$refs.confirm.show()
  //     },
  //     confirmClear() {
  //       this.deleteSongList()
  //       this.hide()
  //     },
  //     getCurrentIcon(item) {
  //       if (this.currentSong.id === item.id) {
  //         return 'icon-play'
  //       }
  //       return ''
  //     },
  //     selectItem(item, index) {
  //       if (this.mode === playMode.random) {
  //         index = this.playlist.findIndex((song) => {
  //           return song.id === item.id
  //         })
  //       }
  //       this.setCurrentIndex(index)
  //       this.setPlayingState(true)
  //     },
  //     scrollToCurrent(current) {
  //       const index = this.sequenceList.findIndex((song) => {
  //         return current.id === song.id
  //       })
  //       this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
  //     },
  //     deleteOne(item) {
  //       this.deleteSong(item)
  //       if (!this.playlist.length) {
  //         this.hide()
  //       }
  //     },
  //     addSong() {
  //       this.$refs.addSong.show()
  //     },
  //     ...mapActions([
  //       'deleteSong',
  //       'deleteSongList'
  //     ])
  //   },
  //   watch: {
  //     currentSong(newSong, oldSong) {
  //       if (!this.showFlag || newSong.id === oldSong.id) {
  //         return
  //       }
  //       setTimeout(() => {
  //         this.scrollToCurrent(newSong)
  //       }, 20)
  //     }
  //   },
  //   components: {
  //     Scroll,
  //     Confirm,
  //     AddSong
  //   }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        border-1px($color-text-d)
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          
          display: flex
          align-items: center
          height: 40px
          padding: 0 0 0 12px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .icon-now
            margin-left:5px
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .color
            color: $color-play !important
          .text
            border-1px($color-text-d) 
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d_
            height: 40px
            line-height: 40px
            .delete
              extend-click()
              font-size: $font-size-small
              color: $color-text-l
              position: absolute
              right: 0
              z-index: 1000
            .singer
              font-size: $font-size-small-s
              color:$color-text-l
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-text-l
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>