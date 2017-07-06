<template>
<div class = "wapper">
	<div class = "page-title">
		学生管理
	</div>
	<div class ="tools">
		<div class = "funcTools">
			<el-button  type ="primary" @click = "openAddStu">新增学员</el-button>
			<el-button  type ="primary" @click = "delStudents">批量删除</el-button>
			<el-button  type ="primary" @click = "dialogTableVisible=true">批量导入</el-button>
			<el-button  type ="primary"  @click = "exportData">批量导出</el-button>
		</div>
		<div class = "search">
			<div class="search-input" style = "float:left">
			<el-input style = "width:200px" v-model="input" placeholder="请输入姓名或手机号搜索"></el-input>
			</div>
			<div class = "search-btn" style = "float:left;margin-left:10px">
			<el-button type = "primary" @click = "doInputQuery">搜索</el-button>
			</div>
		</div>
	</div>
	<div class = "queryTools">
		<div class = "queryAll">
			<el-button type = "text" @click = "queryAll">全部</el-button>
		</div>
		<el-form style = "float:left" :model = "queryForm" :inline = "true" ref = "queryForm" label-width ="70px">
			<el-form-item label="年级" prop = "" >
		    	<el-select v-model="queryForm.plan_id" placeholder="请选择">
		    		<el-option :key ="-1" label = "全部" :value="-1"></el-option>
				    <el-option
				      v-for="item in gradeList"
				      :key="item.id"
				      :label="item.period"
				      :value="item.id">
				    </el-option>
				</el-select>
		    </el-form-item>
		    <el-form-item label="培训专业" prop = "" >
		    	<el-select v-model="queryForm.prof_id" placeholder="请选择">
		    		<el-option label = "全部" :value="-1"></el-option>
				    <el-option
				      v-for="item in professionList"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				</el-select>
		    </el-form-item>
		    <el-form-item label="学员类型" prop = "" >
		    	<el-select v-model="queryForm.type_id" placeholder="请选择">
		    		<el-option label = "全部" :value="-1"></el-option>
				    <el-option
				      v-for="item in stuTypeList"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				</el-select>
		    </el-form-item>
		    <el-form-item label="状态" prop = "" >
		    	<el-select v-model="queryForm.status" placeholder="请选择">
		    		<el-option label = "全部" :value="-1"></el-option>
				    <el-option
				      v-for="item in [{name:'禁用',id:1},{name:'启用',id:0}]"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				</el-select>
		    </el-form-item>
		</el-form>
	</div>
	<div class = "funcBtns">
		<el-button type = "primary" @click ="doSelectQuery">查询</el-button>
	</div>
	<div class = "dataTable">
		<el-table
		    ref="detailTable"
		    :data="studentList"
		    border
		    tooltip-effect="dark"
		    style="width: 100%"
		    @selection-change="handleSelectionChange">
		    <el-table-column type ="selection" width = "65"  ></el-table-column>
		    <el-table-column type ="index" width = "65" label = "序号" ></el-table-column>
		    <el-table-column prop = "stud_name" width = "100" label ="姓名"></el-table-column>
		    <el-table-column prop = "mobile" width = "130" label ="手机号"></el-table-column>
		    <el-table-column prop = "nation" width = "100" label ="民族"></el-table-column>
		    <el-table-column prop = "fresh" width = "100" label ="往届/应届"></el-table-column>
		    <el-table-column prop = "professional" width = "100" label ="培训专业"></el-table-column>
		    <el-table-column prop = "practicing" width = "100" label ="是否执业医师"></el-table-column>
		    <el-table-column prop = "type" width = "100" label ="学员类型"></el-table-column>
		    <el-table-column prop = "year_count" width = "100" label ="培训年限核定/年"></el-table-column>
		    <el-table-column prop = "period" width = "100" label ="年级"></el-table-column>
		    <el-table-column prop = "status" width = "100" label ="状态">
		    	<template scope = "scope">
		    		<span v-if ="scope.row.status=='启用'">{{scope.row.status}}</span>
		    		<el-button v-else type="text" @click ="openReasonDialog(scope.row.forbidden_reason)">{{scope.row.status}}</el-button>
		    	</template>
		    </el-table-column>
		    <el-table-column fixed = "right" width = "240" label ="操作">
		    	<template scope = "scope">
		    		<el-button @click="editStu(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
		    		<el-button @click="delStu(scope.$index, scope.row)" type="text" size="small">删除</el-button>
		    		<el-button @click="disableStu(scope.$index, scope.row)" type="text" size="small">{{scope.row.status=='启用'?'禁用':'启用'}}</el-button>
		    		<el-button @click="showDetail(scope.$index, scope.row)" type="text" size="small">查看</el-button>
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
	<!--添加学员-->
	<el-dialog :title="dialogTitle" :visible.sync="dialogAddStudent" :close-on-click-modal ="false" @close = "closeDialog('addStudentFormRef')" class='dialogAdd'>
	  <el-form :model = "addStudentForm" :rules="rules" ref = "addStudentFormRef" label-width ="90px">
	  <el-row :gutter ="20">
	  	<el-form-item label="基本信息">
	      <!-- <el-input v-model="form.name"></el-input> -->
	    </el-form-item>
	   </el-row>
	   <el-row :gutter ="20">
		    <el-col :span = "11">
			    <el-form-item label="姓名" prop = "name">
			    	<span v-if = "showMode ==1">:</span>
			    	<el-input v-if = "showMode ==0" v-model="addStudentForm.name"></el-input>
			    	<span v-if = "showMode ==1" class="right">{{addStudentForm.name}}</span>
			    </el-form-item>
		    </el-col>
	    <el-col :span = "2"> &nbsp;</el-col>
	    <el-col :span = "11">
		    <el-form-item label="性别" prop = "sex" >
		    	<span v-if = "showMode ==1">:</span>
			    <el-radio-group v-if = "showMode ==0" v-model="addStudentForm.sex">
			      <el-radio :label="0">男</el-radio>
			      <el-radio :label="1">女</el-radio>
			    </el-radio-group>
			    <span v-if = "showMode ==1" class="right">{{addStudentForm.sex=='0'?'男':'女'}}</span>
		    </el-form-item>
	    </el-col>
	    </el-row>
	    <el-row :gutter ="20" class='elRowStyle'>
	    <el-col :span = "11">
		    <el-form-item label="手机号" prop = "mobile">
		    	<span v-if = "showMode ==1">:</span>
		    	<el-input v-if = "showMode ==0" v-model="addStudentForm.mobile"></el-input>
		    	<span v-if = "showMode ==1" class="right">{{addStudentForm.mobile}}</span>
		    </el-form-item>
	    </el-col>
	    <el-col :span = "2"> &nbsp;</el-col>
	    <el-col :span = "11">
		    <el-form-item label="出生年月" v-if = "showMode ==0" required>
		    	<span v-if = "showMode ==1">:</span>
		    	<el-col :span = "11" style = "padding:0px;margin-right:19px">
			    	<el-form-item prop = "addStuYear">
			    		<el-select v-if = "showMode ==0" v-model="addStudentForm.addStuYear" placeholder="请选择">
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
				 <el-col :span = "8" style = "padding:0px">
					 <el-form-item prop ="addStuMonth">
						 <el-select v-if = "showMode ==0" style = "width:100px" v-model="addStudentForm.addStuMonth"  placeholder="请选择">
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
		    <el-form-item label = "年龄" v-if = "showMode ==1" prop ="age" >
		    	<span v-if = "showMode ==1">:</span>
		    	<span class="right">{{(new Date().getFullYear()-addStudentForm.birthday.split('-')[0])+'岁'}}</span>
		    </el-form-item>
	    </el-col>
	    </el-row>
	    <el-row :gutter ="20">
	    <el-col :span = "11">
		    <el-form-item label="民族" prop = "nation">
		    	<span v-if = "showMode ==1">:</span>
			  <el-select v-if = "showMode ==0" v-model="addStudentForm.nation" style = "width:100%" placeholder="请选择">
			  		<el-option value=''>请选择</el-option>
				    <el-option
				      v-for="item in nationList"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
			  </el-select>
			   <!-- <el-input v-if = "showMode ==0" v-model="addStudentForm.nation"></el-input> -->
				<span v-if = "showMode ==1" class="right">{{addStudentForm.nationname}}</span>
		    </el-form-item>
	    </el-col>
	    <el-col :span = "2"> &nbsp;</el-col>
	    <el-col :span = "11">
	    	<el-form-item label = "邮箱" prop = "email">
	    		<span v-if = "showMode ==1">:</span>
	    		<el-input v-if = "showMode ==0" v-model="addStudentForm.email"></el-input>
				 <span v-if = "showMode ==1" class="right">{{addStudentForm.email}}</span>
	    	</el-form-item>
	    </el-col>
	    </el-row>
	    <el-row :gutter ="20">
	    <el-col :span = "11">
		    <el-form-item label="证件类型" prop = "cardType" >
		    	<span v-if = "showMode ==1">:</span>
			   <el-select v-if = "showMode ==0" v-model="addStudentForm.cardtype" style = "width:100%" placeholder="请选择">
			   		<el-option value=''>请选择</el-option>
				    <el-option
				      v-for="item in cardList"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
			   </el-select>
				<span v-if = "showMode ==1" class="right">{{addStudentForm.cardtypename}}</span>
		    </el-form-item>
	    </el-col>
	    <el-col :span = "2"> &nbsp;</el-col>
	    <el-col :span = "11">
	    	<el-form-item label = "证件号" prop = "cardnum">
	    		<span v-if = "showMode ==1">:</span>
	    		<el-input v-if = "showMode ==0" v-model="addStudentForm.cardnum"></el-input>
				 <span v-if = "showMode ==1" class="right">{{addStudentForm.cardnum}}</span>
	    	</el-form-item>
	    </el-col>
	    </el-row>
		<el-row :gutter ="20">
	    <el-col :span = "11">
		    <el-form-item label="培训专业" prop = "prof" >
		    	<span v-if = "showMode ==1">:</span>
			   <el-select v-if = "showMode ==0" v-model="addStudentForm.prof" style = "width:100%" placeholder="请选择">
			   		<el-option value=''>请选择</el-option>
				    <el-option
				      v-for="item in professionList"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
			   </el-select>
				<span v-if = "showMode ==1" class="right">{{addStudentForm.profname}}</span>
		    </el-form-item>
	    </el-col>
	    <el-col :span = "2"> &nbsp;</el-col>
	    <el-col :span = "11">
	    	<el-form-item label = "应届/往届" prop = "fresh">
	    		<span v-if = "showMode ==1">:</span>
	    		<el-radio-group v-if = "showMode ==0" v-model="addStudentForm.fresh">
			      <el-radio :label="0">应届</el-radio>
			      <el-radio :label="1">往届</el-radio>
			    </el-radio-group>
			    <span v-if = "showMode ==1" class="right">{{addStudentForm.fresh=='0'?'应届':'往届'}}</span>
	    	</el-form-item>
	    </el-col>
	    </el-row>
	    <el-row :gutter ="20">
	    <el-col :span = "11">
		    <el-form-item label="专业基地" prop = "base" >
		    	<span v-if = "showMode ==1">:</span>
			   <el-select v-if = "showMode ==0" v-model="addStudentForm.base" @change="initDeptInBaseList" style = "width:100%" placeholder="请选择">
			   		<el-option value=''>请选择</el-option>
				    <el-option
				      v-for="item in deptBaseList"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
			   </el-select>
				<span v-if = "showMode ==1" class="right">{{addStudentForm.basename}}</span>
		    </el-form-item>
	    </el-col>
	    <el-col :span = "2"> &nbsp;</el-col>
	    <el-col :span = "11">
	    	<el-form-item label = "科室" prop = "degree">
	    		<span v-if = "showMode ==1">:</span>
	    		<el-select v-if = "showMode ==0" v-model="addStudentForm.dept" style = "width:100%" placeholder="请选择">
	    			<el-option value=''>请选择</el-option>
				    <el-option
				      v-for="item in deptInBaseList"
				      :key="item&&item.id"
				      :label="item&&item.name"
				      :value="item&&item.id">
				    </el-option>
			   	</el-select>
				<span v-if = "showMode ==1" class="right">{{addStudentForm.deptname}}</span>
	    	</el-form-item>
	    </el-col>
	    </el-row>
	    <el-row :gutter ="20">
	    <el-col :span = "11">
		    <el-form-item label="培训年限核定" prop = "years" >
		    	<span v-if = "showMode ==1">:</span>
			   <el-select v-if = "showMode ==0" v-model="addStudentForm.years" style = "width:100%" placeholder="请选择">
			   		<el-option value=''>请选择</el-option>
				    <el-option
				      v-for="item in turnYearsList"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
			   </el-select>
				<span v-if = "showMode ==1" class="right">{{addStudentForm.yearsname}}</span>
		    </el-form-item>
	    </el-col>
	    <el-col :span = "2"> &nbsp;</el-col>
	    <el-col :span = "11">
	    	<el-form-item label = "实际培训开始时间" prop = "realbegintime">
	    		<span v-if = "showMode ==1">:</span>
	    		<el-date-picker
	    		v-if = "showMode ==0"
	    		style = "width:100%"
			      v-model="addStudentForm.realbegintime"
			      type="date"
			      placeholder="选择日期"
			      >
			    </el-date-picker>
				<span v-if = "showMode ==1" class="right">{{addStudentForm.realbegintime}}</span>
	    	</el-form-item>
	    </el-col>
	    </el-row>
	    <el-row :gutter ="20">
	    	<el-col :span = "11">
		    	<el-form-item label = "执业医师" prop = "practicing">
		    		<span v-if = "showMode ==1">:</span>
		    		<el-radio-group v-if = "showMode ==0" v-model="addStudentForm.practicing">
				      <el-radio :label="0">是</el-radio>
				      <el-radio :label="1">否</el-radio>
				    </el-radio-group>
				    <span v-if = "showMode ==1" class="right">{{addStudentForm.practicing=='0'?'是':'否'}}</span>
		    	</el-form-item>
	    	</el-col>
	    	<el-col :span = "2"> &nbsp;</el-col>
	    	<el-col :span = "11" v-if = "addStudentForm.practicing===0">
	    		<el-form-item label = "执业医师资格证号" prop = "qualificationnumber">
	    			<span v-if = "showMode ==1">:</span>
		    		<el-input v-if = "showMode ==0" v-model="addStudentForm.qualificationnumber"></el-input>
					 <span v-if = "showMode ==1" class="right">{{addStudentForm.qualificationnumber}}</span>
		    	</el-form-item>
	    	</el-col>
	    </el-row>
	    <el-row>
	     <el-row :gutter ="20">
	    <el-col :span = "8">
		    <el-form-item label="学员类型" prop = "type">
		    	<span v-if = "showMode ==1">:</span>
			   <el-select v-if = "showMode ==0" v-model="addStudentForm.type" style = "width:100%" placeholder="请选择">
			   		<el-option value=''>请选择</el-option>
				    <el-option
				      v-for="item in stuTypeList"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
			   </el-select>
				<span v-if = "showMode ==1" class="right">{{addStudentForm.typename}}</span>
		    </el-form-item>
	    </el-col>
	    <el-col :span = "8" v-if="addStudentForm.type==87"> 
			<el-form-item  label = "住陪导师" prop = "hospitaltutor">
				<span v-if = "showMode ==1">:</span>
	    		<el-input v-if = "showMode ==0" v-model="addStudentForm.hospitaltutor"></el-input>
			    <span v-if = "showMode ==1" class="right">{{addStudentForm.hospitaltutor}}</span>
	    	</el-form-item>
	    </el-col>
	    <el-col :span = "8" v-if="addStudentForm.type==88||addStudentForm.type==90">
	    	<el-form-item  label = "委托单位" prop = "entrustedunit">
	    		<span v-if = "showMode ==1">:</span>
	    		<el-input  v-if = "showMode == 0" v-model="addStudentForm.entrustedunit"></el-input>
			    <span v-if = "showMode ==1" class="right">{{addStudentForm.entrustedunit}}</span>
	    	</el-form-item>
	    </el-col>
	    <el-col :span = "8"  v-if="addStudentForm.type==85">
	    	<el-form-item  label = "硕士学位学科" prop = "discipline">
	    		<span v-if = "showMode ==1">:</span>
	    		<el-input v-if = "showMode == 0" v-model="addStudentForm.discipline"></el-input>
			    <span v-if = "showMode ==1" class="right">{{addStudentForm.discipline}}</span>
	    	</el-form-item>
	    </el-col>
	    <el-col :span = "8"  v-if="addStudentForm.type==85">
	    	<el-form-item  label = "导师" prop = "tutor">
	    		<span v-if = "showMode ==1">:</span>
	    		<el-input v-if = "showMode == 0" v-model="addStudentForm.tutor"></el-input>
			    <span v-if = "showMode ==1" class="right">{{addStudentForm.tutor}}</span>
	    	</el-form-item>
	    </el-col>
	    </el-row>
	    </el-row>
	    <el-row :gutter ="20">
	  	<el-form-item label="学历信息">
	  		<span v-if = "showMode ==1">:</span>
	    </el-form-item>
	   </el-row>
		<el-collapse v-model="activeNames" @change="">
			<el-collapse-item title="本科" name="1">
				<el-form-item style = "width:50%" label = "毕业院校" prop = "bachelorschool">
					<span v-if = "showMode ==1">:</span>
		    		<el-input v-if = "showMode == 0" v-model="addStudentForm.bachelorschool"></el-input>
				    <span v-if = "showMode ==1" class="right">{{addStudentForm.bachelorschool}}</span>
		    	</el-form-item>
		    	<el-form-item style = "width:50%"  label = "毕业年份" prop = "bachelorgraduate">
		    		<span v-if = "showMode ==1">:</span>
		    		<el-date-picker
		    			style = "width:100%"
		    			v-if = "showMode ==0"
					    v-model="addStudentForm.bachelorgraduate"
					    type="year"
					    placeholder="选择年">
					 </el-date-picker>
				    <span v-if = "showMode ==1" class="right">{{addStudentForm.bachelorgraduate}}</span>
		    	</el-form-item>
		    	<el-form-item style = "width:50%" label = "毕业专业" prop = "bachelormajor">
		    		<span v-if = "showMode ==1">:</span>
		    		<el-input v-if = "showMode == 0" v-model="addStudentForm.bachelormajor"></el-input>
				    <span v-if = "showMode ==1" class="right">{{addStudentForm.bachelormajor}}</span>
		    	</el-form-item>
		    	<el-form-item style = "width:50%" label = "学位" prop = "bachelordegree">
		    		<span v-if = "showMode ==1">:</span>
		    		<el-select v-if = "showMode ==0" v-model="addStudentForm.bachelordegree" style = "width:100%" placeholder="请选择">
		    			<el-option value=''>请选择</el-option>
					    <el-option
					      v-for="item in studentDegreeList"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					 </el-select>
					 <span v-if = "showMode ==1" class="right">{{addStudentForm.bachelordegreename}}</span>
			    </el-form-item>
			    <el-form-item style = "width:50%" label = "是否全科订单定向" prop = "directional">
			    	<span v-if = "showMode ==1">:</span>
					<el-radio-group v-if = "showMode ==0" v-model="addStudentForm.directional">
				      <el-radio :label="0">是</el-radio>
				      <el-radio :label="1">否</el-radio>
				    </el-radio-group>
				    <span v-if = "showMode ==1" class="right">{{addStudentForm.directional=='0'?'是':'否'}}</span>
			    </el-form-item>
			</el-collapse-item>
			<el-collapse-item title="硕士研究生" name="2">
				<span v-if = "showMode ==1">:</span>
				<el-form-item style = "width:50%" label = "毕业院校" prop = "masterschool">
					<span v-if = "showMode ==1">:</span>
		    		<el-input v-if = "showMode ==0" v-model="addStudentForm.masterschool"></el-input>
				    <span v-if = "showMode ==1" class="right">{{addStudentForm.masterschool}}</span>
		    	</el-form-item>
		    	<el-form-item style = "width:50%"  label = "毕业年份" prop = "mastergraduate">
		    		<span v-if = "showMode ==1">:</span>
		    		
		    		<el-date-picker
		    			style = "width:100%"
		    			v-if = "showMode ==0"
					    v-model="addStudentForm.mastergraduate"
					    type="year"
					    placeholder="选择年">
					 </el-date-picker>
				    <span v-if = "showMode ==1" class="right">{{addStudentForm.mastergraduate}}</span>
		    	</el-form-item>
		    	<el-form-item style = "width:50%" label = "毕业专业" prop = "mastermajor">
		    		<span v-if = "showMode ==1">:</span>
		    		<el-input v-if = "showMode ==0" v-model="addStudentForm.mastermajor"></el-input>
				    <span v-if = "showMode ==1" class="right">{{addStudentForm.mastermajor}}</span>
		    	</el-form-item>
		    	<el-form-item style = "width:50%" label = "学位" prop = "masterdegree">
		    		<span v-if = "showMode ==1">:</span>
		    		<el-select v-if = "showMode ==0" v-model="addStudentForm.masterdegree" style = "width:100%" placeholder="请选择">
		    			<el-option value=''>请选择</el-option>
					    <el-option
					      v-for="item in studentDegreeList"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					 </el-select>
					 <span v-if = "showMode ==1" class="right">{{addStudentForm.masterdegreename}}</span>
			    </el-form-item>
			</el-collapse-item>
			<el-collapse-item title="博士研究生" name="3">
				<span v-if = "showMode ==1">:</span>
				<el-form-item style = "width:50%" label = "毕业院校" prop = "doctorschool">
					<span v-if = "showMode ==1">:</span>
		    		<el-input v-if = "showMode ==0" v-model="addStudentForm.doctorschool"></el-input>
				    <span v-if = "showMode ==1" class="right">{{addStudentForm.doctorschool}}</span>
		    	</el-form-item>
		    	<el-form-item style = "width:50%"  label = "毕业年份" prop = "doctorgraduate">
		    		<span v-if = "showMode ==1">:</span>
		    		<el-date-picker
		    			style = "width:100%"
		    			v-if = "showMode ==0"
					    v-model="addStudentForm.doctorgraduate"
					    type="year"
					    placeholder="选择年">
					 </el-date-picker>
				    <span v-if = "showMode ==1" class="right">{{addStudentForm.doctorgraduate}}</span>
		    	</el-form-item>
		    	<el-form-item style = "width:50%" label = "毕业专业" prop = "doctormajor">
		    		<span v-if = "showMode ==1">:</span>
		    		<el-input v-if = "showMode ==0" v-model="addStudentForm.doctormajor"></el-input>
				    <span v-if = "showMode ==1" class="right">{{addStudentForm.doctormajor}}</span>
		    	</el-form-item>
		    	<el-form-item style = "width:50%" label = "学位" prop = "doctordegree">
		    		<span v-if = "showMode ==1">:</span>
		    		<el-select v-if = "showMode ==0" v-model="addStudentForm.doctordegree" style = "width:100%" placeholder="请选择">
		    			<el-option value=''>请选择</el-option>
					    <el-option
					      v-for="item in studentDegreeList"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					 </el-select>
					 <span v-if = "showMode ==1" class="right">{{addStudentForm.doctordegreename}}</span>
			    </el-form-item>
			</el-collapse-item>
		</el-collapse>
		<el-row :gutter ="20">
	  	<el-form-item label="单位信息">
	  		<span v-if = "showMode ==1">:</span>
	    </el-form-item>
	   </el-row>
	   <el-form-item style = "width:50%" label-width = "140px" label = "工作单位" prop = "workunit">
	   	<span v-if = "showMode ==1">:</span>
    		<el-input v-if = "showMode ==0" v-model="addStudentForm.workunit"></el-input>
		    <span v-if = "showMode ==1" class="right">{{addStudentForm.workunit}}</span>
    	</el-form-item>
    	<el-form-item style = "width:50%" label-width = "140px" label = "医疗卫生机构" prop = "medicalunit">
    		<span v-if = "showMode ==1">:</span>
    		<el-select v-if = "showMode ==0" v-model="addStudentForm.medicalunit" style = "width:100%" placeholder="请选择">
    			<el-option value=''>请选择</el-option>
			    <el-option
			      v-for="item in medicalList"
			      :key="item.id"
			      :label="item.name"
			      :value="item.id">
			    </el-option>
			</el-select>
			<span v-if = "showMode ==1" class="right">{{addStudentForm.medicalunitname}}</span>
    	</el-form-item>
    	<el-form-item v-if = "addStudentForm.medicalunit ==149" style = "width:50%" label-width = "140px"  label = "基层医疗卫生机构" prop = "primarymedical">
    		<span v-if = "showMode ==1">:</span>
    		<el-select v-if = "showMode ==0" v-model="addStudentForm.primarymedical" style = "width:100%" placeholder="请选择">
    			<el-option value=''>请选择</el-option>
			    <el-option
			      v-for="item in primaryMedicalList"
			      :key="item.id"
			      :label="item.name"
			      :value="item.id">
			    </el-option>
			</el-select>
			<span v-if = "showMode ==1" class="right">{{addStudentForm.primarymedicalname}}</span>
    	</el-form-item>
    	<el-form-item v-if = "addStudentForm.medicalunit ==148" style = "width:50%" label-width = "140px" label = "医院属性" prop = "hospitalattributes">
    		<span v-if = "showMode ==1">:</span>
    		<el-select v-if = "showMode ==0" v-model="addStudentForm.hospitalattributes" style = "width:100%" placeholder="请选择">
    			<el-option value=''>请选择</el-option>
			    <el-option
			      v-for="item in hospitalAttributesList"
			      :key="item.id"
			      :label="item.name"
			      :value="item.id">
			    </el-option>
			</el-select>
			<span v-if = "showMode ==1" class="right">{{addStudentForm.hospitalattributesname}}</span>
    	</el-form-item>
    	<el-form-item v-if = "addStudentForm.medicalunit ==148" style = "width:50%" label-width = "140px" label = "医院类别" prop = "hospitalcategory">
    		<span v-if = "showMode ==1">:</span>
    		<el-select v-if = "showMode ==0" v-model="addStudentForm.hospitalcategory" style = "width:100%" placeholder="请选择">
    		<el-option value=''>请选择</el-option>
			    <el-option
			      v-for="item in hospitalCategoryList"
			      :key="item.id"
			      :label="item.name"
			      :value="item.id">
			    </el-option>
			</el-select>
			<span v-if = "showMode ==1" class="right">{{addStudentForm.hospitalcategoryname}}</span>
    	</el-form-item>
    	<el-form-item v-if = "addStudentForm.medicalunit ==148" style = "width:50%" label-width = "140px" label = "医院性质" prop = "hospitalnature">
    		<span v-if = "showMode ==1">:</span>
    		<el-select v-if = "showMode ==0" v-model="addStudentForm.hospitalnature" style = "width:100%" placeholder="请选择">
			    <el-option value=''>请选择</el-option>
			    <el-option
			      v-for="item in hospitalList"
			      :key="item.id"
			      :label="item.name"
			      :value="item.id">
			    </el-option>
			</el-select>
			<span v-if = "showMode ==1" class="right">{{addStudentForm.hospitalnaturename}}</span>
    	</el-form-item>
    	<el-form-item label-width = "140px" label = "是否在协同单位培训" prop = "cooperative">
    		<span v-if = "showMode ==1">:</span>
    		<el-radio-group v-if = "showMode ==0" v-model="addStudentForm.cooperative">
		      <el-radio :label="0">是</el-radio>
		      <el-radio :label="1">否</el-radio>
		    </el-radio-group>
		    <span v-if = "showMode ==1" class="right">{{addStudentForm.cooperative===null?'':(addStudentForm.cooperative=='0'?'是':'否')}}</span>
    	</el-form-item>
    	<el-form-item v-if="addStudentForm.cooperative===0" style = "width:50%" label-width = "140px" label = "协同单位" prop = "cooperativeunit">
    		<span v-if = "showMode ==1">:</span>
			<el-input v-if = "showMode ==0" v-model="addStudentForm.cooperativeunit"></el-input>
			<span v-if = "showMode ==1" class="right">{{addStudentForm.cooperativeunit}}</span>
    	</el-form-item>
    	<el-form-item v-if="addStudentForm.cooperative===0" style = "width:50%" label-width = "140px" label = "协同单位性质" prop = "cooperativenature">
    		<el-select v-if = "showMode ==0" v-model="addStudentForm.cooperativenature" style = "width:100%" placeholder="请选择">
    			<el-option value=''>请选择</el-option>
			    <el-option
			      v-for="item in hospitalList"
			      :key="item.id"
			      :label="item.name"
			      :value="item.id">
			    </el-option>
			</el-select>
			<span v-if = "showMode ==1" class="right">{{addStudentForm.cooperativenaturename}}</span>
    	</el-form-item>
    	<el-form-item label-width = "140px" style = "width:50%" label = "第一年考核" prop = "first">
    		<span v-if = "showMode ==1">:</span>
    		<el-input v-if = "showMode ==0" v-model="addStudentForm.first"></el-input>
		    <span v-if = "showMode ==1">{{addStudentForm.first}}</span>
    	</el-form-item>
    	<el-form-item label-width = "140px" style = "width:50%" label = "第二年考核" prop = "second">
    		<span v-if = "showMode ==1">:</span>
    		<el-input v-if = "showMode ==0" v-model="addStudentForm.second"></el-input>
		    <span v-if = "showMode ==1">{{addStudentForm.second}}</span>
    	</el-form-item>
    	<el-form-item label-width = "140px" style = "width:50%" label = "第三年综合考评" prop = "third">
    		<span v-if = "showMode ==1">:</span>
    		<el-input v-if = "showMode ==0" v-model="addStudentForm.third"></el-input>
		    <span v-if = "showMode ==1">{{addStudentForm.third}}</span>
    	</el-form-item>
	    <el-row :gutter= "20" v-if="showMode==0" class='footerBtn'>
	    	<el-button type = "primary" @click = "handleSubmitAdd('addStudentFormRef')" class = "bottomBtnsSure">保存</el-button>
	    	<el-button  @click = "closeAddStuDialog" class = "bottomBtns">取消</el-button>
	    </el-row>
	  </el-form>
	</el-dialog>

	<el-dialog title="禁用原因说明" size = "tiny" :visible.sync="dialogDisableStudent" :close-on-click-modal ="false" @close = "closeDialogDisable">
		<el-input
		  type="textarea"
		  :rows="4"
		  placeholder="请输入禁用原因"
		  v-model="disableReason">
		</el-input>
		<el-row :gutter= "20" >
	    	<el-button type = "primary" @click = "handleSubmitDisable('disableStuFormRef')" style="margin-left:67%" class = "bottomBtnsSure">确认</el-button>
	    	<el-button  @click = "handleCancelDisable" class = "bottomBtns">取消</el-button>
	    </el-row>
	</el-dialog>
	<el-dialog title="禁用原因说明" size = "tiny" :visible.sync="dialogDisableReason" @close = "closeDialogDisable">
		<span>
			{{disableReason}}
		</span>
	</el-dialog>
	<!--批量导入-->
	<el-dialog title="" :visible.sync="dialogTableVisible" >
	  <div class = "import-popup">
	  	<div>
	  	<span class = "tip-circle">1</span><span>下载学生通讯录模板，批量填写学生信息</span><span><el-button type = "primary" class= "import-popup-btn" @click ="downloadModel">下载</el-button></span></div>

	  	<div>
	  		<div>
	  		<span class = "tip-circle">2</span><span>上传填写好的学生信息表</span>
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
</div>
</template>
<script>
	import {post,getCookie,setTitle,exportMouldExcel,exportExcel} from '../config/util'
	import {mapState,mapActions} from 'vuex'
	import moment from 'moment'
	export default {
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
		    var checkEmail =  (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请输入邮箱'));
		        } else if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))) {
		          callback(new Error('请输入正确的邮箱!'));
		        } else {
		          callback();
		        }
		    };
		    var checkCard =  (rule, value, callback) => {
		    	//护照校验正则
		    	var re1 = /^[a-zA-Z]{5,17}$/;
        		var re2 = /^[a-zA-Z0-9]{5,17}$/;
		        if (value === '') {
		          callback(new Error('请输入证件号'));
		        } else if (this.addStudentForm.cardtype==71) {
		        	if(!(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(value))){
		        		callback(new Error('请输入正确的身份证号!'));
		        	}else{
		        		callback();
		        	}
		          
		        } else if(this.addStudentForm.cardtype==72){
		          if(re1.test(value)||re2.test(value)){
		          	callback();
		          }else{
		          	callback(new Error('请输入正确的护照号!'));
		          }
		        }else{
		        	callback();
		        }
		    };
		    var checkYear =  (rule, value, callback) => {
		        if (this.addStudentForm.addStuYear == '') {
		          callback(new Error('请选择年份'));
		        } else {
		          callback();
		        }
		    };
		    var checkMonth =  (rule, value, callback) => {
		        if (this.addStudentForm.addStuMonth == '') {
		          callback(new Error('请选择月份'));
		        } else {
		          callback();
		        }
		    };
		    var checkNation =  (rule, value, callback) => {
		        if (this.addStudentForm.nation == '') {
		          callback(new Error('请选择民族'));
		        } else {
		          callback();
		        }
		    };
		    var checkCardType =  (rule, value, callback) => {
		        if (this.addStudentForm.cardtype == '') {
		          callback(new Error('请选择证件类型'));
		        } else {
		          callback();
		        }
		    };
		    var checkProf=  (rule, value, callback) => {
		        if (this.addStudentForm.prof == '') {
		          callback(new Error('请选择培训专业'));
		        } else {
		          callback();
		        }
		    };
		    var checkBase=  (rule, value, callback) => {
		        if (this.addStudentForm.base == '') {
		          callback(new Error('请选择专业基地'));
		        } else {
		          callback();
		        }
		    };
		    var checkYears=  (rule, value, callback) => {
		        if (this.addStudentForm.years == '') {
		          callback(new Error('请选择培训年限'));
		        } else {
		          callback();
		        }
		    };
		    var checkType=  (rule, value, callback) => {
		        if (this.addStudentForm.type == '') {
		          callback(new Error('请选择学员类型'));
		        } else {
		          callback();
		        }
		    };
			return {
				showMode:0,
				exportInput:false,
				studentList:[],
				deptInBaseList:[],
				activeNames:['1'],
				dialogTitle:'',
				dialogAddStudent:false,
				dialogDisableStudent:false,
				dialogDisableReason:false,
				dialogTableVisible:false,
				showMode:0,
				addStudentForm:{name:'',sex:'',mobile:'',addStuMonth:'',addStuYear:'',nation:'',cardnum:'',cardtype:'',base:'',prof:'',years:'',type:'',email:'',fresh:'',dept:'',realbegintime:'',practicing:'',qualificationnumber:'',hospitaltutor:'',entrustedunit:'',discipline:'',tutor:'',bachelorschool:'',bachelorgraduate:'',bachelormajor:'',bachelordegree:'',directional:'',masterschool:'',mastergraduate:'',mastermajor:'',masterdegree:'',doctorschool:'',doctorgraduate:'',doctormajor:'',doctordegree:'',workunit:'',medicalunit:'',primarymedical:'',hospitalattributes:'',hospitalcategory:'',hospitalnature:'',cooperative:'',cooperativeunit:'',cooperativenature:'',first:'',second:'',third:''},//sex:'', stutype:'',degree:'',practicing:''
				selectedItems:[],
				queryForm:{plan_id:'',prof_id:'',type_id:'',status:''},
				page:1,
				reqnum:20,
				totalCount:0,
				input:'',
				disableStuObj:'',
				disableReason:'',
				fileList:[],
			  uploadData:{
						_upload_data: JSON.stringify({"1": {
						command: 'student/add',
						sessionid: getCookie('sid'),
						loginid: getCookie('uid'),
				  }})
			  },
				rules: {
				          name: [
				            { required: true, message: '请输入姓名', trigger: 'blur' },
				          ],
				          sex: [
				          	{required: true,message: '请选择性别',}
				          ],
				          age:[{required:true}],
				          mobile: [{ validator:checkMobile,required: true, trigger: 'blur'}],
				          addStuYear:[{ required: true,message:'请选择年份', trigger: 'change'}],
				          addStuMonth:[{ required: true,validator:checkMonth, trigger: 'change'}],
				          nation:[{required:true,validator:checkNation,trigger:'change'}],
				          email:[{required: true,validator:checkEmail,trigger:'blur'}],
				          cardType:[{required:true,validator:checkCardType,trigger:'change'}],
				          cardnum:[{required: true,validator:checkCard,trigger:'blur'}],
				          prof:[{required:true,validator:checkProf,trigger:'change'}],
				          fresh:[{required:true,message:'请选择应届/往届'}],
				          base:[{required:true,validator:checkBase,trigger:'change'}],
				          practicing:[{required:true,message:'请选择是否是执业医师'}],
				          qualificationnumber:[{required:true,message:'执业医师资格证号不能为空',trigger:'blur'}],
				          years:[{required:true,validator:checkYears,trigger:'change'}],
				          type:[{required:true,validator:checkType,trigger:'change'}],
				},
			}
		},
		computed:{
			...mapState(['stuTypeList','studentDegreeList','cardList','professionList','deptBaseList','turnYearsList','nationList','gradeList','medicalList','hospitalAttributesList','hospitalCategoryList','primaryMedicalList','hospitalList','deptList']),
			yearList(){
				let years = [];

				for(let i=new Date().getFullYear()-80;i<new Date().getFullYear()-14;i++){
					years.push(i+'');
				}
				return years;

			}
		},
		methods:{
			...mapActions(['initGradeList','initOptionList']),
			// 下载
			downloadModel(){
				    	let data ={
							sessionid: getCookie('sid'),
							loginid: getCookie('uid'),
							
							command: "student/stumould",
						};
						exportMouldExcel(data);
			},
			changeFile(file,list){
				    	
		    	if(list.length>1){
		    		list.shift();
		    	}
		    	
		    },
		    submitUpload(){
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
		    uploadSuccess(res){
		    	if(res.errcode==0){
		    		this.$message({
			    		type:'success',
			    		message:'上传成功'
			    	});
		    	}else{
		    		this.$msgbox({
				        title: '错误提示',
				        message: this.$createElement('p', null, res.errdesc),
				        type:'error',
				        confirmButtonText: '确定',
				    });
		    	}
		    	
		    	this.$refs.upload.clearFiles();
		    	this.dialogTableVisible=false;
		    	this.$loading().close();
		    },
		    onProgress(){
		    	//this.loading=true;
		    	// console.log("aaaaaaa");
		    	this.$loading();
		    },
		    exportData(){
		    	if(this.selectedItems.length===0){
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
						uids:this.selectedItems.join(','),
						command: "student/export",
					};
		    	exportExcel(data);
			},
			openAddStu(){
				this.addStudentForm = {name:'',sex:'',mobile:'',addStuMonth:'',addStuYear:'',nation:'',cardnum:'',cardtype:'',base:'',prof:'',years:'',type:'',email:'',fresh:'',dept:'',realbegintime:'',practicing:'',qualificationnumber:'',hospitaltutor:'',entrustedunit:'',discipline:'',tutor:'',bachelorschool:'',bachelorgraduate:'',bachelormajor:'',bachelordegree:'',directional:'',masterschool:'',mastergraduate:'',mastermajor:'',masterdegree:'',doctorschool:'',doctorgraduate:'',doctormajor:'',doctordegree:'',workunit:'',medicalunit:'',primarymedical:'',hospitalattributes:'',hospitalcategory:'',hospitalnature:'',cooperative:'',cooperativeunit:'',cooperativenature:'',first:'',second:'',third:''};
				this.dialogTitle='新增学员';
				this.dialogAddStudent = true;
				this.showMode=0;
			},
			handleSubmitAdd(form){
				if(this.showMode==1){
					this.closeAddStuDialog();
					return;
				}
				this.$refs[form].validate((valid) => {
					// console.log(this.addStudentForm)
				    if (valid) {
				    	let self = this;
						let option ={...this.addStudentForm};
						option.birthday = option.addStuYear+'-'+option.addStuMonth+'-01';
						delete option.addStuYear;
						delete option.addStuMonth;
						//最高  学历
						option.degree = (option.bachelordegree<option.masterdegree?option.masterdegree:option.bachelordegree)<option.doctordegree?option.doctordegree:(option.bachelordegree<option.masterdegree?option.masterdegree:option.bachelordegree);
						for(let key in option){
							if(option[key]===''||option[key]===null){
								delete option[key];
								continue;
							}
							key==='practicing'&&option[key]=='1'&& delete option['qualificationnumber'];
							if(key==='type'){
								if(option[key]=='87'){
									delete option.entrustedunit;
									delete option.discipline;
									delete option.tutor;
								}
								if(option[key]=='88'||option[key]=='90'){
									delete option.hospitaltutor;
									delete option.discipline;
									delete option.tutor;
								}
								if(option[key]=='85'){
									delete option.hospitaltutor;
									delete option.entrustedunit;
								}
							}
							if(key==='medicalunit'){
								if(option[key]=='149'){
									delete option.hospitalattributes;
									delete option.hospitalcategory;
									delete option.hospitalnature;
								}else if(option[key]=='148'){
									delete option.primarymedical;
								}else{
									delete option.hospitalattributes;
									delete option.hospitalcategory;
									delete option.hospitalnature;
									delete option.primarymedical;
								}
							}
							if(key = "cooperative"){
								if(option[key]=='1'){
									delete option.cooperativeunit;
									delete option.cooperativenature;
								}
							}
						}
						option.realbegintime && (option.realbegintime = moment(option.realbegintime).format('YYYY-MM-DD'));
						option.bachelorgraduate && (option.bachelorgraduate = moment(option.bachelorgraduate).format('YYYY'));
						option.mastergraduate && (option.mastergraduate = moment(option.mastergraduate).format('YYYY'));
						option.doctorgraduate && (option.doctorgraduate = moment(option.doctorgraduate).format('YYYY'));

						if(option.id){
							delete option.nationname;
							delete option.cardtypename;
							delete option.profname;
							delete option.basename;
							delete option.deptname;
							delete option.yearsname;
							delete option.typename;
							delete option.bachelordegreename;
							delete option.masterdegreename;
							delete option.doctordegreename;
							delete option.medicalunitname;
							delete option.primarymedicalname;
							delete option.hospitalattributesname;
							delete option.hospitalcategoryname;
							delete option.hospitalnaturename;
							delete option.cooperativenaturename;
							post('/student/edit',{
								command:'student/edit',
								sessionid:getCookie('sid'),
								loginid:getCookie('uid'),
								...option
							}).done((data)=>{
								if(data&&data.errcode==0){
									self.$message({
										type:'success',
										message:'修改成功！'
									});
									self.dialogAddStudent=false;
									if(self.exportInput){
										self.doInputQuery(self.page);
									}else{
										self.doSelectQuery(self.page);
									}
								}else if(data&&data.errcode==2703){
									self.$message({
										type:'error',
										message:'手机号已存在！'
									})
								}else if(data&&data.errdesc){
									self.$message({
										type:'error',
										message:data.errdesc,
									})
								}else{
									self.$message({
										type:'error',
										message:'修改失败！'
									})
								}
							}).fail(()=>{
								self.$message({
									type:'error',
									message:'修改失败！'
								})
							})
						}else{
							post('/student/add',{
								command:'student/add',
								sessionid:getCookie('sid'),
								loginid:getCookie('uid'),
								studentlist:[option],
							}).done((data)=>{
								if(data&&data.errcode==0){
									self.$message({
										type:'success',
										message:'新增成功！'
									});
									self.dialogAddStudent=false;
									if(self.exportInput){
										self.doInputQuery(self.page);
									}else{
										self.doSelectQuery(self.page);
									}
								}else if(data&&data.errcode==2703){
									self.$message({
										type:'error',
										message:'手机号已存在！'
									})
								}else if(data&&data.errdesc){
									self.$message({
										type:'error',
										message:data.errdesc,
									})
								}else{
									self.$message({
										type:'error',
										message:'新增失败！'
									})
								}
							}).fail(()=>{
								self.$message({
									type:'error',
									message:'新增失败！'
								})
							})
						}
						
				    }
				});
			},
			editStu(index,row){
				let self = this;
				self.dialogTitle = '编辑学员';
				self.dialogAddStudent =true;
				self.showMode=0;
				post('/student/detail',{
					command:'student/detail',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					id:row.stud_id
				}).done((data)=>{
					if(data&&data.errcode==0){
						self.addStudentForm = data.student;
						self.addStudentForm.addStuYear = self.addStudentForm.birthday.split('-')[0];
						self.addStudentForm.addStuMonth = self.addStudentForm.birthday.split('-')[1];
					}
				})

			},
			handleSubmitDisable(){
				let self = this;
				post('/student/updatestatus',{
					command:'student/updatestatus',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					id:this.disableStuObj.stud_id,
					status:1,
					reason:this.disableReason
				}).done((data)=>{
					if(data&&data.errcode==0){
						self.$message({
							type:'success',
							message:'禁用成功！'
						});
						self.dialogDisableStudent = false;
						if(self.input==''){
							self.doSelectQuery();
						}else{
							self.doInputQuery();
						}
					}else{
						self.$message({
							type:'error',
							message:'禁用失败！'
						});
					}
				}).fail(()=>{
					self.$message({
						type:'error',
						message:'禁用失败！'
					});
				})
			},
			openReasonDialog(reason){
				this.dialogDisableReason= true;
				this.disableReason = reason;
			},
			initDeptInBaseList(){
				let self = this;
				post('/turn/queryDeptList',{
					command: 'turn/queryDeptList',
		            sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					base_id:this.addStudentForm.base
				}).done((data)=>{
					if(data&&data.errcode==0){
						self.deptInBaseList = data.dept_list;
					}
				})
			},
			handleCancelDisable(){
				this.dialogDisableStudent= false;
			},
			closeDialogDisable(){
				this.disableReason = '';
			},
			showDetail(index,row){
				let self = this;
				self.dialogTitle= '学员详情';
				self.dialogAddStudent =true;
				self.showMode=1;
				post('/student/detail',{
					command:'student/detail',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					id:row.stud_id
				}).done((data)=>{
					if(data&&data.errcode==0){
						self.addStudentForm = data.student;
					}
				})
			},
			closeAddStuDialog(){
				this.dialogAddStudent = false;
			},
			closeDialog(formName) {
				this.activeNames=['1'];
		        this.$refs[formName].resetFields();
		    },
			handleSelectionChange(list){
				console.log(list)
				this.selectedItems = list.map((item)=>{
					return item.stud_id;
				});
			},
			delStudents(){
				if(this.selectedItems.length===0){
					this.$message({
			          showClose: true,
			          message: '请先勾选删除项！',
			          type: 'warning'
			        });
					return;
				}
				this.doDeleteStu(this.selectedItems.join(','));
			},
			delStu(index,row){
				this.doDeleteStu(row.stud_id);
			},
			doDeleteStu(ids){
				let self = this;
				this.$confirm('是否要删除选中的学生?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	post('/student/delete',{
						command:'student/delete',
						sessionid:getCookie('sid'),
						loginid:getCookie('uid'),
						uids:ids
					}).done((data)=>{
						if(data&&data.errcode==0){
							self.$message({
								type:'success',
								message:'删除成功！'
							});
							if(self.input!=''){
								self.doInputQuery();
							}else{
								self.doSelectQuery();
							}
							
						}else{
							self.$message({
								type:'error',
								message:data.errdesc,
							});
						}
					}).fail(()=>{
						self.$message({
							type:'error',
							message:'删除失败！'
						});
					})
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
				
			},
			queryAll(){
				this.queryForm = {plan_id:-1,prof_id:-1,type_id:-1,status:-1};
				this.doSelectQuery();
			},
			doSelectQuery(page){
				let option = {...this.queryForm};
				(option.plan_id == -1 || option.plan_id=='') && delete option.plan_id;
				(option.prof_id == -1 || option.prof_id=='') && delete option.prof_id;
				(option.type_id == -1 || option.type_id=='') && delete option.type_id;
				(option.status == -1 || option.status=='') && delete option.status;
				page &&(option.page = page);
				this.input ='';
				this.queryStudents(option);
				this.exportInput = false;
			},
			doInputQuery(page){
				this.queryForm = {plan_id:-1,prof_id:-1,type_id:-1,status:-1};
				let option = {search_info:this.input};
				page && (option.page=page) ;
				this.queryStudents(option);
				this.exportInput = true;
			},
			queryStudents(option){
				let self = this;
				post('/student/queryStudentList',{
					command:'student/queryStudentList',
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					
					reqnum:this.reqnum,
					...option,
				}).done((data)=>{
					if(data&&data.errcode==0){
						self.studentList = data.stud_list;
						self.totalCount = data.count;
					}
				})
			},
			handleSizeChange(size){
				this.reqnum = size;
				if(this.exportInput){
					this.doInputQuery();
				}else{
					this.doSelectQuery();
				}
			},
			handleCurrentChange(currentPage){
				this.page = currentPage;
				if(this.exportInput){
					this.doInputQuery(this.page);
				}else{
					this.doSelectQuery(this.page);
				}
			},

			disableStu(index,row){
				this.disableStuObj=  row;
				if(row.status!=='启用'){
					let self = this;
					post('/student/updatestatus',{
						command:'student/updatestatus',
						sessionid:getCookie('sid'),
						loginid:getCookie('uid'),
						id:this.disableStuObj.stud_id,
						status:0,
					}).done((data)=>{
						if(data&&data.errcode==0){
							self.$message({
								type:'success',
								message:'启用成功！'
							});
							self.dialogDisableStudent = false;
							if(self.exportInput){
								self.doInputQuery();
								
							}else{
								self.doSelectQuery();
							}
						}else{
							self.$message({
								type:'error',
								message:'启用失败！'
							});
						}
					}).fail(()=>{
						self.$message({
							type:'error',
							message:'启用失败！'
						});
					})
				}else{
					this.dialogDisableStudent = true;
				}
				

			}
		},
		mounted(){
			this.initGradeList();
			this.queryStudents({});
			this.initOptionList({type:'medical',mutation:'initMedicalList'});
			this.initOptionList({type:'hospitalAttributes',mutation:'initHospitalAttributesList'});
			this.initOptionList({type:'hospitalCategory',mutation:'initHospitalCategoryList'});
			this.initOptionList({type:'primarymedical',mutation:'initPrimaryMedicalList'});
			this.initOptionList({type:'hospital',mutation:'initHospitalList'});
		}
	}
</script>
<style >
	.tools{
		height: 50px;
	}
	.funcTools{
		float: left;
	}
	.search{
		float:right;
	}
	.queryTools{
		float:left;
		width: 865px;
	}
	.queryAll{
		float: left;
		margin-right: 12px;
	}
	.queryTools .el-form-item {
		width: 190px;
		margin-bottom: 10px;
	}
	.funcBtns{
		width: 80px;
		float: left;
	}
	.el-select{
		width:120px;
	}
	.import-popup{
		font-size: 20px;
	}
	.footerBtn{
		display: flex;
		justify-content: flex-end;
		align-items: center;
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
	.right{
		margin-left: 10px;
	}
	.elRowStyle{
		overflow-x: hidden;
	}
</style>