<template>
<div class = "wapper">
	<div class = "page-title">
		评分表导出
	</div>
	<div class = "topTools">
		<div class ="queryTools">
			<div class = "queryAll">
				<el-button type = "text" @click = "queryAll">全部</el-button>
			</div>
			<el-form :model = "queryForm" :inline = "true" ref = "queryForm" label-width ="70px" style="width: 1000px;">
					<el-form-item label="年级" prop = "" >
				    	<el-select v-model="queryForm.grade" placeholder="请选择">
						    <el-option
						      v-for="item in gradeList"
						      :key="item.id"
						      :label="item.period"
						      :value="item.period">
						    </el-option>
						</el-select>
				    </el-form-item>
				     <el-form-item label="专业基地" prop = "" >
				    	<el-select v-model="queryForm.baseid" placeholder="请选择" @change="baseChange">
						    <el-option
						      v-for="item in baseList"
						      :key="item.id"
						      :label="item.name"
						      :value="item.id">
						    </el-option>
						</el-select>
				    </el-form-item>
				    <el-form-item label="轮转科室" prop = "" >
				    	<el-select v-model="queryForm.deptid" placeholder="请选择">
						    <el-option
						      v-for="item in newRoomList"
						      :key="item.id"
						      :label="item.name"
						      :value="item.id">
						    </el-option>
						</el-select>
				    </el-form-item>
				    <el-form-item label="评分日期" prop = "" >
				    	<el-date-picker
			    		  style = "width:120px"
					      v-model="queryForm.month"
					      type="month"
					      placeholder="选择日期"
					      >
					    </el-date-picker>
				    </el-form-item>
				    <el-button type = "primary" @click="query">查询</el-button>
				</el-form>
			</div>
			<div class = "search">
				<div class="search-input" style = "float:left">
					<el-input style = "width:200px" v-model="inputSearch" placeholder="请输入姓名或手机号搜索"></el-input>
				</div>
				<div class = "search-btn" style = "float:left;margin-left:10px">
					<el-button type = "primary" @click="search">搜索</el-button>
				</div>
			</div>
		</div>
		<div class = "dataTable">
			<el-table
			    ref="detailTable"
			    :data="rateList"
			    border
			    tooltip-effect="dark"
			    style="width: 100%"
			    @selection-change="handleSelectionChange">
		    	<el-table-column type ="selection" width = "45"  ></el-table-column>
			    <el-table-column type ="index" width = "65" label = "序号" ></el-table-column>
			    <el-table-column prop = "name"  label ="姓名"></el-table-column>
			    <el-table-column prop = "mobile" width = "150" label ="手机号"></el-table-column>
			    <el-table-column prop = "basename"  label ="专业基地"></el-table-column>
			    <el-table-column prop = "deptname"  label ="轮转科室"></el-table-column>
			    <el-table-column prop = "grade" label ="年级"></el-table-column>
			    <el-table-column prop = "month"  label ="评分日期"></el-table-column>
			    <el-table-column  label ="操作">
			    	<template scope = "scope">
			    		<el-button @click="exportOut(scope.$index, scope.row)" type="text" size="small" v-if="scope.row.teid!=0">导出</el-button>
			    	</template>
			    </el-table-column>
			</el-table>
			<el-pagination
			  style = "float:right;margin:10px 10px"
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="pageno"
		      :page-sizes="[10, 20, 50, 100]"
		      :page-size="pagesize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="totalCount">
		    </el-pagination>
		</div>

	</div>
