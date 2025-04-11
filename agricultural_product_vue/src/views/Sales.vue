<template>
  <div class="sales-info-container">
    <div class="main-container">
      <main class="content">
        <div class="sales-info-table">
          <div class="table-header">
            <div>
              <button class="add-button" @click="handleAdd">新增</button>&nbsp;
              <button class="print-button" @click="handlePrintAll">打印</button>
            </div>
          </div>

          <!-- 查询表单 -->
          <div class="search-form">
            <div class="search-row">
              <div class="search-item">
                <label>销售编号:</label>
                <input type="text" v-model="searchParams.id" placeholder="请输入编号" />
              </div>
              <div class="search-item">
                <label>产品名称:</label>
                <input type="text" v-model="searchParams.productName" placeholder="请输入产品名称" />
              </div>
              <div class="search-item">
                <label>销售时间:</label>
                <input type="date" v-model="searchParams.date" placeholder="请选择日期" />
              </div>
              <div class="search-item">
                <label>销售地:</label>
                <input type="text" v-model="searchParams.salesLocation" placeholder="请输入销售地" />
              </div>
              <button class="search-button" @click="handleSearch">查询</button>
              <button class="reset-button" @click="handleReset">重置</button>
            </div>
          </div>

          <!-- 表格部分 -->
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>编号</th>
                  <th>产品名称</th>
                  <th>销售地</th>
                  <th>销售时间</th>
                  <th>物流序号</th>
                  <th>说明</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in salesInfo" :key="item.id" :class="{ 'active-row': index % 2 === 0 }">
                  <td>{{ item.id }}</td>
                  <td>{{ item.productName }}</td>
                  <td>{{ item.salesLocation }}</td>
                  <td>{{ formatDateTime(item.saleTime) }}</td>
                  <td>{{ item.logisticId }}</td>
                  <td>{{ item.description }}</td>
                  <td class="action-buttons">
                    <button class="edit-button" @click="editInfo(item.id)">
                      编辑
                    </button>
                    <button class="delete-button" @click="deleteInfo(item.id)">
                      删除
                    </button>
                    <button class="print-receipt-button" @click="printReceipt(item.id)">
                      打印销售单
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 分页部分 -->
          <div class="pagination-container">
            <div class="pagination-info">
              显示 {{ (currentPage - 1) * pageSize + 1 }} 到
              {{ Math.min(currentPage * pageSize, totalCount) }} 条，共
              {{ totalCount }} 条
            </div>
            <div class="pagination-controls">
              <select v-model="pageSize" @change="handlePageSizeChange" class="page-size-select">
                <option value="5">5条/页</option>
                <option value="10">10条/页</option>
                <option value="20">20条/页</option>
                <option value="50">50条/页</option>
              </select>
              <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">
                上一页
              </button>
              <span class="page-number">{{ currentPage }}</span>
              <button @click="nextPage" :disabled="currentPage === pageCount" class="pagination-button">
                下一页
              </button>
            </div>
          </div>
          <teleport to="body">
            <div v-if="showAddModel" class="modal-overlay">
              <div class="modal-container">
                <div class="modal-header">
                  <h3>新增销售信息</h3>
                  <button @click="showAddModel = false" class="close-button">
                    &times;
                  </button>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label>销售地:</label>
                    <select v-model="currentAddItem.salesLocation" class="form-select">
                      <option v-for="place in salePlaceList" :value="place.spAddress" :key="place.spId">
                        {{ place.spAddress }} (负责人:
                        {{ place.spAdministrator }})
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>销售时间:</label>
                    <input type="datetime-local" v-model="currentAddItem.saleTime" step="1" />
                  </div>
                  <div class="form-group">
                    <label>物流序号:</label>
                    <select v-model="currentAddItem.logisticId" class="form-select">
                      <option v-for="log in logisticList" :value="log.logId" :key="log.logId">
                        {{ log.logId }} ({{log.startLocation}} -> {{log.destination}})
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>说明:</label>
                    <textarea v-model="currentAddItem.description"></textarea>
                  </div>
                </div>
                <div class="modal-footer">
                  <button @click="showAddModel = false" class="cancel-button">
                    取消
                  </button>
                  <button @click="saveInfo" class="confirm-button">保存</button>
                </div>
              </div>
            </div>
          </teleport>
          <teleport to="body">
            <div v-if="showEditModel" class="modal-overlay">
              <div class="modal-container">
                <div class="modal-header">
                  <h3>编辑销售信息</h3>
                  <button @click="showEditModel = false" class="close-button">
                    &times;
                  </button>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label>产品名称:</label>
                    <input type="text" v-model="currentEditItem.productName" disabled />
                  </div>
                  <div class="form-group">
                    <label>销售地:</label>
                    <select v-model="currentEditItem.salesLocation" class="form-select">
                      <option v-for="place in salePlaceList" :value="place.spAddress" :key="place.spId">
                        {{ place.spAddress }} (负责人:
                        {{ place.spAdministrator }})
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>销售时间:</label>
                    <input type="datetime-local" v-model="currentEditItem.saleTime" step="1" />
                  </div>
                  <div class="form-group">
                    <label>物流序号:</label>
                    <select v-model="currentEditItem.logisticId" class="form-select">
                      <option v-for="log in logisticList" :value="log.logId" :key="log.logId">
                        {{ log.logId }} ({{log.startLocation}} -> {{log.destination}})
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>说明:</label>
                    <textarea v-model="currentEditItem.description"></textarea>
                  </div>
                </div>
                <div class="modal-footer">
                  <button @click="showEditModel = false" class="cancel-button">
                    取消
                  </button>
                  <button @click="saveInfo" class="confirm-button">保存</button>
                </div>
              </div>
            </div>
          </teleport>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const router = useRouter();
    const currentPage = ref(1);
    const pageSize = ref(5);
    const currentUser = ref("");
    const totalCount = ref(0); // 总条数响应式变量

    // 查询参数
    const searchParams = ref({
      id: "",
      productName: "",
      salesLocation: "",
      saleTime: "",
    });
    // 过滤后的数据
    const salesInfo = ref([]);

    // 下拉框数据
    const productList = ref([]);
    const salePlaceList = ref([]);
    const logisticList = ref([]);

    // 获取产品列表
    const fetchProductList = async () => {
      try {
        const response = await axios.get("http://localhost:8080/product/list");
        productList.value = response.data.data;
      } catch (error) {
        console.error("获取产品列表失败:", error);
      }
    };

    // 获取销售地列表
    const fetchSalePlaceList = async () => {
      try {
        const response = await axios.get("http://localhost:8080/saleplace/list");
        salePlaceList.value = response.data.data;
      } catch (error) {
        console.error("获取销售地列表失败:", error);
      }
    };

    // 获取物流列表
    const fetchLogisticList = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/logistics/list"
        );
        logisticList.value = response.data.data;
        console.log("logisticList: ", response.data.data);
      } catch (error) {
        console.error("获取物流列表失败:", error);
      }
    };

    // 添加API请求方法
    const fetchSalesInfo = async () => {
      try {
        // 构造请求参数，过滤空值
        const params = {
          page: currentPage.value,
          size: pageSize.value,
        };

        // 动态添加非空查询条件
        if (searchParams.value.id) params.saleInfoId = Number(searchParams.value.id); // 转换为数字
        if (searchParams.value.productName) params.productName = searchParams.value.productName;
        if (searchParams.value.salesLocation) params.salePlace = searchParams.value.salesLocation;
        if (searchParams.value.date) {
          // 将日期字符串转换为ISO格式
          params.saleTime = new Date(searchParams.value.date).toISOString();
        }

        console.log("实际发送的查询参数:", params);
        const response = await axios.post(
            "http://localhost:8080/saleinfo/page",
            params,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
        );
        console.log("API响应数据:", response.data);

        if (response.data && response.data.code === 200) {
          salesInfo.value = response.data.data.records.map((item) => ({
            id: item.siId,
            productName: item.pdName,
            salesLocation: item.spAddress,
            saleTime: item.saleTime,
            logisticId: item.logisticsId,
            description: item.siDescription,
          }));
          totalCount.value = response.data.data.total;
        } else {
          console.error("获取销售信息失败:", response.data?.msg);
        }
      } catch (error) {
        console.error("请求销售信息出错:", error);
      }
    };

    // 删除操作
    const deleteInfo = async (id) => {
      const isConfirmed = confirm("您确定要删除这条数据吗？");
      if (isConfirmed) {
        try {
          const response = await axios.delete(
            `http://localhost:8080/saleinfo/${id}`
          );
          if (response.data.code === 200) {
            alert('删除成功')
            handleSearch();
          } else {
            alert("删除失败: " + response.data.msg);
          }
        } catch (error) {
          console.error("删除出错:", error);
        }
      }
    };

    // 格式化日期时间
    const formatDateTime = (dateTimeStr) => {
      if (!dateTimeStr) return "";
      const date = new Date(dateTimeStr);
      return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(
        date.getDate()
      )} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(
        date.getSeconds()
      )}`;
    };

    const padZero = (num) => {
      return num < 10 ? `0${num}` : num;
    };

    const pageCount = computed(() => {
      return Math.ceil(totalCount.value / pageSize.value);
    });

    const handleSearch = () => {
      currentPage.value = 1;
      fetchSalesInfo();
    };

    const handleReset = () => {
      searchParams.value = {
        id: "",
        productName: "",
        salesLocation: "",
        date: "",
      };
      currentPage.value = 1;
      fetchSalesInfo();
    };

    const showEditModel = ref(false);
    const showAddModel = ref(false);
    const currentEditItem = ref(null);
    const currentAddItem = ref({
      id: null,
      productName: "",
      salesLocation: "",
      saleTime: new Date().toISOString().split("T")[0], // 默认当天
      description: "",
    });

    const handleAdd = () => {
      currentAddItem.value = {
        id: null,
        productName: "",
        salesLocation: "",
        saleTime: new Date().toISOString().split("T")[0], // 默认当天
        description: "",
      };
      showAddModel.value = true; // 打开弹窗
    };

    const editInfo = async (id) => {
      const item = salesInfo.value.find((item) => item.id === id);
      if (item) {
        currentEditItem.value = {
          id: item.id,
          productName: item.productName,
          salesLocation: item.salesLocation,
          saleTime: item.saleTime,
          logisticId: item.logisticId,
          description: item.description,
        };
        showEditModel.value = true;
      }
    };

    const saveInfo = async () => {
      try {
        let response;
        if (showAddModel.value) {
          // 新增逻辑
          const backendData = {
            salePlaceId: salePlaceList.value.find(
                place => place.spAddress === currentAddItem.value.salesLocation
            )?.spId, // 映射到 salePlaceId
            logisticsId: Number(currentAddItem.value.logisticId), // 确保为数字
            saleTime: new Date(currentAddItem.value.saleTime).toISOString(), // 转ISO格式
            siDescription: currentAddItem.value.description
          };
          console.log("新增请求数据:", backendData);
          response = await axios.post("http://localhost:8080/saleinfo", backendData);
        } else {
          // 字段映射转换
          const backendData = {
            siId: currentEditItem.value.id,
            salePlaceId: salePlaceList.value.find(
              (place) => place.spAddress === currentEditItem.value.salesLocation
            )?.spId,
            logisticsId: currentEditItem.value.logisticId,
            saleTime: currentEditItem.value.saleTime,
            siDescription: currentEditItem.value.description,
          };
          console.log("edit的内容：", backendData);
          response = await axios.put(
            "http://localhost:8080/saleinfo",
            backendData
          );
        }
        console.log(response);
        if (response.data.code === 200) {
          alert('保存成功');
          currentAddItem.value = {
            id: null,
            productName: "",
            salesLocation: "",
            saleTime: new Date().toISOString().split("T")[0], // 默认当天
            description: "",
          };
          showEditModel.value = false;
          showAddModel.value = false;
          fetchSalesInfo(); // 保存成功后刷新数据
        } else {
          console.error("保存失败:", response.data.msg);
        }
      } catch (error) {
        console.error("保存出错:", error);
      }
    };

    // 打印销售单
    const printReceipt = (id) => {
      const item = salesInfo.value.find((item) => item.id === id);
      if (item) {
        const printContent = `
          <h2>农产品销售单</h2>
          <p><strong>产品名称：</strong>${item.productName}</p>
          <p><strong>销售地：</strong>${item.salesLocation}</p>
          <p><strong>销售时间：</strong>${formatDateTime(item.saleTime)}</p>
          <p><strong>物流序号：</strong>${item.logisticId}</p>
          <p><strong>说明：</strong>${item.description}</p>
          <p><strong>打印时间：</strong>${new Date().toLocaleString()}</p>
        `;
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
          <html>
            <head>
              <title>农产品收货单</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2 { color: #333; text-align: center; }
                p { margin: 10px 0; }
                strong { display: inline-block; width: 80px; }
              </style>
            </head>
            <body>
              ${printContent}
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() {
                    window.close();
                  }, 1000);
                };
              <\/script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    };

    // 批量打印
    const handlePrintAll = () => {
      if (salesInfo.value.length === 0) {
        alert("没有可打印的数据");
        return;
      }

      let printContent =
        '<h2>农产品销售信息汇总</h2><table border="1" cellspacing="0" cellpadding="5" style="width:100%;border-collapse:collapse;">';
      printContent += `
        <tr>
          <th>编号</th>
          <th>产品名称</th>
          <th>销售地</th>
          <th>销售时间</th>
          <th>物流序号</th>
          <th>说明</th>
        </tr>
      `;

      salesInfo.value.forEach((item) => {
        printContent += `
          <tr>
            <td>${item.id}</td>
            <td>${item.productName}</td>
            <td>${item.salesLocation}</td>
            <td>${formatDateTime(item.saleTime)}</td>
            <td>${item.logisticId}</td>
            <td>${item.description}</td>
          </tr>
        `;
      });

      printContent += "</table>";
      printContent += `<p style="text-align:right;margin-top:20px;">打印时间：${new Date().toLocaleString()}</p>`;

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>农产品物流信息汇总</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h2 { color: #333; text-align: center; }
              table { width: 100%; margin-top: 20px; }
              th { background-color: #f2f2f2; text-align: left; }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 1000);
              };
            <\/script>
          </body>
        </html>
      `);
      printWindow.document.close();
    };

    // 上一页
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        fetchSalesInfo();
      }
    };

    // 下一页
    const nextPage = () => {
      if (currentPage.value < pageCount.value) {
        currentPage.value++;
        fetchSalesInfo();
      }
    };

    // 每页条数变化
    const handlePageSizeChange = () => {
      currentPage.value = 1;
      fetchSalesInfo();
    };

    // 退出登录
    const logout = async () => {
      const isConfirmed = confirm("您确定要退出吗？");
      if (isConfirmed) {
        try {
          // 调用后端退出接口
          const response = await axios.post(
            "http://localhost:8080/user/logout"
          );

          if (response.data.code === 200) {
            // 清除本地用户信息
            currentUser.value = "";
            localStorage.removeItem("username");
            // localStorage.removeItem('token'); // 如果有token的话

            // 跳转到登录页
            router.push("/"); // 建议跳转到登录页而不是首页
          } else {
            alert("退出失败: " + response.data.msg);
          }
        } catch (error) {
          console.error("退出出错:", error);
          alert("退出时发生错误");
        } finally {
          // 无论如何都清除本地状态并跳转
          currentUser.value = "";
          localStorage.removeItem("username");
          router.push("/");
        }
      }
    };

    // 在onMounted中初始化数据
    onMounted(() => {
      currentUser.value =
        localStorage.getItem("username") || route.query.username;
      fetchSalesInfo();
      fetchProductList();
      fetchSalePlaceList();
      fetchLogisticList();
    });

    return {
      currentUser,
      salesInfo: salesInfo,
      currentPage,
      pageSize,
      pageCount,
      searchParams,
      formatDateTime,
      handleSearch,
      handleReset,
      totalCount,
      showAddModel,
      currentAddItem,
      showEditModel,
      currentEditItem,
      handleAdd,
      editInfo,
      saveInfo,
      printReceipt,
      handlePrintAll,
      deleteInfo,
      prevPage,
      nextPage,
      handlePageSizeChange,
      logout,
      productList,
      salePlaceList,
      fetchProductList,
      fetchSalePlaceList,
      logisticList,
      fetchLogisticList,
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
  overflow: hidden;
}

