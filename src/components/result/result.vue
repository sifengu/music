<template>
    <div class="search">
        <song-list :songs="songs"></song-list>         
    </div>
</template>
<script>
    import SearchBox from '../../base/search-box/search-box.vue'
    import SongList from '../../base/song-list/song-list.vue'
    // import Scroll from '../../base/scroll/scroll'
    // import Loading from '../../base/loading/loading'
    // import NoResult from 'base/no-result/no-result'
    // import {search} from '../../api/search'
    // import {ERR_OK} from '../../api/config'
    // import {createSong} from '../../common/js/song'
    export default {
        props: {
            songs: {
                type: Array,
                default: []
            }
        },
        components: {
            SongList,
            SearchBox
        }
    }
</script>
<style scoped lang="styl" rel="stylesheet/stylus">
    .search
        position:fixed
        background:#222
        width: 100%
        height: 100%
        top:50px
        left:0
</style>
