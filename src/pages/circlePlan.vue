<template>
<div class = "wapper">
	<div class = "page-title">
		轮转计划
	</div>
	<div class="page-tools">
		<el-button type = "primary" @click = "openDialogAdd">新增计划</el-button>
		<el-button type = "primary" @click = "delPlans">批量删除</el-button>
		<el-button type = "primary" @click = "downloadModel">下载学员模板</el-button>
		
	</div>
	<div class = "year-select">
		<div class = "inline-first">进度</div>
		<div class = "inline-second">
		 <el-select v-model="selectYear" placeholder="请选择" @change = "changeQuery">
		    <el-option
		      v-for="item in progress"
		      :key="item.value"
		      :label="item.name"
		      :value="item.value">
		    </el-option>
		 </el-select>
		 </div>
	</div>
	<div class = "show-data">
		<el-table
			    ref="multipleTable"
			    :data="planDatas"
			    border
			    tooltip-effect="dark"
			    style="width: 100%"
			    @selection-change="handleSelectionChange">
			    <el-table-column type="selection" width = "55"></el-table-column>
			    <el-table-column type ="index" label ="序号" width = "65" ></el-table-column>
			    <el-table-column prop = "turnplanname" width = "170" label ="轮转计划名称"></el-table-column>
			    <el-table-column prop = "comment" width = "240" label ="轮转计划描述"></el-table-column>
			    <el-table-column prop = "begintime" width = "110" label ="开始时间"></el-table-column>
			    <el-table-column prop = "endtime" width = "110" label ="结束时间"></el-table-column>
			    <el-table-column prop = "period" width = "80" label ="年级"></el-table-column>
			    <el-table-column prop = "progress" width = "80" label ="进度"></el-table-column>
			    <el-table-column  label ="操作" >
			    	<template scope = "scope">
			    		<el-button @click="importStu(scope.$index, scope.row)" type="text" size="small">导入学员</el-button>
			    		<!-- <el-upload
			    								  class="upload-demo"
			    								  style="display:inline-block;margin-right:10px"
			    								  action="http://192.168.1.200:8086/import/importExcel"
			    								  ref ="upload"
			    								  :file-list="fileList"
			    								  :data = "uploadData"
			    								  :show-file-list = "false"
			    								  :auto-upload="true"
			    								  
			    								  :on-success="uploadSuccess"
			    								  :on-progress ="onProgress">
			    									<el-button type="text" size = "small" @click = 'console.log('aa')' >导入学员</el-button>
			    								</el-upload> -->
			    		<el-button @click="editPlan(scope.$index, scope.row)" type="text" size="small">编辑计划</el-button>
			    		<el-button @click="delPlan(scope.$index, scope.row)" type="text" size="small">删除计划</el-button>
			    		<el-button @click="showDetail(scope.$index, scope.row)" type="text" size="small">查看详情</el-button>
			    	</template>
			    </el-table-column>
		</el-table>
		<el-pagination
		  style = "float:right;margin:10px 10px"
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="pagenum"
	      :page-sizes="[10, 20, 50, 100]"
	      :page-size="pagepersize"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="totalCount">
	    </el-pagination>
	</div>
	<!-- xinzong tankuang -->
	<el-dialog :title="dialogTitle" :visible.sync="dialogAddPlan" :close-on-click-modal ="false" @close ="closeDialog('addPlanForm')">
		 <el-form :model = "addPlanForm" :rules="rules" ref = "addPlanForm" label-width ="80px">
		 	<el-form-item label="计划名称" prop = "turnplanname">
		    	<el-input style = "width:400px" v-model="addPlanForm.turnplanname"></el-input>
		    </el-form-item>
		    <el-form-item label="年级" prop = "period">
		    	<el-input style = "width:400px" v-model="addPlanForm.period"></el-input>
		    </el-form-item>
		    <el-row>
		    <el-col :span = "11">
		    <el-form-item label = "开始时间" prop = "begintime">
	    		<el-date-picker
	    			
			      v-model="addPlanForm.begintime"
			      type="date"
			      placeholder="选择日期"
				  :picker-options="pickerOptions"
			      >
			    </el-date-picker>
	    	</el-form-item>
	    	</el-col>
	    	<el-col :span = "2">&nbsp</el-col>
	    	<el-col :span ="11">
	    		<el-form-item label = "结束时间" prop = "endtime">
		    		<el-date-picker
		    			
				      v-model="addPlanForm.endtime"
				      type="date"
				      placeholder="选择日期"
					  :picker-options="pickerOptions"
				      >
				    </el-date-picker>
		    	</el-form-item>
	    	</el-col>
	    	</el-row>
	    	<el-form-item label="计划描述" prop = "comment" >
		    	<el-input style = "width:600px;" type = "textarea" :rows = "4" v-model="addPlanForm.comment"></el-input>
		    </el-form-item>
		    <el-row :gutter= "20" >
		    	<el-button type = "primary" @click = "handleSubmitAdd('addPlanForm')" class = "bottomBtnsSure">保存</el-button>
		    	<el-button  @click = "dialogAddPlan=false" class = "bottomBtns">取消</el-button>
		    </el-row>
		 </el-form>
	</el-dialog>
	<!-- wenjian shangcchan-->
	<el-dialog title="导入学员" :visible.sync="dialogImportStu" size = "tiny" :close-on-click-modal ="false">
		<el-upload
		  class="upload-demo"
		  style="display:inline-block;margin-right:10px"
		  action="/import/importExcel"
		  ref ="upload"
		  :file-list="fileList"
		  :data = "uploadData"
		  :show-file-list = "true"
		  :auto-upload="false"
		  :before-upload='checkFile'
		  :on-change="changeFile"
		  :on-success="uploadSuccess"
		  :on-progress ="onProgress">
			<el-button type="primary" size = "small" >选择文件</el-button>
		</el-upload>
		<el-button type = "primary" size = "small" @click = "submitImport">上传</el-button>
	</el-dialog>
