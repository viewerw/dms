<template>
  <div class="wapper">
    <div class="page-title">
      角色管理
    </div>

    <!---->
    <div class="tools">
      <div class="funcTools">
        <el-button type="primary" @click="addrole">新增角色</el-button>
        <el-button type="primary" @click="largeDelete">批量删除</el-button>
      </div>
      <div class="search">
        <div class="search-input" style="float:left">
          <el-input style="width:200px" v-model="searchName" placeholder="请输入角色名称搜索"></el-input>
        </div>
        <div class="search-btn" style="float:left;margin-left:10px">
          <el-button type="primary" @click='search'>搜索</el-button>
        </div>
      </div>
    </div>

    <!---->
    <div class="dataTable">
      <el-table ref="detailTable" :data="roleDatas" border tooltip-effect="dark" style="width: 100%" @selection-change="changeDelRoles">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="65"></el-table-column>
        <el-table-column prop="name" width="100" label="角色名称"></el-table-column>
        <el-table-column prop="roledesc" width="400" label="描述"></el-table-column>
        <el-table-column prop="createdBy" width="100" label="创建人"></el-table-column>
        <el-table-column prop="createdAt" width="120" label="创建时间"></el-table-column>
        <el-table-column prop="statu" width="100" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button @click="editRole(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="disableRole(scope.$index, scope.row)" type="text" size="small" v-if='scope.row.status == "0"'>启用</el-button>
            <el-button @click="disableRole(scope.$index, scope.row)" type="text" size="small" v-if='scope.row.status == "1"'>禁用</el-button>
            <el-button @click="delRole(scope.$index, scope.row)" type="text" size="small">删除</el-button>
            <el-button @click="showBinded(scope.$index, scope.row)" type="text" size="small">已绑用户</el-button>
            <el-button v-if="scope.row.id!=9&&scope.row.id!=8" @click="bindUser(scope.$index, scope.row)" type="text" size="small">绑定用户</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <!--新增角色弹出框-->
    <el-dialog :title="addeidt" :visible.sync="dialogRoleDetail">
      <!-- <div class = "dialogTitle">
			新增角色
		</div> -->
      <el-form :model="showRole" ref="showRoleForm" label-width="150px">
        <div class="formItem">
          <el-form-item label="角色名称（必填）" prop="name">
            <el-input v-model="showRole.rolename" :disabled='disabledid.indexOf(showRole.id) > -1' v-if='disabledid.indexOf(showRole.id) > -1'></el-input>
            <el-input v-model="showRole.rolename" v-else></el-input>
          </el-form-item>
        </div>
        <div class="formItem">
          <el-form-item label="角色描述（必填）" prop="name">
            <el-input v-model="showRole.roledesc"></el-input>
          </el-form-item>
        </div>
        <div class="formItem">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="showRole.status">
              <el-radio label="1">开启</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="diffTabs">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="APP" name="first">
              <div class="appControl">
                <div class="conHeader">
                  管理功能菜单列表
                </div>
                <div class="conBody">
                  <el-tree :data="appMenuList" show-checkbox node-key="id" ref="appTree" :default-expanded-keys="[]" :default-checked-keys="appCheckList"
                    :props="appDefaultProps">
                  </el-tree>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="医院轮转管理系统" name="second">
              <div class="appControl">
                <div class="conHeader">
                  管理功能菜单列表
                </div>
                <div class="conBody">
                  <el-tree :data="menuList" show-checkbox node-key="id" ref="pcTree" :default-expanded-keys="[]" :default-checked-keys="menuCheckList"
                    :props="defaultProps">
                  </el-tree>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div>
          <el-button type="primary" @click="handleSubmitAddRole" class="bottomBtnsSure">确认</el-button>
          <el-button @click="dialogRoleDetail = false" class="bottomBtns">取消</el-button>
        </div>
      </el-form>
    </el-dialog>

