<template>
  <div class="production-info-container">
    <div class="main-container">
      <main class="content">
        <div class="production-info-table">
          <div class="table-header">
            <div>
              <button class="add-button" @click="showAddDialog">新增</button>
            </div>
          </div>

          <!-- 查询表单 -->
          <div class="search-form">
            <div class="search-row">
              <div class="search-item">
                <label>生产编号：</label>
                <input type="text" v-model="searchParams.id" placeholder="请输入序号" />
              </div>
              <div class="search-item">
                <label>产品名称：</label>
                <input type="text" v-model="searchParams.productName" placeholder="请输入产品名称" />
              </div>
              <div class="search-item">
                <label>生产地：</label>
                <input type="text" v-model="searchParams.productionPlace" placeholder="请输入生产地" />
              </div>
            </div>
            <div class="search-row">
              <div class="search-item">
                <label>种子来源：</label>
                <input type="text" v-model="searchParams.seedSource" placeholder="请输入种子来源" />
              </div>
              <div class="search-item">
                <label>负责人：</label>
                <input type="text" v-model="searchParams.administrator" placeholder="请输入生产负责人" />
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
                <th>生产编号</th>
                <!-- 新增的生产编号列 -->
                <th>产品名称</th>
                <th>生产地</th>
                <th>种子来源</th>
                <th>播种时间</th>
                <th>收获时间</th>
                <th>生产描述</th>
                <th>负责人</th>
                <th>联系方式</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="productionInfo.length === 0">
                <td colspan="11" class="table-empty">暂无生产信息数据</td>
                <!-- 注意colspan改为11 -->
              </tr>
              <tr v-for="(item, index) in productionInfo" :key="item.id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ item.id || "无" }}</td>
                <td>{{ item.productName || "无" }}</td>
                <td>{{ item.productionPlace || "无" }}</td>
                <td>{{ item.seedSource || "无" }}</td>
                <td>{{ formatDateForDisplay(item.plantingDate) }}</td>
                <td>{{ formatDateForDisplay(item.harvestDate) }}</td>
                <td>{{ item.description || "无" }}</td>
                <td>{{ item.administrator || "无" }}</td>
                <td>{{ item.phone || "无" }}</td>
                <td>
                  <button class="edit-button" @click="showEditDialog(item)">
                    编辑
                  </button>
                  <button class="delete-button" @click="showDeleteConfirm(item.id)">
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
          <h3>{{ isEditMode ? "编辑生产信息" : "新增生产信息" }}</h3>
          <button class="close-button" @click="closeDialog">&times;</button>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="submitForm">
            <div class="form-grid">
              <!-- 第一列 -->
              <div class="form-column">
                <div class="form-item">
                  <label>产品名称：</label>
                  <select v-model="formData.productId" required>
                    <option value="">请选择产品名称</option>
                    <option v-for="product in productList" :key="product.pdId" :value="product.pdId">
                      {{ product.pdName }}
                    </option>
                  </select>
                </div>

                <div class="form-item">
                  <label>种子来源：</label>
                  <input type="text" v-model="formData.seedSource" required />
                </div>

                <div class="form-item">
                  <label>播种时间：</label>
                  <input type="datetime-local" v-model="formData.plantingDate" required step="1" />
                </div>

                <div class="form-item">
                  <label>负责人：</label>
                  <input type="text" v-model="formData.administrator" disabled placeholder="根据产地自动填充" />
                </div>
              </div>

              <!-- 第二列 -->
              <div class="form-column">
                <div class="form-item">
                  <label>生产地：</label>
                  <select class="place" v-model="formData.productPlaceId"
                    @change="handleProductionPlaceChange(formData.productPlaceId)" required>
                    <option value="">请选择生产地</option>
                    <option v-for="place in productionPlaceOptions" :key="place.value" :value="place.value">
                      {{ place.label }}
                    </option>
                  </select>
                </div>

                <div class="form-item">
                  <label>联系方式：</label>
                  <input type="text" v-model="formData.phone" disabled placeholder="根据产地自动填充" />
                </div>

                <div class="form-item">
                  <label>收获时间：</label>
                  <input type="datetime-local" v-model="formData.harvestDate" required step="1" />
                </div>

                <div class="form-item">
                  <label>生产描述：</label>
                  <input type="text" v-model="formData.description" required />
                </div>
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
    const currentUser = ref("");
    const showDialog = ref(false);
    const isEditMode = ref(false);
    const editingId = ref(null);
    const isSubmitting = ref(false);
    const productionPlaces = ref([]); // 存储所有生产地信息
    const productList = ref([]); // 存储所有产品信息
    const maxPiId = ref(0); // 存储当前最大的piId

    onMounted(() => {
      currentUser.value =
        localStorage.getItem("username") ||
        router.currentRoute.value.query.username;
      fetchProductionInfo();
      fetchProductionPlaces();
      fetchProductList(); // 新增：获取产品列表
    });

    // 查询参数
    const searchParams = ref({
      id: "",
      productName: "",
      productionPlace: "",
      seedSource: "",
      administrator: "",
    });

    // 表单数据
    const formData = ref({
      productId: "", // 改为存储产品ID
      productName: "", // 可以保留用于显示
      productPlaceId: "",
      seedSource: "",
      plantingDate: "",
      harvestDate: "",
      description: "",
      administrator: "",
      phone: "",
    });

    // 生产信息数据
    const productionInfo = ref([]);

    // 日期格式化辅助函数
    const formatDate = (dateString) => {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0]; // 格式化为 YYYY-MM-DD
      } catch {
        return dateString; // 如果已经是格式化好的字符串
      }
    };

    // 从后端获取生产信息数据
    const fetchProductionInfo = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/productinfo/page",
          {
            page: currentPage.value,
            size: pageSize.value,
            productInfoId: searchParams.value.id || undefined,
            productName: searchParams.value.productName || undefined,
            productPlace: searchParams.value.productionPlace || undefined,
            seed: searchParams.value.seedSource || undefined,
            administrator: searchParams.value.administrator || undefined,
          }
        );

        console.log("API响应数据:", response.data);

        if (response.data.code === 1) {
          const responseData = response.data.data;

          if (responseData && responseData.records) {
            productionInfo.value = responseData.records.map((item) => ({
              id: item.piId,
              productName: item.pdName,
              productionPlace: item.ppAddress,
              seedSource: item.seed,
              plantingDate: item.plantingDate,
              harvestDate: item.harvestDate,
              description: item.piDescription,
              administrator: item.ppAdministrator,
              phone: item.ppPhone,
              productId: item.productId,
              productPlaceId: item.productPlaceId,
            }));

            // 更新最大piId
            if (responseData.records.length > 0) {
              maxPiId.value = Math.max(
                ...responseData.records.map((item) => item.piId)
              );
            }

            totalItems.value = responseData.total || 0;
          } else {
            console.error("返回数据格式不正确:", responseData);
            productionInfo.value = [];
            totalItems.value = 0;
          }
        } else {
          console.error("API返回错误:", response.data.msg);
          productionInfo.value = [];
          totalItems.value = 0;
        }
      } catch (error) {
        console.error("获取数据失败:", {
          error: error.message,
          response: error.response?.data,
        });
        productionInfo.value = [];
        totalItems.value = 0;
      }
    };

    // 获取所有产品
    const fetchProductList = async () => {
      try {
        const response = await axios.get("http://localhost:8080/product/list");
        if (response.data.code === 1) {
          productList.value = response.data.data || [];
        } else {
          console.error("获取产品列表失败:", response.data.msg);
          productList.value = [];
        }
      } catch (error) {
        console.error("获取产品列表失败:", error);
        productList.value = [];
      }
    };

    // 获取选中的产品名称
    const selectedProductName = computed(() => {
      const selected = productList.value.find(
        (p) => p.pdId === formData.value.productId
      );
      return selected ? selected.pdName : "";
    });

    // 获取所有生产地信息
    const fetchProductionPlaces = async () => {
      try {
        console.log("开始获取生产地信息...");
        const response = await axios.get("http://localhost:8080/productplace");
        console.log("生产地API响应:", response.data);

        if (response.data.code === 1) {
          productionPlaces.value = response.data.data || [];
          console.log("生产地数据:", productionPlaces.value);
        } else {
          console.error("获取生产地信息失败:", response.data.msg);
          productionPlaces.value = [];
        }
      } catch (error) {
        console.error("获取生产地信息失败:", error);
        productionPlaces.value = [];
      }
    };

    // 用于获取生产地选项
    const productionPlaceOptions = computed(() => {
      try {
        if (!productionPlaces.value || !Array.isArray(productionPlaces.value)) {
          console.log("生产地数据无效或不是数组");
          return [];
        }

        const options = productionPlaces.value.map((place) => ({
          value: place.ppId,
          label: place.ppAddress,
          administrator: place.ppAdministrator,
          phone: place.ppPhone,
        }));

        console.log("生成的生产地选项:", options);
        return options;
      } catch (error) {
        console.error("生成生产地选项出错:", error);
        return [];
      }
    });

    // 当生产地改变时更新负责人和联系方式
    const handleProductionPlaceChange = (ppId) => {
      const selectedPlace = productionPlaces.value.find(
        (place) => place.ppId === ppId
      );
      if (selectedPlace) {
        formData.value.administrator = selectedPlace.ppAdministrator;
        formData.value.phone = selectedPlace.ppPhone;
        formData.value.productionPlace = selectedPlace.ppAddress; // 更新生产地地址
      } else {
        formData.value.administrator = "";
        formData.value.phone = "";
        formData.value.productionPlace = "";
      }
    };

    // 计算总页数
    const pageCount = computed(() => {
      return Math.ceil(totalItems.value / pageSize.value);
    });

    // 搜索处理
    const handleSearch = () => {
      currentPage.value = 1;
      fetchProductionInfo();
    };

    // 重置搜索
    const handleReset = () => {
      searchParams.value = {
        id: "",
        productName: "",
        productionPlace: "",
        seedSource: "",
        administrator: "",
      };
      fetchProductionInfo();
    };

    // 分页相关方法
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        fetchProductionInfo();
      }
    };

    const nextPage = () => {
      if (currentPage.value < pageCount.value) {
        currentPage.value++;
        fetchProductionInfo();
      }
    };

    const handlePageSizeChange = () => {
      currentPage.value = 1;
      fetchProductionInfo();
    };

    // 显示新增对话框
    const showAddDialog = async () => {
      isEditMode.value = false;

      try {
        // 确保已获取最新数据
        await fetchProductionInfo();

        formData.value = {
          id: maxPiId.value + 1, // 使用最大piId + 1
          productId: "",
          productPlaceId: "",
          seedSource: "",
          plantingDate: "",
          harvestDate: "",
          description: "",
          administrator: "",
          phone: "",
        };

        // 加载所需数据
        await Promise.all([
          productionPlaces.value.length === 0 && fetchProductionPlaces(),
          productList.value.length === 0 && fetchProductList(),
        ]);

        showDialog.value = true;
      } catch (error) {
        console.error("初始化新增对话框失败:", error);
        alert("初始化表单数据失败，请刷新页面重试");
      }
    };

    // 显示编辑对话框
    const showEditDialog = (item) => {
      isEditMode.value = true;
      editingId.value = item.id;
      formData.value = {
        productId: item.productId || "",
        productPlaceId: item.productPlaceId || "",
        seedSource: item.seedSource || "",
        plantingDate: item.plantingDate
          ? formatDateForInput(item.plantingDate)
          : "",
        harvestDate: item.harvestDate
          ? formatDateForInput(item.harvestDate)
          : "",
        description: item.description || "",
        administrator: item.administrator || "", // 保留但不允许编辑
        phone: item.phone || "", // 保留但不允许编辑
      };
      showDialog.value = true;
    };

    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        // 转换为本地日期时间字符串，去掉秒和时区部分
        return date.toISOString().slice(0, 16);
      } catch {
        return dateString;
      }
    };

    // 关闭对话框
    const closeDialog = () => {
      showDialog.value = false;
    };

    const submitForm = async () => {
      if (isSubmitting.value) return;
      isSubmitting.value = true;

      try {
        // 验证必填字段
        const requiredFields = [
          "productId",
          "productPlaceId",
          "seedSource",
          "plantingDate",
          "harvestDate",
        ];
        const missingFields = requiredFields.filter(
          (field) => !formData.value[field]
        );

        if (missingFields.length > 0) {
          alert(`以下必填字段未填写: ${missingFields.join(", ")}`);
          isSubmitting.value = false;
          return;
        }

        // 构建符合后端要求的请求数据
        const requestData = {
          piId: isEditMode.value ? editingId.value : 0, // 编辑时传piId，新增时为0
          productId: Number(formData.value.productId),
          productPlaceId: Number(formData.value.productPlaceId),
          seed: formData.value.seedSource,
          piDescription: formData.value.description || "",
          plantingDate: new Date(formData.value.plantingDate).toISOString(),
          harvestDate: new Date(formData.value.harvestDate).toISOString(),
        };

        console.log("提交数据:", JSON.stringify(requestData, null, 2));

        // 根据模式选择请求方法
        const method = isEditMode.value ? "put" : "post";
        const url = "http://localhost:8080/productinfo";

        // 发送请求
        const response = await axios({
          method,
          url,
          data: requestData,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data.code === 1) {
          alert(`${isEditMode.value ? "更新" : "添加"}成功`);
          closeDialog();
          await fetchProductionInfo(); // 刷新数据
        } else {
          throw new Error(response.data.msg || "操作失败");
        }
      } catch (error) {
        console.error("请求失败:", {
          error: error.message,
          request: error.config?.data ? JSON.parse(error.config.data) : null,
          response: error.response?.data,
        });

        let errorMsg = `${isEditMode.value ? "更新" : "添加"}失败: `;
        if (error.response?.status === 400) {
          errorMsg += "请求参数不正确 - ";
          if (error.response?.data?.errors) {
            errorMsg += Object.values(error.response.data.errors).join(", ");
          } else {
            errorMsg += "请检查所有必填字段是否填写正确";
          }
        } else {
          errorMsg += error.message;
        }
        alert(errorMsg);
      } finally {
        isSubmitting.value = false;
      }
    };

    // 确保日期格式正确
    const formatDateForBackend = (dateString) => {
      if (!dateString) return null; // 改为返回null而不是空字符串

      try {
        const date = new Date(dateString);
        // 确保时区处理正确
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);

        return adjustedDate.toISOString().replace("T", " ").replace(/\..+/, "");
      } catch (e) {
        console.error("日期格式化错误:", e);
        return null;
      }
    };

    const formatDateForDisplay = (dateString) => {
      if (!dateString) return "无";

      // 如果已经是正确的显示格式，直接返回
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)) {
        return dateString;
      }

      // 处理ISO格式或其他格式
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "无";

        const pad = (num) => num.toString().padStart(2, "0");
        return (
          `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
            date.getDate()
          )} ` +
          `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
            date.getSeconds()
          )}`
        );
      } catch (e) {
        console.error("日期显示格式化错误:", e);
        return dateString || "无";
      }
    };

    // 删除项
    const deleteItem = async (id) => {
      try {
        const response = await axios.delete(
          `http://localhost:8080/productinfo/${id}`
        );

        if (response.data.code === 1) {
          alert("删除成功");
          fetchProductionInfo(); // 刷新数据
        } else {
          // 根据接口文档，code=1表示成功，其他值表示失败
          alert(response.data.msg || "删除失败，请稍后重试");
        }
      } catch (error) {
        console.error("删除失败:", {
          error: error.message,
          response: error.response?.data,
        });

        let errorMsg = "删除失败";
        if (error.response?.data?.msg) {
          errorMsg += `: ${error.response.data.msg}`;
        } else if (error.message) {
          errorMsg += `: ${error.message}`;
        }

        alert(errorMsg);
      }
    };

    // 显示删除确认
    const showDeleteConfirm = (id) => {
      if (confirm("确定要删除这条生产信息吗？删除后无法恢复！")) {
        deleteItem(id);
      }
    };

    // 导航方法
    const logout = () => {
      const isConfirmed = confirm("您确定要退出吗？");
      if (isConfirmed) {
        currentUser.value = "";
        router.push("/");
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
      currentUser,
      productionInfo,
      currentPage,
      pageSize,
      totalItems,
      pageCount,
      searchParams,
      formData,
      showDialog,
      isEditMode,
      isSubmitting,
      productionPlaceOptions,
      productList,
      handleProductionPlaceChange,
      handleSearch,
      handleReset,
      prevPage,
      nextPage,
      handlePageSizeChange,
      showAddDialog,
      showEditDialog,
      closeDialog,
      submitForm,
      showDeleteConfirm,
      logout,
      goToHome,
      goToProduct,
      goToProduction,
      goToLogistics,
      goToSales,
      goToPersonal,
      formatDateForDisplay,
      formatDateForBackend,
    };
  },
};
</script>