.content {
  flex: 1;
  padding: 10px;
  background-color: #ecf0f5;
  height: 100%;
  overflow-y: auto;
}

.sales-info-table {
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

.add-button,
.print-button {
  padding: 6px 15px;
  background-color: #00a65a;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.add-button:hover,
.print-button:hover {
  background-color: #008d4c;
}

.delete-button {
    padding: 4px 8px;
    background-color: #dd4b39;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
}

.delete-button:hover {
    background-color: #be4131;
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
  display: flex;
  align-items: center;
  margin-right: 15px;
  flex: 1;
}

.search-item label {
  width: 60px;
  text-align: right;
  margin-right: 8px;
  font-size: 14px;
}

.search-item input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.status-select {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
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

.search-button:hover {
  background-color: #367fa9;
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

.reset-button:hover {
  background-color: #e08e0b;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
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

.action-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.edit-button {
  padding: 4px 8px;
  background-color: #1e5cc0;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.edit-button:hover {
  background-color: #1a4fa0;
}

.print-receipt-button {
  padding: 4px 8px;
  background-color: #3c8dbc;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.print-receipt-button:hover {
  background-color: #367fa9;
}

.received-status {
  color: #00a65a;
  font-weight: bold;
  padding: 4px 8px;
  font-size: 12px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding: 10px 0;
  border-top: 1px solid #eee;
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
  font-size: 14px;
}

.pagination-button {
  padding: 5px 10px;
  background-color: #f5f5f5;
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
  background-color: #f5f5f5;
}

.page-number {
  padding: 5px 10px;
  background-color: #3c8dbc;
  color: white;
  border-radius: 3px;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 5px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  padding: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 97%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group textarea {
  min-height: 80px;
}

.form-select {
  width: 100%;
  padding: 8px;
  color: black;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-footer {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button {
  padding: 8px 15px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button {
  padding: 8px 15px;
  background-color: #3c8dbc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #367fa9;
}
</style>