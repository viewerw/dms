<template>
<div class = "wapper">
	<div class = "page-title">
		带教记录查询
	</div>
	<div class = "topTools">
		<div class ="queryTools">
			<el-form  :inline = "true" ref = "queryForm" label-width ="70px">
					<el-form-item label="专业基地" prop = "" >
				    	<el-select v-model="basenameid" placeholder="请选择" @change='initDeptInBaseList'>
							<el-option label='全部' value=''></el-option>
						    <el-option
						      v-for="item in deptBaseList"
						      :key="item.id"
						      :label="item.name"
						      :value="item.id">
						    </el-option>
						</el-select>
				    </el-form-item>
				    <el-form-item label="科室" prop = "" >
				    	<el-select v-model="deptid" placeholder="请选择">
							<el-option label='全部' value=''></el-option>
						    <el-option
						      v-for="item in deptList"
							  :key="item && item.id"
						      :label="item && item.name"
						      :value="item && item.id">
						    </el-option>
						</el-select>
				    </el-form-item>
					<el-button type = "primary" @click='lookup'>查找</el-button>
				     <!--<el-form-item label="年级" prop = "" >
				    	<el-select v-model="period" placeholder="请选择">
				    		<el-option
				    		   v-for="item in gradeList"
				    		   :key="item.id"
				    		   :label="item.period"
				    		   :value="item.id">
				    		</el-option>
				    	</el-select>
				    </el-form-item> -->
				</el-form>
			</div>
			<div class = "search">
				<div class="search-input" style = "float:left">
					<el-input style = "width:200px" v-model="input" placeholder="请输入姓名或手机号搜索"></el-input>
				</div>
				<div class = "search-btn" style = "float:left;margin-left:10px">
					<el-button type = "primary" @click='search'>搜索</el-button>
				</div>
			</div>
		</div>
		<div class = "dataTable">
			<el-table
			    ref="detailTable"
			    :data="TeachersList"
			    border
			    tooltip-effect="dark"
			    style="width: 100%">
			    <el-table-column type ="index" label= "序号" width = "65" ></el-table-column>
			    <el-table-column prop = "username"  label ="姓名"></el-table-column>
			    <el-table-column prop = "mobile" width = "150" label ="手机号"></el-table-column>
			    <el-table-column prop = "deptname"  label ="所属科室"></el-table-column>
			    <el-table-column prop = "title"  label ="职称"></el-table-column>
			    <el-table-column prop = "position" label ="职位"></el-table-column>
			    <el-table-column prop = "education"  label ="学历"></el-table-column>
			    <el-table-column prop = "degree"  label ="学位"></el-table-column>
			    <el-table-column  label ="操作">
			    	<template scope = "scope">
			    		<el-button @click="showTeachRecords(scope.$index, scope.row)" type="text" size="small">带教记录查看</el-button>
			    	</template>
			    </el-table-column>
			</el-table>
			<el-pagination
				style = "float:right;margin:10px 10px"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentpage"
				:page-sizes="[10, 20, 50, 100]"
				:page-size="pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="totalcount">
			</el-pagination>
		</div>
	<!-- xueyuan liebiao dialog-->
	<el-dialog title = "学员列表" :visible.sync="dialogTeacherDetail">
		<div class ="dialogQueryTools">
			<el-form  :inline = "true" ref = "queryForm" label-width ="70px">
			    <el-form-item label="年级" prop = "" >
			    	<el-select v-model="periodname" placeholder="请选择" @change='selectGrade'>
			    		<el-option label='全部' value=''></el-option>
					    <el-option
					      v-for="item in gradeList"
					      :key="item.id"
					      :label="item.period"
					      :value="item.period">
					    </el-option>
					</el-select>
			    </el-form-item>
			    <div class = "search">
					<div class="search-input" style = "float:left">
						<el-input style = "width:200px" v-model="inputStu" placeholder="请输入姓名或手机号搜索"></el-input>
					</div>
					<div class = "search-btn" style = "float:left;margin-left:10px">
						<el-button type = "primary" @click='seachStu'>搜索</el-button>
					</div>
				</div>
			</el-form>
			
		</div>
		<div class = "tableWapper">
			<el-table
			    ref="detailTable"
			    :data="TeacherStudents"
			    border
			    tooltip-effect="dark"
			    style="width: 100%">
			    <el-table-column type ="index" width = "65" label ="序号" ></el-table-column>
			    <el-table-column prop = "username" width = "96" label ="学员"></el-table-column>
			    <el-table-column prop = "mobile" width="128" label ="手机号码"></el-table-column>
			    <el-table-column prop = "deptname"  label ="轮转科室"></el-table-column>
			    <el-table-column prop = "period" width ="90" label ="年级"></el-table-column>
			    <el-table-column   label ="评价" width="90">
			    	<template scope = "scope">
			    		<el-button type = "text" @click ="showEvaluations(scope.row)">查看详情</el-button>
			    	</template>
			    </el-table-column>
			</el-table>
			<el-pagination
				style = "float:right;margin:10px 10px"
				@size-change="handleSizeChangeStu"
				@current-change="handleCurrentChangeStu"
				:current-page="currentpageStu"
				:page-sizes="[10, 20, 50, 100]"
				:page-size="pagesizeStu"
				layout="total, sizes, prev, pager, next, jumper"
				:total="totalcountStu">
			</el-pagination>
		</div>
	</el-dialog>
	<!--chakan pingjia dialog-->
	<el-dialog title = "评价列表" :visible.sync="dialogEvaluation">
		<div class = "dialogContainer">
			<div class = "dialogLeft">
				日常评价
			</div>
			<div class = "dialogRight">
				<el-table
				ref="evaluationTable"
			    :data="evaluationList"
			    border
			    tooltip-effect="dark"
				style='float:right;'
				>
				<el-table-column prop = "evaluationmonth" width='300' label ="评价日期"></el-table-column>
			    <el-table-column prop = "totalscore" label ="总分/100分"></el-table-column>
				</el-table>
			</div>
		</div>
	</el-dialog>
