import { query as queryUsers, queryCurrent } from '../services/user';
import {getJson, postJson} from '../services/httpservice';
export default {
  namespace: 'user',

  state: {
    list: [],
    loading: false,
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const {response} = yield call(queryUsers);


      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchCurrent(_, { call, put }) {
      //const {response} = yield call(queryCurrent);
      const {response} = yield call(getJson, {url:'user/currentInfo'});
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      const {menus} = action.payload;
      const pathMap = {};
      const eachChildren = (children)=>{
        let arr = [];
        children.forEach((item) => {
          let p = item.path;
          p = p.startsWith('/')?p:('/'+p);
          pathMap[p] = {name: item.name};
          arr.push({ path: p, name: item.name });
          if (item.children) {
            arr = arr.concat(eachChildren(item.children));
          }
        });
        return arr;
      }
      const paths = eachChildren(menus||[]);
      return {
        ...state,
        currentUser: {...action.payload,pathMap:pathMap,paths:paths}
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
