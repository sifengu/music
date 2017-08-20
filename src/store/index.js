
import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';
import * as getters from './getters';
import state from './state';
import mutations from './mutations';

import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

// npm run dev时是dev环境  npm run build时是production环境

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    strict: debug,
    plugins: debug ? [createLogger()] : []
});