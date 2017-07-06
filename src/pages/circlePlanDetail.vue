<template>
	<div class = "wapper">
		<div class ="topTitle">
			<div class = "backBtn">
				<el-button type = "text" size = "large" @click = "backToCirclePlan">返回</el-button>
			</div>
			<div class = "titleMessage">{{detailTitle}}</div>
		</div>
		<div class="btnTools">
			<el-button type = "primary" @click = "openAddDialog">新增</el-button>
			<el-button type = "primary" @click = "editStu">编辑</el-button>
			<el-button type = "primary" @click = "delStus">删除</el-button>
			<el-button type = "primary" @click = "exportStus">导出</el-button>
		</div>
		<div class = "queryTools">
			<el-form :model = "queryForm" :inline = "true" ref = "queryForm" label-width ="70px">
						<el-form-item label="年级" prop = "plan_id" >
					    	 <el-select v-model="queryForm.plan_id" disabled placeholder="请选择">
					    	 	<el-option label="全部" :value="-1"></el-option>
							    <el-option
							      v-for="item in gradeList"
							      :key="item.id"
							      :label="item.period"
							      :value="item.id">
							    </el-option>
							 </el-select>
					    </el-form-item>
						<el-form-item  label="专业基地" prop = "base_id" >
					    	 <el-select v-model="queryForm.base_id" placeholder="请选择">
					    	 	<el-option label="全部" :value="-1"></el-option>
							    <el-option
							      v-for="item in deptBaseList"
							      :key="item.id"
							      :label="item.name"
							      :value="item.id">
							    </el-option>
							 </el-select>
					    </el-form-item>
					    <el-form-item label="科室" prop = "dept_id" >
					    	
					    	 <el-select v-model="queryForm.stud_dept_id" placeholder="请选择">
					    	 <el-option label="全部" :value="-1"></el-option>
							    <el-option
							      v-for="item in deptList"
							      :key="item&&item.id"
							      :label="item&&item.name"
							      :value="item&&item.id">
							    </el-option>
							 </el-select>
					    </el-form-item>
					    <!-- <el-form-item label="性别" prop = "" >
					    	 <el-select v-model="value" placeholder="请选择">
					    							    <el-option
					    							      v-for="item in [{label:'男',value:'男'},{label:'女',value:'女'}]"
					    							      :key="item.value"
					    							      :label="item.label"
					    							      :value="item.value">
					    							    </el-option>
					    							 </el-select>
					    </el-form-item> -->
					    <el-form-item label="学位" prop = "degre_id" >
					    	
					    	 <el-select v-model="queryForm.degre_id" placeholder="请选择">
					    	 	<el-option label="全部" :value="-1"></el-option>
							    <el-option
							      v-for="item in studentDegreeList"
							      :key="item.id"
							      :label="item.name"
							      :value="item.id">
							    </el-option>
							 </el-select>
					    </el-form-item>
					    <el-form-item label="人员类型" prop = "type_id" >
					    	 <el-select v-model="queryForm.type_id" placeholder="请选择">
								<el-option label="全部" :value="-1"></el-option>
							    <el-option
							      v-for="item in stuTypeList"
							      :key="item.id"
							      :label="item.name"
							      :value="item.id">
							    </el-option>
							 </el-select>
					    </el-form-item>
					   <!--  <el-form-item label="委托单位" prop = "" >
					   	 <el-select v-model="value" placeholder="请选择">
					   							    <el-option
					   							      v-for="item in options"
					   							      :key="item.value"
					   							      :label="item.label"
					   							      :value="item.value">
					   							    </el-option>
					   							 </el-select>
					   </el-form-item>
					   
					   <el-form-item label="学历" prop = "" >
					   	 <el-select v-model="value" placeholder="请选择">
					   							    <el-option
					   							      v-for="item in options"
					   							      :key="item.value"
					   							      :label="item.label"
					   							      :value="item.value">
					   							    </el-option>
					   							 </el-select>
					   </el-form-item> -->
					    
					    <el-form-item label="轮转科室" prop = "turn_dept_id" >
					    	 <el-select v-model="queryForm.turn_dept_id" placeholder="请选择">
					    	 	<el-option label="全部" :value="-1"></el-option>
							    <el-option
							      v-for="item in deptList"
							      :key="item&&item.id"
							      :label="item&&item.name"
							      :value="item&&item.id">
							    </el-option>
							 </el-select>
					    </el-form-item>
					    <el-form-item style = "width:400px" label = "轮转时间" prop = "dateRange">
					    	<el-date-picker v-model = "queryForm.dateRange" style = "width:330px" type = "daterange" placeholder= "选择时间段">
					    	</el-date-picker>
					    </el-form-item>
					    <!-- <el-form-item label = "轮转时间" prop = "">
					    				    		<el-date-picker
					    				    			style = "width:120px"
					    						      v-model="queryForm."
					    						      type="date"
					    						      placeholder="选择日期"
					    						      >
					    						    </el-date-picker>
					    				    	</el-form-item>
					    						<el-form-item label = "————" prop = "">
					    				    		<el-date-picker
					    				    			style = "width:120px"
					    						      v-model="value"
					    						      type="date"
					    						      placeholder="选择日期"
					    						      >
					    						    </el-date-picker>
					    				    	</el-form-item> -->
			</el-form>
		</div>
		<div class = "searchBtn">
			<el-button type ="primary" @click = "selectQuery">查询</el-button>
		</div>
		<div class = "searchTools">
			<el-input style = "width:200px" v-model = "input" placeholder = "请输入手机号或姓名搜索"></el-input>
			<el-button type ="primary" @click = "doInputQuery">搜索</el-button>
		</div>
		<div class = "detailTable">
			<div style = "width:100%;overflow-x: auto;">
			<div style = "width:5000px">
				<el-table
			    ref="detailTable"
			    :data="planDetailsDatas"
			    border
			    tooltip-effect="dark"
			    style="width:1230px;overflow:hidden;float:left"
			    @selection-change="handleSelectionChange">
			    <el-table-column type="selection" width = "55"></el-table-column>
			    <el-table-column type ="index" width = "65" label ="序号"></el-table-column>
			    <el-table-column prop = "name" width = "150" label ="姓名"></el-table-column>
			    <el-table-column prop = "mobile" width = "150" label ="手机号"></el-table-column>
			    <el-table-column prop = "period" width = "150" label ="年级"></el-table-column>
			    <el-table-column prop = "degree" width = "150" label ="学位"></el-table-column>
			    <el-table-column prop = "base"  width = "180" label ="专业基地"></el-table-column>
			    <el-table-column prop = "deptName"  width = "180" label ="科室"></el-table-column>
			    <el-table-column prop = "type"   label ="人员类型"></el-table-column>

			    
				</el-table>
				<div style = "float:left">
					<circle-detail :height="rowHeight" :startTime ="$route.query.begintime" :endTime = "$route.query.endtime" :circleData = "circleData"></circle-detail>
				</div>
			</div>
			</div>
			<el-pagination
			  style = "float:right;margin:10px 10px"
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="page"
		      :page-sizes="[10, 20, 50, 100]"
		      :page-size="reqnum"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="totalPages">
		    </el-pagination>
		</div>
		<el-dialog title="添加学员" :visible.sync="dialogAddNewStu" @close="closeAddStu">
	  		<el-form :model = "addStuForm" :inline = "true"  ref = "addStuForm" label-width ="80px" :rules = "rules">
	  			<el-form-item label="手机号" prop = "mobile" >
			    	<el-select
					    v-model="addStuForm.mobile"
					    filterable
					    :disabled = "mode ==1"
					    :clearable = "true"
					    remote
					    placeholder="请输入手机号搜索"
					    :remote-method="queryStuByMobile"
					    :loading="loading"
						@change ="setName"
					    >
					    <el-option
					      v-for="item in mobileOptions"
					      :key="item.mobile"
					      :label="item.mobile"
					      :value="item.mobile">
					    </el-option>
					  </el-select>
			    </el-form-item>
	  			<el-form-item label="姓名" prop = "name" >
			    	<el-input :disabled= "true" v-model = "addStuForm.name"></el-input>
			    </el-form-item>
			    <div v-for="(item,index) in addStuForm.detail" class = "circleRoomInfo">
			    	<el-form-item class="circleRoom" label="轮转科室"  :prop="'detail['+index+'].deptid'" :rules="{required:true,validator:checkDept,trigger:'change'}" >
				    	 <el-select :disabled = "item.status>0" v-model ="item.deptid" placeholder="请选择">
						    <el-option
						      v-for="i in deptList"
						      :key="i&&i.id"
						      :label="i&&i.name"
						      :value="i&&i.id">
						    </el-option>
						 </el-select>
				    </el-form-item>
				    <el-form-item class = "selectDate" label = "轮转时间" :prop="'detail['+index+'].dateRange'" :rules="{required:true,validator:checkDateRange,trigger:'change'}">
				    		<el-date-picker :disabled = "item.status>0" v-model = "item.dateRange" :picker-options="pickerOptions" style = "width:330px" type = "daterange" placeholder= "选择时间段">
					    	</el-date-picker>
				    </el-form-item>
				   <!--  <el-form-item  class = "selectDate" label = "开始时间" >
				   			    		<el-date-picker
				   			    			v-model = "item.begintime"
				   					      	type="date"
				   					     	placeholder="选择日期"
				   					      	>
				   					    </el-date-picker>
				   			    	</el-form-item>
				   			    	<el-form-item  class = "selectDate" label = "结束时间" >
				   			    		<el-date-picker
				   			    			v-model = "item.endtime"
				   					      	type="date"
				   					     	placeholder="选择日期"
				   					      	>
				   					    </el-date-picker>
				   			    	</el-form-item> -->
			    	<el-button v-if="item.status===0" type = "primary" @click = "delRoomInfo(index)">删除</el-button>
			    </div>
			    <div class = "addBtn">
			    	<el-button type = "primary" @click = "addRoomInfo">添加</el-button>
			    </div>
			    <div>
			    	<el-button type = "primary" @click = "handleSubmitAddStu" class = "bottomBtnsSure">确认</el-button>
		    		<el-button  @click = "dialogAddNewStu=false" class = "bottomBtns">取消</el-button>
			    </div>
	  		</el-form>
	  	</el-dialog>

	</div>
