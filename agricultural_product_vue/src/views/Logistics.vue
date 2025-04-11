<template>
  <div class="logistics-info-container">
    <div class="main-container">
      <main class="content">
        <div class="logistics-info-table">
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
                <label>物流ID:</label>
                <input type="text" v-model="searchParams.id" placeholder="请输入ID" />
              </div>
              <div class="search-item">
                <label>出发时间:</label>
                <input type="date" v-model="searchParams.date" placeholder="请选择日期" />
              </div>
              <div class="search-item">
                <label>产品名称:</label>
                <input type="text" v-model="searchParams.productName" placeholder="请输入产品名称" />
              </div>
              <div class="search-item">
                <label>物流公司:</label>
                <input type="text" v-model="searchParams.companyName" placeholder="请输入物流公司" />
              </div>
            </div>
            <div class="search-row">
              <div class="search-item">
                <label>起始地:</label>
                <input type="text" v-model="searchParams.startLocation" placeholder="请输入起始地" />
              </div>
              <div class="search-item">
                <label>目的地:</label>
                <input type="text" v-model="searchParams.destination" placeholder="请输入目的地" />
              </div>
              <div class="search-item">
                <label>负责人:</label>
                <input type="text" v-model="searchParams.responsiblePerson" placeholder="请输入负责人" />
              </div>
              <div class="search-buttons">
                <button class="search-button" @click="handleSearch">
                  查询
                </button>
                <button class="reset-button" @click="handleReset">重置</button>
              </div>
            </div>
          </div>

          <!-- 表格部分 -->
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>产品名称</th>
                  <th>起始地</th>
                  <th>目的地</th>
                  <th>出发时间</th>
                  <th>到达时间</th>
                  <th>物流公司</th>
                  <th>负责人</th>
                  <th>联系方式</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in logisticsInfo" :key="item.id" :class="{ 'active-row': index % 2 === 0 }">
                  <td>{{ item.id }}</td>
                  <td>{{ item.productName }}</td>
                  <td>{{ item.startLocation }}</td>
                  <td>{{ item.destination }}</td>
                  <td>{{ formatDateTime(item.startTime) }}</td>
                  <td>{{ formatDateTime(item.endTime) }}</td>
                  <td>{{ item.companyName }}</td>
                  <td>{{ item.responsiblePerson }}</td>
                  <td>{{ item.contact }}</td>
                  <td class="action-buttons">
                    <button v-if="item.status === '未收货'" class="receive-button" @click="confirmReceipt(item.id)">
                      确认收货
                    </button>
                    <span v-else class="received-status">已收货</span>
                    <button class="delete-button" @click="deleteInfo(item.id)">
                      删除
                    </button>
                    <button class="print-receipt-button" @click="printReceipt(item.id)">
                      打印收货单
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
                  <h3>新增物流信息</h3>
                  <button @click="showAddModel = false" class="close-button">
                    &times;
                  </button>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label>产品名称:</label>
                    <select v-model="currentAddItem.id" class="form-select">
                      <option v-for="pi in piList" :value="pi.piId" :key="pi.piId">
                        {{ getProductName(pi.productId) }} (信息ID:
                        {{ pi.piId }})
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>起始地:</label>
                    <input type="text" v-model="currentAddItem.startLocation" />
                  </div>
                  <div class="form-group">
                    <label>目的地:</label>
                    <input type="text" v-model="currentAddItem.destination" />
                  </div>
                  <div class="form-group">
                    <label>出发时间:</label>
                    <input type="datetime-local" v-model="currentAddItem.startTime" step="1" />
                  </div>
                  <div class="form-group">
                    <label>到达时间:</label>
                    <input type="datetime-local" v-model="currentAddItem.endTime" step="1" />
                  </div>
                  <div class="form-group">
                    <label>物流公司:</label>
                    <select v-model="currentAddItem.companyName" class="form-select">
                      <option v-for="com in companyList" :value="com.comId" :key="com.comId">
                        {{ com.comName }} (负责人: {{ com.comAdministrator }})
                      </option>
                    </select>
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
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const currentPage = ref(1);
    const pageSize = ref(5);
    const currentUser = ref("");
    const totalCount = ref(0);
    const piList = ref([]);
    const productList = ref([]);
    const companyList = ref([]);

    // 查询参数
    const searchParams = ref({
      id: "",
      date: "",
      productName: "",
      companyName: "",
      startLocation: "",
      destination: "",
      responsiblePerson: "",
    });

    // 物流信息数据
    const logisticsInfo = ref([]);

    const fetchProductList = async () => {
      try {
        const response = await axios.get("http://localhost:8080/product/list");
        productList.value = response.data.data;
      } catch (error) {
        console.error("获取产品列表失败:", error);
      }
    };

    // 删除操作
    const deleteInfo = async (id) => {
      try {

        const response = await axios.delete(`http://localhost:8080/logistics/${id}`);
        if (response.data.code === 200) {
          alert('删除成功');
          currentPage.value = 1;

          // 重新获取数据
          await fetchLogisticsInfo();

        } else {
          alert("删除失败: " + response.data.msg);
        }
      } catch (error) {
        console.error("删除出错:", error);
        alert("删除失败: " + (error.response?.data?.msg || error.message));
      }
    };

    // 获取产品信息列表
    const fetchPiList = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/productinfo/list"
        );
        piList.value = response.data.data;
      } catch (error) {
        console.error("获取产品信息列表失败:", error);
      }
    };

    // 获取产品名称的函数
    const getProductName = (productId) => {
      const product = productList.value.find((p) => p.pdId === productId);
      return product ? product.pdName : "未知产品";
    };

    // 获取产品类型的函数
    const getProductType = (productId) => {
      const product = productList.value.find((p) => p.pdId === productId);
      return product ? product.type : "未知类型"; // 假设product对象有type字段
    };

    // 获取物流公司列表
    const fetchCompanyList = async () => {
      try {
        const response = await axios.get("http://localhost:8080/company/list");
        companyList.value = response.data.data;
      } catch (error) {
        console.error("获取物流公司列表失败:", error);
      }
    };

    // 获取物流信息
    const fetchLogisticsInfo = async () => {
      try {
        const params = {
          page: currentPage.value,
          size: pageSize.value,
          logId: searchParams.value.id ? parseInt(searchParams.value.id) : 0, // 转换为数字，空值时设为0
          pdName: searchParams.value.productName || "", // 确保不为undefined
          comName: searchParams.value.companyName || "",
          startLocation: searchParams.value.startLocation || "",
          destination: searchParams.value.destination || "",
          comAdministrator: searchParams.value.responsiblePerson || "",
          startTime: searchParams.value.date || "", // 确保时间格式正确

        };

        console.log("修正后的查询参数:", params);
        const response = await axios.post(
            "http://localhost:8080/logistics/page",
            params
        );

        if (response.data && response.data.code === 200) {
          if (response.data.data && response.data.data.records) {
            logisticsInfo.value = response.data.data.records.map((item) => ({
                id: item.logId,
                productName: item.pdName,
                companyName: item.comName,
                startLocation: item.startLocation,
                destination: item.destination,
                status: item.endTime == null ? "未收货" : "已收货",
                responsiblePerson: item.comAdministrator,
                startTime: item.startTime,
                endTime: item.endTime,
                contact: item.comPhone,
                productInfoId: item.productInfoId, // 添加这个字段
                companyId: item.companyId        // 添加这个字段
            }));
            totalCount.value = response.data.data.total || 0;
          } else {
            logisticsInfo.value = []; // 设置为空数组
            totalCount.value = 0;
            console.log("查询成功但没有数据记录");
          }
        } else {
          console.error("获取物流信息失败:", response.data?.msg);
        }
      } catch (error) {
        console.error("请求物流信息出错:", error);
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

    // 计算总页数
    const pageCount = computed(() => {
      return Math.ceil(totalCount.value / pageSize.value);
    });

    // 搜索处理
    const handleSearch = () => {
      currentPage.value = 1;
      fetchLogisticsInfo();
    };

    // 重置搜索
    const handleReset = () => {
      searchParams.value = {
        id: "",
        productName: "",
        companyName: "",
        startLocation: "",
        destination: "",
        startTime: "",
        endTime: "",
        status: "",
        responsiblePerson: "",
      };
      currentPage.value = 1;
      fetchLogisticsInfo();
    };

    // 新增物流信息
    const showAddModel = ref(false);
    const currentAddItem = ref({
      id: "",
      productName: "",
      companyName: "",
      startLocation: "",
      destination: "",
      startTime: "",
      endTime: "",
      status: "",
      responsiblePerson: "",
      contact: "",
    });

    const handleAdd = () => {
      currentAddItem.value = {
        id: "",
        productName: "",
        companyName: "",
        startLocation: "",
        destination: "",
        startTime: "",
        endTime: "",
        status: "",
        responsiblePerson: "",
        contact: "",
      };
      showAddModel.value = true;
    };

    // 保存物流信息
    const saveInfo = async () => {
      try {
        const formatForBackend = (dateTimeStr) => {
          if (!dateTimeStr) return null;
          const date = new Date(dateTimeStr);
          return date.toISOString(); // 转换为ISO格式
        };
        // 准备后端需要的数据，只包含必要字段
        const backendData = {
          productInfoId: parseInt(currentAddItem.value.id),
          companyId: parseInt(currentAddItem.value.companyName),
          startLocation: currentAddItem.value.startLocation,
          destination: currentAddItem.value.destination,
          startTime: formatForBackend(currentAddItem.value.startTime),
          endTime: formatForBackend(currentAddItem.value.endTime),
        };

        console.log("准备发送的数据:", JSON.stringify(backendData, null, 2));

        const response = await axios.post(
            "http://localhost:8080/logistics",
            backendData
        );

        if (response.data.code === 200) {
          alert('添加成功');
          showAddModel.value = false;
          fetchLogisticsInfo();
        } else {
          alert("保存失败: " + response.data.msg);
        }
      } catch (error) {
        console.error("保存物流信息出错:", error);
        if (error.response) {
          alert(`保存失败 (${error.response.status}): ${error.response.data.msg || '未知错误'}`);
        } else {
          alert('保存失败，请检查网络连接或联系管理员');
        }
      }
    };

    function getLocalISOString() {
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000; // 时区偏移（毫秒）
      return new Date(now.getTime() - offset).toISOString().slice(0, -1); // 移除末尾的'Z'
    }

    // 确认收货
    const confirmReceipt = async (id) => {
      try {
        const isConfirmed = confirm("您确定要确认收货吗？");
        if (!isConfirmed) return;

        // 从当前表格数据中获取完整信息
        const item = logisticsInfo.value.find(item => item.id === id);
        if (!item) {
          alert("未找到对应的物流信息");
          return;
        }

        // 准备更新数据，确保包含所有必要字段
        const updatedData = {
          logId: item.id,
          productInfoId: item.productInfoId, // 需要确保这个字段存在
          companyId: item.companyId, // 需要确保这个字段存在
          startLocation: item.startLocation,
          destination: item.destination,
          startTime: item.startTime, // 保持原有的开始时间
          endTime: new Date().toISOString(), // 设置当前时间为到达时间
          // 如果有其他必要字段，也需要包含
        };

        console.log("发送的更新数据:", updatedData); // 调试用

        const response = await axios.put(
            "http://localhost:8080/logistics",
            updatedData
        );

        if (response.data.code === 200) {
          alert('确认收货成功');
          fetchLogisticsInfo(); // 刷新列表
        } else {
          alert("确认收货失败: " + response.data.msg);
        }
      } catch (error) {
        console.error("确认收货出错:", error);
        alert("确认收货出错: " + (error.response?.data?.msg || error.message));
      }
    };

    // 打印收货单
    const printReceipt = (id) => {
      const item = logisticsInfo.value.find((item) => item.id === id);
      if (item) {
        const printContent = `
          <h2>农产品收货单</h2>
          <p><strong>产品名称：</strong>${item.productName}</p>
          <p><strong>物流公司：</strong>${item.companyName}</p>
          <p><strong>起始地：</strong>${item.startLocation}</p>
          <p><strong>目的地：</strong>${item.destination}</p>
          <p><strong>出发时间：</strong>${formatDateTime(item.startTime)}</p>
          <p><strong>到达时间：</strong>${formatDateTime(item.endTime)}</p>
          <p><strong>负责人：</strong>${item.responsiblePerson}</p>
          <p><strong>联系方式：</strong>${item.contact}</p>
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
      if (logisticsInfo.value.length === 0) {
        alert("没有可打印的数据");
        return;
      }

      let printContent =
        '<h2>农产品物流信息汇总</h2><table border="1" cellspacing="0" cellpadding="5" style="width:100%;border-collapse:collapse;">';
      printContent += `
        <tr>
          <th>ID</th>
          <th>产品名称</th>
          <th>起始地</th>
          <th>目的地</th>
          <th>出发时间</th>
          <th>到达时间</th>
          <th>物流公司</th>
          <th>负责人</th>
          <th>联系方式</th>
          <th>状态</th>
        </tr>
      `;

      logisticsInfo.value.forEach((item) => {
        printContent += `
          <tr>
            <td>${item.id}</td>
            <td>${item.productName}</td>
            <td>${item.startLocation}</td>
            <td>${item.destination}</td>
            <td>${formatDateTime(item.startTime)}</td>
            <td>${formatDateTime(item.endTime)}</td>
            <td>${item.companyName}</td>
            <td>${item.responsiblePerson}</td>
            <td>${item.contact}</td>
            <td>${item.status}</td>
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
        fetchLogisticsInfo();
      }
    };

    // 下一页
    const nextPage = () => {
      if (currentPage.value < pageCount.value) {
        currentPage.value++;
        fetchLogisticsInfo();
      }
    };

    // 每页条数变化
    const handlePageSizeChange = () => {
      currentPage.value = 1;
      fetchLogisticsInfo();
    };

    // 退出登录
    const logout = () => {
      const isConfirmed = confirm("您确定要退出吗？");
      if (isConfirmed) {
        currentUser.value = "";
        router.push("/");
      }
    };

    onMounted(() => {
      currentUser.value =
        localStorage.getItem("username") || route.query.username;
      fetchLogisticsInfo();
      fetchProductList();
      fetchPiList();
      fetchCompanyList();
    });

    return {
      currentUser,
      logisticsInfo,
      currentPage,
      pageSize,
      pageCount,
      searchParams,
      formatDateTime,
      handleSearch,
      handleReset,
      handleAdd,
      showAddModel,
      currentAddItem,
      saveInfo,
      confirmReceipt,
      printReceipt,
      handlePrintAll,
      totalCount,
      deleteInfo,
      prevPage,
      nextPage,
      handlePageSizeChange,
      companyList,
      piList,
      productList,
      getProductName,
      getProductType,
      logout,
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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

.logistics-info-table {
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
  align-items: center;
}

.search-row:last-child {
  margin-bottom: 0;
}

.search-item {
  width: 323px;
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.search-item label {
  width: 60px;
  text-align: left;
  margin-right: 8px;
  font-size: 14px;
}

.search-item input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.status-select {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 14px;
  background-color: white;
}

.search-buttons {
  width: 336px;
  display: flex;
  justify-content: flex-end;
  /* 让子元素靠右 */
  gap: 10px;
}

.search-button {
  padding: 6px 15px;
  background-color: #3c8dbc;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
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

.receive-button {
  padding: 4px 8px;
  background-color: #00a65a;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.receive-button:hover {
  background-color: #008d4c;
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