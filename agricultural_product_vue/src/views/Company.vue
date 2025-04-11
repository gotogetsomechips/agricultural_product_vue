<template>
    <div class="company-info-container">
      <div class="main-container">
        <main class="content">
          <div class="company-info-table">
            <div class="table-header">
              <div>
                <button class="add-button" @click="handleAdd">新增</button>
              </div>
            </div>
            <!-- 查询表单 -->
     <div class="search-form">
        <div class="search-row">
          <div class="search-item">
            <label>公司名称：</label>
            <input
                type="text"
                v-model="searchParams.comName"
                placeholder="请输入公司名称"
            />
          </div>
        <div class="search-item">
            <label>公司地址：</label>
            <input
                type="text"
                v-model="searchParams.comAddress"
                placeholder="请输入公司地址"
            />
        </div>
        <div class="search-item">
            <label>负责人：</label>
            <input
                type="text"
                v-model="searchParams.comAdministrator"
                placeholder="请输入公司负责人"
            />
        </div>
    </div>
    <div class="search-row">
        <div class="search-item">
            <label>手机号：</label>
            <input
                type="text"
                v-model="searchParams.comPhone"
                placeholder="请输入负责人手机号"
                style="flex:0.58"
            />
        </div>
        <div class="search-item">
            <button class="search-button" @click="handleSearch">
                查询
            </button>
            <button class="reset-button" @click="handleReset">重置</button>
        </div>
    </div>
