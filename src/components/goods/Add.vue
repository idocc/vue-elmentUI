<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addFromRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLevel"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFrom.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFrom.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFrom.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addFrom.goods_cat"
                :options="cateList"
                :props="{ expandTrigger: 'hover',label:'cat_name',children:'children',value:'cat_id'}"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--渲染表单-->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border v-for="(cb,i) in item.attr_vals" :key="i" :label="cb"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="hearderObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addFrom.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add()">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="preViewdialogVisible" width="50%">
      <img :src="previewPath" alt="预览图片" class="previewImg" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: "0",
      addFrom: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        //图片数组
        pics: [],
        //商品的详情描述
        goods_introduce: "",
        attrs:[]
      },
      addFromRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur"
          }
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur"
          }
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur"
          }
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "blur"
          }
        ]
      },
      cateList: [],
      cateProps: [],
      //动态参数列表数据
      manyTableData: [],
      //静态属性列表
      onlyTableData: [],
      //图片上传请求地址
      uploadUrl: "https://www.liulongbin.top:8888/api/private/v1/upload",
      //图片上传请求头
      hearderObj: {
        authorization: window.sessionStorage.getItem("token")
      },
      previewPath: "",
      preViewdialogVisible: false
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.cateList = res.data;
      console.log(this.cateList);
    },
    handleChange() {
      if (this.addFrom.goods_cat.length !== 3) {
        this.addFrom.goods_cat = [];
      }
    },
    // 级联选择器选中项变化
    beforeTabLevel(activeName, oldActiveName) {
      if (this.addFrom.goods_cat.length !== 3 && oldActiveName === "0") {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    async tabClicked() {
      // 点击的动态参数面板
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数失败");
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
        console.log(res.data);
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品参数失败");
        }
        console.log(res.data);
        this.onlyTableData = res.data;
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.preViewdialogVisible = true;
    },
    // 处理移除图片操作
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addFrom.pics.findIndex(x => x.pic === filePath);
      this.addFrom.pics.splice(i, 1);
      console.log(this.addFrom.pics);
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path };
      this.addFrom.pics.push(picInfo);
      console.log(this.addFrom.pics);
    },
    //添加商品
    async add() {
      this.$refs.addFromRef.validate(valid => {
        if (!valid) return this.$message.error("请添写必要填写项");
      });
      var from = JSON.parse(JSON.stringify(this.addFrom));
      from.goods_cat = from.goods_cat.join(",");
      //处理静态属性和动态参数
      this.manyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(" ")
        };
        this.addFrom.attrs.push(newInfo);
      });
      this.onlyTableData.forEach(item=>{
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        };
        this.addFrom.attrs.push(newInfo);
      })
      from.attrs=this.addFrom.attrs
      //发起添加商品请求
      const {data:res} = await this.$http.post('goods',from)
      if(res.meta.status!==201){
        return this.$message.error('添加商品失败')
      }
      this.$message.success('添加商品成功')
      this.$router.push('/goods')

    }
  },
  computed: {
    cateId() {
      if (this.addFrom.goods_cat.length === 3) return this.addFrom.goods_cat[2];
    }
  }
};
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>