import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import VuexPersistence from 'vuex-persist';
import localForage from 'localforage';
const vuexLocal = new VuexPersistence({
  storage: localForage,
  asyncStorage: true,
});

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticated: false,
    userType: 0,
    user: null,
    
  },
  mutations: {
    SET_AUTH:(state,auth)=> state.authenticated = auth,
    SET_USER_TYPE:(state,userType)=> state.userType = userType,
    SET_USER:(state,user)=> state.user = user,

  },
  actions: {
    setAuth: ({commit},auth) => commit('SET_AUTH',auth),
    setUserType:({commit},userType) => commit('SET_USER_TYPE',userType),
    setUser:({commit},user) => commit('SET_USER',user),

  },
  modules: {
  },
  plugins: [vuexLocal.plugin],
})
