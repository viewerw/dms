<template>
<div class = "wapper">
	<div class = "page-title">科室职工管理</div>
	<div class = "tools">
		<div class = "emp-btns">
			<el-button type = "primary" @click = "addEmployee">添加成员</el-button>
			<el-button type = "primary" @click = "dialogTableVisible=true">批量导入</el-button>
			<el-button type = "primary" @click ="deleteAlert">批量删除</el-button>
			<el-button type = "primary" @click="exportData">批量导出</el-button>
		</div>
		<div class = "search">
			<div class="search-input" style = "float:left">
			<el-input style = "width:200px" v-model="firstInput" placeholder="请输入姓名或手机号搜索"></el-input>
			</div>
			<div class = "search-btn" style = "float:left;margin-left:10px">
			<el-button type = "primary" @click ="queryByInput">搜索</el-button>
			</div>
		</div>
	</div>
	<div class = "tree-data">
		<div class ="emp-tree" style = "height:100%">
			<el-tree :expand-on-click-node="true" :default-expanded-keys="expandedKeys" :current-node-key="currentDeptId
			" :highlight-current = "true" node-key="id" :data="deptData" style = "height:100%" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
		</div>
		<div class = "data-table">
			<el-table
		    ref="multipleTable"
		    :data="tableData"
		    border
		    tooltip-effect="dark"
		    style="width: 100%"
		    
		    @selection-change="handleSelectionChange">
		    <el-table-column
		      type="selection"
		      >
		    </el-table-column>
		    <el-table-column
		      prop = "name"
		      label="姓名"
		      width = "100"
		     >
		      <template scope = "scope">
		      	<span>{{scope.row.name}}</span>
		      	<!-- <el-tag type ="primary" v-if="scope.row.isduty">负责人</el-tag> -->
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="mobile"
		      label="手机号"
		      width = "125"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="dept"
		     
		      label="科室">
		    </el-table-column>
		    <el-table-column
		      prop="position"
		      label="职位">
		    </el-table-column>
		    <el-table-column
		      prop="technique"
		      label="职称">
		    </el-table-column>
		    <el-table-column
		      prop="educational"
		      label="学历">
		    </el-table-column>
		    <el-table-column
		      prop="degree"
		      width= "80"
		      label="学位">
		    </el-table-column>
		    <el-table-column
		      width = "210"
		      label="操作">
		       <template scope="scope">
			        <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
			        <el-button @click="handleDelete(scope.$index, scope.row)" type="text" size="small">删除</el-button>
			        <el-button @click="handleDetail(scope.$index, scope.row)" type="text" size="small">查看</el-button>
			        <!-- <el-button @click="handlePowerManage(scope.$index, scope.row)" type="text" size="small">{{scope.row.isduty?'撤销负责人':'设为负责人'}}</el-button> -->
      			</template>
		    </el-table-column>
		  </el-table>
		  <el-pagination
		  style = "float:right;margin:10px 10px"
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="requestPage"
	      :page-sizes="[10, 20, 50, 100]"
	      :page-size="sizePerPage"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="totalCount">
	    </el-pagination>
		</div>

	</div>
	<el-dialog title="" :visible.sync="dialogTableVisible" >
	  <div class = "import-popup">
	  	<div>
	  	<span class = "tip-circle">1</span><span>下载员工通讯录模板，批量填写员工信息</span><span><el-button type = "primary" class= "import-popup-btn" @click ="downloadModel">下载</el-button></span></div>

	  	<div>
	  		<div>
	  		<span class = "tip-circle">2</span><span>上传填写好的员工信息表</span>
	  		</div>
	  		<div>
	  		<el-upload
    		  style = "display:inline-block;margin:10px 40px"
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
    			<el-button type="primary" >选择文件</el-button>
    		</el-upload>
    		</div>
	  	</div>
	  	<div style = "margin:10px auto;width:60px" >
	  		<el-button type = "primary" @click ="submitUpload">上传</el-button>
	  	</div>
	  </div>
	</el-dialog>
	<!-- tianjia chengyuan -->
	<el-dialog :title="dialogTitle" :visible.sync="dialogAddEmployee" :close-on-click-modal ="false" @close = "closeDialog('addEmployeeFormRef')">
	  <el-form :model = "addEmployeeForm" :rules="rules" ref = "addEmployeeFormRef" label-width ="80px">
	  <el-row :gutter ="20">
	  	<el-form-item label="基本信息">
	      <!-- <el-input v-model="form.name"></el-input> -->
	    </el-form-item>
	   </el-row>
	   <el-row :gutter ="20">
		    <el-col :span = "11">
			    <el-form-item label="姓名" prop = "name">
			    	<span v-if = "showMode ==1" >:</span>
			    	<el-input v-if = "showMode ==0" v-model="addEmployeeForm.name"></el-input>
			    	<span v-if = "showMode ==1" class ="detailItem">{{addEmployeeForm.name}}</span>
			    </el-form-item>
		    </el-col>
	    <el-col :span = "2"> &nbsp;</el-col>
	    <el-col :span = "11">
		    <el-form-item label="性别" prop = "sex" >
		    	<span v-if = "showMode ==1" >:</span>
			    <el-radio-group v-if = "showMode ==0" v-model="addEmployeeForm.sex">
			      <el-radio :label="0">男</el-radio>
			      <el-radio :label="1">女</el-radio>
			    </el-radio-group>
			    <span v-if = "showMode ==1" class="detailItem">{{addEmployeeForm.sex==0?'男':'女'}}</span>
		    </el-form-item>
	    </el-col>
	    </el-row>
	    <el-row :gutter ="20">
	    <el-col :span = "11">
		    <el-form-item label="手机号" prop = "mobile">
		    	<span v-if = "showMode ==1" >:</span>
		    	<el-input v-if = "showMode ==0" v-model="addEmployeeForm.mobile"></el-input>
		    	<span v-if = "showMode ==1" class = "detailItem">{{addEmployeeForm.mobile}}</span>
		    </el-form-item>
	    </el-col>
	    <el-col :span = "2"> &nbsp;</el-col>
	    <el-col :span = "11">
		    <el-form-item label="出生年月" v-if = "showMode ==0" required>
		    	<el-col :span = "11" style = "padding:0px;margin-right:19px">
			    	<el-form-item prop = "addEmpYear">
			    		<el-select v-if = "showMode ==0" v-model="addEmployeeForm.addEmpYear" placeholder="请选择">
						    <el-option
						      v-for="item in yearList"
						      :key="item"
						      :label="item+'年'"
						      :value="item">
						    </el-option>
						</el-select>
						
			    	</el-form-item>
				 </el-col>
				 <el-col :span ="2"></el-col>
				 <el-col :span = "11" style = "padding:0px">
					 <el-form-item prop ="addEmpMonth">
						 <el-select v-if = "showMode ==0" v-model="addEmployeeForm.addEmpMonth"  placeholder="请选择">
						    <el-option
						      v-for="item in ['01','02','03','04','05','06','07','08','09','10','11','12']"
						      :key="item"
						      :label="item+'月'"
						      :value="item">
						    </el-option>
						 </el-select>
						 
					 </el-form-item>
				 </el-col>
				 
		    </el-form-item>
		    <el-form-item label = "年龄" v-if = "showMode ==1" prop ="age">
		    	<span v-if = "showMode ==1" >:</span>
		    	<span class="detailItem">{{(new Date().getFullYear()-addEmployeeForm.addEmpYear)+'岁'}}</span>
		    </el-form-item>
	    </el-col>
	    </el-row>
	    <el-row :gutter ="20">
	    <el-col :span = "11">
		    <el-form-item label="学历" prop = "educational" >
		    	<span v-if = "showMode ==1" >:</span>
			   <el-select v-if = "showMode ==0" v-model="addEmployeeForm.educational" style = "width:100%" placeholder="请选择">
				    <el-option
				      v-for="item in educationList"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
			   </el-select>
				<span v-if = "showMode ==1" class="detailItem">{{addEmployeeForm.educational}}</span>
		    </el-form-item>
	    </el-col>
	    <el-col :span = "2"> &nbsp;</el-col>
	    <el-col :span = "11">
	    	<el-form-item label = "学位" prop = "degree">
	    		<span v-if = "showMode ==1" >:</span>
	    		<el-select v-if = "showMode ==0" v-model="addEmployeeForm.degree" style = "width:100%" placeholder="请选择">
				    <el-option
				      v-for="item in degreeList"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				 </el-select>
				 <span v-if = "showMode ==1" class="detailItem">{{addEmployeeForm.degree}}</span>
	    	</el-form-item>
	    </el-col>
	    </el-row>
	    <el-row :gutter ="20">
	    <el-col :span = "11">
		    <el-form-item label="证件类型" prop = "cardType" >
				<span v-if = "showMode ==1" >:</span>
			   <el-select v-if = "showMode ==0" v-model="addEmployeeForm.card_type" style = "width:100%" placeholder="请选择">
				    <el-option
				      v-for="item in cardList"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
			   </el-select>
				<span v-if = "showMode ==1" class="detailItem">{{addEmployeeForm.card_type_name}}</span>
		    </el-form-item>
	    </el-col>
	    <el-col :span = "2"> &nbsp;</el-col>
	    <el-col :span = "11">
	    	<el-form-item label = "证件号" prop = "cardNo">
				<span v-if = "showMode ==1" >:</span>
	    		<el-input v-if = "showMode ==0" v-model="addEmployeeForm.card_num"></el-input>
				 <span v-if = "showMode ==1" class="detailItem">{{addEmployeeForm.card_num}}</span>
	    	</el-form-item>
	    </el-col>
	    </el-row>
	    <el-row :gutter ="20">
	    <el-col :span = "8">
		    <el-form-item label="技术职称" prop = "technique_id">
			   <span v-if = "showMode ==1" >:</span>
			   <el-select v-if = "showMode ==0" v-model="addEmployeeForm.technique_id" style = "width:100%" placeholder="请选择">
				    <el-option
				      v-for="item in techniqueList"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
			   </el-select>
				<span v-if = "showMode ==1" class="detailItem">{{addEmployeeForm.technique}}</span>
		    </el-form-item>
	    </el-col>
	    <el-col :span = "8"> 
			<el-form-item  label = "资格时间" prop = "technique_validate_date">
				<span v-if = "showMode ==1" >:</span>
	    		<el-date-picker
	    		v-if = "showMode ==0"
	    		style = "width:100%"
			      v-model="addEmployeeForm.technique_validate_date"
			      type="date"
			      placeholder="选择日期"
			      >
			    </el-date-picker>
			    <span v-if = "showMode ==1" class="detailItem">{{addEmployeeForm.technique_validate_date}}</span>
	    	</el-form-item>
	    </el-col>
	    <el-col :span = "8">
	    	<el-form-item  label = "聘用时间" prop = "validate_date">
				<span v-if = "showMode ==1" >:</span>
	    		<el-date-picker
	    		v-if = "showMode ==0"
	    		style = "width:100%"
			      v-model="addEmployeeForm.technique_engage_date"
			      type="date"
			      placeholder="选择日期"
			      >
			    </el-date-picker>
			    <span v-if = "showMode ==1" class="detailItem">{{addEmployeeForm.technique_engage_date}}</span>
	    	</el-form-item>
	    </el-col>
	    </el-row>
	    <el-row :gutter ="20">
	    <el-col :span = "8">
		    <el-form-item label="教学职称" prop = "teching_id">
				<span v-if = "showMode ==1" >:</span>
			   <el-select v-if = "showMode ==0" v-model="addEmployeeForm.teching_id" style = "width:100%" placeholder="请选择">
				    <el-option
				      v-for="item in techingList"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
			   </el-select>
				<span v-if = "showMode ==1" class="detailItem">{{addEmployeeForm.teching}}</span>
		    </el-form-item>
	    </el-col>
	    <el-col :span = "8"> 
			<el-form-item  label = "资格时间" prop = "teching_validate_date">
				<span v-if = "showMode ==1">:</span>
	    		<el-date-picker
	    		v-if = "showMode ==0"
	    		style = "width:100%"
			      v-model="addEmployeeForm.teching_validate_date"
			      type="date"
			      placeholder="选择日期"
			      >
			    </el-date-picker>
			    <span v-if = "showMode ==1" class="detailItem">{{addEmployeeForm.teching_validate_date}}</span>
	    	</el-form-item>
	    </el-col>
	    <el-col :span = "8">
	    	<el-form-item  label = "聘用时间" prop = "teching_engage_date">
				<span v-if = "showMode ==1" >:</span>
	    		<el-date-picker
	    		v-if = "showMode ==0"
	    		style = "width:100%"
			      v-model="addEmployeeForm.teching_engage_date"
			      type="date"
			      placeholder="选择日期"
			      >
			    </el-date-picker>
			    <span v-if = "showMode ==1" class="detailItem">{{addEmployeeForm.teching_engage_date}}</span>
	    	</el-form-item>
	    </el-col>
	    </el-row>
	    <el-row :gutter ="20">
	    	<el-form-item label="科室信息" prop ="roomInfo"></el-form-item>
		</el-row>
		<el-row :gutter ="20" :key = "index" v-for = "(officeInfo,index) in addEmployeeForm.depts">
	    	<el-col :span = "7">
			   
		    </el-col>
		    <el-col :span = "7"> 
				<el-form-item label = "科室" >
					<span v-if = "showMode ==1" >:</span>
		    		<el-input :disabled = "true" v-if = "showMode ==0" v-model="officeInfo.name"></el-input>
		    		<span v-if = "showMode ==1" class="detailItem">{{officeInfo.name}}</span>
		    	</el-form-item>
		    </el-col>
		    <el-col :span = "7">
		    	<el-form-item label = "职位" >
					<span v-if = "showMode ==1" >:</span>
		    		<el-select  v-if = "showMode ==0" v-model="officeInfo.position_id" style = "width:100%" placeholder="请选择">
					    <el-option
					      v-for="item in titleList"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					 </el-select>
					 <span v-if = "showMode ==1" class="detailItem">{{officeInfo.positionname}}</span>
		    	</el-form-item>
		    </el-col>
		    <el-col :span = "3">
		    	<el-button v-if = "officeInfo.deleteflag==0&& showMode ==0" type = "primary"  @click = "roomInfoDel(index)" class = "roomInfoDel">移除</el-button>
		    </el-col>
	    </el-row>
	    <el-row :gutter= "20" >
	    	<el-button v-if = "showMode ==0" type = "primary" @click = "roomInfoAdd" class = "roomInfoAdd">添加</el-button>
	    	
	    </el-row>
		<el-row :gutter ="20" ><el-form-item label="角色信息"></el-form-item></el-row>
		<el-row :gutter = "20">
			<el-form-item  label ="所属角色" class = "pickRoles" prop= "roles">
				<span v-if = "showMode ==1" >:</span>
				<el-checkbox-group v-if = "showMode ==0" v-model="addEmployeeForm.roles">
			      <el-checkbox v-if="item.id!=9&&item.id!=8" :disabled = "item.status==0" v-for="item in roleList" :label="item.id" :key = "item.id" >{{item.name}}</el-checkbox>
			    </el-checkbox-group>
			    <span v-if = "showMode ==1" class="detailItem">{{addEmployeeForm.roles.join('、')}}</span>
			</el-form-item>
		</el-row>
		<el-row :gutter= "20" v-if='showMode == 0' class='footerBtn'>
	    	<el-button type = "primary" @click = "handleSubmitAdd('addEmployeeFormRef')" class = "bottomBtnsSure">保存</el-button>
	    	<el-button  @click = "handleCancel" class = "bottomBtns">取消</el-button>
	    </el-row>
	  </el-form>
	</el-dialog>
	<!--xuanze keshi dialog-->
	<el-dialog title="选择科室" size = "tiny" :visible.sync="dialogChooseRoom" :close-on-click-modal ="false" @close = "resetChooseTree">
		<div class ="searchTop">
			<div class = "search">
				<div class="search-input" style = "float:left">
				<el-input style = "width:200px" v-model="rInput" placeholder="请输入科室名搜索"></el-input>
				</div>
				<div class = "search-btn" style = "float:left;margin-left:10px">
				<el-button type = "primary" @click = "searchRoom">搜索</el-button>
				</div>
			</div>
		</div>
		<div class ="chooseTree" style = "max-height:500px;overflow-y:scroll">
			<el-tree v-if="!inTreeSearch" :key = "1" ref= "chooseRoomTree" :check-strictly="true"  :default-expanded-keys="[99]" :default-checked-keys="defaultChecked" show-checkbox node-key="id" :data="deptData_3" style = "width:100%" :props="defaultProps1" @node-click=""></el-tree>
			<el-tree v-if="inTreeSearch" :key = "2"ref= "chooseRoomTree" :check-strictly="true"  :default-expanded-keys="[99]" show-checkbox node-key="id" :data="roomTree" style = "width:100%" :props="defaultProps2" @node-click=""></el-tree>
		</div>
		<div>
			<el-button type = "primary" @click = "chooseRoom" style = "margin-left:60%" class = "bottomBtnsSure">确认</el-button>
	    	<el-button  @click = "cancelChoose" class = "bottomBtns">取消</el-button>
		</div>
	</el-dialog>
