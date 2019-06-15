import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home'
import store from '../store'
Vue.use(Router)

const routes=[
	{
		//主页入口
		path: '/',
		component: Home,
		children:[{
			path:'/',
			component:resolve=>require(['../views/home/homePage'],resolve)
		},
		{//主页(所有文章)
			path:'/index',
		  name:'index',
		  component:resolve=>require(['../views/home/homePage'],resolve)
		},
		{//技术
			path:'/tech',
		  name:'tech',
		  component:resolve=>require(['../views/tech/tech'],resolve)
		},
		{//音乐
			path:'/music',
		  name:'music',
		  component:resolve=>require(['../views/music/music'],resolve)
		},
		{//感悟
			path:'/sense',
		  name:'sense',
		  component:resolve=>require(['../views/sense/sense'],resolve)
		},
		{//归档
			path:'/file',
		  name:'sortFile',
		  component:resolve=>require(['../views/file/sortFile'],resolve)
		},
		{//关于我
			path:'/aboutMe',
		  name:'aboutMe',
		  component:resolve=>require(['../views/aboutMe/aboutMe'],resolve)
		},
		{//关于我
			path:'/myApp',
		  name:'myApp',
		  component:resolve=>require(['../views/myApp/myApp'],resolve)
		},
		{//单个文章页面
			path:'/articles/:articleId',
		  name:'articles',
		  component:resolve=>require(['../components/oneArticle'],resolve),
		  props:true
		},
		{//文字搜索页面
			path:'/search/s=:searchStr',
		  name:'searchWord',
		  component:resolve=>require(['../views/search/search'],resolve),
		  props:true
		},
		{//标签搜索页面
		  path:'/search/t=:tagStr',
		  name:'searchTag',
		  component:resolve=>require(['../views/search/search'],resolve),
		  props:true
		},
		]
	},
	//后台路由
	{
		//管理页面入口
		path: '/admin',
		component: resolve=>require(['../components/admin/admin'],resolve),
		meta: {
			requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
		},
		children:[
			{
				path:'/',
				name:'allAricle',
				component:resolve=>require(['../components/admin/ARTICLES/allArticles'],resolve),
				meta: {
					requireAuth: true,
				},
			 },
			{
				path:'Href',
				name:'HrefList',
				component:resolve=>require(['../components/admin/Href/HrefList'],resolve),
				meta: {
					requireAuth: true,
				},
			},
			{
				path:'Href/modify/:id?',
				name:'musicAdmin',
				component:resolve=>require(['../components/admin/Href/modify'],resolve),
				meta: {
					requireAuth: true,
				},
			},
			{
				path:'TagList',
				name:'TagList',
				component:resolve=>require(['../components/admin/Tag/TagList'],resolve),
				meta: {
					requireAuth: true,
				},
			},	{
				path:'Tag/modify/:id?',
				name:'TagList',
				component:resolve=>require(['../components/admin/Tag/modify'],resolve),
				meta: {
					requireAuth: true,
				},
			},
			{
				path:'Imglist',
				name:'meAdmin',
				component:resolve=>require(['../components/admin/Img/Imglist'],resolve),
				meta: {
					requireAuth: true,
				},
			},
			{
				path:'Piclist',
				name:'meAdmin',
				component:resolve=>require(['../components/admin/Pic/Piclist'],resolve),
				meta: {
					requireAuth: true,
				},
			},
			{
				path:'Piclist/modify/:id?',
				name:'meAdmin',
				component:resolve=>require(['../components/admin/Pic/modify'],resolve),
				meta: {
					requireAuth: true,
				},
			},
			{
				path:'Img/modify/:id?',
				name:'meAdmin',
				component:resolve=>require(['../components/admin/Img/modify'],resolve),
				meta: {
					requireAuth: true,
				},
			},{
				path:'commentAdmin',
				name:'commentAdmin',
				component:resolve=>require(['../components/admin/commentAdmin'],resolve),
				meta: {
					requireAuth: true,
				},
			 },
			{
				path:'modify/articleId=:id',
				name:'modify',
				component:resolve=>require(['../components/admin/ARTICLES/modify'],resolve),
				props:true,
				meta: {
					requireAuth: true,
				},
			},
			{
				path:'newArticle/type=:type',
				name:'newArticle',
				component:resolve=>require(['../components/admin/Articles/modify'],resolve),
				props:true,
				meta: {
					requireAuth: true,
				},
			}
		],
	},
	{
		path:'/login',
		name:'login',
		component:resolve=>require(['../components/admin/login'],resolve)
	},
];

const router=new Router({
	mode:'hash',
	routes,
	//定义路由跳转时，滚动条的位置
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {//如果存在存储过的位置，则跳回该位置（即点击浏览器回退按钮）
			return savedPosition
		} else {//没有就跳回顶部
			return { x: 0, y: 0 }
		}
	},
});

//页面刷新时，如果token存在于localStorage中，那么就重新赋予token值
if (window.localStorage.getItem('token')) {
	store.commit('login', window.localStorage.getItem('token'));
}

// 添加一个导航守卫，对登录状态进行验证
router.beforeEach((to, from, next) => {
	if (to.meta.requireAuth) {
		console.log('需要登录验证')  // 判断该路由是否需要登录权限
		if (store.state.token) {  // 通过vuex state获取当前的token是否存在
			next();
		}
		else {
			next({
				path: '/login',
				query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
			})
		}
	}
	else {
		next();
	}
  })

export default router;