</template>
<script>
	import circleDetail from '../components/circleDetailLayout'
	import moment from 'moment'
	import {post,getCookie,exportExcel} from '../config/util'
	import {mapState,mapActions} from 'vuex'
	var _ = require('lodash');
	var $ = require('jquery');

	export default{
		data(){

			return{
				value:'',
				input:'',
				exportInput:false,
				loading:false,
				detailTitle:'',
				dialogAddNewStu:false,
				addStuForm:{mobile:'',name:'',detail:[{deptid:'',dateRange:[]}]},
				mode:0,
				selectItems:[],
				planDetailsDatas:[],
				page:1,
				reqnum:20,
				totalPages:0,
				/*circleData:[[{deptName:'心脑科',planBeginTime:'2015-06-01',planEndTime:'2015-08-15'},{deptName:'心脑科',planBeginTime:'2015-08-16',planEndTime:'2015-09-27'},{deptName:'心脑科',planBeginTime:'2015-09-28',planEndTime:'2015-10-15'},{deptName:'心脑科',planBeginTime:'2015-10-16',planEndTime:'2016-03-10'},{deptName:'心脑科',planBeginTime:'2016-03-11',planEndTime:'2016-08-15'},],[{deptName:'心脑科',planBeginTime:'2015-06-01',planEndTime:'2015-08-15'},{deptName:'心脑科',planBeginTime:'2015-08-16',planEndTime:'2015-09-27'},{deptName:'心脑科',planBeginTime:'2015-09-28',planEndTime:'2015-10-15'},{deptName:'心脑科',planBeginTime:'2015-10-16',planEndTime:'2016-03-10'},{deptName:'心脑科',planBeginTime:'2016-03-11',planEndTime:'2016-08-15'},]]*/
				rowHeight:0,
				rules:{
					name:[{required:true,message:'请输入姓名',trigger:'change'},],
					mobile:[{required:true,message:'请输入手机号',trigger:'change'}],
				},
				mobileOptions:[],
				rooms:[],
				queryForm:{
					plan_id:'',
					base_id:'',
					stud_dept_id:'',
					degre_id:'',
					type_id:'',
					turn_dept_id:'',
					dateRange:''
				},
				pickerOptions: {
		          disabledDate(time) {
		            return time.getTime() < Date.now() - 8.64e7;
		          }
		        },
			}
		},
		components:{
			circleDetail,
		},
		computed:{
			...mapState(['deptList','gradeList','deptBaseList','studentDegreeList','professionList','stuTypeList']),
			circleData(){
				return this.planDetailsDatas.map((item)=>item.detail);
			},
			
		},
		watch:{

		},
		methods:{
			
			...mapActions(['initGradeList','initDeptBaseList','initOptionList']),

			checkDept(rule, value, callback){
				if (value === '') {
		          callback(new Error('请选择轮转科室'));
		        } else {
		          callback();
		        }
			},
			checkDateRange(rule, value, callback){
				console.log(value)
				if (value.length===0) {
		          callback(new Error('请选择轮转时间'));
		        } else {
		          callback();
		        }
			},
			openAddDialog(){
				this.mode = 0;
				this.addStuForm = {mobile:'',name:'',detail:[{deptid:'',dateRange:[],status:0}]};
				this.dialogAddNewStu = true;
			},
			closeAddStu(){
				this.$refs.addStuForm.resetFields();
			},
			handleSubmitAddStu(){
				this.$refs.addStuForm.validate((valid) => {

				    if (valid) {
				    	let self = this;
						let option ={...this.addStuForm};
						option.detail = self.addStuForm.detail.map((item)=>{
							if(item.dateRange[0]){
								return {deptid:item.deptid,turnstatus:item.status,begintime:moment(item.dateRange[0]).format('YYYY-MM-DD'),endtime:moment(item.dateRange[1]).format('YYYY-MM-DD')}
							}else{
								return {deptid:item.deptid,turnstatus:item.status,begintime:'',endtime:''}
							}
							
						});
						if(option.interId){
							post('/turn/updateturnplandetail',{
								command:'turn/updateturnplandetail',
								sessionid:getCookie('sid'),
								loginid:getCookie('uid'),
								...option,
							}).done((data)=>{
								if(data&&data.errcode==0){
									self.$message({
							            type: 'success',
							            message: '编辑成功!'
							        });
									self.dialogAddNewStu = false;
									if(self.exportInput){
				        				self.doInputQuery(self.page);
				        			}else{
				        				self.selectQuery(self.page);
				        			}
								}else{
									const h = self.$createElement;
							        self.$msgbox({
							          title: '错误提示',
							          message: h('p', null, self.createElement(data.errorlist)),
							          type:'error',
							          confirmButtonText: '确定',
							      });
								}
							}).fail(()=>{
								self.$message({
						            type: 'error',
						            message: '编辑失败!'
						        });
							})
						}else{
							post('/turn/addturnplandetail',{
								command:'turn/addturnplandetail',
								sessionid:getCookie('sid'),
								loginid:getCookie('uid'),
								plandetaillist:[{...option,planId:self.$route.params.plan_id}]
							}).done((data)=>{
								if(data&&data.errcode==0){
									self.$message({
							            type: 'success',
							            message: '新增成功!'
							        });
									self.dialogAddNewStu = false;
									if(self.exportInput){
				        				self.doInputQuery(self.page);
				        			}else{
				        				self.selectQuery(self.page);
				        			}
								}else{
									const h = self.$createElement;
							        self.$msgbox({
							          title: '错误提示',
							          message: h('p', null, self.createElement(data.errorlist)),
							          type:'error',
							          confirmButtonText: '确定',
							      });
								}
							}).fail(()=>{
								self.$message({
						            type: 'error',
						            message: '新增失败!'
						        });
							})
						}
				    }
				});
			},
			createElement(errlist){
				const h = this.$createElement;
				let res = [];
				let err4008=[];
				let err4007 = [];
				for(let i=0;i<errlist.length;i++){
					if(errlist[i][4008]){
						err4008.push(errlist[i][4008]);
					}
					if(errlist[i][4007]){
						err4007.push(errlist[i][4007]);
					}
					
				}
				err4008.length>0&&res.push(h('p',null,err4008.join('、')+'轮转时间重叠'));
				err4007.length>0&&res.push(h('p',null,err4007.join('、')+'轮转时间超出轮转计划时间'));
				return res;
			},
			editStu(){
				if(this.selectItems.length!==1){
					this.$message({
			          showClose: true,
			          message: '请勾选一个编辑项！',
			          type: 'warning'
			        });
					return;
				}
				this.mode=1;
				let option ={name: this.selectItems[0].name,mobile:this.selectItems[0].mobile, interId:this.selectItems[0].interId,detail:this.selectItems[0].detail};
				option.detail = option.detail.map((item)=>{
					return {deptid:item.dept_id,dateRange:[moment(item.begin_time),moment(item.end_time)],status:item.turn_status};
				})
				this.addStuForm = option;
				this.dialogAddNewStu = true;

			},
			delStus(){
				let self = this;
				if(this.selectItems.length===0){

					this.$message({
			          showClose: true,
			          message: '请先勾选删除项！',
			          type: 'warning'
			        });
					return;
				}
				console.log(this.selectItems);
				this.$confirm('是否要删除选中学员?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	post('/turn/deleteturnplandetail',{
		        		command:'turn/deleteturnplandetail',
						sessionid:getCookie('sid'),
						loginid:getCookie('uid'),
						plandetailidlist:this.selectItems.map((item)=>{
							return item.interId;
						})
		        	}).done((data)=>{
		        		if(data&&data.errcode==0){
		        			self.$message({
					            type: 'success',
					            message: '删除成功!'
					          });
		        			if(self.exportInput){
		        				self.doInputQuery();
		        			}else{
		        				self.selectQuery();
		        			}
		        		}else{
		        			self.$message({
					            type: 'success',
					            message: '删除失败!'
					          });
		        		}
		        	})
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
			},
			exportStus(){
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
						
						export_data:this.selectItems.map((item)=>{
										return item.interId;
									}),
						command: "turn/queryTurnPlanDetailList",
					};
		    	exportExcel(data);
			},
			addRoomInfo(){
				this.addStuForm.detail.push({deptid:'',dateRange:[],status:0});
			},
			handleSelectionChange(r){
				//console.log(r)
				this.selectItems = r;
			},
			backToCirclePlan(){
				this.$router.push({name:'CirclePlan'})
			},
			initPlanDetailList(){
				this.queryPlanDetailList({plan_id:this.$route.params.plan_id})
			},
			doInputQuery(page){
				this.exportInput= true;
				this.queryForm={
					plan_id:'',
					base_id:'',
					stud_dept_id:'',
					degre_id:'',
					type_id:'',
					turn_dept_id:'',
					dateRange:''
				};
				let option = {search_info:this.input,plan_id:this.$route.params.plan_id};
				page &&(option.page = page);
				this.queryPlanDetailList(option);
			},
			selectQuery(page){
				this.exportInput=false;
				this.input ='';
				let option = {...this.queryForm,plan_id:this.$route.params.plan_id};
				page &&(option.page = page);
				if(option.dateRange!=''&&option.dateRange[0]!==null){
					option.begin_time = moment(option.dateRange[0]).format('YYYY-MM-DD');
					option.end_time = moment(option.dateRange[1]).format('YYYY-MM-DD');
				}
				
				delete option.dateRange;
				for(let key in option){
					if(option[key]===-1)delete option[key];
				}
				this.queryPlanDetailList(option);
			},
			queryPlanDetailList(option){
				var self = this;
				var opt = {
					command:'turn/queryTurnPlanDetailList',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					reqnum:this.reqnum,
					...option,
				}
				post('/turn/queryTurnPlanDetailList',opt).done(function(data){
					if(data&&data.errcode ==0){
						self.planDetailsDatas = data.turn_plan_detail;
						self.totalPages = data.count;
						self.$nextTick(function(){
							self.rowHeight = $('tr').height();
							console.log("next-------"+this.rowHeight);
						})
					}
				})
			},
			queryStuByMobile(query){
				let self = this;
				if (query !== '') {
		          this.loading = true;
		          setTimeout(() => {
		            this.loading = false;
		            post('/turn/queryturndoctorinfo',{
						command:'turn/queryturndoctorinfo',
						sessionid:getCookie('sid'),
						loginid:getCookie('uid'),
						mobile:query,
					}).done(function(data){
						if(data&&data.errcode ==0){
							self.mobileOptions = data.doctorinfolist;
						}
					})
		          }, 200);
		        } else {
		          
		        }
			},
			delRoomInfo(index){
				this.addStuForm.detail.splice(index,1);
			},
			setName(val){
				this.mobileOptions.forEach((item)=>{
					if(item.mobile===val){
						this.addStuForm.name=item.name;
					}
				})
			},
			
			handleSizeChange(size){
				this.reqnum = size;
				if(this.exportInput){
					this.doInputQuery();
				}else{
					this.selectQuery();
				}
			},
			handleCurrentChange(page){
				this.page = page;
				if(this.exportInput){
					this.doInputQuery(this.page);
				}else{
					this.selectQuery(this.page);
				}
			}
		},
		filters:{
			
		},
		mounted(){
			//console.log(circleDetail)
			
			this.detailTitle = this.$route.query.turnplanname;
			this.queryForm.plan_id = +this.$route.params.plan_id;
			this.initPlanDetailList();
			this.initGradeList();
			this.initDeptBaseList();
		}
	}