</template>
<script>
	import {post,getCookie,exportWord} from '../config/util';
	import {mapState,mapActions} from 'vuex';
	import moment from 'moment';
	var _ =require('lodash');
	
	
	export default{
		data(){
			return{
				queryForm:{grade:'',baseid:'',deptid:'',month:''},
				studentsList:[{}],
				pageno:1,
				pagesize:10,
				totalCount:0,
				inputSearch:'',
				options:'',
				rateList:[],
				idList:[],
				baseList:[],
				roomList:[],
				newRoomList:[]
			}
		},
		computed:{
			...mapState(['deptList','deptBaseList','gradeList']),
		},
		mounted(){
			this.getRateList(this.pageno,this.pagesize,'','','','','');
			this.initGradeList();
			this.teach();
		},
		watch:{
			'inputSearch':function(curVal,oldVal){
				if (curVal=='') {
					this.getRateList(this.pageno,this.pagesize,'','','','','');
				}
			}
		},
		methods:{
			...mapActions(['initGradeList']),
			handleSizeChange(size){
				this.pagesize = size;
				this.pageno=1;
				this.getRateList(this.pageno,this.pagesize,this.queryForm.grade,this.queryForm.baseid,this.queryForm.deptid,this.queryForm.month,this.inputSearch)
			},
			handleCurrentChange(currentPage){
				this.pageno = currentPage;
				this.getRateList(this.pageno,this.pagesize,this.queryForm.grade,this.queryForm.baseid,this.queryForm.deptid,this.queryForm.month,this.inputSearch)
			},
			getRateList(pagenum,pagesize,gradeVal,baseVal,deptidVal,monthVal,searchVal){
				let self=this;
				post('/turn/allturndoctors',{
					command:'turn/allturndoctors',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					pageno:pagenum,
					pagesize:pagesize,
					grade:gradeVal,
					baseid:baseVal,
					deptid:deptidVal,
					month:monthVal,
					nameormobile:searchVal
				}).done(function(data){
					if (data && data.errcode==0) {
						self.rateList=data.turndoctors;
						self.totalCount=data.totalcount;
					}
				}).fail(function(error){
					console.log(error)
				})
			},
			queryAll(){
				var self=this;
				self.getRateList(this.pageno,this.pagesize,'','','','','');
				self.inputSearch="";
				self.queryForm.grade="";
				self.queryForm.baseid="";
				self.queryForm.deptid="";
				self.queryForm.month="";
			},
			handleSelectionChange(){
				
			},
			//专业基地改变后，显示对应的轮转科室
			baseChange(){
				var self=this;
				self.newRoomList=[];
				console.log(self.roomList.length);
				console.log(self.queryForm.baseid);
				for (var i=0;i<self.roomList.length;i++) {
					if (self.queryForm.baseid==self.roomList[i].pid) {
						self.newRoomList.push(self.roomList[i])
					}
				}
				
				for (var i=0;i<self.newRoomList.length;i++) {
					for (var j=0;j<self.roomList.length;j++) {
						if (self.roomList[j].pid==self.newRoomList[i].id) {
							self.newRoomList.push(self.roomList[j])
						}
					}
				}
				console.log(self.newRoomList)
			},
			// 查询学生每页显示数据量变更
			handleSizeChangeStu(val){
				this.pagesizeStu = val
				this.queryteachingstudent()
				// alert(val)
			},
			// 查询学生页码变更
			handleCurrentChangeStu(val){
				// alert(val)
				this.currentpageStu = val
				this.queryteachingstudent()
			},
			//搜索按钮，进行按条件搜索
			search(){
				let self=this;
				if (self.inputSearch && self.inputSearch!='') {
					self.getRateList(self.pageno,self.pagesize,'','','','',self.inputSearch);
					self.queryForm.grade='';
					self.queryForm.baseid='';
					self.queryForm.deptid='';
					self.queryForm.month='';
				} else{
					self.$message({
							type:'error',
							message:'搜索内容不能为空！'
						})
				}
				
			},
			//按条件查询，查询按钮
			query(){
				let self=this;
				var time=self.queryForm.month;
				var newMonth;
				if (time!='') {
					newMonth=moment(time).format('YYYY-MM')
				}
				self.getRateList(self.pageno,self.pagesize,self.queryForm.grade,self.queryForm.baseid,self.queryForm.deptid,newMonth,'')
				self.inputSearch="";
			},
			//根据教师id查询所在部门
			teach(){
				let self=this;
				post('/dept/finddeptbytecid',{
					command:'dept/finddeptbytecid',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					tecid:getCookie('uid')
				}).done(function(data){
					if (data && data.errcode==0) {
						self.idList=data.dept;
						for (var i=0;i<self.idList.length;i++) {
							post('/turn/queryTurnDeptList',{
								command:"turn/queryTurnDeptList",
								sessionid:getCookie('sid'),
								loginid:getCookie("uid"),
								dept_id:self.idList[i].id,
								type:0//查询轮转科室或者基地信息      type：0 用户所在部门所属的基地         type：1 用户所在部门的所有子科室
							}).done(function(res){
								self.baseList=_.union(self.baseList,res.dept_list)
							}).fail(function(error){
								console.log(error)
							})
							post('/turn/queryTurnDeptList',{
								command:"turn/queryTurnDeptList",
								sessionid:getCookie('sid'),
								loginid:getCookie("uid"),
								dept_id:self.idList[i].id,
								type:1//查询轮转科室或者基地信息      type：0 用户所在部门所属的基地         type：1 用户所在部门的所有子科室
							}).done(function(res){
								self.roomList=_.union(self.roomList,res.dept_list)
							}).fail(function(error){
								console.log(error)
							})
						}
						setTimeout(function(){
							console.log(self.roomList)
						},3000)
					}
				}).fail(function(error){
					console.log(error)
				})
			},
			exportOut(index,row){
				let data ={
						sessionid: getCookie('sid'),
						loginid: getCookie('uid'),
						id:row.teid,
						deptname:row.deptname,
						command: "turn/evaluateExport",
					};
				exportWord(data);
			}
		}
	}
/*	function getLocalTime(nS) {     
	   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
	}  */   
	
	
</script>
<style scoped>

	.topTools{
		height: 50px;
	}
	.queryTools{
		float:left;
		width: 825px;
	}
	.queryAll{
		float: left;
		margin-right: 12px;
	}
	.queryTools .el-form-item {
		width: 190px;
		margin-bottom: 10px;
	}
	.queryTools .el-select{
		width:120px;
	}
	.search{
		float:right;
	}


</style>