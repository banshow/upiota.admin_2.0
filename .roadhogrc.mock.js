import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { imgMap } from './mock/utils';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
      menus:[{
        name: 'Dashboard',
        icon: 'dashboard',
        path: 'dashboard',
        children: [
          {
            name: '分析页',
            key:'analysis',
            path: '/dashboard/analysis',
          },
          {
            name: '监控页',
            key:'monitor',
            path: '/dashboard/monitor',
          },
          {
            name: '工作台',
            key:'workplace',
            path: '/dashboard/workplace',
          },
        ],
      },
        {
          name: '表单页',
          path: 'form',
          icon: 'form',
          children: [
            {
              name: '基础表单',
              key:'basic-form',
              path: '/form/basic-form',
            },
            {
              name: '分步表单',
              key:'step-form',
              path: '/form/step-form',
            },
            {
              name: '高级表单',
              key:'advanced-form',
              path: '/form/advanced-form',
            },
          ],
        },
        {
          name: '列表页',
          path: 'list',
          icon: 'table',
          children: [
            {
              name: '查询表格',
              key:'table-list',
              path: '/list/table-list',
            },
            {
              name: '标准列表',
              key:'basic-list',
              path: '/list/basic-list',
            },
            {
              name: '卡片列表',
              key:'card-list',
              path: '/list/card-list',
            },
            {
              name: '搜索列表（项目）',
              key:'cover-card-list',
              path: '/list/cover-card-list',
            },
            {
              name: '搜索列表（应用）',
              key:'filter-card-list',
              path: '/list/filter-card-list',
            },
            {
              name: '搜索列表（文章）',
              key:'search',
              path: '/list/search',
            },
          ],
        },
        {
          name: '详情页',
          path: 'profile',
          icon: 'profile',
          children: [
            {
              name: '基础详情页',
              key:'basic',
              path: '/profile/basic',
            },
            {
              name: '高级详情页',
              key:'advanced',
              path: '/profile/advanced',
            },
          ],
        },
        {
          name: '结果',
          path: 'result',
          icon: 'check-circle-o',
          children: [
            {
              name: '成功',
              key:'success',
              path: '/result/success',
            },
            {
              name: '失败',
              key:'fail',
              path: '/result/fail',
            },
          ],
        },
        {
          name: '异常',
          path: 'exception',
          icon: 'warning',
          children: [
            {
              name: '403',
              key:'403',
              path: '/exception/403',
            },
            {
              name: '404',
              key:'404',
              path: '/exception/404',
            },
            {
              name: '500',
              key:'500',
              path: '/exception/500',
            },
          ],
        },
        {
          name: '帐户',
          icon: 'user',
          path: 'user',
          children: [
            {
              name: '登录',
              key:'login',
              path: '/user/login',
            },
            {
              name: '注册',
              key:'register',
              path: '/user/register',
            },
            {
              name: '注册结果',
              key:'register-result',
              path: '/user/register-result',
            },
          ],
        },
        {
          name: '使用文档',
          path: 'http://pro.ant.design/docs/getting-started',
          target: '_blank',
          icon: 'book',
        },
      ],
    },
  },
  // GET POST 可省略
  'GET /api/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    res.send({
      status: password === '888888' && userName === 'admin' ? 'ok' : 'error',
      type,
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok' });
  },
  'GET /api/notices': getNotices,
};

export default noProxy ? {} : delay(proxy, 1000);