<style scoped>
/* 样式部分保持不变，与之前相同 */

.main-container {
  display: flex;
  flex: 1;
}

.content {
  flex: 1;
  padding: 10px;
  background-color: #ecf0f5;
  max-height: 100%;
  overflow-y: auto;
}

.production-info-table {
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
  margin-right: 10px;
}

.print-button {
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

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
  /* 新增：表格内容水平居中 */
}

th,
td {
  padding: 10px;
  text-align: center;
  /* 修改：从left改为center */
  border-bottom: 1px solid #eee;
  white-space: nowrap;
  vertical-align: middle;
  /* 新增：垂直居中 */
}

/* 确保操作按钮组也居中 */
td .edit-button,
td .delete-button {
  display: inline-block;
  /* 确保按钮在同一行 */
  margin: 0 2px;
  /* 按钮间距 */
}

th {
  background-color: #f5f5f5;
  color: #333;
  font-weight: bold;
}

table tbody tr {
  height: 40px;
}

.table-empty {
  text-align: center;
  padding: 20px;
  color: #999;
}

table td {
  min-width: 80px;
  padding: 8px 12px;
}

table td:nth-child(2) {
  min-width: 70px;
}

tr:hover {
  background-color: #f9f9f9;
}

.active-row {
  background-color: #f9f9f9;
}

