<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" class="item" v-for="(song, index) in songs">
        <!-- <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div> -->
        <div class="content">
          <h2 class="index" ref="index" v-if="flag" :class="index<3?color:''">{{index + 1}}</h2>
            <h2 class="name">{{song.name}}</h2>
            <p class="desc border-1px">{{getDesc(song)}}</p>
          
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      },
      rank: {
        type: Boolean,
        default: false
      },
      flag: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        color: 'color'
      }
    },
    mounted() {
      if(this.rank) {
          this.$refs.index.style.color = 'red'
        }
    },
    methods: {
      selectItem(item, index) {
        this.$emit('select', item, index)
      },
      getDesc(song) {
        return `${song.singer}·${song.album}`
      // },
      // getRankCls(index) {
      //   if (index <= 2) {
      //     return `icon icon${index}`
      //   } else {
      //     return 'text'
      //   }
      // },
      // getIndex(index) {
      //   if (index > 2) {
      //     return index + 1
      //   }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .color
          color: red !important
        .index
          width: 25px
          height: 40px
          float: left
          line-height: 40px
          color: $color-text-d
        .name
          no-wrap()
          color: $color-text-d_
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
          border-1px(#222)
</style>