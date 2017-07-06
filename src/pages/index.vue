<template>
	<div id = "wapper">
		<div class = "header">
	      <div class = "title">
	        {{title}}
	      </div>
	      <div v-if="login" class = "userInfo">
	      <div>	
				<img src="../assets/images/user.png">
	       		<span>{{userName}}</span>
	      </div>
	       <el-button type = "primary" @click = "logout" style='border-color: white;background-color:#58b7ff;'>退出</el-button>
	      </div>
	      <div v-else-if="showMenu" class = "userInfo">
	        <router-link :to = "{name:'Login'}">请登录</router-link>
	      </div>
	      <div v-else></div>
	    </div>
	    <div class = "downWapper">
	    <div class = "leftMenu" v-if = "showMenu">
	      <el-menu :default-active="currentActive" :router = "true" class="el-menu-vertical-demo" @open="" @close="" @select="changeMenu">
	        <el-menu-item :key="item.id" v-for = "(item,index ) in menuList" :index="item.url" class='leftList'><i class="iconfont " :class = "'icon-menu-'+index" style = "margin-right:10px"></i>{{item.name}}</el-menu-item>
	        <!-- <el-menu-item  index="/studentManage"><i class="el-icon-menu"></i>学生管理</el-menu-item>
	        <el-menu-item  index="/circlePlan"><i class="el-icon-menu"></i>轮转计划</el-menu-item>
	        <el-menu-item  index="/circleManage"><i class="el-icon-menu"></i>轮转管理</el-menu-item>
	        <el-menu-item  index="/roleManage"><i class="el-icon-menu"></i>角色管理</el-menu-item>
	        <el-menu-item  index="/evaluationQuery"><i class="el-icon-menu"></i>带教记录查询</el-menu-item>
	        <el-menu-item  index="/ratingOut"><i class="el-icon-menu"></i>评分表导出</el-menu-item> -->
	      </el-menu>
	    </div>
	    <div :class = "{content:showMenu,loginContent:!showMenu}">
	      <router-view></router-view>
	    </div>
	    </div>
	</div>
</template>
<script >
	import {getCookie,removeCookie,setTitle,getStorage,setStorage,removeStorage} from '../config/util'
	import {mapState,mapActions} from 'vuex'
	export default {
	  
	  data(){
	    return {
	      
	      title:'住院医师管理系统',
	      userName:getCookie('name'),
	    }
	  },
	  computed:{
	    ...mapState([
	      'login',
	      'menuList',
	      'userRole',
	    ]),
	    showMenu:function(){
	      return this.$route.path.indexOf('/login')==-1;
	    },
	    currentActive(){
	      if(this.$route.path.indexOf('/circlePlanDetail')!=-1){
	        return '/circlePlan';
	      }else{
	        return this.$route.path;
	      }
	      
	    }

	  },
	  methods:{
	  	...mapActions(['initLogin','initMenuList','initDeptList','initOptionList','initDeptBaseList','initUserRole','initDeptIdList']),
	  	logout(){
	  		removeCookie("uid");
            removeCookie("sid");
            removeCookie("name");
            removeStorage('currentMenu');
            this.$router.push({name:'Login'});
	  	},
	  	initAllOptionList(){
	  		this.initOptionList({type:'degree',mutation:'initDegreeList'});
	  		this.initOptionList({type:'base',mutation:'initProfessionList'});
	  		this.initOptionList({type:'stud_type',mutation:'initStuTypeList'});
	  		this.initOptionList({type:'stud_degree',mutation:'initStudentDegreeList'});
	  		this.initOptionList({type:'nation',mutation:'initNationList'});
	  		this.initOptionList({type:'education',mutation:'initEducationList'});
	  		this.initOptionList({type:'card',mutation:'initCardList'});
	  		this.initOptionList({type:'technique',mutation:'initTechniqueList'});
	  		this.initOptionList({type:'teaching',mutation:'initTechingList'});
	  		this.initOptionList({type:'turnyears',mutation:'initTurnYearsList'});
	  		this.initOptionList({type:'position',mutation:'initTitleList'});
	  	},
	  	changeMenu(index){
	  		setStorage('currentMenu',index);
	  	}
	  },
	  beforeMount(){
	  	
	  },

	  mounted(){
	  	
	  	this.initDeptList();
	  	this.initDeptBaseList();
	  	this.initLogin();
	  	this.initUserRole();
	  	this.initDeptIdList();
	  	this.initAllOptionList();
	  	setTitle('住院医师管理系统');
	  	this.initMenuList().then(()=>{
	  		if(this.menuList.length>0){

		  		if(getStorage('currentMenu')){
		  			this.$router.push({path:getStorage('currentMenu')});
		  		}else{
		  			this.$router.push({path:this.menuList[0].url});
		  		}
		  		
		  	}
	  	});
	  }
	}
</script>
<style scoped>
.router-fade-enter-active, .router-fade-leave-active {
  	transition: all .3s;
}
.router-fade-enter {
  	opacity: 0;
  	transform:translateY(400px);
}
.router-fade-leave-active{
	opacity: 0;
  	transform:translateY(-400px);
}

.header{
  width:100%;
  height:100px;
  background-color: #58b7ff;
  color:white;
  position: relative;
  z-index: 100;
}
.title{
    float: left;
    /*margin-top: 60px;*/
    /*width: 500px;*/
    font-size: 24px;
    margin-left: 20px;
    letter-spacing: 4px;
    line-height: 100px;
    /*text-shadow: 36px 5px 5px #6600D1;*/

}
.userInfo{
  float: right;
  font-size: 20px;
  /*margin-top: 114px;*/
  margin-right: 10px;
  /*width: 200px;*/
  height: 100px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.userInfo div{
	/*width: 100px;*/
	height: 100px;
	line-height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.userInfo div span{
	font-size: 18px;
	margin-right: 20px;
}
.userInfo div img{
	width: 20px;
	height: 20px;
	margin-right: 10px;
}
.downWapper{
  box-sizing: border-box;
  /*margin-top: -150px;
  /*padding-top:150px;*/
  position: relative;
  width: 100%;
  min-height: 100%;
  padding-bottom: 30px;
}
.downWapper:after{
  clear:both;
  display: block;
  content:'';
}
.leftMenu{
width: 240px;
height: 100vh;
float: left;
background-color: #eef1f6;
/*text-align: center;*/

}
.leftList{
	padding-left:40px!important;
	box-sizing: border-box;
}
.content{
  float:left;
  width: calc(100% - 240px);
}
.loginContent{
  height:100%;
  width:100% ;
}
</style>