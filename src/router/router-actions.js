import store from '../store'
export default function(router){
	router.beforeEach((to, from, next) => {
	  console.log('从'+from.path+'浏览到'+to.path)
	  let path = to.path.indexOf('/circlePlanDetail')>-1?'/circlePlan':to.path;
	  let flag =false;
	  //console.log(store)
	  //location refeash bug fix
	  if(to.path=='/login'){
	  	next();
	  }else{
	  	store.dispatch('initMenuList').then(()=>{
		  	store.state.menuList.forEach((item)=>{
			  	if(item.url.indexOf(path)>-1){
			  		flag = true;
			  	}
			  });
			  if(flag){
			  	next();
			  }else if(to.path=='/index'){
			  	next();
			  }else{
			  	next(false);
			  }

		  })
	  }
	  
	  
	})

}