import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/components/home/Home'
// import Passage from '@/components/passage/Passage'
// import PassageList from '@/components/passage/PassageList'
// import Club from '@/components/club/Club'
// import ClubList from '@/components/club/ClubList'
// import Activity from '@/components/activity/Activity'
// import ActivityList from '@/components/activity/ActivityList'
// import File from '@/components/file/File'
// import FileList from '@/components/file/FileList'


Vue.use(Router)
/* eslint-disable */
export default new Router({
	// mode: "history",
	routes: [
		{
			path:'/',
			name:"Index",
			component: resolve => require(['@/components/home/Index'],resolve),
			children:[
				{
					path: '/',
					base:"/club",
					name: 'Home',
					component: resolve => require(['@/components/home/Home'],resolve)
				},
				{
					name: 'Passage',
					path: '/passages/:id/detail.html',
					 component:resolve => require(['@/components/passage/Passage'],resolve)
				},
				{
					name: 'PassageList',
					path: '/passages',
					 component:resolve => require(['@/components/passage/PassageList'],resolve)
				},
				{
					name: 'Club',
					path: '/clubs/:num',
					 component:resolve => require(['@/components/club/Club'],resolve)
				},
				{
					name: 'ClubList',
					path: '/clubs',
					 component:resolve => require(['@/components/club/ClubList'],resolve)
				},
		
				{
					path: '/activities/:id/detail.html',
					name: 'Activity',
					 component:resolve => require(['@/components/activity/Activity'],resolve)
				},
				{
					name: 'ActivityList',
					path: '/activities',
					 component:resolve => require(['@/components/activity/ActivityList'],resolve)
				},
				{
					name: 'File',
					path: '/files/:id/detail.html',
					component:resolve => require(['@/components/file/File'],resolve)
				},
				{
					name: 'FileList',
					path: '/files',
					component:resolve => require(['@/components/file/FileList'],resolve)
				},
				{
					name: 'User',
					path: '/user',
					component:resolve => require(['@/components/user/User'],resolve)
				},

			]
		},
		{
			name: 'Login',
			path: '/login',
			component:resolve => require(['@/components/login/Login'],resolve)
		},
		{
			name: 'UserLogin',
			path: '/user/login',
			component:resolve => require(['@/components/user/UserLogin'],resolve)
		},
		{
			name: 'Register',
			path: '/user/register',
			component:resolve => require(['@/components/user/Register'],resolve)
		},
		{
			path: '*',
			redirect: "/"
		}
	]
})