.edit-button {
  padding: 4px 8px;
  background-color: #3c8dbc;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 5px;
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

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding: 10px 0;
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
  width: 80.67px;
  height: 29.56px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 14px;
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
  width: 600px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.dialog-header h3 {
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}




.dialog-body {
  padding: 20px;
}

.dialog-body input:disabled {
  background-color: #f5f5f5;
  color: #666;
  cursor: not-allowed;
}

/* 添加 datetime-local 输入框的样式 */
input[type="datetime-local"] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  /* 统一字体大小 */
  height: 36px;
  /* 固定高度 */
  box-sizing: border-box;
  /* 确保padding不影响高度 */
  appearance: none;
  /* 移除默认样式 */
  -webkit-appearance: none;
  /* 针对webkit浏览器 */
}

input[type="datetime-local"]::placeholder {
  font-size: 14px;
  /* 统一占位文字大小 */
  color: #999;
  /* 统一占位文字颜色 */
}

/* 确保表单行高度适应 */
.form-row {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
  /* 垂直居中 */
}

/* 新增/修改的样式 */
.form-grid {
  display: flex;
  gap: 20px;
}

.form-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-item {
  display: flex;
  align-items: center;
  /* 垂直居中 */
  margin-bottom: 0;
}

.form-item label {
  width: 80px;
  /* 固定标签宽度 */
  text-align: right;
  /* 标签右对齐 */
  margin-right: 10px;
  /* 标签和输入框之间的间距 */
  font-size: 14px;
  flex-shrink: 0;
  /* 防止标签被压缩 */
}

