// ref: https://umijs.org/config/
export default {
    treeShaking: true,
    sass: {},
    routes: [
        {
            path: '/',
            component: '../pages/Login',
            Routes: ['./src/components/AdminAuthentication'],
        },
        {
            path: '/login',
            component: '../pages/Login',
            Routes: ['./src/components/AdminAuthentication'],
        },

        {
            path: '/payment',
            component: '../WrappersSecond',
            routes: [
                {
                    path: '/payment',
                    component: '../pages/Payment',
                    Routes: ['./src/components/AdminAuthentication'],
                },
            ],
        },
        {
            path: '/home',
            component: '../Wrappers',
            routes: [
                {
                    path: '/home/all-transaction',
                    component: '../pages/Transaction',
                    Routes: ['./src/components/AdminAuthentication'],
                },
                {
                    path: '/home/deposit',
                    component: '../pages/Deposit',
                    Routes: ['./src/components/AdminAuthentication'],
                },
                {
                    path: '/home/withdraw',
                    component: '../pages/Withdraw',
                    Routes: ['./src/components/AdminAuthentication'],
                },
                {
                    path: '/home/account-manage',
                    component: '../pages/AccountManage',
                    Routes: ['./src/components/AdminAuthentication'],
                },
                {
                    path: '/home/device-management',
                    component: '../pages/DeviceManagement',
                    Routes: ['./src/components/AdminAuthentication'],
                },

                {
                    path: '/home/update-device/:id',
                    component: '../pages/DeviceManagement/Edit',
                    Routes: ['./src/components/AdminAuthentication'],
                },
                {
                    path: '/home/admin',
                    component: '../pages/Admin',
                    Routes: ['./src/components/AdminAuthentication'],
                },
                {
                    path: '/home/create-account',
                    component: '../pages/AccountManage/Create',
                    Routes: ['./src/components/AdminAuthentication'],
                },

                {
                    path: '/home/create-card',
                    component: '../pages/DeviceManagement/Create',
                    Routes: ['./src/components/AdminAuthentication'],
                },

                {
                    path: '/home/update-manipulation/:deviceId',
                    component: '../pages/DeviceManagement/Edit',
                    Routes: ['./src/components/AdminAuthentication'],
                },

                {
                    path: '/home/ip-address',
                    component: '../pages/IPAddress',
                    Routes: ['./src/components/AdminAuthentication'],
                },

                {
                    path: '/home/report',
                    component: '../pages/Report',
                    Routes: ['./src/components/AdminAuthentication'],
                },

                {
                    path: 'internal-transfer',
                    component: '../pages/InternalTransfer',
                    Routes: ['./src/components/AdminAuthentication'],
                },
                {
                    path: 'history-edit',
                    component: '../pages/HistoryEdit',
                    Routes: ['./src/components/AdminAuthentication'],
                },

                {
                    path: '/home/history-withdraw-card',
                    component: '../pages/WithdrawHistoryCard',
                    Routes: ['./src/components/AdminAuthentication'],
                },

                {
                    path: '/home/card-management',
                    component: '../pages/CardManagement',
                    Routes: ['./src/components/AdminAuthentication'],
                },
            ],
        },
    ],
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        [
            'umi-plugin-react',
            {
                antd: true,
                dva: true,
                dynamicImport: { webpackChunkName: true },
                title: 'TingTing',
                dll: false,
                locale: {
                    enable: true,
                    default: 'en-US',
                },
                routes: {
                    exclude: [
                        /models\//,
                        /services\//,
                        /model\.(t|j)sx?$/,
                        /service\.(t|j)sx?$/,
                        /components\//,
                    ],
                },
            },
        ],
    ],
};
