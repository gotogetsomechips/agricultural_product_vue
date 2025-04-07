<template>
  <div class="production-place-container">
    <div class="main-container">
      <main class="content">
        <div class="production-place-table">
          <div class="table-header">
            <div>
              <button class="add-button" @click="showAddDialog">新增</button>
            </div>
          </div>

          <!-- 查询表单 -->
          <div class="search-form">
            <div class="search-row">
              <div class="search-item">
                <label>生产地编号：</label>
                <input type="text" v-model="searchParams.id" placeholder="请输入编号" />
              </div>
              <div class="search-item">
                <label>生产地地址：</label>
                <input type="text" v-model="searchParams.address" placeholder="请输入地址" />
              </div>
              <div class="search-item">
                <label>负责人：</label>
                <input type="text" v-model="searchParams.administrator" placeholder="请输入负责人" />
              </div>
              <div class="search-item buttons">
                <button class="search-button" @click="handleSearch">查询</button>
                <button class="reset-button" @click="handleReset">重置</button>
              </div>
            </div>
          </div>

          <!-- 表格部分 -->
          <table>
            <thead>
              <tr>
                <th>生产地编号</th>
                <th>生产地地址</th>
                <th>负责人</th>
                <th>联系电话</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in productionPlaces" :key="item.ppId" :class="{ 'active-row': item.ppId % 2 === 0 }">
                <td>{{ item.ppId }}</td>
                <td>{{ item.ppAddress }}</td>
                <td>{{ item.ppAdministrator }}</td>
                <td>{{ item.ppPhone }}</td>
                <td class="action-buttons">
                  <button class="edit-button" @click="showEditDialog(item)">
                    编辑
                  </button>
                  <button class="delete-button" @click="showDeleteConfirm(item.ppId)">
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
              {{ Math.min(currentPage * pageSize, totalItems) }} 条，共
              {{ totalItems }} 条
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
        </div>
      </main>
    </div>

    <!-- 新增/编辑对话框 -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog">
        <div class="dialog-header">
          <h3>{{ isEditMode ? "编辑生产地信息" : "新增生产地信息" }}</h3>
          <button class="close-button" @click="closeDialog">&times;</button>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="submitForm">
            <div class="form-row">
              <div class="form-item">
                <label>生产地地址：</label>
                <input type="text" v-model="formData.ppAddress" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <label>负责人：</label>
                <input type="text" v-model="formData.ppAdministrator" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <label>联系电话：</label>
                <input type="tel" v-model="formData.ppPhone" required />
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-button" @click="closeDialog">
                取消
              </button>
              <button type="submit" class="confirm-button" :disabled="isSubmitting">
                {{ isSubmitting ? "提交中..." : isEditMode ? "保存" : "添加" }}
              </button>
            </div>
          </form>
        </div>
      </div>
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
    const totalItems = ref(0);
    const showDialog = ref(false);
    const isEditMode = ref(false);
    const isSubmitting = ref(false);
    const editingId = ref(null);

    // 查询参数
    const searchParams = ref({
      id: "",
      address: "",
      administrator: "",
    });

    // 表单数据
    const formData = ref({
      ppId: null,  // 新增字段，用于编辑时使用
      ppAddress: "",
      ppAdministrator: "",
      ppPhone: "",
    });

    // 生产地信息数据
    const productionPlaces = ref([]);

    // 从后端获取生产地信息数据
    const fetchProductionPlaces = async () => {
      try {
        const params = {
          page: currentPage.value,
          size: pageSize.value,
          ppId: searchParams.value.id ? Number(searchParams.value.id) : undefined,
          ppAddress: searchParams.value.address || undefined,
          ppAdministrator: searchParams.value.administrator || undefined,
        };

        const response = await axios.post(
          "http://localhost:8080/productplace/page",
          params
        );

        if (response.data.code === 1) {
          productionPlaces.value = response.data.data?.records || [];
          totalItems.value = response.data.data?.total || 0;
        } else {
          console.error("API返回错误:", response.data.msg);
          productionPlaces.value = [];
          totalItems.value = 0;
        }
      } catch (error) {
        console.error("获取数据失败:", error);
        productionPlaces.value = [];
        totalItems.value = 0;
      }
    };

    // 计算总页数
    const pageCount = computed(() => {
      return Math.ceil(totalItems.value / pageSize.value);
    });

    // 搜索处理
    const handleSearch = () => {
      currentPage.value = 1;
      fetchProductionPlaces();
    };

    // 重置搜索
    const handleReset = () => {
      searchParams.value = {
        id: "",
        address: "",
        administrator: "",
      };
      fetchProductionPlaces();
    };

    // 分页相关方法
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        fetchProductionPlaces();
      }
    };

    const nextPage = () => {
      if (currentPage.value < pageCount.value) {
        currentPage.value++;
        fetchProductionPlaces();
      }
    };

    const handlePageSizeChange = () => {
      currentPage.value = 1;
      fetchProductionPlaces();
    };

    // 显示新增对话框
    const showAddDialog = () => {
      isEditMode.value = false;
      formData.value = {
        ppId: null,
        ppAddress: "",
        ppAdministrator: "",
        ppPhone: "",
      };
      showDialog.value = true;
    };

    // 显示编辑对话框
    const showEditDialog = (item) => {
      isEditMode.value = true;
      editingId.value = item.ppId;
      formData.value = {
        ppId: item.ppId,
        ppAddress: item.ppAddress,
        ppAdministrator: item.ppAdministrator,
        ppPhone: item.ppPhone,
      };
      showDialog.value = true;
    };

    // 关闭对话框
    const closeDialog = () => {
      showDialog.value = false;
    };

    // 提交表单（新增/编辑）
    const submitForm = async () => {
      if (isSubmitting.value) return;
      isSubmitting.value = true;

      try {
        // 构建符合接口要求的请求数据
        const requestData = {
          ppId: formData.value.ppId || 0, // 新增时为0，编辑时为当前ID
          ppAddress: formData.value.ppAddress,
          ppAdministrator: formData.value.ppAdministrator,
          ppPhone: formData.value.ppPhone,
        };

        // 根据模式选择请求方法
        const method = isEditMode.value ? "put" : "post";
        const url = "http://localhost:8080/productplace";

        const response = await axios({
          method,
          url,
          data: requestData,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data.code === 1) {
          alert(`${isEditMode.value ? "更新" : "添加"}成功`);
          closeDialog();
          fetchProductionPlaces(); // 刷新数据
        } else {
          throw new Error(response.data.msg || "操作失败");
        }
      } catch (error) {
        console.error("请求失败:", {
          error: error.message,
          response: error.response?.data
        });
        alert(`${isEditMode.value ? "更新" : "添加"}失败: ${error.message}`);
      } finally {
        isSubmitting.value = false;
      }
    };

    // 删除项
    const deleteItem = async (id) => {
      try {
        const response = await axios.delete(
          `http://localhost:8080/productplace/${id}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        if (response.data.code === 1) {
          alert("删除成功");
          // 如果删除的是当前页的最后一条数据且不是第一页，则返回上一页
          if (productionPlaces.value.length === 1 && currentPage.value > 1) {
            currentPage.value--;
          }
          fetchProductionPlaces();
        } else {
          throw new Error(response.data.msg || "删除失败");
        }
      } catch (error) {
        console.error("删除失败:", error);
        alert(`删除失败: ${error.message}`);
      }
    };

    // 显示删除确认
    const showDeleteConfirm = (id) => {
      if (confirm("确定要删除这条生产地信息吗？删除后无法恢复！")) {
        deleteItem(id);
      }
    };

    // 初始化数据
    onMounted(() => {
      fetchProductionPlaces();
    });

    return {
      currentPage,
      pageSize,
      totalItems,
      pageCount,
      searchParams,
      productionPlaces,
      handleSearch,
      handleReset,
      prevPage,
      nextPage,
      handlePageSizeChange,
      showDialog,
      isEditMode,
      isSubmitting,
      formData,
      showAddDialog,
      showEditDialog,
      closeDialog,
      submitForm,
      showDeleteConfirm,
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
  height: 100%;
  overflow-y: auto;
}

.production-place-table {
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

.add-button {
  padding: 6px 15px;
  background-color: #00a65a;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
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
  justify-content: space-between;
  align-items: center;
}

.search-item {
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 20px;
}

.search-item:last-child {
  margin-left: 0;
}

.search-item label {
  width: 85px;
  text-align: left;
  margin-left: 5px;
  font-size: 14px;
}

.search-item input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-item.buttons {
  justify-content: flex-end;
}

.search-button,
.reset-button {
  padding: 6px 15px;
  margin-left: 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.search-button {
  background-color: #3c8dbc;
  color: white;
}

.reset-button {
  background-color: #f39c12;
  color: white;
}

.search-button:hover {
  background-color: #367fa9;
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
  background-color: #c73c29;
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

.dialog-overlay {
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

.dialog {
  background-color: white;
  border-radius: 5px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dialog-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h3 {
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.dialog-body {
  padding: 15px;
}

.form-row {
  display: flex;
  margin-bottom: 15px;
}

.form-item {
  flex: 1;
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.form-item:last-child {
  margin-right: 0;
}

.form-item label {
  width: 85px;
  text-align: right;
  margin-right: 10px;
  font-size: 14px;
}

.form-item input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
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