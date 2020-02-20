<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse?'64px':'200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="iscollapse"
          :collapse-transition="false"
          router
          :default-active="this.$route.path"
        >
          <el-submenu :index="item.id +'1'" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item  :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="saveNavState('/'+subitem.path)">
              <i class="el-icon-menu"></i>
              <span>{{subitem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconObj:{
          '125':'el-icon-user-solid',
          '103':'el-icon-takeaway-box',
          '101':'el-icon-shopping-bag-2',
          '102':'el-icon-s-order',
          '145':'el-icon-data-line'
      },
      iscollapse:false,
      activepath:''
    };
  },
  created() {
    this.getmenuList();
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getmenuList() {
      const { data: res } = await this.$http.get("menus");
      if(res.meta.status!==200) return this.$message.error(res.meta.msg);
      this.menulist = res.data
    },
    //点击按钮切换菜单的折叠与展开
    toggleCollapse(){
        this.iscollapse=!this.iscollapse
    },
    saveNavState(activepath){
        window.sessionStorage.getItem("activePath",activepath)
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  align-items: center;
  > div {
    display: flex;
  }
  span {
    margin-left: 15px;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
      border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 21px;
    letter-spacing: 0.2em;
    color: #fff;
    text-align: center;
    cursor: pointer;
}
</style>