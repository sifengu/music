// 取数据到组件中

// 代理
export const singer = state => state.singer;

export const playing = state => state.playing;

export const fullScreen = state => state.fullScreen;

export const playlist = state => state.playlist;

export const sequenceList = state => state.sequenceList;

export const mode = state => state.mode;

export const currentIndex = state => state.currentIndex;

export const disc = state => state.disc;

export const topList = state => state.topList;

export const searchHistory = state => state.searchHistory

// 计算
// 当前歌曲
export const currentSong = (state) => {
    return state.playlist[state.currentIndex] || {};
};