</div>
</template>
<script>
import moment from 'moment'
import {post,getCookie,exportMouldExcel} from '../config/util'
var _ = require('lodash');
	export default{
		data(){
			var checkDate1 = (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请输入开始日期'));
		        } else {
		        	
		          if (this.addPlanForm.endtime!=='') {
		            this.$refs.addPlanForm.validateField('endtime');
		          }
		          callback();
		        }
		    };
			var checkDate2 = (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请输入结束日期'));
		        } else {
		          if (moment(this.addPlanForm.begintime).isAfter(this.addPlanForm.endtime)) {
		            callback(new Error('结束日期不能小于开始日期！'));
		          }
		          callback();
		        }
		    };
		    var currentPlanId = ()=>{
		    	console.log(this.currentPlanId)
		    	return this.currentPlanId;

		    };
			var validateBlank = (rule, value, callback) => {
				if (value === '' || value.trim() === '') {
					callback(new Error('请输入计划名称！'));
				}else{
					callback()
				}
			};
			var validatePeriod = (rule, value, callback) => {
				if (value === '' || value.trim() === '') {
					callback(new Error('请输入年级！'));
				}else{
					callback()
				}
			};
			return{
				pickerOptions:{
					disabledDate(time) {
            			return time.getTime() < Date.now() - 8.64e7;
          			}
				},
				dialogTitle:'',
				selectYear:'全部',
				progress:[{name:'全部',value:'-1'},{name:'未开始',value:'0'},{name:'进行中',value:'1'},{name:'已结束',value:'2'},],
				dialogAddPlan:false,
				dialogImportStu:false,
				fileList:[],
				planDatas:[],
				addPlanForm:{
					turnplanname:'',
					comment:'',
					begintime:'',
					endtime:'',
					period:''
				},
				rules:{
					turnplanname: [
			            // { required: true, message: '请输入计划名称', trigger: 'blur' },
						{ required: true,validator: validateBlank, trigger: 'blur' },
			            { max: 100, message: '长度必须小于100个字符', trigger: 'blur' }
						
					],
					period:[
						// { required: true, message: '请输入年级', trigger: 'blur' },
						{ required: true,validator: validatePeriod, trigger: 'blur' },
						{  max: 20, message: '长度必须小于20个字符', trigger: 'blur' }
						
					],
					begintime:[
						{ required: true,validator:checkDate1, trigger: 'blur' },
					],
					endtime:[
						{required: true, validator:checkDate2, trigger: 'blur' },
					],
					comment:[
						{  max: 500, message: '长度必须小于500个字符', trigger: 'blur' }
					]
				},
				selectItems:[],
				fileList:[],
				currentPlanId:'',
				pagenum:1,
				pagepersize:10,
				totalCount:0,
				changeProgress:-1,
			}
		},
		computed:{
			uploadData(){
				let planId = this.currentPlanId;
				return {
		        	_upload_data: JSON.stringify({"1": {
			        	command: 'turn/importturnplandetail',
						sessionid: getCookie('sid'),
						loginid: getCookie('uid'),
						planId:planId,
			        }})
		        }
			}
		},
		methods:{
			openDialogAdd(){
				this.addPlanForm = {
					turnplanname:'',
					comment:'',
					begintime:'',
					endtime:'',
					period:''
				};
				this.dialogTitle='新增计划';
				this.dialogAddPlan = true;
			},
			delPlans(){
				var self =this;
				console.log(this.selectItems.length);
				if(this.selectItems.length===0){
					this.$message({
			          showClose: true,
			          message: '请先勾选删除项！',
			          type: 'warning'
			        });
					return;
				}
				this.$confirm('是否要删除选中的计划?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	post('/turnplan/deleteturnplan',{
		        		command:'turnplan/deleteturnplan',
						sessionid:getCookie('sid'),
						loginid:getCookie('uid'),
						turnplanidlist:this.selectItems
		        	}).done((data)=>{
		        		if(data&&data.errcode==0){
		        			self.$message({
					            type: 'success',
					            message: '删除成功!'
					          });
		        			self.queryCircleList();
		        		}else if(data.errcode=='1901'){
		        			self.$message.error('删除的计划已有学生轮转，若确定删除计划，请先将学生从计划中删除！');
		        		}else{
		        			self.$message.error('删除失败！');
		        		}
		        	}).fail(function(){
		        		self.$message.error('删除失败！');
		        	})
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
			},
			downloadModel(){
		    	let data ={
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					
					command: "turn/turnPlanTempData",
				};
				exportMouldExcel(data);
		    },

			changeQuery(val){
				let opt = {};
				this.changeProgress =val;
				if(val!=-1){
					opt.progress = val;
					
				}
				this.queryCircleList(opt);
			},
			importStu(index,row){
				this.currentPlanId=row.turnplanid;
				this.dialogImportStu=true;
			},
			changeFile(file,list){
		    	
		    	if(list.length>1){
		    		list.shift();
		    	}
		    	
		    },
			submitImport(){
		    	this.$refs.upload.submit();
		    },
		    checkFile(file) {
		    	//console.log(file.type)
		        const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')||file.type === 'application/vnd.ms-excel';

		        if (!isExcel) {
		          this.$message.error('请上传.xls或.xlsx格式的Excel文件！');
		        }
		        this.hasFile=false;
		        return isExcel ;
		    },
			uploadSuccess(resp){
				if(resp.errcode==9903){
					this.$message({
						showClose:true,
						duration:5000,
			    		type:'error',
			    		message:'导入失败，建议检查Excel中的日期格式'
			    	});
				}else if(resp.errcode==1901){
					this.$msgbox({
				        title: '错误提示',
				        message: this.$createElement('p', null, this.createElement(resp.errorlist)),
				        type:'error',
				        confirmButtonText: '确定',
				    });
				    console.log(resp)
				}else{

				}
		    	
		    	this.$refs.upload.clearFiles();
				this.dialogImportStu=false;
		    	this.$loading().close();
		    },
		    createElement(list){
		    	const h = this.$createElement;
		    	let res = [];
		    	let line = [];
		    	list.forEach((item,index)=>{
		    		for(var key in item){
		    			item[key].forEach((item1)=>{
		    				for(let key1 in item1){
		    					if(key1==4008){
		    						line.push(item1[key1]+'轮转时间重叠');
		    					}else if(key1==4007){
		    						line.push(item1[key1]+'轮转时间超过计划时间')
		    					}else if(key1==4009){
		    						line.push(item1[key1]+'轮转信息不完整')
		    					}else if(key1==2704){
		    						line.push(item1[key1]+'手机号不正确')
		    					}else if(key1==3100){
		    						line.push(item1[key1]+'学员不存在')
		    					}
		    				}
		    			})
		    		}
		    		res.push(h('p',null,index+1+'.序号为'+key+':'+line.join(';')));
		    		line = [];
		    	});
		    	return res;
		    },
		    onProgress(){

		    	this.$loading();
		    },
			editPlan(index,data){
				this.dialogTitle = '编辑计划';
				this.dialogAddPlan = true;
				this.addPlanForm = {...data};
			},
			delPlan(index,row){
				let self = this
				this.selectItems = []
				this.selectItems.push(row.turnplanid)
				this.$confirm('是否要删除该条计划?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
					post('/turnplan/deleteturnplan',{
		        		command:'turnplan/deleteturnplan',
						sessionid:getCookie('sid'),
						loginid:getCookie('uid'),
						turnplanidlist:this.selectItems
		        	}).done((data)=>{
		        		if(data&&data.errcode==0){
		        			self.$message({
					            type: 'success',
					            message: '删除成功!'
					          });
		        			self.queryCircleList();
		        		}else if(data.errcode=='1901'){
		        			self.$message.error('删除的计划已有学生轮转，若确定删除该计划，请先将学生从计划中删除！');
		        		}else{
		        			self.$message.error('删除失败！');
		        		}
		        	}).fail(function(){
		        		self.$message.error('删除失败！');
		        	})
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
			},
			showDetail(index,row){
				this.$router.push({name:'circlePlanDetail',params:{plan_id:row.turnplanid},query:{begintime:row.begintime,endtime:row.endtime,turnplanname:row.turnplanname}});
			},
			
		    handleSelectionChange(r){
				this.selectItems = r.map((i)=>i.turnplanid);
			},
			handleSubmitAdd(formName){
				this.addPlanForm.turnplanname = this.addPlanForm.turnplanname.trim()
				this.addPlanForm.period = this.addPlanForm.period.trim()
				this.$refs[formName].validate((valid) => {
		          if (valid) {
		            let self = this;
					//console.log(this.addPlanForm.begintime);
					let begintime = moment(this.addPlanForm.begintime).format('YYYY-MM-DD');
					let endtime = moment(this.addPlanForm.endtime).format('YYYY-MM-DD');
					// console.log(begintime);
					if(this.addPlanForm.turnplanid){
						post('/turnplan/updateturnplan',{
							command:'turnplan/updateturnplan',
							sessionid:getCookie('sid'),
							loginid:getCookie('uid'),
							turnplanname:this.addPlanForm.turnplanname,
							period:this.addPlanForm.period,
							begintime:begintime,
							endtime:endtime,
							comment:this.addPlanForm.comment,
							turnplanid:this.addPlanForm.turnplanid
						}).done(function(data){
							if(data&&data.errcode==0){
								self.dialogAddPlan = false;
								self.$message({
						            type: 'success',
						            message: '编辑成功!'
						          });
								self.queryCircleList();
							}else if(data && data.errcode == 1901){
								self.$message.error(data.errdesc);
							}else if(data && data.errcode == 4007){
								self.$message.error(data.errdesc);
							}else if(data && data.errcode == 4004){
								self.$message.error('轮转计划中已有学生在轮转，不能修改开始时间！');
							}
							else{
								self.$message.error('编辑失败！');
							}
						}).fail(function(){
							self.$message.error('编辑失败！');
						});
					}else{
						post('/turnplan/addturnplan',{
							command:'turnplan/addturnplan',
							sessionid:getCookie('sid'),
							loginid:getCookie('uid'),
							turnplanname:this.addPlanForm.turnplanname,
							period:this.addPlanForm.period,
							begintime:begintime,
							endtime:endtime,
							comment:this.addPlanForm.comment
						}).done(function(data){
							if(data&&data.errcode==0){
								self.dialogAddPlan = false;
								self.$message({
						            type: 'success',
						            message: '新增成功!'
						          });
								self.queryCircleList();
							}else if(data&&data.errcode==1901){
								self.$message.error('您输入的计划名称已经存在，请重新输入！');
							}else{
								self.$message.error('新增失败！');
							}
						}).fail(function(){
							self.$message.error('新增失败！');
						});
					}
		          } else {
		            console.log('error submit!!');
		            return false;
		          }
		        });

				
				
				
			},
			 closeDialog(formName) {
		        this.$refs[formName].resetFields();
		     },
			handleCancel(){
				this.dialogAddPlan = false;
			},
			handleSizeChange(size){
				this.pagepersize = size;
				this.queryCircleList({progress:this.changeProgress});
			},
			handleCurrentChange(page){
				this.pagenum = page;
				this.queryCircleList({progress:this.changeProgress});
			},
			queryCircleList(option){
				let self = this;
				post('/turnplan/queryturnplanlist',{
					command:'turnplan/queryturnplanlist',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					pagenum:this.pagenum,
					pagepersize:this.pagepersize,
					...option

				}).done(function(data){
					if(data&&data.errcode==0){
						//console.log(data);
						self.planDatas = data.list.map((item)=>{
							return _.mapValues(item,(val,key)=>{
								if(key=='progress'){
									return val==0?'未开始':(val==1?'进行中':'已结束');
								}
								return val;
							})
						});
						self.totalCount = data.totalcount;
					}
				});
			}
		},
		mounted(){
			this.queryCircleList({});
		}
	}
</script>
<style scoped>
	.page-title{
		font-size: 20px;
		color: #1f2d3d;
		margin:10px 0px;
	}
	.page-tools{
		margin:10px 10px;
	}
	.year-select{
		margin:10px 10px;
		height: 37px;
		width: 500px;
	}
	.inline-first{
		float: left;
		line-height: 37px;
		margin-right: 10px;
	}
	.inline-second{
		float:left;
	}
</style>