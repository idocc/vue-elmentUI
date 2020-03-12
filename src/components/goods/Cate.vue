<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialogVisible()">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        class="tree-table"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:green"></i>
          <i class="el-icon-edit" v-else style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" class="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" class="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed()">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            change-on-select
            :options="parentCateList"
            :props="cascaderProps"
            clearable
            @change="parentCateChange()"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //商品分类数据列表
      catelist: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cate_name: [
          {
            required: true,
            message: "请输入分类的名称",
            trigger: "blur"
          }
        ]
      },
      //父级分类列表
      parentCateList: [],
      //级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        childern: "children"
      },
      //选中id数组
      selectedKeys: []
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");
      console.log(res);
      this.catelist = res.data.result;
      this.total = res.data.total;
    },
    //监听翻页数据
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getCateList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getCateList();
    },
    //获取父级的分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取父级列表失败");
      this.parentCateList = res.data;
    },
    showAddCateDialogVisible() {
      this.getParentCateList();

      this.addCateDialogVisible = true;
    },
    //选择项发生变化触发函数
    parentCateChange() {
      console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        //获取父级分类id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        //当前商品的等级分类
        this.addCateForm.cat_level = this.selectedKeys.length;
        return
      }
      else{
          this.addCateForm.cat_level=0
          this.addCateForm.cat_pid=0
      }
    },
    //点击按钮添加分类
    addCate(){
         this.$refs.addCateFormRef.validate( async valid=>{
            if(!valid) return
            const {data:res} = await this.$http.post('categories',this.addCateForm)
            if(res.meta.status!==201) return this.$message.error('添加分类失败')
            this.$message.success('添加分类成功')
            this.getCateList()
            this.addCateDialogVisible=false
        })
    },
    //监听对话框监听事件
    addCateDialogClosed(){
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys=[]
        this.addCateForm.cat_level=0
        this.addCateForm.cat_pid=0
    }
  }
};
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>