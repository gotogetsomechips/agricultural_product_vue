<template>
  <div class="product-info-container">
    <div class="main-container">
      <main class="content">
        <div class="product-info-table">
          <div class="table-header">
            <div>
              <button class="add-button" @click="handleAdd">新增</button>
            </div>
          </div>

          <!-- 查询表单 -->
          <div class="search-form">
            <div class="search-row">
              <div class="search-item">
                <label>产品名称：</label>
                <input
                  type="text"
                  v-model="searchParams.productName"
                  placeholder="请输入产品名称"
                />
              </div>
              <div class="search-item">
                <label>产品类型：</label>
                <select v-model="searchParams.type">
                  <option
                    v-for="option in productTypeOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
              </div>
              <div class="search-item">
                <button
                  class="search-button"
                  @click="handleSearch"
                  style="margin-left: 20px"
                >
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
              <th>产品名称</th>
              <th>产品类型</th>
              <th>单价</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in paginatedData"
                :key="item.pdId"
                :class="{ 'active-row': index % 2 === 0 }"
              >
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ item.pdName }}</td>
                <td>{{ item.type }}</td>
                <td>{{ item.unitPrice }}</td>
                <td class="action-buttons">
                  <button class="detail-button" @click="showDetail(item)">
                    详情
                  </button>
                  <button class="editProduct-button" @click="showEdit(item)">
                    编辑
                  </button>
                  <button
                    class="deleteProduct-button"
                    @click="deleteProduct(item)"
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
              {{ Math.min(currentPage * pageSize, productInfo.length) }} 条，共
              {{ productInfo.length }} 条
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
      v-if="showDetailComponent || showEditComponent||showAddComponent"
      class="modal-overlay"
      @click="hideModal"
    ></div>
    <!-- 新增模态框 -->
    <div v-if="showAddComponent" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>新增农产品</h2>
          <button class="close-button" @click="hideAdd">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group input-group">
            <label for="newImage">图片: </label>
            <input
              type="file"
              id="newImage"
              @change="handleImageChange($event)"
            />
            <img
              v-if="newProduct.image"
              :src="newProduct.image"
              alt="预览图片"
              style="width: 80px; height: 80px; margin-bottom: 10px"
            />
          </div>
          <br />
          <div class="form-group input-group">
            <label for="newProductName">产品名称: </label>
            <input
              type="text"
              id="newProductName"
              v-model="newProduct.pdName"
            />
          </div>
          <br />
          <div class="form-group input-group">
            <label for="newProductType">产品类型: </label>
            <select id="newProductType" v-model="newProduct.type">
              <option
                v-for="option in productTypeOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
          <br />
          <div class="form-group input-group">
            <label for="newUnitPrice">单价: </label>
            <input
                type="number"
                id="newUnitPrice"
                v-model="newProduct.unitPrice"
                step="0.01"
                min="0"
            />
          </div>
          <br />
          <div class="form-group input-group">
            <label for="newDescription">描述: </label>
            <textarea
              id="newDescription"
              v-model="newProduct.pdDescription"
            ></textarea>
          </div>
          <br />
        </div>
        <div class="modal-footer">
          <button class="addConfirm-button" @click="addProduct">
            确认添加
          </button>
          <button class="back-button" @click="hideAdd">返回</button>
        </div>
      </div>
    </div>
    <!-- 详情模态框 -->
    <div v-if="showDetailComponent" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>农产品详情</h2>
          <button class="close-button" @click="hideDetail">×</button>
        </div>
        <div class="modal-body">
          <img :src="currentProduct.image" alt="农产品图片" /><br />
          <div class="form-group input-group">
            <label style="width: 80px; text-align: right; margin-left: 160px"
              >产品名称:
            </label>
            <span>{{ currentProduct.pdName }}</span>
          </div>
          <br />
          <div class="form-group input-group">
            <label style="width: 80px; text-align: right; margin-left: 160px"
              >产品类型:
            </label>
            <span>{{ currentProduct.type }}</span>
          </div>
          <br />
          <div class="form-group input-group">
            <label style="width: 80px; text-align: right; margin-left: 160px"
              >描述:
            </label>
            <span>{{ currentProduct.pdDescription }}</span>
          </div>
          <br />
        </div>
        <div class="modal-footer">
          <button class="back-button" @click="hideDetail">返回</button>
        </div>
      </div>
    </div>

    <!-- 修改模态框 -->
    <div v-if="showEditComponent" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>农产品编辑</h2>
          <button class="close-button" @click="hideEdit">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group input-group">
            <label for="image">图片: </label>
            <input type="file" id="image" @change="handleImageChange($event)" />
            <img
              v-if="currentProduct.image"
              :src="currentProduct.image"
              alt="预览图片"
              style="width: 80px; height: 80px; margin-bottom: 10px"
            />
          </div>
          <br />
          <div class="form-group input-group">
            <label for="productName">产品名称: </label>
            <input
              type="text"
              id="productName"
              v-model="currentProduct.pdName"
            />
          </div>
          <br />
          <div class="form-group input-group">
            <label for="productType">产品类型: </label>
            <select id="productType" v-model="currentProduct.type">
              <option
                v-for="option in productTypeOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
          <br />
          <div class="form-group input-group">
            <label for="unitPrice">单价: </label>
            <input
                type="number"
                id="unitPrice"
                v-model="currentProduct.unitPrice"
                step="0.01"
                min="0"
            />
          </div>
          <br />
          <div class="form-group input-group">
            <label for="description">描述: </label>
            <textarea
              id="description"
              v-model="currentProduct.pdDescription"
            ></textarea>
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

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const currentUser = ref("");
    const currentPage = ref(1);
    const pageSize = ref(5);
    const showDetailComponent = ref(false);
    const showEditComponent = ref(false);
    const token = localStorage.getItem("token");
    const item = ref({
      pdName: "",
      type: "",
    });
    const currentProduct = ref({
      pdId: "",
      pdName: "",
      type: "",
      pdDescription: "",
      image: "",
      unitPrice: 0
    });
    const productTypeOptions = ref([
      "水果",
      "蔬菜",
      "鲜花",
      "肉类",
      "奶制品",
      "其他",
    ]);
    onMounted(() => {
      currentUser.value =
        localStorage.getItem("username") || route.query.username;
    });
    // 查询参数
    const searchParams = ref({
      productName: "",
      type: "",
    });

    // 过滤后的数据
    const productInfo = ref([]);

    // 计算总页数
    const pageCount = computed(() => {
      return Math.ceil(productInfo.value.length / pageSize.value);
    });

    // 获取当前页数据
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return productInfo.value.slice(start, end);
    });

    // 搜索处理
    const handleSearch = async () => {
      currentPage.value = 1; // 重置到第一页
      try {
        const response = await axios.post(
          "http://localhost:8080/product/page",
          {
            page: currentPage.value,
            size: pageSize.value,
            productName: searchParams.value.productName,
            type: searchParams.value.type,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.data.code === 200) {
          productInfo.value = response.data.data.records || [];
          if (response.data.data.length > 0) {
            item.value.pdName = response.data.data[0].pdName;
            item.value.type = response.data.data[0].type;
            currentProduct.value.pdId = response.data.data[0].pdId;
            currentProduct.value.pdName = response.data.data[0].pdName;
            currentProduct.value.type = response.data.data[0].type;
            currentProduct.value.pdDescription =
              response.data.data[0].pdDescription;
            currentProduct.value.image = response.data.data[0].image;
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
    const newProduct = ref({
      pdName: "",
      type: "",
      pdDescription: "",
      image: "",
      unitPrice: 0
    });

    const showAdd = () => {
      showAddComponent.value = true;
    };

    const hideAdd = () => {
      showAddComponent.value = false;
      // 重置新增农产品信息
      newProduct.value = {
        pdName: "",
        type: "",
        pdDescription: "",
        image: "",
      };
    };
    onMounted(() => {
      showAllProduct();
    });
    const showAllProduct = async () => {
      try {
        const response = await axios.get("http://localhost:8080/product/list", {
          headers: {
            Authorization: token,
          },
        });
        if (response.data.code === 200) {
          productInfo.value = response.data.data;
          if (response.data.data.length > 0) {
            item.value.pdName = response.data.data[0].pdName;
            item.value.type = response.data.data[0].type;
            currentProduct.value.pdId = response.data.data[0].pdId;
            currentProduct.value.pdName = response.data.data[0].pdName;
            currentProduct.value.type = response.data.data[0].type;
            currentProduct.value.pdDescription =
              response.data.data[0].pdDescription;
            currentProduct.value.image = response.data.data[0].image;
          }
        } else {

        }
      } catch (error) {
        console.error("查询失败:", error);
      }
    };
     // 重置搜索
     const handleReset = () => {
      searchParams.value = {
        productName: "",
        type: "",
      };
     showAllProduct();
    };
    const uploadMessage = ref("");
    const selectedFile = ref(null);
    const handleImageChange = (event) => {
      selectedFile.value = event.target.files[0];
      alert("图片上传成功");
    };

    const addProduct = async () => {
      if (!selectedFile.value) {
        uploadMessage.value = "请选择图片";
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile.value);
      try {
        const uploadResponse = await axios.post(
            "http://localhost:8080/upload",
            formData,
            {
              headers: {
                Authorization: token,
              },
            }
        );
        if (uploadResponse.data.code === 200) {
          uploadMessage.value = uploadResponse.data.data;

          try {
            const response = await axios.post(
                "http://localhost:8080/product",
                {
                  pdName: newProduct.value.pdName,
                  type: newProduct.value.type,
                  pdDescription: newProduct.value.pdDescription,
                  image: uploadMessage.value,
                  unitPrice: newProduct.value.unitPrice
                },
                {
                  headers: {
                    Authorization: token,
                  },
                }
            );
            if (response.data.code === 200) {
              showAllProduct();
              hideAdd();
              selectedFile.value = null;
              uploadMessage.value = "";
              alert("添加成功");
            } else {
              alert(response.data.msg);
            }
          } catch (error) {
            console.error("添加错误:", error);
          }
        } else {
          alert(uploadResponse.data.msg);
        }
      } catch (error) {
        console.error("上传图片失败:", error);
        alert("上传图片失败，请稍后重试");
      }
    };

    const showDetail = (item) => {
      currentProduct.value = { ...item };
      showDetailComponent.value = true;
    };
    const hideDetail = () => {
      showDetailComponent.value = false;
    };

    const showEdit = (item) => {
      currentProduct.value = { ...item };
      showEditComponent.value = true;
    };

    const hideEdit = () => {
      showEditComponent.value = false;
    };

    const saveChanges = async () => {
      if (selectedFile.value) {
        const formData = new FormData();
        formData.append("file", selectedFile.value);
        try {
          const uploadResponse = await axios.post(
              "http://localhost:8080/upload",
              formData,
              {
                headers: {
                  Authorization: token,
                },
              }
          );
          if (uploadResponse.data.code === 200) {
            uploadMessage.value = uploadResponse.data.data;
            try {
              const response = await axios.put(
                  "http://localhost:8080/product",
                  {
                    pdId: currentProduct.value.pdId,
                    pdName: currentProduct.value.pdName,
                    type: currentProduct.value.type,
                    pdDescription: currentProduct.value.pdDescription,
                    image: uploadMessage.value,
                    unitPrice: currentProduct.value.unitPrice
                  },
                  {
                    headers: {
                      Authorization: token,
                    },
                  }
              );
              if (response.data.code === 200) {
                showAllProduct();
                hideEdit();
                selectedFile.value = null;
                uploadMessage.value = "";
                alert("修改成功");
              } else {
                alert(response.data.msg);
              }
            } catch (error) {
              console.error("修改错误:", error);
            }
          } else {
            alert(uploadResponse.data.msg);
          }
        } catch (error) {
          console.error("上传图片失败:", error);
          alert("上传图片失败，请稍后重试");
        }
      } else {
        try {
          const response = await axios.put(
              "http://localhost:8080/product",
              {
                pdId: currentProduct.value.pdId,
                pdName: currentProduct.value.pdName,
                type: currentProduct.value.type,
                pdDescription: currentProduct.value.pdDescription,
                image: currentProduct.value.image,
                unitPrice: currentProduct.value.unitPrice
              },
              {
                headers: {
                  Authorization: token,
                },
              }
          );
          if (response.data.code === 200) {
            showAllProduct();
            hideEdit();
            alert("修改成功");
          } else {
            alert(response.data.msg);
          }
        } catch (error) {
          console.error("修改错误:", error);
        }
      }
    };

    const deleteProduct = async (item) => {
      currentProduct.value = { ...item };
      const id = currentProduct.value.pdId;
      const isConfirmed = confirm("您确定要删除这条数据吗？");
      if (isConfirmed) {
        try {
          const response = await axios.delete(
            "http://localhost:8080/product/" + id,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          if (response.data.code === 200) {
            alert("删除成功");
            showAllProduct();
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
      currentUser,
      item,
      productInfo,
      paginatedData,
      currentPage,
      pageSize,
      pageCount,
      productTypeOptions,
      searchParams,
      handleSearch,
      handleReset,
      prevPage,
      nextPage,
      handlePageSizeChange,
      logout,
      goToPersonal,
      goToHome,
      goToProduct,
      goToProduction,
      goToLogistics,
      goToSales,
      showDetailComponent,
      currentProduct,
      showDetail,
      hideDetail,
      showEditComponent,
      hideEdit,
      saveChanges,
      deleteProduct,
      showEdit,
      showAllProduct,
      handleAdd,
      showAddComponent,
      newProduct,
      showAdd,
      hideAdd,
      addProduct,
      handleImageChange,
      uploadMessage,
      selectedFile,
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

.product-info-table {
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
.deleteProduct-button {
  padding: 6px 15px;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
  background-color: #f39c12;
}
.editProduct-button {
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