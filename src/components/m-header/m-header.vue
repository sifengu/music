<template>
  <div class="m-header">
    <div class="icon">
      <i class="icon-theme"></i>
    </div>
    <h1 class="text">Music</h1>
     <!-- <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>  -->
    <router-link tag="div" class="search" to="/search">
        <i class="icon-search"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-text-l_
    font-size: 0
    background: $color-theme
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 30px
      height: 32px
      margin-right: 9px
      background-size: 30px 32px
      .icon-theme
        font-size:$font-theme
        color:$color-text
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .search
      position: absolute
      top: 0
      right: 0
      height: 44px
      width: 44px
      text-align: center
      line-height: 44px
      .icon-search
        height: 44px
        width:44px
        line-height:44px
        text-align:center
        font-size:$font-search
        color:$color-text
</style>