<template>
<div class = "wapper">
	<div class = "page-title">
		轮转管理
	</div>
	<div class = "circleStatus">
		<!-- <div class = "statusInnerWapper">
			<el-tabs type="border-card">
			  <el-tab-pane label="轮转中"></el-tab-pane>
			  <el-tab-pane label="待轮转"></el-tab-pane>
			  <el-tab-pane label="已结束"></el-tab-pane>
			</el-tabs>
		</div> -->
		
		<el-radio-group @change = "doFilter" v-model="filterStatus">
		    <el-radio-button label="run">轮转中</el-radio-button>
		    <el-radio-button label="wait">待轮转</el-radio-button>
		    <el-radio-button label="end">已结束</el-radio-button>
		</el-radio-group>
	</div>
	<div class = "exportBtn">
		<el-button type = "primary" @click = "exportData">导出</el-button>
	</div>
	<div class = "searchTools">
		<div class="search-input" style = "float:left">
			<el-input style = "width:200px" v-model="input" placeholder="请输入姓名或手机号搜索"></el-input>
		</div>
		<div class = "search-btn" style = "float:left;margin-left:10px">
			<el-button type = "primary" @click ="queryByInput">搜索</el-button>
		</div>
	</div>
	<div class = "queryTools">
		<div class = "queryAll">
			<el-button type = "text" @click = "queryAll">全部</el-button>
		</div>
		<el-form style = "float:left" :model = "queryForm" :inline = "true" ref = "queryForm" label-width ="100px">
			<div class ="mainQuery">
				<!--  -->
			    <el-form-item label="轮转科室" prop = "" v-if ="filterStatus=='run'">
			    	<el-select v-model="queryForm.turn_dept_id" placeholder="请选择">
					    <el-option
					      v-for="item in turnDeptRoom"
					      :key="item &&item.id"
					      :label="item &&item.name"
					      :value="item &&item.id">
					    </el-option>
					</el-select>
			    </el-form-item>
			    <el-form-item label="待轮转科室"  prop = "" v-if ="filterStatus=='wait'">
			    	<el-select v-model="queryForm.turn_dept_id" placeholder="请选择">
					    <el-option
					      v-for="item in turnDeptRoom"
					      :key="item &&item.id"
					      :label="item &&item.name"
					      :value="item &&item.id">
					    </el-option>
					</el-select>
			    </el-form-item>
			    <el-form-item label="年级" prop = "" >
			    	<el-select v-model="queryForm.period" placeholder="请选择">
					    <el-option
					      v-for="item in gradeList"
					      :key="item.id"
					      :label="item.period"
					      :value="item.period">
					    </el-option>
					</el-select>
			    </el-form-item>
			    <el-form-item label="带教老师" prop = "" v-if ="filterStatus=='run'">
			    	<!-- <el-select v-model="value" placeholder="请选择">
			    						    <el-option
			    						      v-for="item in options"
			    						      :key="item.value"
			    						      :label="item.label"
			    						      :value="item.value">
			    						    </el-option>
			    						</el-select> -->
			    	<el-input v-model = "queryForm.tech_name"></el-input>
			    </el-form-item>
			    <el-form-item label="计划开始时间" prop = "" v-if ="filterStatus=='wait'">
					<el-date-picker
			    		  style = "width:120px"
					      v-model="queryForm.plan_begin_time"
					      type="month"
					      placeholder="选择日期"
					      >
					    </el-date-picker>
			    </el-form-item>
			</div>
			<div class = "additionQuery" v-show = "showAdditionQuery">
				<el-form-item label="专业基地" prop = "" >
					<el-select v-model="queryForm.base_id" placeholder="请选择" @change="initDeptInBaseList">
					    <el-option
					      v-for="item in deptBaseList"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="科室" prop = "" >
			    	<el-select v-model="queryForm.stud_dept_id" placeholder="请选择">
					    <el-option
					      v-for="item in deptInBaseList"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					</el-select>
			    </el-form-item>
			    <el-form-item label="性别" prop = "" >
			    	<el-select v-model="queryForm.sex" placeholder="请选择">
					    <el-option
				      	  v-for="item in [{id:0,name:'男'},{id:1,name:'女'}]"
					      :key="item.id"
					      :label="item.name"
					      :value="item.name">
					    </el-option>
					</el-select>
			    </el-form-item>
			    <el-form-item label="学位" prop = "" >
			    	<el-select v-model="queryForm.degree_id" placeholder="请选择">
					    <el-option
					      v-for="item in studentDegreeList"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					</el-select>
			    </el-form-item>
			    <el-form-item label="人员类型" prop = "" >
			    	<el-select v-model="queryForm.type_id" placeholder="请选择">
					    <el-option
					      v-for="item in stuTypeList"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					</el-select>
			    </el-form-item>
			    <el-form-item label="完成进度" style = "width:191px;margin-right:0px" prop = "" >
			    	<el-select v-model="queryForm.progress_from" style = "width:90px" placeholder="请选择">
					    <el-option
					      v-for="item in [0,10,20,30,40,50,60,70,80,90,100]"
					      :key="item"
					      :label="item"
					      :value="item">
					    </el-option>
					</el-select>
			    </el-form-item>
			    <el-form-item label="—" label-width="30px" style = "width:120px"  prop = "" >
			    	<el-select v-model="queryForm.progress_to" style = "width:90px" placeholder="请选择">
					    <el-option
					      v-for="item in [0,10,20,30,40,50,60,70,80,90,100]"
					      :key="item"
					      :label="item"
					      :value="item">
					    </el-option>
					</el-select>
			    </el-form-item>
			</div>
		</el-form>
	</div>
	<div class = "showMore">
		<el-button type = "text" @click = "upDownSelect">{{showAdditionQuery===true?'收起':'展开'}}</el-button>
	</div>
	<div class = "funcBtns">
		<el-button type = "primary" @click ="queryBySelect">查询</el-button>
	</div>
	
	<div class = "dataTable">
		<el-table
		    ref="detailTable"
		    :data="circleManageDatas"
		    border
		    tooltip-effect="dark"
		    style="width: 100%"
		    :row-style="{height:'40px'}"
		    @selection-change="handleSelectionChange">
		    <el-table-column type ="selection" width = "65"  ></el-table-column>
		    <el-table-column type ="index" width = "65" label = "序号" ></el-table-column>
		    <el-table-column prop = "stud_name" width = "100" label ="姓名"></el-table-column>
		    <el-table-column prop = "mobile" width = "130" label ="手机号"></el-table-column>
		    <el-table-column prop = "sex" width = "100" label ="性别"></el-table-column>
		    <el-table-column prop = "base" width = "180" label ="培训基地"></el-table-column>
		    <el-table-column prop = "stud_dept" width = "180" label ="科室"></el-table-column>
		    <el-table-column prop = "type" width = "120" label ="人员类型"></el-table-column>
		    <el-table-column prop = "degree" width = "100" label ="学位"></el-table-column>
		    
		    <el-table-column v-if = "filterStatus =='run'" prop = "turn_dept" width = "150" label ="轮转科室"></el-table-column>
		    <el-table-column v-if = "filterStatus =='wait'" prop = "turn_dept" width = "150" label ="待轮转科室"></el-table-column>
		    <el-table-column v-if = "filterStatus =='run'" prop = "tech_name" width = "150" label ="带教老师"></el-table-column>
		    <el-table-column v-if = "filterStatus =='run'" prop = "begin_time" width = "150" label ="实际开始时间"></el-table-column>
		    <el-table-column v-if = "filterStatus =='wait'" prop = "begin_time" width = "150" label ="计划开始时间"></el-table-column>
		    <el-table-column v-if = "filterStatus =='end'" prop = "begin_time" width = "150" label ="轮转开始时间"></el-table-column>
		    <el-table-column v-if = "filterStatus =='wait'||filterStatus =='run'" prop = "end_time" width = "150" label ="计划结束时间"></el-table-column>
		    <el-table-column v-if = "filterStatus =='end'" prop = "end_time" width = "150" label ="轮转结束时间"></el-table-column>
		    <el-table-column prop = "progress" width = "120" label ="完成进度(%)"></el-table-column>
		    <el-table-column prop = "period" width = "100" label ="年级"></el-table-column>
		    <el-table-column fixed = "right" width = "240" label ="操作">
		    	<template scope = "scope">
		    		<el-button v-if= "isSecretary &&filterStatus=='run'" @click="assignTeacher(scope.$index, scope.row)" type="text" size="small">分配带教老师</el-button>
		    		<el-button v-if= "isSecretary &&filterStatus=='run'" @click="outConfirm(scope.$index, scope.row)" type="text" size="small">出科确认</el-button>
		    		<el-button v-if= "isSecretary&&filterStatus=='wait'" @click="inConfirm(scope.$index, scope.row)" type="text" size="small">入科确认</el-button>
		    		<el-button @click="showDetail(scope.$index, scope.row)" type="text" size="small">轮转详情</el-button>
		    	</template>
		    </el-table-column>
		</el-table>
		<el-pagination
		  style = "float:right;margin:10px 10px"
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="page"
	      :page-sizes="[10, 20, 50, 100]"
	      :page-size="reqnum"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="totalCount">
	    </el-pagination>
	</div>
	<!--fen pei daijiao laoshi dialog-->
	<el-dialog title = "选择带教老师"  :visible.sync="dialogChooseTeacher">
		<div class ="treeTitle">
			当前科室
		</div>
		<div class ="topSearch">
			<div style  = "float:right;margin-right:10px">
				<div class="search-input" style = "float:left;">
				<el-input style = "width:200px" v-model="tInput" placeholder="请输入姓名搜索"></el-input>
				</div>
				<div class = "search-btn" style = "float:left;margin-left:10px">
				<el-button type = "primary" @click = "queryTeacherByInput">搜索</el-button>
				</div>
			</div>
		</div>
		<div class ="leftTree">
			<div class ="emp-tree">
				{{currentDept}}
			</div>
		</div>
		<div class ="rightTable">
			<el-table
		    ref="assignTable"
		    :data="tableData"
		    border
		    tooltip-effect="dark"
		    style="width: 100%"
		    >
		    <el-table-column
		      type="index"
		      label = "序号"
		      width ="65"
		      >
		    </el-table-column>
		    <el-table-column
			  prop = "tech_name"
		      label = "姓名"
		      width = "94"
		      >
		    </el-table-column>
		    <el-table-column
			  prop = "mobile"
		      label = "手机"
		      width = "125"
		      >
		    </el-table-column>
		    <el-table-column
			  prop = "title"
		      label = "职称"
		      >
		    </el-table-column>
		    <el-table-column
			  prop = "stud_num"
		      label = "带学生数量/人"
		      width = "88"
		      >
		    </el-table-column>
		    <el-table-column
		      label = "操作"
		      width = "70"
		      >
		      <template scope = "scope">
		      	 <el-checkbox v-model="scope.row.checked" @change = 'cancelOther(scope.$index,scope.row)'></el-checkbox>
		      </template>
		    </el-table-column>
		    </el-table>
		    <el-pagination
		      v-if ="teacherTotalCount>10"
			  style = "float:right;margin:10px 10px"
		      @size-change="handleTSizeChange"
		      @current-change="handleTCurrentChange"
		      :current-page="teacherPage"
		      :page-sizes="[10, 20, 50, 100]"
		      :page-size="teacherPageSize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="teacherTotalCount">
		    </el-pagination>
		</div>
		<div class ="bottombtn">
			<el-button type = "primary" @click = "assignTeacherSubmit" class = "bottomBtnsSure">确认</el-button>
	    	<el-button  @click = "dialogChooseTeacher=false" class = "bottomBtns">取消</el-button>
		</div>
	</el-dialog>
	<!-- lunzhuan xiangqing  dialog -->
	<el-dialog :title = "currentStudent" size = "large" :visible.sync="dialogCircleDetail">
		<!-- <div>
			{{}}
		</div> -->
		<div class ="tableWapper">
		<el-table
		    ref="detailTable"
		    :data="circleDetailData"
		    border
		    tooltip-effect="dark"
		    style="width: 100%"
			>
		    <el-table-column prop = "turn_dept" label ="轮转科室" width = "210"></el-table-column>
		    
		    <el-table-column prop = "planTurnTime" label ="计划轮转时间" width = "220"></el-table-column>
		    <el-table-column prop = "realTurnTime" label ="实际轮转时间" width = "220"></el-table-column>
		    <el-table-column prop = "tech_name" label ="带教老师" width = "210"></el-table-column>
		    <el-table-column prop = "turn_status" label ="状态" width = "210"></el-table-column>
		    <el-table-column  label ="考核详情" >
		    	<template scope = "scope">
		    		<el-button v-if='scope.row.turn_status != "待轮转"' @click="showTestDetail(scope.$index,scope.row)" type="text" size="small">考核详情</el-button>
		    	</template>
		    </el-table-column>
		</el-table>
		</div>
	</el-dialog>
	<!-- 考核月份查询 -->
	
	<el-dialog title='考核详情' :visible.sync="dialogExamMonths">
		<el-table :data='evaluatedmonths'
			border>
			<el-table-column
				prop='month'
				label='考核日期'
				style='widht:60%'>
			</el-table-column>
			<el-table-column
				label='操作'
				style='widht:40%;'>
				<template scope='scope'>
					<el-button
						type='text'
						size='small'
						@click.native.prevent='showExamDetail(scope.$index,scope.row)'>
						查看详情
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-dialog>
	<!-- kao he xiangqing  dialog-->
	<el-dialog title = "武汉大学中南医院住院医师日常考核表" :visible.sync="dialogTestDetail" size='large'>
			<table class="evaluationTable">
				<tr>
					<th></th>
					<th>项目</th>
					<th>A</th>
					<th>B</th>
					<th>C</th>
					<th>D</th>
					<th>E</th>
					<th>考核结果</th>
				</tr>
				<tr v-for='(item,index) in evaluationList'>
					<td>{{item.category}}</td>
					<td>（{{index+1}}）、{{item.title}}</td>
					<td v-for='v in item.evaluationitems'>{{v.content}}</td>
					<td v-for='(score,key) in evaluateditems.detaillist' v-if='key == index'>{{score.name?score.name:''}}</td>
				</tr>
			</table>
			<h4>住院医师优点：</h4>
			<p>{{evaluateditems.advantage}}</p>
			<h4>对进一步成长的建议：</h4>
			<p>{{evaluateditems.advise}}</p>
			<h4>关于此次评估我已经给予该住院医师反馈：<span v-if='evaluateditems.feedback == 0'>是</span><span v-if='evaluateditems.feedback == 1'>否</span></h4>