</div>
</template>
<script >
import moment from 'moment'
import {post,getCookie,setTitle,exportMouldExcel,exportExcel} from '../config/util'
import{mapState,mapActions} from 'vuex'
var _ = require('lodash');
	export default{
		data(){
			var checkMobile =  (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请输入手机号'));
		        } else if (!(/^1[34578]\d{9}$/.test(value))) {
		          callback(new Error('请输入正确的手机号!'));
		        } else {
		          callback();
		        }
		    };
		    var checkYear =  (rule, value, callback) => {
		        if (this.addEmployeeForm.addEmpYear === '') {
		          callback(new Error('请选择年份'));
		        } else {
		          callback();
		        }
		    };
		    var checkMonth =  (rule, value, callback) => {
		        if (this.addEmployeeForm.addEmpMonth === '') {
		          callback(new Error('请选择月份'));
		        } else {
		          callback();
		        }
		    };
		    var checkEdu =  (rule, value, callback) => {
		        if (this.addEmployeeForm.educational === '') {
		          callback(new Error('请选择学历'));
		        } else {
		          callback();
		        }
		    };
		    var checkLevel =  (rule, value, callback) => {
		        if (this.addEmployeeForm.level === '') {
		          callback(new Error('请选择职称'));
		        } else {
		          callback();
		        }
		    };
		    var checkCard =  (rule, value, callback) => {
		    	console.log(value)
		    	//护照校验正则
		    	var re1 = /^[a-zA-Z]{5,17}$/;
        		var re2 = /^[a-zA-Z0-9]{5,17}$/;
		        if (this.addEmployeeForm.card_num === '') {
		          callback(new Error('请输入证件号'));
		        } else if (this.addEmployeeForm.card_type==71) {
		        	if(!(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(this.addEmployeeForm.card_num))){
		        		callback(new Error('请输入正确的身份证号!'));
		        	}else{
		        		callback();
		        	}
		          
		        } else if(this.addEmployeeForm.card_type==72){
		          if(re1.test(this.addEmployeeForm.card_num)||re2.test(this.addEmployeeForm.card_num)){
		          	callback();
		          }else{
		          	callback(new Error('请输入正确的护照号!'));
		          }
		        }else{
		        	callback();
		        }
		    };
		    var checkCardType = (rule, value, callback) => {
		    	if (this.addEmployeeForm.card_type === '') {
		          callback(new Error('请选择证件类型'));
		        } else {
		          callback();
		        }
		    };
		    var checkRoomInfo = (rule, value, callback) => {
		    	if(this.addEmployeeForm.depts.length<1){
		    		callback(new Error('请选择科室！'));
		    	}else{
		    		callback();
		    	}
		    };
			return{
				firstInput:'',
				rInput:'',
				inTreeSearch:false,
				exportInput:false,//是否导出查询的数据
				dialogTitle:'',
				dialogTableVisible:false,
				dialogAddEmployee:false,
				selectItems:[],
				defaultChecked:[],
				showMode:0,
				expandedKeys:[99],
				addEmployeeForm:{
					name:'',
					sex:'',
					addEmpYear:'',
					addEmpMonth:'',
					mobile:'',
					depts:[],
					educational:'',
					degree:'',
					card_type:'',
					card_num:'',
					technique_id:'',
					technique_validate_date:null,
					technique_engage_date:null,
					teching_id:'',
					teching_validate_date:null,
					teching_engage_date:null,
					roles:[],
				},
				rules: {
				          name: [
				            { required: true, message: '请输入姓名', trigger: 'blur' },
				            {max:10,message:'请输入小于10个字符',trigger:'blur'}
				          ],
				          sex: [
				          	{required: true,message: '请选择性别',}
				          ],
				          age:[{required:true}],
				          mobile: [{ validator:checkMobile,required: true, trigger: 'blur'}],
				          addEmpYear:[{ required: true,validator:checkYear, trigger: 'change'}],
				          addEmpMonth:[{ required: true,validator:checkMonth, trigger: 'change'}],
				          cardType:[{required:true,validator:checkCardType,trigger:'visible-change'}],
				          cardNo:[{ required:true,validator:checkCard,trigger:'blur'}],
				          educational:[{required:true,validator:checkEdu,trigger:'visible-change'}],
				          level:[{required:true,validator:checkLevel,trigger:'visible-change'}],
				          /*roles:[ { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }]*/
				          roomInfo:[{required:true,validator:checkRoomInfo,}]
				},
				rulesNull:{},
				deptData:[],
				roomTree:[],
			        defaultProps: {
			          children: 'children',
			          label: 'label'
			        },
			        defaultProps1: {
			          children: 'children',
			          label: 'name'
			        },
			        defaultProps2: {
			          children: 'children',
			          label: 'sname'
			        },
			        tableData:[],
			        dialogChooseRoom:false,
			        roleList:[],
			        currentDeptId:'',
			        requestPage:1,
			        sizePerPage:20,
			        totalCount:0,
			        fileList:[],
			        uploadData:{
			        	_upload_data: JSON.stringify({"1": {
				        	command: 'dept/importdepttech',
							sessionid: getCookie('sid'),
							loginid: getCookie('uid'),
				        }})
			        },
			        hasFile:false,
			      };
			   },
			    computed:{
			    	...mapState(['cardList','degreeList','educationList','titleList','techniqueList','techingList']),
			    	yearList(){
						let years = [];

						for(let i=new Date().getFullYear()-80;i<new Date().getFullYear()-14;i++){
							years.push(i+'');
						}
						return years;

					},
					deptData_3(){
						let temList = _.cloneDeep(this.deptData);

						for(let i=0;i<temList.length;i++){
							for(let j=0;j<temList[i].children.length;j++){
								if(!temList[i].children){
									continue;
								}
								let baselist = temList[i].children[j];
								for(let k = 0;k<baselist.children.length;k++){
									if(!baselist.children[k].children){
										continue;
									}
									baselist.children[k].children=[];
								}
							}
						}
						return temList;
					},
					deptData_flat(){
						let temList = _.cloneDeep(this.deptData);
						let flatList = [];
						for(let i=0;i<temList.length;i++){
							
							for(let j=0;j<temList[i].children.length;j++){
								if(!temList[i].children){
									continue;
								}
								let baselist = temList[i].children[j];
								for(let k = 0;k<baselist.children.length;k++){
									if(!baselist.children[k].children){
										continue;
									}
									let room  = baselist.children[k];
									room.sname = temList[i].name+'-'+baselist.name+'-'+room.name;
									room.children=[];
									flatList.push(room);
								}
								baselist.children=[];
								baselist.sname = temList[i].name+'-'+baselist.name;
								flatList.push(baselist);
							}
							temList[i].children=[];
							temList[i].sname = temList[i].name;
							flatList.push(temList[i]);
						}
						console.log(flatList)
						return flatList;
					}
			    },
			    methods: {
			      handleNodeClick(data) {
			      	this.currentDeptId = data.id;
			      	let option = {deptid:data.id,requestPage:1};
			      	this.queryTechList(option);
			      	this.exportInput = false;
			      	this.firstInput='';
			      },
			      queryTechList(option){
			      	// alert(this.sizePerPage)
			      	let self = this;
			      	post('/dept/listdepttech',{
			        	command:'dept/listdepttech',
						sessionid:getCookie('sid'),
						loginid:getCookie('uid'),
						sizePerPage:this.sizePerPage,
						...option,
			        }).done((data)=>{
			        	if(data&&data.errcode==0){
			        		self.tableData = data.techlist;
			        		self.totalCount = data.count;
			        	}
			        })
			      },
			      queryByInput(){
			      	this.queryTechList({query:this.firstInput,requestPage:1});
			      	this.exportInput = true;
			      	this.currentDeptId=99;
			      },
			      handleSelectionChange(r){
			      	let self = this
			      	// console.log(r)
			      	this.selectItems = []
			      	r.map(function(item,index,arr){
			      		item.depts.map(function(item1,index1,arr1){
			      			if(item1.name == item.dept){
			      				self.selectItems.push({
			      					techid:item.id,
				    				deptid:item1.id
			      				})
			      			}
			      		})
			      	})
			      	// console.log(this.selectItems)
			      	// this.selectItems =r.map((item)=>item.id);
			      },
			      handleSizeChange(size){
			      	this.sizePerPage = size;
					if(this.exportInput){
						this.queryTechList({requestPage:this.requestPage,query:this.firstInput,});
					}else{
						this.queryTechList({deptid:this.currentDeptId,requestPage:this.requestPage,});
					}	
			      	
			      },
			      handleCurrentChange(page){
			      	this.requestPage = page;
					  if(this.exportInput){
						  this.queryTechList({query:this.firstInput,requestPage:this.requestPage});
					  }else{
						  this.queryTechList({deptid:this.currentDeptId,requestPage:this.requestPage});
					  }
			      },
			      addEmployee(){
			      		//清除编辑数据
			      		this.addEmployeeForm ={
									name:'',
									sex:'',
									addEmpYear:'',
									addEmpMonth:'',
									mobile:'',
									depts:[],
									educational:'',
									degree:'',
									card_type:'',
									card_num:'',
									technique_id:'',
									technique_validate_date:null,
									technique_engage_date:null,
									teching_id:'',
									teching_validate_date:null,
									teching_engage_date:null,
									roles:[],
								};
			      		//this.$refs['addEmployeeFormRef'].resetFields();
			      		this.dialogTitle ='新增职工';
			      		this.dialogAddEmployee= true;
				    	this.showMode = 0;
				    	
				    },
				    closeDialog(formName) {
				        this.$refs[formName].resetFields();
				    },
				    openImport(){

				    },
				    roomInfoAdd(){
				    	this.dialogChooseRoom=true;
				    	let checkIds = []
				    	let self = this
				    	if(this.addEmployeeForm.depts.length > 0){
				    		this.addEmployeeForm.depts.map((item,index,arr)=>{
				    			console.log(item)
				    			checkIds.push(item.id)
				    		})
				    	}
				    	// console.log(checkIds)
				    	this.defaultChecked = checkIds 
				    	// console.log(this.$refs)
				    	// console.log(this.$refs.chooseRoomTree)
				    	setTimeout(function(){
				    		self.$refs.chooseRoomTree.setCheckedKeys(self.defaultChecked)
				    	},0)
		
				    },
				    chooseRoom(){
				    	let self = this
				    	this.addEmployeeForm.depts = this.addEmployeeForm.depts.concat(this.$refs.chooseRoomTree.getCheckedNodes()).map((obj)=>{
				    		return {id:obj.id,name:obj.name,position_id:obj.position_id};
				    	});
				    	this.addEmployeeForm.depts = this.unique(self.addEmployeeForm.depts);
				    	this.$refs.addEmployeeFormRef.validateField('roomInfo',(valid)=>{
				    		if(valid){
				    			//console.log(valid);
				    		}else{
				    			//console.log(valid);
				    		}
				    	});
				 		this.dialogChooseRoom = false;
				    },
				    unique(arr){
						if(arr.length>0){
						 	for(let i = 0;i<arr.length;i++){
						 		for(let j = i+1;j<arr.length;j++){
						 			if(arr[i].id == arr[j].id){
						 				arr.splice(j,1)
						 			}
						 		}
						 	}
						 }
						return arr;
					},
				    cancelChoose(){

				 		this.dialogChooseRoom = false;
				    },
				    resetChooseTree(){
				    	this.rInput='';
				    	this.$refs.chooseRoomTree.setCheckedKeys([]);
				    },
				    roomInfoDel(index){
				    	this.addEmployeeForm.depts.splice(index,1);
				    	this.$refs.addEmployeeFormRef.validateField('roomInfo',(valid)=>{
				    		if(valid){
				    			//console.log(valid);
				    		}else{
				    			//console.log(valid);
				    		}
				    	});
				    },
				    deleteAlert(){
				    	var self =this;
						if(this.selectItems.length===0){
							this.$message({
					          showClose: true,
					          message: '请先勾选删除项！',
					          type: 'warning'
					        });
							return;
						}
						// console.log(this.selectItems.join(','))
						this.doDelete(this.selectItems,'是否要删除选中的职工?');
				    },
				    doDelete(list,message){
				    	let self = this;
				    	this.$confirm(message, '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	post('/dept/deletetech',{
				        		command:'dept/deletetech',
								sessionid:getCookie('sid'),
								loginid:getCookie('uid'),
								techdeptlist:list
				        	}).done((data)=>{
				        		if(data&&data.errcode==0){
				        			self.$message({
							            type: 'success',
							            message: '删除成功!'
							          });
				        			if(self.exportInput){
				        				self.queryTechList({query:this.firstInput,requestPage:this.requestPage});
				        			}else{
				        				self.queryTechList({deptid:this.currentDeptId,requestPage:this.requestPage});
				        			}
				        			
				        		}else if(data &&　data.errcode == 4001){
				        			self.$message.error('该人员下有学员，请先解绑关系后，再进行删除!');
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
							
							command: "dept/depttechmould",
						};
						exportMouldExcel(data);
				    },
				    changeFile(file,list){
				    	
				    	if(list.length>1){
				    		list.shift();
				    	}
				    	if(list.length>0){
				    		this.hasFile = true;
				    	}
				    	
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
				    submitUpload(){
				    	if(!this.hasFile){
				    		this.$message({
					          showClose: true,
					          message: '请先选择上传的Excel文件！',
					          type: 'warning'
					        });
				    	}
				    	this.$refs.upload.submit();
				    },
				    uploadSuccess(){
				    	this.$message({
				    		type:'success',
				    		message:'上传成功'
				    	});
				    	this.$refs.upload.clearFiles();
				    	this.hasFile=false;
				    	this.dialogTableVisible=false;
				    	this.$loading().close();
				    },
				    onProgress(){
				    	//this.loading=true;
				    	this.$loading();
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
							depttecid:this.selectItems,
							command: "dept/exportdepttech",
						};
				    	
				    	exportExcel(data);
				    },
				    handlePowerManage(index,row){
				    	// console.log(row)
				    	let self = this;
				    	if(typeof row.isduty == 'undefined'){
				    		this.$set(row,'isduty',true)
				    	}else{
				    		row.isduty = !row.isduty
				    	}
				    	
				    	// this.isduty = !this.isduty
				    	// let isduty = row.isduty===0?1:0;
				    	post('/dept/setduty',{
				    		command:'dept/setduty',
							sessionid:getCookie('sid'),
							loginid:getCookie('uid'),
							tecid:row.id,
							deptid:this.currentDeptId,
							// isduty:isduty
				    	}).done((data)=>{
				    		if(data&&data.errcode==0){
				    			// row.isduty = isduty;
				    			// console.log(data)
				    			this.$set(row,'isduty',true)
				    		}else{
				    			self.$message.error('设置负责人失败！');
				    			// this.
				    		}
				    	}).fail(()=>{
				    		self.$message.error('设置负责人失败！');
				    	})
				    },
				    handleDetail(index,row){
						// this.rules = []
				    	let data =  {...row};
				    	data.addEmpYear = data.birthday.split('-')[0];
				    	data.addEmpMonth = data.birthday.split('-')[1];
				    	data.roles = data.roles.map((item)=>item.name);

				    	this.addEmployeeForm =data;
				    	this.showMode = 1;
				    	this.dialogTitle='职工详情';
				    	this.dialogAddEmployee= true;
				    	//console.log(this.addEmployeeForm.roles.join('、'))
				    	//console.log(this.$refs);
				    	//this.$refs.addEmployeeFormRef.rules = {};
				    	//console.log(this.$refs.addEmployeeFormRef.rules);

				    },
				    handleEdit(index,row){
				    	// console.log(row)
				    	let data =  {...row};
				    	data.depts = [...data.depts];
				    	// console.log(data.depts)
				    	data.depts.map(function(item,index,arr){
				    		delete item.is_duty
				    	})
				    	data.roles =[...data.roles];
				    	data.addEmpYear = data.birthday.split('-')[0];
				    	data.addEmpMonth = data.birthday.split('-')[1];
				    	data.roles = data.roles.map((item)=>{
				    		return item.id;
				    	})
				    	data.degree = data.degreeid;
				    	delete data.degreeid;
				    	delete data.dept;
				    	delete data.card_type_name;
				    	data.educational = data.educationalid;
				    	delete data.educationalid;
				    	delete data.isduty;
				    	delete data.level;
				    	delete data.levelid;
				    	delete data.position;
				    	delete data.positionid;
				    	data.tecid = data.id;
				    	delete data.id;
				    	delete data.technique;
				    	delete data.teching;
				    	this.addEmployeeForm =data;
				    	// console.log(data);
				    	this.showMode = 0;
				    	this.dialogTitle = '编辑职工';
				    	this.dialogAddEmployee= true;
				    },
				    handleDelete(index,row){
				    	console.log(row)
				    	let list = []
				    	let deptid = ''
				    	row.depts.map(function(item,index,arr){
				    		if(item.name == row.dept){
				    			deptid = item.id
				    		}
				    	})
				    	list.push({
				    		techid:row.id,
				    		deptid:deptid
				    	})
				    	console.log(list)
				    	this.doDelete(list,'确定删除'+row.name+'?');
				    },
				    handleSubmitAdd(formName){
				    	if(this.showMode==1){
							this.handleCancel();
							return;
						}
				    	let self = this;
				    	this.$refs[formName].validate((valid) => {
				          if (valid) {
				          	// console.log("aaa");
				          	let option = {...this.addEmployeeForm};

				          	option.birthday = option.addEmpYear+'-'+option.addEmpMonth;
				          	delete option.addEmpYear;
				          	delete option.addEmpMonth;
				          	option.technique_validate_date && (option.technique_validate_date =moment(option.technique_validate_date).format('YYYY-MM-DD'));
				          	option.technique_engage_date && (option.technique_engage_date =moment(option.technique_engage_date).format('YYYY-MM-DD'));
				          	option.teching_validate_date && (option.teching_validate_date =moment(option.teching_validate_date).format('YYYY-MM-DD'));
				          	option.teching_engage_date && (option.teching_engage_date =moment(option.teching_engage_date).format('YYYY-MM-DD'));
				          	option.roles = option.roles.map((item)=>{
				          		return {id:item};
				          	})
				          	if(option.tecid){
				          		post('/dept/updatetech',{
				          			command:'dept/updatetech',
									sessionid:getCookie('sid'),
									loginid:getCookie('uid'),
									...option,
				          		}).done((data)=>{
				          			if(data&&data.errcode==0){
				          				self.$message({
					          				type:'success',
					          				message:'编辑成功！',
					          			});
					          			self.dialogAddEmployee = false;
					          			self.handleCurrentChange(self.requestPage);
					          			self.expandedKeys.push(self.currentDeptId);
					          			self.initDeptTree();
					          		}else if(data &&data.errcode=='4001'){
					          			self.$message({
					          				type:'error',
					          				message:'该职工在所属科室下有带教学员，请先解绑关系后，再修改科室信息！',
					          			});
					          		}else if(data &&data.errdesc){
					          			self.$message({
					          				type:'error',
					          				message:data.errdesc,
					          			});
					          		}else{
					          			self.$message({
					          				type:'error',
					          				message:'编辑失败！',
					          			});
					          		}
				          		}).fail(()=>{
				          			self.$message({
				          				type:'error',
				          				message:'编辑失败！',
				          			});
				          			
				          		})
				          	}else{
				          		post('/dept/addtech',{
					          		command:'dept/addtech',
									sessionid:getCookie('sid'),
									loginid:getCookie('uid'),
									...option,
									
					          	}).done((data)=>{
					          		if(data&&data.errcode==0){
					          			self.$message({
					          				type:'success',
					          				message:'新增成功！',
					          			});
					          			self.dialogAddEmployee = false;
					          			self.queryTechList({deptid:option.depts[0].id,requestPage:1});
					          			self.currentDeptId = option.depts[0].id;
					          			self.expandedKeys.push(self.currentDeptId);
					          			self.requestPage=1;
					          			self.initDeptTree();
					          		}else if(data &&data.errdesc){
					          			self.$message({
					          				type:'error',
					          				message:data.errdesc,
					          			});
					          		}else{
					          			self.$message({
					          				type:'error',
					          				message:'新增失败！',
					          			});
					          		}
					          	}).fail(()=>{
				          			self.$message({
				          				type:'error',
				          				message:'新增失败！',
				          			});
				          			
				          		})
				          	}
				          	
				          }
				        }); 
					},
					initDeptTree(){
						let self = this;
						post('/dept/listdepttree',{
							command:'dept/listdepttree',
							sessionid:getCookie('sid'),
							loginid:getCookie('uid'),
						}).done(function(data){
							if(data&&data.errcode==0){
								data.dept.children.forEach((item)=>{
									if(item.id==99){
										self.deptData=[item];
									}
								})

							}
						})
					},
					initSelectOption(type,list){
						let self = this;
						post('/hr/querylevellist',{
							command:'hr/querylevellist',
							sessionid:getCookie('sid'),
							loginid:getCookie('uid'),
							code:type
						}).done(function(data){
							if(data&&data.errcode==0){
								self[list] = data.levellist;
								//console.log(list)
							}
						})
					},
					queryRoleList(){
						let self = this;
						post('/role/searchrole',{
							command:'role/searchrole',
							sessionid:getCookie('sid'),
							loginid:getCookie('uid'),
						}).done(function(data){
							if(data&&data.errcode==0){
								self.roleList = data.roleList;
							}
						})
					},
					handleCancel(){
						this.dialogAddEmployee = false;
					},
					searchRoom(){
						if(this.rInput!=''){
							let rList = [];
							for(let i=0;i<this.deptData_flat.length;i++){
								if(this.deptData_flat[i].sname.indexOf(this.rInput)>-1){
									rList.push(this.deptData_flat[i]);
								}
							}
							this.inTreeSearch=true;
							this.roomTree = rList;
						}else{
							this.inTreeSearch=false;
						}
					}

			    },
			    watch:{
			    	rInput(val){
			    		if(val==''){
			    			this.inTreeSearch=false;
			    		}else{
			    			this.searchRoom();
			    		}
			    	}
			    },
			    mounted(){
			    	this.initDeptTree();
			    	this.currentDeptId=99;
			    	this.queryTechList({deptid:this.currentDeptId});
			    	/*this.initSelectOption('education','educationalList');
			    	this.initSelectOption('degree','degreeList');
			    	this.initSelectOption('level','levelList');
			    	this.initSelectOption('level','levelList');*/
			    	//this.queryAllTeachers();
			    	let option = {deptid:99,requestPage:1};
			      	this.queryTechList(option);
			    	this.queryRoleList();
                    
			    }

			}
		