<!--查看已绑用户和解绑弹框-->
  <el-dialog title="已绑用户" :visible.sync="dialogBindedUsers" @close="closeUnbindDialog">
  <div style ="margin-bottom:10px">
    <el-button type = "primary" @click="unbindUsers" >批量解绑</el-button>
      <div class="search">
        <div class="search-input" style="float:left">
          <el-input style="width:200px" v-model="unbindInput" placeholder="请输入姓名或手机号搜索"></el-input>
        </div>
        <div class="search-btn" style="float:left;margin-left:10px">
          <el-button type="primary" @click="queryBindUsers">搜索</el-button>
        </div>
      </div>
  </div>    
    <el-table ref="unbindTable" :data="bindedDatas" border tooltip-effect="dark" style="width: 100%" @selection-change="changeUnbindUsers">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="65"></el-table-column>
        <el-table-column prop="name" width="200" label="姓名"></el-table-column>
        <el-table-column prop="mobile" width="200" label="手机号"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope" >
            <el-button type = "text"  size="small" @click = "unbindUser(scope.$index,scope.row)">解绑</el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination style="float:right;" @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="pagenum" :page-sizes="[10, 20,50, 100]" :page-size="pagepersize" layout="total, sizes, prev, pager, next" :total="totalCount1">
        </el-pagination>
  </el-dialog>
    <!-- 绑定用户弹出框-->
    <el-dialog :title="roleName" custom-class="dialogClass" size="large" :visible.sync="dialogUserBinding" @close="closeBindDialog">
      <el-row>
        <el-col :span="14">
          <div class="userListHeader">
            用户列表
            <div class="search">
              <div class="search-input" style="float:left">
                <el-input style="width:200px" v-model="firstInput" placeholder="请输入姓名搜索"></el-input>
              </div>
              <div class="search-btn" style="float:left;margin-left:10px">
                <el-button type="primary" @click="queryUsers">搜索</el-button>
              </div>
            </div>
          </div>
          <div class="leftTree">
            <div class="emp-tree" style="">
              <!-- <el-tree :data="deptData" style="height:100%" :props="defaultProps1" @node-click="handleNodeClick"></el-tree> -->
              <el-tree :expand-on-click-node="true" :default-expanded-keys="[99]" node-key="id" :data="deptData_3" style="height:500px;overflow-y:scroll" :props="defaultProps1"
                @node-click="handleNodeClick"></el-tree>
            </div>
          </div>
          <div class="rightTable">
            <el-table ref="assignTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" @selection-change="changeAddUser">
              <el-table-column type="selection" width="50">

              </el-table-column>
              <el-table-column type="index" label="序号" width="70">
              </el-table-column>
              <el-table-column prop="name" label="姓名">
              </el-table-column>
              <el-table-column prop="mobile" label="手机">
              </el-table-column>

            </el-table>
            <el-pagination style="float:right;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="requestPage"
              :page-sizes="[10, 20,
50, 100]" :page-size="sizePerPage" layout="total, sizes, prev, pager, next" :total="totalCount">
            </el-pagination>
          </div>
        </el-col>
        <el-col :span="2">
          <el-button style="margin:200px 23px;" type="primary" @click="addToRight">添加</el-button>
        </el-col>
        <el-col :span="8">
          <div class="userListHeader">
            <div class="delBtn">
              <el-button type="primary" @click="removeSelected">移除</el-button>
            </div>
            已选用户
          </div>
          <div class="selectedTable">
            <el-table ref="assignTable" :data="rightSelectedUsers" border tooltip-effect="dark" style="width: 100%" @selection-change="changeDelSeletedUser">
              <el-table-column type="selection" width="50">

              </el-table-column>
              <el-table-column type="index" label="序号" width="70">
              </el-table-column>
              <el-table-column prop="name" label="姓名">
              </el-table-column>
              <el-table-column prop="mobile" label="手机">
              </el-table-column>

            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-button type="primary" @click="handleSubmitAdd" class="bottomBtnsSure">保存</el-button>
        <el-button @click="dialogUserBinding=false" class="bottomBtns">取消</el-button>
      </el-row>
    </el-dialog>


  </div>