</script>
<style scoped>
.topTitle{
	width: 100%;
	height: 30px;
}
.backBtn{
	width: 100px;
	float: left;
}
.titleMessage{
float: left;
width: 1000px;
text-align: center;
font-size: 20px;
line-height: 30px;
}
.btnTools{
	padding:10px 0px;
	margin:10px 0px;
	border-top: 1px solid #d3dce6;
	border-bottom: 1px solid #d3dce6;
}
.queryTools{
	float:left;
	width: 855px;
}
.searchBtn{
	float:left;
	margin-left: 10px;
	margin-top: 26px;
}
.searchTools{
	float:right;

}
.queryTools .el-form-item {
	width: 200px;
	margin-bottom: 10px;
}
.el-select{
	width:120px;
}
.detailTable{
	width: 100%;

}
.el-dialog .el-select{
	width: 196px;
}
.circleRoomInfo{
	padding-top: 20px;
	border-top: 1px solid #d3dce6;

}
.circleRoom{
	margin-right: 300px;
}
.selectDate .el-date-editor{
	width: 196px;
}
.addBtn{
	padding-top: 20px;
	border-top: 1px solid #d3dce6;
}
.rowHeight{
	height:40px;
}
.el-table__body-wrapper{
	overflow-x: hidden;
}
</style>