<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="queryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addInput(item.k)" class="item" v-for="item in hotKey">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="confirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <div class="search-list" v-show="searchHistory.length">
             <transition-group name="list" tag="ul"> 
              <li :key="item" class="search-item" @click="addInput(item)" v-for="item in searchHistory">
                <span class="text">{{item}}</span>
                <span class="icon" @click.stop="deleteSearchHistory(item)">
                  <i class="icon-delete"></i>
                </span>
              </li>
             </transition-group> 
          </div>
        </div>
      </div>
    </div>
     <div class="search-result"> 
       <suggest @search="saveSearch" @pulldown="blurInput" :query="query"></suggest> 
     </div> 
      <confirm ref="confirm" text="清空搜索历史" @confirm="clearSearchHistory"></confirm>
  </div>
  <!-- <router-view></router-view> -->
</template>

<script>
  import SearchBox from '../../base/search-box/search-box'
  import Confirm from '../../base/confirm/confirm'
  import Suggest from '../../components/suggest/suggest'
  import {getHotKey} from '../../api/search'
  import {ERR_OK} from '../../api/config'
  // import {playlistMixin, searchMixin} from 'common/js/mixin'
  import {mapActions, mapGetters} from 'vuex'

  export default {
    data() {
      return {
        hotKey: [],
        query: '',
        searches: []
      }
    },
    created() {
      this._getHotKey()
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ])
    },
    methods: {
      confirm() {
        this.$refs.confirm.show()
      },
      saveSearch() {
        this.saveSearchHistory(this.query)
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if(res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10);
          }
        })
      },
      addInput(query) {
        this.$refs.searchBox.setQuery(query)
      },
      queryChange(query) {
        this.query = query
      },
      blurInput() {
        this.$refs.searchBox.blur()
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory'
      ])
    },
    components: {
      SearchBox,
      Confirm,
      Suggest
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
   @import "../../common/stylus/variable"
   @import "../../common/stylus/mixin" 

  .search
    position:fixed
    top:0
    height:100%
    width:100%
    background: $color-background
    .search-box-wrapper
      height:50px
      background: $color-background-t-
    .shortcut-wrapper
      position: fixed
      top: 75px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .search-list
            .search-item
              display: flex
              align-items: center
              height: 40px
              overflow: hidden
              &.list-enter-active, &.list-leave-active
                transition: all 0.1s
              &.list-enter, &.list-leave-to
                height: 0
              .text
                flex: 1
                color: $color-text-l
              .icon
                extend-click()
                .icon-delete
                  font-size: $font-size-small
                  color: $color-text-d
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 65px
      bottom: 0
      z-index: -1
</style>