</el-dialog>
</div>
</template>
<script>
import moment from 'moment'
import {post,getCookie,exportExcel} from '../config/util'
import{mapState,mapActions} from 'vuex'
var _ = require('lodash');
	export default{
		data(){
			return{
				filterStatus:'run',
				input:'',
				queryMode:0,//0:filter,1:select,2:input
				exportInput:false,
				tInput:'',
				dialogChooseTeacher:false,
				showAdditionQuery:false,
				dialogCircleDetail:false,
				dialogTestDetail:false,
				dialogExamMonths:false,
				queryForm:{turn_dept_id:'',stud_dept_id:'',period:'',tech_name:'',plan_begin_time:'',base_id:'',sex:'',degree_id:'',type_id:'',progress_from:'',progress_to:''},
				deptInBaseList:[],
				circleManageDatas:[],
				circleDetailData:[],
				currentDept:'',
				currentdeptId:'',
		        defaultProps: {
		          children: 'children',
		          label: 'name'
		        },
		        tableData:[],
		        page:1,
		        reqnum:20,
		        totalCount:0,
		        teacherPage:1,
		        teacherPageSize:10,
		        teacherTotalCount:0,
		        currentAssignedTeacher:'',
		        currentDetaId:'',
		        currentStudent:'',
		        turnDeptRoom:[],
		        evaluationList:[],
		        teacherid:'',
		        studentid:'',
		        evaluatedmonths:[],
		        evaluateditems:{},
		        selectItems:[],
			}
		},
		computed:{
			...mapState(['gradeList','deptList','professionList','educationList','studentDegreeList','stuTypeList','deptBaseList','userRole','deptIdList']),
			isSecretary(){
				return _.indexOf(this.userRole,6)>-1;
				
			}
		},
		methods:{
			...mapActions(['initGradeList','initUserRole','initDeptIdList']),
			handleSelectionChange(r){
				console.log(r);
				this.selectItems = r.map((item)=>{
					return item.deta_id;
				});
			},
			doFilter(){
				console.log( typeof arguments[0])
				this.queryMode=0;
				this.input= '';
				this.queryForm = {turn_dept_id:'',stud_dept_id:'',period:'',tech_name:'',plan_begin_time:'',base_id:'',sex:'',degree_id:'',type_id:'',progress_from:'',progress_to:''};
				//console.log(this.deptIdList)
				let option = {query_type:this.filterStatus,turn_dept_id:this.deptIdList};
				(typeof arguments[0]==='number') &&(option.page = arguments[0]);
				this.queryCircleList(option);
			},
			queryCircleList(option){
				let self = this;
				post('/turn/queryTurnRecordList',{
					command:'turn/queryTurnRecordList',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					reqnum:this.reqnum,

					...option
				}).done((data)=>{
					if(data&&data.errcode ==0){
						self.circleManageDatas = data.turn_plan_record;
						self.totalCount = data.count;
					}
				})
			},
			queryAll(){
				this.queryMode=1;
				this.queryForm = {turn_dept_id:'',stud_dept_id:'',period:'',tech_name:'',plan_begin_time:'',base_id:'',sex:'',degree_id:'',type_id:'',progress_from:'',progress_to:''};
				this.input='';
				this.exportInput= false;
				this.queryCircleList({query_type:this.filterStatus,turn_dept_id:this.deptIdList});
			},
			upDownSelect(){
				this.showAdditionQuery=!this.showAdditionQuery;
				this.queryForm.base_id='';
				this.queryForm.stud_dept_id='';
				this.queryForm.sex = '';
				this.queryForm.degree_id = '';
				this.queryForm.type_id='';
				this.queryForm.progress_from = '';
				this.queryForm.progress_to = '';
			},
			queryBySelect(page){

				this.queryMode=1;
				this.queryForm.plan_begin_time && (this.queryForm.plan_begin_time = moment(this.queryForm.plan_begin_time).format('YYYY-MM-DD'));
				page &&(this.queryForm.page = page);
				(this.queryForm.turn_dept_id=='')&&(this.queryForm.turn_dept_id=this.deptIdList);
				this.queryCircleList({...this.queryForm,query_type:this.filterStatus});
				this.input = '';
			},
			queryByInput(){
				this.queryMode=2;
				this.queryForm = {turn_dept_id:'',stud_dept_id:'',period:'',tech_name:'',plan_begin_time:'',base_id:'',sex:'',degree_id:'',type_id:'',progress_from:'',progress_to:''};
				let option = {query_type:this.filterStatus, search_info:this.input,turn_dept_id:this.deptIdList};
				(typeof arguments[0]==='number') && (option.page=arguments[0])
				this.queryCircleList(option);
				this.exportInput=true;
			},
			exportData(){
				if(this.selectItems.length===0){
					this.$message({
			          showClose: true,
			          message: '请先勾选导出项！',
			          type: 'warning'
			        });
					return;
				}
				let data ={
						sessionid: getCookie('sid'),
						loginid: getCookie('uid'),
						
						turn_dept_id:this.deptIdList,
						query_type:this.filterStatus,
						export_data:this.selectItems,
						command: "turn/queryTurnRecordList",
					};
		    	exportExcel(data);
			},
			assignTeacher(index,row){
				let self = this;
				this.currentDept = row.turn_dept;
				this.currentdeptId = row.dept_id;
				this.currentDetaId = row.deta_id;
				this.queryTeacherList({dept_id:row.dept_id});
				this.dialogChooseTeacher= true;
			},
			queryTeacherByInput(){
				this.queryTeacherList({search_info:this.tInput,dept_id:this.currentdeptId});
			},
			queryTeacherList(option){
				let self = this;
				post('/turn/queryTeacherList',{
					command:'turn/queryTeacherList',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					reqnum:this.teacherPageSize,
					...option,
				}).done((data)=>{
					if(data&&data.errcode==0){
						self.tableData = data.dept_teach_list;
						self.tableData.forEach((item)=>{
							self.$set(item,'checked',false);
						})

						self.teacherTotalCount = data.count;
					}
				})
			},
			assignTeacherSubmit(){
				if(this.currentAssignedTeacher==''){
					this.$message({
			            type: 'info',
			            message: '请选择一名带教老师!'
			        });
			        return;
				}
				let self = this;
				post('/turn/assignedTeacher',{
					command:'turn/assignedTeacher',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					deta_id:this.currentDetaId,
					tech_id:this.currentAssignedTeacher
				}).done((data)=>{
					if(data&&data.errcode==0){
						self.$message({
				            type: 'success',
				            message: '分配成功!'
				        });
				        self.dialogChooseTeacher= false;
				        self.doFilter();
					}else{
						self.$message.error('分配失败');
					}
				}).fail(()=>{
					self.$message.error('分配失败');
				})
			},
			outConfirm(index,row){
				let self = this;
				this.$confirm('是否确认该学生将出科?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
					post('/turn/turnStatusChange',{
		        		command:'turn/turnStatusChange',
						sessionid:getCookie('sid'),
						loginid:getCookie('uid'),
						deta_id:row.deta_id,
						turn_num:row.turn_num,
						req_opera:'leave'
		        	}).done((data)=>{
		        		if(data&&data.errcode==0){
		        			self.$message({
					            type: 'success',
					            message: '出科成功!'
					        });
					        self.doFilter();
		        		}else if(data&&data.errcode=='4005'){
		        			self.$message.error('该住院医未分配带教老师，不能出科！');
		        		}else{
		        			self.$message.error('出科失败');
		        		}
		        	}).fail(()=>{
		        		self.$message.error('出科失败');
		        	});
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消出科'
		          });          
		        });
			},
			inConfirm(index,row){
				let self = this;
				this.$confirm('是否确认该学生将入科?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	post('/turn/turnStatusChange',{
		        		command:'turn/turnStatusChange',
						sessionid:getCookie('sid'),
						loginid:getCookie('uid'),
						deta_id:row.deta_id,
						turn_num:row.turn_num,
						req_opera:'enter'
		        	}).done((data)=>{
		        		if(data&&data.errcode==0){
		        			self.$message({
					            type: 'success',
					            message: '入科成功!'
					        });
					        self.doFilter();
		        		}else if(data&&data.errdesc){
		        			self.$message.error(data.errdesc);
		        		}
		        		else{
		        			self.$message.error('入科失败');
		        		}
		        	}).fail(()=>{
		        		self.$message.error('入科失败');
		        	});
		          
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消入科'
		          });          
		        });
			},
			showDetail( index,row){
				// console.log(row)
				let self = this;
				self.studentid = ''
				self.studentid = row.stud_id
				post('/turn/queryStudTurnRecord',{
					command:'turn/queryStudTurnRecord',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					plan_id:row.plan_id,
					stud_id:row.stud_id,
				}).done((data)=>{
					if(data&&data.errcode==0){
						self.circleDetailData = data.stud_turn_record.map((item)=>{
							return{ turn_dept:item.turn_dept,planTurnTime:item.plan_begin_time+'——'+item.plan_end_time,realTurnTime:item.real_begin_time+'——'+item.real_end_time,tech_name:item.tech_name,turn_status:item.turn_status,tech_id:item.tech_id}
						});
						self.currentStudent = data.stud_name;
					}
				})
				this.dialogCircleDetail = true;

			},
			showTestDetail(index,row){
				let self = this
				console.log(row)
				// alert(row.tech_id)
					post('/turn/queryevaluatedmonths',{
						command:'turn/queryevaluatedmonths',
						sessionid:getCookie('sid'),
						loginid:getCookie('uid'),
						uid:row.tech_id,
						evaluatedid:self.studentid,
						type:4
					}).done(function(data){
						// console.log(data)
						if(data && data.evaluatedlist.length != 0){
							self.evaluatedmonths = data.evaluatedlist
						}
					})
					this.dialogExamMonths = true
			},
			showExamDetail(index,row){
				let self = this
				// console.log(row)
				post('/turn/queryevaluationitems',{
					command:'/turn/queryevaluationitems',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					evaluatedid:self.studentid,
					type:4
				}).done(function(data){
					// console.log(data)
					if(data && data.evaluationList.length != 0){
						self.evaluationList = data.evaluationList
					}
					post('/turn/queryevaluateditems',{
						command:'turn/queryevaluateditems',
						sessionid:getCookie('sid'),
						loginid:getCookie('uid'),
						id:row.id
					}).done(function(data){
						// console.log(data)
						self.evaluateditems = data
					})
					

				})
				this.dialogTestDetail = true;
			},
			cancelOther(index,row){


				this.tableData.forEach((item,idx)=>{
					if(idx!=index){

						item.checked&&(item.checked = false);
					}
				});
				this.currentAssignedTeacher =(row.checked ? row.tech_id:'');
			},
			handleSizeChange(size){
				this.reqnum= size;
				if(this.input){
					this.queryByInput();
				}else{
					this.queryBySelect();
				}
			},
			handleTSizeChange(size){
				this.teacherPageSize = size;
				this.queryTeacherList();
			},
			handleCurrentChange(page){
				this.page = page;
				if(this.queryMode===2){
					this.queryByInput(page);
				}else if(this.queryMode===1){
					this.queryBySelect(page);
				}else{
					console.log(page)
					this.doFilter(page);
				}
			},
			handleTCurrentChange(page){
				this.teacherPage = page;
				this.queryTeacherList({page:page});
			},
			initDeptInBaseList(){
				let self = this;
				post('/turn/queryDeptList',{
					command: 'turn/queryDeptList',
		            sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					base_id:this.queryForm.base_id
				}).done((data)=>{
					if(data&&data.errcode==0){
						self.deptInBaseList = data.dept_list;
					}
				})
			},
			initTurnDept(){
				let deptList = [];
				post('/dept/finddeptbytecid',{
					command: 'dept/finddeptbytecid',
		            sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					tecid:getCookie('uid')
				}).done((data)=>{
					if(data&&data.errcode==0){
						deptList = data.dept.map((item)=>{
							return item.id;
						});
						deptList.forEach((item)=>{
							post('/turn/queryTurnDeptList',{
								command: 'turn/queryTurnDeptList',
					            sessionid:getCookie('sid'),
								loginid:getCookie('uid'),
								dept_id:item,
								type:1
							}).done((data)=>{
								if(data&&data.errcode==0){
									this.turnDeptRoom =_.union(this.turnDeptRoom,data.dept_list);
								}
							})
						})
					}
				})
			}
		},
		
		mounted(){
			this.initGradeList();
			this.initDeptIdList().then(()=>{
				this.doFilter();
			});
			/*if(this.deptIdList.length===0){
				let _deptIdList = [];
				let self = this;
				post('/dept/finddeptbytecid',{
					command: 'dept/finddeptbytecid',
		            sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					tecid:getCookie('uid')
				}).done((data)=>{
					if(data&&data.errcode==0){
						_deptIdList = data.dept.map((item)=>{
							return item.id;
						});
						self.doFilter({turn_dept_id:_deptIdList});
					}
				})
			}
*/
			this.initUserRole();
			this.initTurnDept();
		}
	}
