import {playMode} from '../common/js/config'
import {loadSearchHistory} from '../common/js/cache'

const state = {
    singer: {},
    // 播放暂停
    playing: false,
    // 全屏
    fullScreen: false,
    playlist: [],
    sequenceList: [],
    mode: playMode.sequence,
    // 当前索引
    currentIndex: -1,
    disc: {},
    topList: {},
    // 本地读取数据
    searchHistory: loadSearchHistory()
};

export default state;
