import * as types from './mutation-type'
import {playMode} from '../common/js/config'
import {shuffle} from '../common/js/util'

import {saveSearch, deleteSearch, clearSearch, savePlay} from '../common/js/cache'

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

export const selectPlay = function({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
        let randomList = shuffle(list)
        commit(types.SET_PLAYLIST, randomList)
        index = findIndex(randomList, list[index])
    }else{
        commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
}

// 随机播放全部
export const randomPlay = function ({commit}, {list}) {
    commit(types.SET_PLAY_MODE, playMode.random);
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAY_MODE, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
}

// 插入歌曲
// 最终需要对三个参数做操作
export const insertSong = function ({commit, state}, song) {
    // 创建副本
    let playlist = state.playlist.slice();
    let sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;
    // 修改playlist
    // 记录当前歌曲
    let currentSong = playlist[currentIndex]

    // 查找是否在当前列表中
    let songIndex = findIndex(playlist, song)

    currentIndex++;
    playlist.splice(currentIndex, 0, song);

    if(songIndex > -1) {
        // 删除当前索引
        if(currentIndex > songIndex) {
            playlist.splice(songIndex, 1)
            currentIndex--
        } else {
            playlist.splice(songIndex + 1, 1)
        }
    }

    // 修改sequenceList
    let cIndex = findIndex(sequenceList, currentSong) + 1
    let sequenceIndex = findIndex(sequenceList, song);

    sequenceList.splice(cIndex, 0, song);
    if(sequenceIndex > -1) {
        if (cIndex > sequenceIndex) {
            sequenceList.splice(sequenceIndex, 1)
            } else {
            sequenceList.splice(sequenceIndex + 1, 1)
            }
    }
    // console.log('action', playlist, currentIndex, sequenceList, cIndex)

    commit(types.SET_PLAYLIST, playlist);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
}

// 删除歌曲
export const deleteSong = function ({commit, state}, song) {
    // 创建副本
    let playlist = state.playlist.slice();
    let sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;

    // 查找是否在当前列表中
    let songIndex = findIndex(playlist, song)

    playlist.splice(songIndex, 1);

    // 修改sequenceList
    let sequenceIndex = findIndex(sequenceList, song);

    sequenceList.splice(sequenceIndex, 1);

    if(currentIndex > songIndex || currentIndex === playlist.length) {
        currentIndex--;
    }

    commit(types.SET_PLAYLIST, playlist);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);

    const playingState = playlist.length > 0
    // 列表为空
    commit(types.SET_PLAYING_STATE, playingState)
    // else{
    //     commit(types.SET_PLAYING_STATE, true);
    // }
}

export const clearSong = function ({commit, state}) {
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_PLAYING_STATE, false)
    commit(types.SET_CURRENT_INDEX, -1)
}

export const saveSearchHistory = function ({commit, state}, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({commit, state}, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({commit, state}) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const savePlayHistory = function({commit}, song) {
    commit(types.SET_PLAY_HISTORY, savePlay(song))
}