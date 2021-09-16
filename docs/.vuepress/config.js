const { AutoComplete } = require("antd");

module.exports = {
    title: 'freelog-docs',
    description: 'freelog 开发者文档',
    port: 8081,
    base: '/freelog-runtime/',
    head: [
        ['link', {
            rel: 'icon',
            href: '/freelog.ico'
        }]
    ],
    themeConfig: {
        logo: '/logo.svg',
        sidebarDepth: 2,
        sidebar: "auto",
        //  {
        //     '/': [
        //         '', 
        //     ],
        //     '/api/': [
        //         '', 
        //     ]
        // }, 
        // [{
        //         title: 'guide', // 必要的
        //         path: '/guide/', // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        //         collapsable: false, // 可选的, 默认值是 true,
        //         sidebarDepth: 2, // 可选的, 默认值是 1
        //     },
        //     {
        //         title: 'api', // 必要的
        //         path: '/api/', // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        //         collapsable: false, // 可选的, 默认值是 true,
        //         sidebarDepth: 2, // 可选的, 默认值是 1
        //     }
        // ],
        nav: [{
                text: '首页',
                link: '/'
            },
            {
                text: 'API',
                link: '/api/'
            }
        ]
    }
}