.form-item input,
.form-item select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  height: 36px;
  box-sizing: border-box;
}

/* 其他样式保持不变 */

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-button {
  padding: 8px 15px;
  background-color: #f1f2f3;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
}

.confirm-button {
  padding: 8px 15px;
  background-color: #3c8dbc;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

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
}

.header-link {
  color: white;
  margin-left: 15px;
  text-decoration: none;
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

.production-info-table {
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
  margin-right: 10px;
}

.print-button {
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

/* 按钮容器调整 */
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

/* 确保表格行可见 */
table tbody tr {
  height: 40px;
  /* 固定行高 */
}

/* 空数据提示 */
.table-empty {
  text-align: center;
  padding: 20px;
  color: #999;
}

/* 确保单元格内容可见 */
table td {
  min-width: 80px;
  padding: 8px 12px;
}

tr:hover {
  background-color: #f9f9f9;
}

.active-row {
  background-color: #f9f9f9;
}

/* 操作按钮样式 */
.edit-button {
  padding: 4px 8px;
  background-color: #3c8dbc;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 5px;
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

/* 确保下拉框样式一致 */
select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  height: 36px;
  box-sizing: border-box;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
}

select:focus {
  outline: none;
  border-color: #3c8dbc;
}

select option {
  color: #333;
  background: white;
}

/* 对话框样式 */
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
  width: 700px;
  /* 稍微加宽对话框以适应两列布局 */
  max-width: 90%;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.dialog-header h3 {
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.dialog-body {
  padding: 20px;
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
  width: 80px;
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
  margin-top: 20px;
}

.cancel-button {
  padding: 8px 15px;
  background-color: #f1f2f3;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
}

.confirm-button {
  padding: 8px 15px;
  background-color: #3c8dbc;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}
</style>