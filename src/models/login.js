import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';
import { postJson } from '../services/httpservice';
import {set,remove} from '../utils/tokenUtil';
export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const {response} = yield call(postJson, {url:'auth',param:payload});
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
      if(response){
        yield call(set,response.token);
        yield put(routerRedux.push('/'));
        return;
      }

      // Login successfully
      //if (response.status === 'ok') {

      //}
    },
    *logout(_, { call,put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      yield call(remove);
      yield put(routerRedux.push('/user/login'));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        submitting: false,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
