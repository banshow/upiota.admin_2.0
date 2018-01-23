import React from 'react';
import {Router, Route, Switch, Redirect} from 'dva/router';
import {LocaleProvider, Spin} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import cloneDeep from 'lodash/cloneDeep';
import {getNavData, getLayouts, getRouteMap} from './common/nav';
import {getPlainNode} from './utils/utils';
import {get} from './utils/tokenUtil';
import styles from './index.less';

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin}/>;
});

function getRouteData(layouts, path) {
  if (!layouts) {
    return null;
  }
  let routes = {};
  if (!path) {
    const layoutKey = Object.keys(layouts);
    layoutKey.forEach((k) => {
      routes = {...routes, ...layouts[k].routes};
    });
  } else if (!layouts[path]) {
    return null;
  } else {
    routes = cloneDeep(layouts[path]).routes;
  }
  const routeKeys = Object.keys(routes);

  const arr = [];
  routeKeys.forEach((k) => {
    const item = routes[k];
    item.path = k;
    item.exact = item.exact === false ? false : true;
    arr.push(item);
  });
  return arr;
}

function _getRouteData(navData, path) {
  if (!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) {
    return null;
  }
  const route = cloneDeep(navData.filter(item => item.layout === path)[0]);
  const nodeList = getPlainNode(route.children);
  return nodeList;
}

function getLayout(layouts, path) {
  if (!layouts || !layouts[path]) {
    return null;
  }
  const route = layouts[path];
  return {
    component: route.component,
    layout: route.layout,
    name: route.name,
    path: route.path,
  };
}

function _getLayout(navData, path) {
  if (!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) {
    return null;
  }
  const route = navData.filter(item => item.layout === path)[0];
  return {
    component: route.component,
    layout: route.layout,
    name: route.name,
    path: route.path,
  };
}

function RouterConfig({history, app}) {
  const navData = getNavData(app);
  const layouts = getLayouts(app);
  const routeData = getRouteData(layouts);
  const UserLayout = getLayout(layouts, 'UserLayout').component;
  const BasicLayout = getLayout(layouts, 'BasicLayout').component;

  const passProps = {
    app,
    navData,
    getRouteMap: () => {
      return getRouteMap(app);
    },
    getRouteData: (path) => {
      return getRouteData(layouts, path);
    },
  };

  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/user" render={props => (
            !get() ?
              (<UserLayout {...props} {...passProps} />)
              : (
                <Redirect to={{
                  pathname: '/',
                  state: {from: props.location}
                }}/>
              )
          )
          }/>
          <Route path="/" render={props => (
            get() ?
              (<BasicLayout {...props} {...passProps} />) : (
                <Redirect to={{
                  pathname: '/user/login',
                  state: {from: props.location}
                }}/>
              )
          )}/>
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