</script>
<style scoped>
	.circleStatus{
		display: inline-block;
		width: 224px;
    	height: 37px;
    	overflow: hidden;
	}
	.statusInnerWapper{
		width: 250px;
    	height: 45px;
    	overflow: hidden;
	}
	.exportBtn{
		display: inline-block;
		position: relative;
		top:-17px;
		margin-left: 87px;
    	margin-right: 500px;
	}
	.queryTools{
		float:left;
		width: 850px;
	}
	.queryAll{
		float: left;
		margin-right: 12px;
	}
	.additionQuery{
		width: 800px;
	}
	.showMore{
		float:left;
		width: 50px;
	}
	.funcBtns{
		width: 80px;
		float: left;
	}
	.searchTools{
		float:right;
	}
	.queryTools .el-form-item {
		width: 220px;
		margin-bottom: 10px;
	}
	.el-select{
		width:120px;
	}
	.queryTools .el-input{
		width:120px;
	}
	.dataTable{
		margin-top: 20px;
	}
	.tableWapper{
		width: 96%;
	}
	.treeTitle{
		width: 20%;
		height: 56px;
		box-sizing: border-box;
		line-height: 56px;
		float: left;
		text-align: center;
		border:1px solid #dfe6ec;
	}
	.topSearch{
		padding:10px 0px;
		width: 80%;
		float: left;
		height: 56px;
		border:1px solid #dfe6ec;
		box-sizing: border-box;
	}
	.leftTree{
		width: 20%;
		float: left;
	}
	.emp-tree{
		height: 40px;
		line-height: 40px;
		text-align: center;
		border:1px solid #dfe6ec;
	}
	.rightTable{
		width: 80%;
		float: left;
		/* min-height: 514px;
		border:1px solid  #dfe6ec;
		box-sizing: border-box; */
	}
	.bottombtn{
		clear: both;
		width: 100%;
		float: left;
	}
	.evaluationTable{
		border: solid 1px black;
	}
	.evaluationTable th{
		height: 50px;
	}
	.evaluationTable td,th{
		border: solid 1px black;
		padding:5px;
		box-sizing: border-box;
		text-align: center;
	}
	.evaluationTable tr th:nth-of-type(1),td:nth-of-type(1){
		width:100px;
	}
	.evaluationTable tr th:nth-of-type(8),td:nth-of-type(8){
		width:100px;
	}
</style>