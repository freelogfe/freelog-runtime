
module.exports = {
    title: '',
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
        logo: '/home.jpg',
        sidebarDepth: 2,
        sidebar: "auto", 
        collapsable: true,
        nav: [{
                text: '指南',
                link: '/'
            },
            {
                text: 'API',
                link: '/api/'
            },
            {
                text: '技术方案适配',
                link: '/adapt/'
            },
            {
                text: 'FAQ',
                link: '/faq/'
            }
        ]
    }
}