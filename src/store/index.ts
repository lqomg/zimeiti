import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import userModel from './user';
const store = createStore({
    modules: {
        user: userModel
    },
    plugins: [createPersistedState()]
})

export default store;