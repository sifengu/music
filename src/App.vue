<template>
  <div id="app">
    <my-header></my-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
     </keep-alive>
    <player></player>
     <!-- type="text/ecmascripts-6" -->
  </div>
</template>

<script>
  import myHeader from './components/m-header/m-header'
  import Tab from './components/tab/tab.vue'
  import Player from './components/player/player.vue'
  export default {
    name: 'app',
    components: {
      myHeader,
      Tab,
      Player
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
   @import "common/stylus/variable" 
  .tab
    background: $color-background-t
          
</style>