</script>
<style scoped>
	
	.tools{

	}
	.emp-btns{
		float: left;
	}
	.search{
		float:right;
	}
	.searchTop{
		line-height: 40px;
		box-sizing: border-box;
		width: 100%;
		height: 60px;
		padding:10px 10px;
		border:1px solid #d3dce6;
	}
	.tree-data{
		margin-top: 10px;
	}
	.tree-data:after{
		clear:both;
		display: block;
		content:'';
	}
	.emp-tree{
		float: left;
		width: 20%
	}
	.data-table{
		float: left;
		width: 80%;
		border:1px solid #dfe6ec;
		box-sizing: border-box;
	}
	.roomInfoAdd{
		margin-left: 20px;
		margin-bottom: 20px;
	}
	.el-row{
		
	}
	.pickRoles{
		margin-left: 10px;
	}
	.bottomBtns{
		margin-bottom: 20px;
		margin-top: 20px;
	}
	.footerBtn{
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.bottomBtnsSure{
		/*margin-bottom: 20px;*/
		/*margin-top: 20px;*/
		/*margin-left: 60%!important;*/
	}
	.import-popup{
		/*font-size: 20px;*/
	}
	.tip-circle{
		display: inline-block;
		margin-right: 10px;
	    width: 30px;
	    height: 30px;
	    font-size: 28px;
	    text-align: center;
	    color: white;
	    background-color: #58b7ff;
	    border-radius: 30px;
	}
	.import-popup-btn{
		position: relative;
	    left: 10px;
	    top: -2px;
	}
	.file-name{
		position: relative;
		left: 20px;
	}
	.el-upload-list{
		display: inline-block;
	}
	.detailItem{
		margin-left: 10px;
	}
</style>