<template>
    <div class="player" v-show="playlist.length>0">
      <transition name="normal" > 
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <div class="mk"></div>
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @click.prevent="changenow">
            <div class="middle-l" v-if="now">
            <div class="cd-wrapper" ref="cdWrap" >
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div> 
             <div class="playing-lyric-wrapper">
               <!-- <div class="playing-lyric" v-if="currentLyric.lines.length">纯音乐，请欣赏</div>  -->
              <div class="playing-lyric">{{playingLyric}}</div>
            </div> 
           </div>  
          
          <Scroll class="middle-r"  ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text" :class="{'current': currentLyricNumber === index}" ref="lyricLine" v-for="(line, index) in currentLyric.lines">{{line.txt, index}}</p>
              </div>
               
            </div>
          </Scroll>
        </div>
        <div class="bottom">
           <div class="progress-wrapper"> 
             <span class="time time-l">{{format(currentTime)}}</span>
             <div class="progress-bar-wrapper">
               <progress-bar :percent="percent" @percentChange="changeProgress"></progress-bar>
             </div>
             <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div> 
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prevSong" class="icon-prev" ></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="play" :class="playIcon" ></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="nextSong" class="icon-next"></i>
            </div>
            <div class="icon i-right" @click="showPlaylist">
              <i class="icon icon-playlist" ></i>
            </div>
          </div>
        </div>
      </div>
      </transition>
      <transition name="mini"> 
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <!-- <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div> -->
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i :class="miniIcon" @click.stop="play" class="icon-mini"></i>
          </progress-circle>
          
        </div>
        <div class="control" @click="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
     </transition>
    <play-list ref="playlist"></play-list>
    <audio ref="audio" :src="currentSong.url" @timeupdate="updateTime" @canplay="ready" @error="error" @ended="end"></audio>
  </div> 
</template> 
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import ProgressBar from '../../base/progress-bar/progress-bar'
import ProgressCircle from '../../base/progress-circle/progress-circle'
import {playMode} from '../../common/js/config.js'
// import {shuffle} from '../../common/js/util.js'
import Lyric from '../../common/js/lyric.js'
import Scroll from '../../base/scroll/scroll'
import PlayList from '../../components/playlist/playlist'
import {playerMixin} from '../../common/js/mixin.js'

  export default {
    mixins: [playerMixin],
    data() {
      return {
        songReady: false,
        currentTime: 0,
        radius: 32,
        currentLyric: null,
        currentLyricNumber: 0,
        now: true,
        playingLyric: ''
        // ce: 0
      }
    },
    methods: {
      // 歌曲列表
      showPlaylist() {
        this.$refs.playlist.show()
      },
      // ce(e) {
      //   e.padStart(2, '0');
      // },
            // 歌词封面交换
      changenow() {
        this.now = !this.now;
        console.log(this.now)
      },
      // 获取歌曲时间戳格式化
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      format (interval) {
        interval = interval | 0;
        const minute = interval / 60 | 0;
        const second = this._pad(interval % 60);
        return `${minute} : ${second}`
      },
      _pad(num, n = 2) {
        let len = num.toString().length;
        while(len < n) {
          num = '0' + num;
          len++
        }
        return num
      },
      // 播放模式
      // changeMode() {
      //   const mode = (this.mode + 1) % 3;
      //   this.setPlayMode(mode)
      //   // console.log(this.mode)
      //   let list = null;
      //   if(mode === playMode.random) {
      //     list = shuffle(this.sequenceList)
      //   }else{
      //     list = this.sequenceList
      //   }
      //   // console.log(this.currentSong)
      //   this.resetCurrentIndex(list)
      //   this.setPlayList(list)
      // },
      // resetCurrentIndex(list) {
      //   let index = list.findIndex((item) => {
      //     return item.id === this.currentSong.id
      //   })
      //   this.setCurrentIndex(index)
      // },
      // 自动播放下一首
      end() {
        if(this.mode === playMode.loop) {
          this.loop();
        }else{
          this.nextSong()
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0;
          this.$refs.audio.play()
          if(this.currentLyric) {
            this.currentLyric.seek(0)
          }
      },
      // 获取歌词
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          console.log(this.currentLyric)
          if(this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null;
          this.playingLyric = ''
          this.currentLyricNumber = 0
        })
      },
      handleLyric({linenum, txt}) {
        this.currentLyricNumber = linenum;
        console.log(this.currentLyricNumber)
        if(linenum > 5) {
          let line = this.$refs.lyricLine[linenum - 5]
          this.$refs.lyricList.scrollToElement(line, 1000)
        }else{
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      // 缩屏
      back() {
        this.setFullScreen(false);
      },
      open() {
        this.setFullScreen(true);
      },
      play() {
        if (!this.songReady) {
          return
        }
        this.setPlayingState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      nextSong() {
        if(!this.songReady) {
          return
        }
        // 如果歌单里只有一首歌
        if(this.playlist.length === 1) {
          this.loop()
        }else{
          let index = this.currentIndex + 1;
          if(index === this.playlist.length) {
            index = 0;
          }
          this.setCurrentIndex(index);
          if(!this.playing) {
            this.play()
          }
        }
        this.songReady = false;
      },
      prevSong() {
        if(!this.songReady) {
          return
        }
        if(this.playlist.length === 1) {
          this.loop()
        }else{
          let index = this.currentIndex - 1;
          if(index === -1) {
            index = this.playlist.length - 1;
          }
          this.setCurrentIndex(index);
          if(!this.playing) {
            this.play()
        }
        }
        this.songReady = false;
      },
      changeProgress(percent) {
        // console.log(percent)
        const currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = currentTime;
        if(!this.playing) {
          this.play()
        }
        if(this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      ready() {
        this.songReady = true;
        this.savePlayHistory(this.currentSong)
      },
      error() {
        this.songReady = true;
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN'
        // setPlayingState: 'SET_PLAYING_STATE',
        // setCurrentIndex: 'SET_CURRENT_INDEX',
        // setPlayMode: 'SET_PLAY_MODE',
        // setPlayList: 'SET_PLAYLIST'
      }),
      ...mapActions([
        'savePlayHistory'
      ])
    },
    computed: {
      // iconMode() {
      //   return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      // },
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      // 歌曲百分比
      percent() {
        return this.currentTime / this.currentSong.duration;
      },
      ...mapGetters([
        'fullScreen',
        // 'playlist',
        // 'currentSong',
        'playing',
        'currentIndex'
        // 'mode',
        // 'sequenceList'
      ])
    },
    watch: {
      currentSong(newSong, oldSong) {
        if(!newSong.id) {
          return
        }
        if(newSong.id === oldSong.id) {
          return
        }
        if(this.currentLyric) {
          this.currentLyric.stop()
        }
        this.$nextTick(() => {
          this.$refs.audio.play();
          this.getLyric()
        })
        // setTimeout(() => {
        //   this.$refs.audio.play();
        //   this.getLyric()
        // }, 1000)
      },
      playing(newState) {
        const audio = this.$refs.audio;
        this.$nextTick(() => {
          newState ? audio.play() : audio.pause()
        })
      }
      // shownow() {
      //   if(this.now === false) {
      //     this.now = true
      //   }
      // }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      PlayList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
        .mk
          background: rgba(0,0,0,0.5)
          position:fixed
          width:100%
          height:100%
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-text
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .null
            position:absolute
            top:50%
            width:100%
            text-align: center
            font-size: $font-size-medium
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small-s
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme-n
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text-d_
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-text-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>