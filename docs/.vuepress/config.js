const { AutoComplete } = require("antd");

module.exports = {
    title: 'docs',
    description: 'freelog 开发者文档',
    port: 8081,
    base: '/',
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
        nav: [{
                text: '指南',
                link: '/'
            },
            {
                text: 'API',
                link: '/api/'
            },
            {
                text: 'FAQ',
                link: '/faq/'
            }
        ]
    }
}