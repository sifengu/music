<template>
  <Scroll class="suggest" ref="suggest" :data="result" :beforeScroll="beforeScroll" @beforeScroll="pulldown"  @scrollToEnd="searchMore" :pullup="pullup">
    <ul class="suggest-list">
      <li class="suggest-item border-1px" @click="selectItem(item)" v-for="item in result">
        <!-- <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div> -->
        <div class="name">
          <p class="text" v-html="item.name"></p>
          <p class="singer" ><span v-html="item.singer"></span> - <span v-html="item.album"></span></p>
        </div>
      </li>
      <loading v-show="more&&query" title=""></loading>
    </ul>
    <div v-show="!more && !result.length && query" class="no-result-wrapper">未找到与"{{query}}"相关的内容</div>
  </Scroll>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  import {search} from '../../api/search'
  import {ERR_OK} from '../../api/config'
  import {createSong} from '../../common/js/song'
  import {mapActions} from 'vuex'
  // import Singer from 'common/js/singer'

  const TYPE_SINGER = 'singer'
  // 数据
  const perpage = 25

  export default {
    props: {
      query: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        beforeScroll: true,
        more: true
      }
    },
    watch: {
      query() {
        this.searchList();
      }
    },
    methods: {
      selectItem(item) {
        this.insertSong(item)
        this.$emit('search')
      },
      searchMore() {
        if(!this.more) {
          return
        }
        // console.log('pull up')
        this.page++;
        this.searchList(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._getResult(res.data))
            this.check(res.data)
            console.log(this.result)
          }
        })
      },
      searchList() {
        this.page = 1
        this.more = true
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._getResult(res.data)
            this.check(res.data)
          }
        })
      },
      check(data) {
        const song = data.song;
        if(!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.more = false
        }
      },
      _getResult(data) {
        let ret = []
        if(data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if(data.song) {
          ret = ret.concat(this._norSongs(data.song.list))
        }
        return ret
      },
      _norSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if(musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      getIconCls(item) {
        if(item.type === TYPE_SINGER) {
          return 'icon-mine'
        }else{
          return 'icon-music'
        }
      },
      // getDisplayName(item) {
      //   if(item.type === TYPE_SINGER) {
      //     return item.singername
      //   }else{
      //     return `${item.name}-${item.singer}`
      //   }
      // },
      pulldown() {
        this.$emit('polldown')
      },
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 2px 10px
      .suggest-item
        display: flex
        align-items: center
        padding: 10px 2px
        margin-bottom: 10px
        border-1px(#222)
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
          font-size: $font-size-medium
          color:$color-text-d_
        .singer
          no-wrap()
          font-size:$font-size-small
          margin-top:5px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 15%
      transform: translateY(-50%)
      color: $color-text-d
      text-align: center
</style>