</template>
<script>
  import _ from 'lodash';
  import {
    post,
    getCookie
  } from '../config/util'
  import {
    mapState,
    mapActions
  } from 'vuex'
  export default {
    data() {
      return {
        searchName: '',
        roleDatas: [{}],
        dialogRoleDetail: false,
        dialogUserBinding: false,
        showRole: {
          rolename: '',
          roledesc: '',
          status: '1',
          id: ''
        },
        activeName: 'first',
        appMenuList: [],
        pcMenuList: [],
        appCheckList: [],
        menuCheckList: [],
        allAppChecked: [],
        allMenuChecked: [],
        appDefaultProps: {
          children: 'children',
          label: 'name'
        },
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        deptData: [],
        defaultProps1: {
          children: 'children',
          label: 'label'
        },
        tableData: [],
        leftSelectedUsers: [],
        rightSelectedUsers: [],
        toDelSelectedUsers: [],
        idlist: [],
        multipleSelection: [],
        url: '',
        data: {},
        addeidt: '',
        totalCount: 0,
        exportInput:false,
        requestPage: 1,
        sizePerPage: 10,
        input: '',
        firstInput:'',
        edit: false,
        disabledid: [5, 6, 7, 8],
        index: 0,
        currentDeptId: '',
        currentBindRoleId: '',
        roleName:'',
        dialogBindedUsers:false,
        bindedDatas:[],
        toUnbindUsers:[],
        pagenum:1,
        pagepersize:10,
        totalCount1:0,
        currentRoleId:null,
        unbindInput:'',
      }
    },
    computed: {
      ...mapState(['menuList']),
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
    },
    mounted() {
      this.queryRoles();
      // alert(this.appMenuList)
      this.appMenulist();
      this.initDeptTree();
    },
    methods: {
      // 绑定 用户
      bindUser(index, row) {
        // console.log(row)
        this.dialogUserBinding = true;
        this.currentBindRoleId = row.id;
        this.roleName = row.name
        //this.selectusers()
      },
      closeUnbindDialog(){
        this.unbindInput='';
      },
      unbindUsers(){
        if(this.toUnbindUsers.length===0){
          this.$message({
                showClose: true,
                message: '请先勾选解绑项！',
                type: 'warning'
              });
          return;
        }
        this.unbind(this.toUnbindUsers.map((item)=>{
          return item.id;
        }));
       
      },
      unbindUser(index,row){
        this.unbind([row.id]);
      },
      unbind(list){
        let self = this;
        post('/role/removebinduser',{
          command: 'role/removebinduser',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          roleid:this.currentRoleId,
          uidlist:list,
        }).done((data)=>{
          if(data&&data.errcode==0){
            self.$message({
              type:'success',
              message:'解绑成功！'
            })
             self.getBindUsers(self.currentRoleId);
          }else if(data&&data.errcode){
              this.$message({
                type:'error',
                message:data.errdesc,
              })
          }
        })
      },
      //   绑定用户信息搜索
      queryUsers() {
        this.queryTechList({query:this.firstInput,requestPage:1});
        this.exportInput = true;
        this.currentDeptId=99;

      },
      handleClick() {},

      handleSubmitAdd() {
        let self = this;
        post('/role/bindusers', {
          command: 'role/bindusers',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          roleid: self.currentBindRoleId,
          userlist: self.rightSelectedUsers.map((item) => {
            return item.id;
          })
        }).done((data) => {
          if (data && data.errcode) {
            self.$message({
              type: 'success',
              message: '綁定成功!'
            });
            self.dialogUserBinding = false;
          } else {
            self.$message({
              type: 'error',
              message: '綁定失敗!'
            });
          }
        }).fail(() => {
          self.$message({
            type: 'error',
            message: '綁定失敗!'
          });
        })
      },
      //   查询用户信息

      //   绑定用户分页
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
      queryBindUsers(){
        this.getBindUsers(this.currentRoleId);
      },
      //已绑分页
      handleSizeChange1(size){
        this.pagepersize = size;
        this.getBindUsers(this.currentRoleId);
      },
      handleCurrentChange1(page){
        this.pagenum = page;
        this.getBindUsers(this.currentRoleId);
      },
      changeDelRoles(item) {
        // console.log(item);
        let self = this
        this.multipleSelection = item
        this.idlist = []
        this.multipleSelection.map(function (item, index, arr) {
          self.idlist.push(item.id)
        })
        // console.log(this.idlist)
      },
      showBinded(index,row){
        let self = this;
        this.dialogBindedUsers = true;
        this.currentRoleId = row.id;
        this.getBindUsers(row.id);
      },
      getBindUsers(roleid){
        let self = this;
        post('/role/querybinduser',{
          command:'role/querybinduser',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          roleid: roleid,
          searchinfo:this.unbindInput,
          pagepersize:this.pagepersize,
          pagenum:this.pagenum,
        }).done((data)=>{
          if(data&&data.errcode==0){
            self.bindedDatas = data.binduserlist;
            self.totalCount1 = data.totalcount;
          }
        })
      },
      changeUnbindUsers(r){
        this.toUnbindUsers = r;
      },
      changeDelSeletedUser(r) {
        this.toDelSelectedUsers = r;
      },
      changeAddUser(r) {
        this.leftSelectedUsers = [...r];
      },
      addToRight() {
        this.rightSelectedUsers = _.union(this.leftSelectedUsers, this.rightSelectedUsers);

      },
      removeSelected() {
        this.rightSelectedUsers = _.difference(this.rightSelectedUsers, this.toDelSelectedUsers);
      },
      //   点击新增角色和编辑按钮后点击确定事件
      handleSubmitAddRole() {
        // console.log(this.menuList)
        // console.log(this.appMenuList)
        let self = this;
        if (self.showRole.rolename == '') {
          self.$message({
            type: 'info',
            message: '该角色名称不能为空！'
          })
        } else if (self.showRole.roledesc == '') {
          self.$message({
            type: 'info',
            message: '该角色描述不能为空！'
          })
        } else {
          post(self.url, {
            command: self.data.command,
            sessionid: getCookie('sid'),
            loginid: getCookie('uid'),
            id: self.data.id,
            ...this.showRole,
            menuslist: this.$refs.appTree.getCheckedKeys().concat(this.$refs.pcTree.getCheckedKeys()).map((item) => {
              return {
                id: item
              }
            })
          }).done(function (data) {
            if (data && data.errcode == 0) {
              self.dialogRoleDetail = false
              if (self.edit == false) {
                self.$message({
                  type: 'success',
                  message: '新增角色成功!'
                });
              } else {
                self.$message({
                  type: 'success',
                  message: '修改角色成功!'
                });
              }

              self.queryRoles({});
            } else if (data && data.errcode == '9903') {
              self.$message({
                type: 'warning',
                message: '该角色名称已存在!'
              });
            }
          })
        }
      },
      // 查询app菜单列表
      appMenulist() {
        let self = this
        post('/menus/querymenusbyuid', {
          command: 'menus/querymenusbyuid',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          moduleid: 'futuredoctorapp'
        }).done(function (data) {
          if (data && data.errcode == 0) {
            let list = [];
            data.resultlist.forEach((item) => {
              if (item.url.split('/').length > 1) {
                list.push(item);
              }
            })
            // let appMenu = ['住培轮转-住院医', '住培轮转-带教老师', '住培轮转-科秘书']
            // console.log(list)
            // list.map(function (item, index, arr) {
            //   if (appMenu.indexOf(item.name) >= 0) {
            //     self.appMenuList.push(item)
            //   }
            // })
            // console.log(self.appMenuList)
            self.appMenuList = list
          }
        })
      },
      queryRoles(option) {
        let self = this;
        post('/role/searchrole', {
          command: 'role/searchrole',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          filteredinfo: option
          //   ...option
        }).done(function (data) {
          if (data && data.errcode == 0) {
            self.roleDatas = data.roleList;
            // console.log(self.roleDatas)
            self.roleDatas.map(function (item, index, arr) {
              if (item.status == '0') {
                item.statu = '禁用'
              } else if (item.status == '1') {
                item.statu = '启用'
              }
            })
          }
        })
      },
      //   新增角色
      addrole() {
        let self = this
        self.edit = false
        self.addeidt = '新增角色'
        self.showRole.rolename = ''
        self.showRole.roledesc = ''
        self.showRole.status = '0',
        self.showRole.id = ''
        this.dialogRoleDetail = true
        self.url = '/role/addrole'
        self.data.command = 'role/addrole'
        self.$refs.appTree.setCheckedKeys([])
        self.$refs.pcTree.setCheckedKeys([])
      },
      //   编辑
      editRole(index, row) {
        let self = this
        self.index = index
        // alert(row.id)
        self.appCheckList = []
        self.menuCheckList = []
        post('/role/querymenusbyroleid',{
            command:'role/querymenusbyroleid',
            sessionid: getCookie('sid'),
            loginid: getCookie('uid'),
            roleid:row.id
        }).done(function(data){
            // self.allAppChecked[self.index] = self.$refs.appTree.getCheckedKeys()
            // self.allMenuChecked[self.index] = self.$refs.pcTree.getCheckedKeys()
            //  console.log(data)
             if(data.futuredoctorapplist.length != 0){
                  data.futuredoctorapplist.map(function(item,index,arr){
                    self.appCheckList.push(item.id)
                })
             }else{
               self.appCheckList = []
             }
             if(data.applist.length != 0){
                  data.applist.map(function(item,index,arr){
                    self.menuCheckList.push(item.id)
                })
             }else{
               self.menuCheckList = []
             }
             self.$refs.appTree.setCheckedKeys(self.appCheckList)
             self.$refs.pcTree.setCheckedKeys(self.menuCheckList)
            //  console.log(self.appCheckList)
            //  console.log(self.menuCheckList)
        })
       
       
        self.edit = true
        self.addeidt = '修改角色'
        self.showRole.rolename = row.name
        self.showRole.roledesc = row.roledesc
        self.showRole.status = row.status + ''
        self.showRole.id = row.id
        this.dialogRoleDetail = true
        self.url = '/role/editrole'
        self.data.command = 'role/editrole'
        self.data.id = row.id

      },
      //   搜索查询
      search() {
        this.queryRoles(this.searchName)
      },
      //   批量删除
      largeDelete() {
        let self = this
        if (self.idlist && self.idlist.length != 0) {
          this.$confirm('是否要删除该选中的角色?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            self.deleterole()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        } else {
          this.$message({
            type: 'info',
            message: '请选择要删除的角色！'
          });
        }
      },
      //   删除
      delRole(index, row) {
        // alert(index)
        let self = this
        this.idlist = []
        // alert(row.id)
        this.idlist.push(row.id)
        // 	alert(this.idlist)
        // self.deleterole()
        this.$confirm('是否要删除该角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.deleterole()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleterole() {
        let self = this
        post('/role/deleterole', {
          command: 'role/deleterole',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          idlist: self.idlist
        }).done(function (data) {
          // console.log(data)
          if (data.errcode == '0') {
            self.$message({
              type: 'success',
              message: '删除成功!'
            });
            self.queryRoles()
          } else {
            self.$message({
              type: 'info',
              message: data.errdesc
            });
          }

          // alert('ok')
        }).fail(function (error) {
          // console.log(error)
          // alert('error')
        })
      },
      // 点击启用禁用按钮
      disableRole(index, row) {
        let self = this
        let statu;
        let status;
        if (row.status == '0') {
          statu = '是否要启用该角色？'
          status = '1'
        } else if (row.status == '1') {
          statu = '是否要禁用该角色？'
          status = '0'
        }
        this.$confirm(statu, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updaterolestatus(row.id, status)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });

      },
      // 启用，禁用角色请求
      updaterolestatus(id, status) {
        let self = this
        post('/role/updaterolestatus', {
          command: 'role/updaterolestatus',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          id: id,
          status: status
        }).done(function (data) {
          if (data.errcode == '0') {
            self.$message({
              type: 'success',
              message: '修改成功!'
            });
            self.queryRoles()
          }
        }).fail(function (error) {
          console.log(error)
        })
      },
      handleNodeClick(data) {
        this.currentDeptId = data.id;
        let option = {deptid:data.id,requestPage:1};
        this.queryTechList(option);
        this.exportInput = false;
        this.firstInput='';
      },
      initDeptTree() {
        let self = this;
        post('/dept/listdepttree', {
          command: 'dept/listdepttree',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
        }).done(function (data) {
          if (data && data.errcode == 0) {
            data.dept.children.forEach((item)=>{
              if(item.id==99){
                self.deptData=[item];
              }
            })
            self.currentDeptId = self.deptData[0].id;
            self.queryTechList({deptid:self.currentDeptId});
          }
        })
      },
      queryTechList(option) {
        let self = this;
        post('/dept/listdepttech', {
          command: 'dept/listdepttech',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          sizePerPage: this.sizePerPage,
          ...option,
        }).done((data) => {
          if (data && data.errcode == 0) {
            self.tableData = data.techlist;
            self.totalCount = data.count;
          }
        })
      },
      closeBindDialog() {
        this.rightSelectedUsers = [];
        this.firstInput='';
        this.queryTechList({
          deptid: this.currentDeptId
        });
      }
    }
  }

</script>
<style scoped>
  .tools {
    height: 50px;
  }

  .funcTools {
    float: left;
  }

  .search {
    float: right;
  }

  .formItem {
    margin-top: 10px;
    border-bottom: 1px solid #d3dce6;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .el-input {
    width: 50%;
  }

  .diffTabs {}

  .appControl {
    width: 400px;
    margin: 0 auto;
  }

  .conHeader {
    height: 30px;
    line-height: 30px;
    border: 1px solid #d3dce6;
    text-align: center;
  }

  .conBody {}

  .dialogClass {
    width: 1367.28px;
  }

  .userListHeader {
    text-align: center;
    line-height: 40px;
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    padding: 10px 10px;
    border: 1px solid #d3dce6;
  }

  .headerText {
    float: left;
    line-height: 40px;
    margin-left: 200px;
  }

  .search {
    float: right;
  }

  .leftTree {
    float: left;
    width: 30%;
    box-sizing: border-box;
  }

  .rightTable {
    float: left;
    width: 70%;
    min-height: 500px;
    border:1px solid #d3dce6;
    box-sizing: border-box;
  }

  .delBtn {
    float: left;
    margin-left: 10px;
  }

  .selectedTable {

    height: 500px;
    border:1px solid #d3dce6;
    box-sizing: border-box;
    overflow-y: auto;
  }

</style>