</div>
</template>
<script>
	import {post,getCookie} from '../config/util';
	import {mapState,mapActions} from 'vuex';
	export default{
		data(){
			return{
				TeachersList:[],
				TeacherStudents:[
					// {uesrname:'未为晚也',mobile:'15601598900',deptname:'神经外科（设计好好了就流口水）',period:'2014级'}
				],
				dialogTeacherDetail:false,
				dialogEvaluation:false,
				evaluationList:[
					// {evaluationmonth:'2017年5月',totalscore:'80'}
				],
				input:'',
				inputStu:'',
				// seachStudent:'',
				totalcount:0,
				currentpage:1,
				pagesize:10,
				// 学生列表分页
				totalcountStu:0,
				currentpageStu:1,
				pagesizeStu:10,
				teacherid:'',

				username:'',
				mobile:'',
				usernameStu:'',
				mobileStu:'',

				deptid:'',
				basenameid:'',
				periodname:'',
				deptList:[],
				deptId:''
			}
		},
		watch:{
			'input':function(val,oldval){
				if(val == ''){
					this.username = ''
					this.mobile = ''
					this.queryteachingteacher(this.currentpage,this.pagesize)
				}
				var mobilereg = /^(-)?\d+(\.\d+)?$/;
				if(mobilereg.test(val)){
					this.mobile = val
				}else{
					this.username = val
				}
			},
			'inputStu':function(val,oldval){
				if(val == ''){
					this.usernameStu = ''
					this.mobileStu = ''
					this.queryteachingstudent(this.currentpage,this.pagesize)
				}
				var mobilereg = /^(-)?\d+(\.\d+)?$/;
				if(mobilereg.test(val)){
					this.mobileStu = val
				}else{
					this.usernameStu = val
				}
			}
		},
		computed:{
			...mapState(['deptBaseList','gradeList']),
		},
		mounted(){
			this.queryteachingteacher(this.currentpage,this.pagesize)
			this.initGradeList()
		},
		methods:{
			...mapActions(['initGradeList']),
			// 基地科室联动
			initDeptInBaseList(){
				let self = this;
				post('/turn/queryDeptList',{
					command: 'turn/queryDeptList',
		            sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					base_id:self.basenameid
				}).done((data)=>{
					if(data&&data.errcode==0){
						self.deptList = data.dept_list;
					}
				})
			},
			// 选择基地和 科室后查找
			lookup(){
				// alert(this.basenameid)
				// alert(this.deptid)
				this.input = ''
				this.queryteachingteacher(this.currentpage,this.pagesize)
			},
			// 查询带教老师信息
			queryteachingteacher(pagenum,pagesize){
				let self = this
				post('/teachingrecord/queryteachingteacher',{
					command:'teachingrecord/queryteachingteacher',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					baseid:self.basenameid,
					deptid:self.deptid,
					username:self.username,
					mobile:self.mobile,
					pagenum:pagenum,
					pagepersize:pagesize
				}).done(function(data){
					// console.log(data)
					// if(data.teacherinfolist && data.teacherinfolist.length == 0){
					// 	self.$message({
					// 		type: 'warning',
					// 		message: '没有搜索到相关内容，请重新搜索!'
					// 	});
					// }
					self.TeachersList = data.teacherinfolist
					self.totalcount = data.totalcount
				}).fail(function(error){
					console.log(error)
				})
			},
			// 每页显示数据量变更
			handleSizeChange(val){
				this.pagesize = val
				this.queryteachingteacher(this.currentpage,this.pagesize)
			},
			// 页码变更
			handleCurrentChange(val){
				this.currentpage = val
				this.queryteachingteacher(this.currentpage,this.pagesize)
			},
			// 搜索带教记录
			search(){
				let self = this
				self.basenameid = ''
				self.deptid = ''
				this.queryteachingteacher(this.currentpage,this.pagesize)
			},

			// 点击带教记录查看
			showTeachRecords(index,row){
				// console.log(row)
				this.dialogTeacherDetail = true;
				this.teacherid = row.teacherid
				this.deptId = row.deptid
				this.queryteachingstudent()
			},
			// 选择年级查询
			selectGrade(){
				// alert(this.periodname)
				// let self = this
				this.inputStu = ''
				this.usernameStu = ''
				this.mobileStu = ''
				this.queryteachingstudent()
			},
			// 点击搜索学生
			seachStu(){
				// let self = this
				// alert(self.periodname)
				this.periodname = ''
				this.queryteachingstudent()
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
			// 查询带教学生信息
			queryteachingstudent(){
				let self = this
				post('/teachingrecord/queryteachingstudent',{
					command:'teachingrecord/queryteachingstudent',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					teacherid:self.teacherid,
					period:self.periodname,
					deptid:self.deptId,
					username:self.usernameStu,
					mobile:self.mobileStu,
					pagenum:self.currentpageStu,
					pagepersize:self.pagesizeStu
				}).done(function(data){
					// console.log(data)
					self.TeacherStudents = data.studentinfolist
					self.totalcountStu = data.totalcount
				}).fail(function(error){
					console.log(error)
				})
			},
				// 点击查看详情列表
			showEvaluations(row){
				let self = this
				console.log(row)
				this.dialogEvaluation = true;
				post('/teachingrecord/queryteachingevaluate',{
					command:'teachingrecord/queryteachingevaluate',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					teacherid:self.teacherid,
					stuid:row.uid,
					deptid:self.deptId
				}).done(function(data){
					// console.log(data)
					self.evaluationList = data.evaluateinfolist
				}).fail(function(error){
					console.log(error)
				})
			},
		}
	}
</script>
<style scoped>

	.topTools{
		height: 50px;
	}
	.queryTools{
		float:left;
		width: 625px;
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
	.dialogContainer{
		width:100%;
		height: 100%;
		border-top:1px solid #d3dce6;
		display: flex;
	}
	.dialogLeft{
		width:20%;
		height: 40px;
		border-right: 1px solid #d3dce6;
		box-sizing: border-box;
		text-align: center;
		font-weight: bolder;
		/*font-size: 20px;*/
		line-height: 40px;
	}
	.dialogRight{
		width:80%;

	}
</style>