</div>     
  
            <!-- 表格部分 -->
            <table>
              <thead>
                <tr>
                  <th>序号</th>
                  <th>公司名称</th>
                  <th>公司地址</th>
                  <th>负责人</th>
                  <th>手机号</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in paginatedData"
                  :key="item.comId"
                  :class="{ 'active-row': index % 2 === 0 }"
                >
                  <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                  <td>{{ item.comName }}</td>
                  <td>{{ item.comAddress }}</td>
                  <td>{{ item.comAdministrator }}</td>
                  <td>{{ item.comPhone }}</td>
                  <td class="action-buttons">
                    <button class="editCompany-button" @click="showEdit(item)">
                      编辑
                    </button>
                    <button
                      class="deleteCompany-button"
                      @click="deleteCompany(item)"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
  
            <!-- 分页部分 -->
            <div class="pagination-container">
              <div class="pagination-info">
                显示 {{ (currentPage - 1) * pageSize + 1 }} 到
                {{ Math.min(currentPage * pageSize, companyInfo.length) }} 条，共
                {{ companyInfo.length }} 条
              </div>
              <div class="pagination-controls">
                <select
                  v-model="pageSize"
                  @change="handlePageSizeChange"
                  class="page-size-select"
                >
                  <option value="5">5条/页</option>
                  <option value="10">10条/页</option>
                  <option value="20">20条/页</option>
                  <option value="50">50条/页</option>
                </select>
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="pagination-button"
                >
                  上一页
                </button>
                <span class="page-number">{{ currentPage }}</span>
                <button
                  @click="nextPage"
                  :disabled="currentPage === pageCount"
                  class="pagination-button"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <!-- 模态框覆盖层 -->
      <div
        v-if="showEditComponent|| showAddComponent"
        class="modal-overlay"
        @click="hideModal"
      ></div>
      <!-- 新增模态框 -->
      <div v-if="showAddComponent" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>新增物流公司</h2>
            <button class="close-button" @click="hideAdd">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group input-group">
              <label for="newCompanyName">公司名称: </label>
              <input
                type="text"
                id="newCompanyName"
                v-model="newCompany.comName"
              />
            </div>
            <br />
            <div class="form-group input-group">
              <label for="newCompanyAddress">公司地址: </label>
              <input
                type="text"
                id="newCompanyAddress"
                v-model="newCompany.comAddress"
              />
            </div>
            <br />
            <div class="form-group input-group">
              <label for="newCompanyAdministrator">公司负责人: </label>
              <input
                type="text"
                id="newCompanyAdministrator"
                v-model="newCompany.comAdministrator"
              />
            </div>
            <br />
            <div class="form-group input-group">
              <label for="newCompanyPhone">负责人手机号: </label>
              <input
                type="text"
                id="newCompanyPhone"
                v-model="newCompany.comPhone"
              />
            </div>
            <br />
          </div>
          <div class="modal-footer">
            <button class="addConfirm-button" @click="addCompany">
              确认添加
            </button>
            <button class="back-button" @click="hideAdd">返回</button>
          </div>
        </div>
      </div>
      <!-- 修改模态框 -->
      <div v-if="showEditComponent" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>公司编辑</h2>
            <button class="close-button" @click="hideEdit">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group input-group">
              <label for="companyName">公司名称: </label>
              <input
                type="text"
                id="companyName"
                v-model="currentCompany.comName"
              />
            </div>
            <br />
            <div class="form-group input-group">
              <label for="companyAddress">公司地址: </label>
              <input
                type="text"
                id="companyAddress"
                v-model="currentCompany.comAddress"
              />
            </div>
            <br />
            <div class="form-group input-group">
              <label for="companyAdministrator">公司负责人: </label>
              <input
                type="text"
                id="companyAdministrator"
                v-model="currentCompany.comAdministrator"
              />
            </div>
            <br />
            <div class="form-group input-group">
              <label for="companyPhone">负责人手机号: </label>
              <input
                type="text"
                id="companyPhone"
                v-model="currentCompany.comPhone"
              />
            </div>
            <br />
           
          </div>
          <div class="modal-footer">
            <button class="save-button" @click="saveChanges">保存</button>
            <button class="back-button" @click="hideEdit">返回</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import axios from "axios";
  import { provinceAndCityData, regionData, codeToText } from "element-china-area-data";
  
  export default {
    setup() {
      const router = useRouter();
      const route = useRoute();
      const currentUser = ref("");
      const currentPage = ref(1);
      const pageSize = ref(5);
      const showEditComponent = ref(false);
      const token = localStorage.getItem("token");
      const item = ref({
        comName: "",
        comAddress: "",
        comAdministrator: "",
        comPhone: "",
      });
      const currentCompany = ref({
        comId: "",
        comName: "",
        comAddress: "",
        comAdministrator: "",
        comPhone: "",
      });
      onMounted(() => {
        currentUser.value =
          localStorage.getItem("username") || route.query.username;
      });
      // 查询参数
      const searchParams = ref({
       comName: "",
       comAddress: "",
       comAdministrator: "",
       comPhone: "",
      });
  
      // 过滤后的数据
      const companyInfo = ref([]);
  
      // 计算总页数
      const pageCount = computed(() => {
        return Math.ceil(companyInfo.value.length / pageSize.value);
      });
  
      // 获取当前页数据
      const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        const end = start + pageSize.value;
        return companyInfo.value.slice(start, end);
      });
  
      // 搜索处理
      const handleSearch = async () => {
        currentPage.value = 1; // 重置到第一页
        try {
          const response = await axios.post(
            "http://localhost:8080/company/page",
            {
              page: currentPage.value,
              size: pageSize.value,
              comName: searchParams.value.comName,
              comAddress: searchParams.value.comAddress,
              comAdministrator: searchParams.value.comAdministrator,
              comPhone: searchParams.value.comPhone,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );
          if (response.data.code === 200) {
            companyInfo.value = response.data.data.records || [];
            if (response.data.data.length > 0) {
              item.value.comName = response.data.data[0].comName;
              item.value.comAddress = response.data.data[0].comAddress;
              item.value.comAdministrator = response.data.data[0].comAdministrator;
              item.value.comPhone = response.data.data[0].comPhone;
              currentCompany.value.comId = response.data.data[0].comId;
              currentCompany.value.comName = response.data.data[0].comName;
              currentCompany.value.comAddress = response.data.data[0].comAddress;
              currentCompany.value.comAdministrator = response.data.data[0].comAdministrator;
              currentCompany.value.comPhone = response.data.data[0].comPhone;
            }
          } else {
            alert(response.data.msg);
          }
        } catch (error) {
          console.error("查询失败:", error);
          alert("查询失败，请稍后重试");
        }
      };
  
      const handleAdd = () => {
        showAdd();
      };
  
      // 上一页
      const prevPage = () => {
        if (currentPage.value > 1) {
          currentPage.value--;
        }
      };
  
      // 下一页
      const nextPage = () => {
        if (currentPage.value < pageCount.value) {
          currentPage.value++;
        }
      };
  
      // 每页条数变化
      const handlePageSizeChange = () => {
        currentPage.value = 1; // 重置到第一页
      };
  
      // 退出登录
      const logout = () => {
        const isConfirmed = confirm("您确定要退出吗？");
        if (isConfirmed) {
          currentUser.value = "";
          router.push("/");
        }
      };
      // 控制新增模态框显示隐藏
      const showAddComponent = ref(false);
      // 存储新增农产品信息
      const newCompany = ref({
       comName: "",
       comAddress: "",
       comAdministrator: "",
       comPhone: "",
      });
  
      const showAdd = () => {
        showAddComponent.value = true;
      };
  
      const hideAdd = () => {
        showAddComponent.value = false;
        // 重置新增农产品信息
        newCompany.value = {
         comName: "",
         comAddress: "",
         comAdministrator: "",
         comPhone: "",
        };
      };
      onMounted(() => {
        showAllCompany();
      });
      const showAllCompany = async () => {
        try {
          const response = await axios.get("http://localhost:8080/company/list", {
            headers: {
              Authorization: token,
            },
          });
          if (response.data.code === 200) {
            companyInfo.value = response.data.data;
            if (response.data.data.length > 0) {
              item.value.comName = response.data.data[0].comName;
              item.value.comAddress = response.data.data[0].comAddress;
              item.value.comAdministrator = response.data.data[0].comAdministrator;
              item.value.comPhone = response.data.data[0].comPhone;
              currentCompany.value.comId = response.data.data[0].comId;
              currentCompany.value.comName = response.data.data[0].comName;
              currentCompany.value.comAddress = response.data.data[0].comAddress;
              currentCompany.value.comAdministrator = response.data.data[0].comAdministrator;
              currentCompany.value.comPhone = response.data.data[0].comPhone;
            }
          } else {
            alert(response.data.msg);
          }
        } catch (error) {
          console.error("查询失败:", error);
        }
      };
        // 重置搜索
        const handleReset = () => {
        searchParams.value = {
         comName: "",
         comAddress: "",
         comAdministrator: "",
         comPhone: "",
        };
        showAllCompany();
      };
      
      const addCompany = async () => {
        if(newCompany.value.comPhone!=''){
            if(newCompany.value.comPhone.length !=11){
                alert('手机号需要为11位的数字');
                return;
            }
            const regex = /^1[3-9]\d{9}$/;
            if (!regex.test(newCompany.value.comPhone)) {
              alert('手机号不能以10、11、12开头且需都为数字');
              return;
            }
        }
            try {
              const response = await axios.post(
                "http://localhost:8080/company",
                {
                  comName: newCompany.value.comName,
                  comAddress: newCompany.value.comAddress,
                  comAdministrator: newCompany.value.comAdministrator,
                  comPhone: newCompany.value.comPhone
                },
                {
                  headers: {
                    Authorization: token,
                  },
                }
              );
              if (response.data.code === 200) {
                //handleSearch();
                showAllCompany();
                hideAdd();
                alert("添加成功");
              } else {
                alert(response.data.msg);
              }
            } catch (error) {
              console.error("添加错误:", error);
            }
      };
  
  
      const showEdit = (item) => {
        currentCompany.value = { ...item };
        showEditComponent.value = true;
      };
  
      const hideEdit = () => {
        showEditComponent.value = false;
      };
  
      const saveChanges = async () => {
        if(currentCompany.value.comPhone!=''){
            if(currentCompany.value.comPhone.length !=11){
                alert('手机号需要为11位的数字');
                return;
            }
            const regex = /^1[3-9]\d{9}$/;
            if (!regex.test(currentCompany.value.comPhone)) {
              alert('手机号不能以10、11、12开头且需都为数字');
              return;
            }
        }
              try {
                const response = await axios.put(
                  "http://localhost:8080/company",
                  {
                    comId: currentCompany.value.comId,
                    comName: currentCompany.value.comName,
                    comAddress: currentCompany.value.comAddress,
                    comAdministrator: currentCompany.value.comAdministrator,
                    comPhone: currentCompany.value.comPhone
                  },
                  {
                    headers: {
                      Authorization: token,
                    },
                  }
                );
                if (response.data.code === 200) {
                  showAllCompany();
                  hideEdit();
                  alert("修改成功");
                } else {
                  alert(response.data.msg);
                }
              } catch (error) {
                console.error("修改错误:", error);
              }
            }; 
  
      const deleteCompany = async (item) => {
        currentCompany.value = { ...item };
        const id = currentCompany.value.comId;
        const isConfirmed = confirm("您确定要删除这条数据吗？");
        if (isConfirmed) {
          try {
            const response = await axios.delete(
              "http://localhost:8080/company/" + id,
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            if (response.data.code === 200) {
              alert("删除成功");
              showAllCompany();
              //handleSearch();
            } else {
              alert(response.data.msg);
            }
          } catch (error) {
            console.error("删除错误:", error);
          }
        }
      };
      // 跳转到个人信息界面
      const goToPersonal = () => {
        router.push("/personal");
      };
  
      // 跳转到首页
      const goToHome = () => {
        router.push("/home");
      };
      // 跳转到农产品信息界面
      const goToProduct = () => {
        router.push("/product");
      };
      // 跳转到生产信息界面
      const goToProduction = () => {
        router.push("/production");
      };
  
      // 跳转到物流信息界面
      const goToLogistics = () => {
        router.push("/logistics");
      };
      // 跳转到销售信息界面
      const goToSales = () => {
        router.push("/sales");
      };
  
      return {
        companyInfo,
        currentCompany,
        currentUser,
        searchParams,
        handleSearch,
        handleReset,
        handleAdd,
        paginatedData,
        pageCount,
        pageSize,
        currentPage,
        prevPage,
        nextPage,
        handlePageSizeChange,
        logout,
        item,
        newCompany,
        showEditComponent,
        showAddComponent,
        hideAdd,
        goToPersonal,
        goToHome,
        goToProduct,
        goToProduction,
        goToLogistics,
        goToSales,
        showAllCompany,
        addCompany,
        showEdit,
        hideEdit,
        saveChanges,
        deleteCompany
      };
    },
  };
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #0088cc;
    color: white;
    padding: 0 20px;
    height: 60px;
  }
  
  .header-title {
    font-size: 20px;
    font-weight: bold;
  }
  .header-user-info {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  
  .header-link {
    color: white;
    margin-left: 15px;
    text-decoration: none;
    font-size: 14px;
  }
  
  .header-link:hover {
    text-decoration: underline;
  }
  
  .main-container {
    display: flex;
    flex: 1;
  }
  
  .sidebar {
    width: 200px;
    background-color: #222;
    color: white;
    padding: 10px;
    max-height: 100%;
    overflow-y: auto;
  }
  
  .sidebar-menu {
    list-style-type: none;
    padding: 0;
  }
  
  .sidebar-item {
    padding: 8px 10px;
    cursor: pointer;
  }
  
  .sidebar-item:hover {
    background-color: #444;
  }
  
  .sidebar-item.active {
    background-color: #444;
  }
  
  .content {
    flex: 1;
    padding: 10px;
    background-color: #ecf0f5;
    max-height: 100%;
    overflow-y: auto;
  }
  
  .company-info-table {
    background-color: white;
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  .search-form {
    background-color: #f9f9f9;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
}

.search-row {
    display: flex;
    margin-bottom: 10px;
}

.search-row:last-child {
    margin-bottom: 0;
}

.search-item {
    flex: 1;
    display: flex;
    align-items: center;
    margin-right: 15px;
}

.search-item:last-child {
    margin-right: 0;
}

.search-item label {
    width: 80px;
    text-align: right;
    margin-right: 10px;
    font-size: 14px;
}

.search-item:nth-child(1) label,
.search-item:nth-child(4) label {
    text-align: left;
    padding-left: 10px;
}

.search-item:nth-child(2) label,
.search-item:nth-child(5) label {
    text-align: left;
    padding-left: 10px;
}

.search-item input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.search-item:last-child {
    justify-content: flex-end;
}

.search-button {
    padding: 6px 15px;
    background-color: #3c8dbc;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
    margin-left: 10px;
}

.reset-button {
    padding: 6px 15px;
    background-color: #f39c12;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
    margin-left: 10px;
}    
  
  .add-button {
    padding: 6px 15px;
    background-color: #00a65a;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
  }
  
  /* 修改后的表格样式 */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    margin-bottom: 15px;
  }
  
  th,
  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #eee;
    white-space: nowrap;
  }
  
  th {
    background-color: #f5f5f5;
    color: #333;
    font-weight: bold;
  }
  
  tr:hover {
    background-color: #f9f9f9;
  }
  
  .active-row {
    background-color: #f9f9f9;
  }
  
  .pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    padding: 8px 0;
    border-top: 1px solid #e0e0e0;
  }
  
  .pagination-info {
    color: #666;
    font-size: 14px;
  }
  
  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .page-size-select {
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 3px;
  }
  
  .pagination-button {
    padding: 5px 10px;
    background-color: #f1f2f3;
    border: 1px solid #ddd;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .pagination-button:hover:not(:disabled) {
    background-color: #e0e0e0;
  }
  
  .pagination-button:disabled {
    color: #aaa;
    cursor: not-allowed;
  }
  
  .page-number {
    padding: 5px 10px;
    background-color: #0088cc;
    color: white;
    border-radius: 3px;
    font-size: 14px;
  }
  .detail-button {
    padding: 6px 15px;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
    margin-left: 10px;
    background-color: #00a65a;
  }
  .deleteCompany-button {
    padding: 6px 15px;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
    margin-left: 10px;
    background-color: #f39c12;
  }
  .editCompany-button {
    padding: 6px 15px;
    background-color: #3c8dbc;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
    margin-left: 10px;
  }
  /* 模态框覆盖层 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  /* 模态框 */
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1001;
    max-width: 500px;
    width: 90%;
  }
  
  .modal-content {
    padding: 20px;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  
  .modal-header h2 {
    margin: 0;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
  }
  
  .close-button:hover {
    color: #333;
  }
  
  .modal-body {
    margin-bottom: 20px;
  }
  
  .modal-body img {
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .back-button,
  .save-button {
    padding: 8px 15px;
    background-color: #0088cc;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .back-button:hover,
  .save-button:hover {
    background-color: #0077b3;
  }
  .input-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .input-group label {
    width: 100px;
    text-align: right;
  }
  
  .input-group input,
  .input-group textarea {
    flex: 1;
  }
  </style>