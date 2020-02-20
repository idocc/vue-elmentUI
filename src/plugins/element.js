import Vue from 'vue'
import { MessageBox,Dialog,Pagination,Tooltip,Switch,Button,Form,FormItem,Input,Message,Container,Header,Aside,Main,menu,Submenu,MenuItemGroup,MenuItem,breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$confirm=MessageBox.confirm
Vue.prototype.$message=Message