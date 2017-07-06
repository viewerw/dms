import Vue from 'vue'
import Router from 'vue-router'
import EmployeeManage from '../pages/EmployeeManage'
import CirclePlan from '../pages/circlePlan'
import CirclePlanDetail from '../pages/circlePlanDetail'
import CircleManage from '../pages/circleManage'
import RoleManage from '../pages/roleManage'
import EvaluationQuery from '../pages/evaluationQuery'
import Login from '../pages/login'
import StudentManage from '../pages/studentManage'
import Index from '../pages/index'




Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      redirect:{name:'Login'}
      
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      
    },
    {
    	path:'/index',
    	name:'Index',
    	component: Index,
    	children:[
    		{
		      path: '/employeeManage',
		      name: 'EmployeeManage',
		      component: EmployeeManage
		    },
		    {
		      path: '/studentManage',
		      name: 'StudentManage',
		      component: StudentManage
		    },
		    {
		      path: '/circlePlan',
		      name: 'CirclePlan',
		      component: CirclePlan
		    },
		    {
		      path: '/circlePlanDetail/:plan_id',
		      name: 'circlePlanDetail',
		      component: CirclePlanDetail
		    },
		    {
		      path: '/circleManage',
		      name: 'CircleManage',
		      component: CircleManage
		    },
		    {
		      path: '/roleManage',
		      name: 'RoleManage',
		      component: RoleManage
		    },
		    {
		      path: '/evaluationQuery',
		      name: 'EvaluationQuery',
		      component: EvaluationQuery
		    },
		    {
		      path: '/ratingOut',
		      name: 'RatingOut',
		      component: require('../pages/ratingOut')
		    },
    	]
    },
    
  ]
});

export default router;
