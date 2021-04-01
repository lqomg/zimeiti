import { Mutation, Action } from 'vuex';
import { login, queryMessage } from "@/services/user";
import { removeToken } from "@/utils/localToken";
import { stat } from 'fs';

export interface UserState {
  code: string | number;
  id: string;
  token: string;
  name?: string;
  status?: string
}


export interface ModuleType {
  namespaced?: boolean,
  name: string,
  state: UserState;
  mutations: {
    saveUser: Mutation<UserState>;
  };
  actions: {
    login: Action<UserState, UserState>;
    logout: Action<UserState, UserState>;
  };
}

const initState: UserState = {
  code: 0,
  name: '',
  id: '',
  token: '',
}

const StoreModel: ModuleType = {
  namespaced: true,
  name: 'user',
  state: {
    ...initState
  },
  mutations: {
    saveUser(state, { code, name, id, token }) {
      state.code = code || initState.code;
      state.token = token || initState.token;
      state.id = id || initState.id;
      state.name = name || initState.name;

    }
  },
  actions: {
    async login({ commit, state }, playload) {
      try {
        const { code, password } = playload;
        const response = await login(code, password);
        commit('saveUser', {
          code: response.code,
          id: response.id,
          token: response.token,
          status: response.status
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    async logout({ commit }) {
      try {
        await removeToken();
        commit('saveUser', { ...initState });
        return true;
      } catch (error) {
        return false;
      }
    }
  }
}



export default StoreModel;
