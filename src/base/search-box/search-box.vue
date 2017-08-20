<template>
  <div class="search-box">
    <i class="icon-back"  @click="back"></i>
    <input class="box" ref="input" v-model="query" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="icon-delete"></i>
  </div>
</template>

<script>
  import {setTime} from '../../common/js/util'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索音乐、歌手'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      clear() {
        this.query = ''
      },
      setQuery(query) {
        this.query = query
        console.log(query)
      },
      blur() {
        this.$refs.input.blur()
      },
      back() {
        this.$router.back()
      }
    },
    created() {
      this.$watch('query', setTime((newQ) => {
        this.$emit('query', newQ)
      }, 200))
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    //background: $color-background-t-
    border-radius: 6px
    .icon-back, .icon-delete
      font-size: 24px
    .box
      flex: 1
      margin: 0 5px
      color:$color-text
      height:44px
      background:$color-background-t-
      padding-left:5px
      line-height: 44px
      font-size: $font-size-medium-x
      appearance: none
      border-bottom:1px solid $color-text
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>