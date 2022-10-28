import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from '/Users/macair/TrungBach/TingTingPayCMS/src/pages/.umi/LocaleWrapper.jsx';
import { routerRedux, dynamic as _dvaDynamic } from 'dva';

const Router = routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__Login" */ '../Login'),
        })
      : require('../Login').default,
    Routes: [require('../../components/AdminAuthentication').default],
    exact: true,
    _title: 'TingTing',
    _title_default: 'TingTing',
  },
  {
    path: '/login',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__Login" */ '../Login'),
        })
      : require('../Login').default,
    Routes: [require('../../components/AdminAuthentication').default],
    exact: true,
    _title: 'TingTing',
    _title_default: 'TingTing',
  },
  {
    path: '/payment',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "WrappersSecond" */ '../../WrappersSecond'),
        })
      : require('../../WrappersSecond').default,
    routes: [
      {
        path: '/payment',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__Payment" */ '../Payment'),
            })
          : require('../Payment').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        component: () =>
          React.createElement(
            require('/Users/macair/TrungBach/TingTingPayCMS/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
    ],
    _title: 'TingTing',
    _title_default: 'TingTing',
  },
  {
    path: '/home',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "Wrappers" */ '../../Wrappers'),
        })
      : require('../../Wrappers').default,
    routes: [
      {
        path: '/home/all-transaction',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__Transaction__models__index.js' */ '/Users/macair/TrungBach/TingTingPayCMS/src/pages/Transaction/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__Transaction" */ '../Transaction'),
            })
          : require('../Transaction').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        path: '/home/deposit',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__Deposit__models__index.js' */ '/Users/macair/TrungBach/TingTingPayCMS/src/pages/Deposit/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__Deposit" */ '../Deposit'),
            })
          : require('../Deposit').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        path: '/home/withdraw',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__Withdraw__models__index.js' */ '/Users/macair/TrungBach/TingTingPayCMS/src/pages/Withdraw/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__Withdraw" */ '../Withdraw'),
            })
          : require('../Withdraw').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        path: '/home/account-manage',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__AccountManage__models__index.js' */ '/Users/macair/TrungBach/TingTingPayCMS/src/pages/AccountManage/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__AccountManage" */ '../AccountManage'),
            })
          : require('../AccountManage').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        path: '/home/device-management',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__DeviceManagement__models__index.js' */ '/Users/macair/TrungBach/TingTingPayCMS/src/pages/DeviceManagement/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__DeviceManagement" */ '../DeviceManagement'),
            })
          : require('../DeviceManagement').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        path: '/home/update-device/:id',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__DeviceManagement__models__index.js' */ '/Users/macair/TrungBach/TingTingPayCMS/src/pages/DeviceManagement/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__DeviceManagement__Edit" */ '../DeviceManagement/Edit'),
            })
          : require('../DeviceManagement/Edit').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        path: '/home/tranfer-balance',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__TransferBalance__models__index.js' */ '/Users/macair/TrungBach/TingTingPayCMS/src/pages/TransferBalance/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__TransferBalance" */ '../TransferBalance'),
            })
          : require('../TransferBalance').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        path: '/home/admin',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__Admin__models__index.js' */ '/Users/macair/TrungBach/TingTingPayCMS/src/pages/Admin/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__Admin" */ '../Admin'),
            })
          : require('../Admin').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        path: '/home/create-account',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__AccountManage__models__index.js' */ '/Users/macair/TrungBach/TingTingPayCMS/src/pages/AccountManage/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__AccountManage__Create" */ '../AccountManage/Create'),
            })
          : require('../AccountManage/Create').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        path: '/home/create-card',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__DeviceManagement__models__index.js' */ '/Users/macair/TrungBach/TingTingPayCMS/src/pages/DeviceManagement/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__DeviceManagement__Create" */ '../DeviceManagement/Create'),
            })
          : require('../DeviceManagement/Create').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        path: '/home/update-manipulation/:deviceId',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__DeviceManagement__models__index.js' */ '/Users/macair/TrungBach/TingTingPayCMS/src/pages/DeviceManagement/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__DeviceManagement__Edit" */ '../DeviceManagement/Edit'),
            })
          : require('../DeviceManagement/Edit').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        path: '/home/ip-address',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__IPAddress__models__index.js' */ '/Users/macair/TrungBach/TingTingPayCMS/src/pages/IPAddress/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__IPAddress" */ '../IPAddress'),
            })
          : require('../IPAddress').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        path: '/home/report',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__Report__models__index.js' */ '/Users/macair/TrungBach/TingTingPayCMS/src/pages/Report/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__Report" */ '../Report'),
            })
          : require('../Report').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        path: '/home/internal-transfer',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__InternalTransfer__models__index.js' */ '/Users/macair/TrungBach/TingTingPayCMS/src/pages/InternalTransfer/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__InternalTransfer" */ '../InternalTransfer'),
            })
          : require('../InternalTransfer').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        path: '/home/history-edit',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__HistoryEdit__models__index.js' */ '/Users/macair/TrungBach/TingTingPayCMS/src/pages/HistoryEdit/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__HistoryEdit" */ '../HistoryEdit'),
            })
          : require('../HistoryEdit').default,
        Routes: [require('../../components/AdminAuthentication').default],
        exact: true,
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
      {
        component: () =>
          React.createElement(
            require('/Users/macair/TrungBach/TingTingPayCMS/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
        _title: 'TingTing',
        _title_default: 'TingTing',
      },
    ],
    _title: 'TingTing',
    _title_default: 'TingTing',
  },
  {
    component: () =>
      React.createElement(
        require('/Users/macair/TrungBach/TingTingPayCMS/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
    _title: 'TingTing',
    _title_default: 'TingTing',
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
