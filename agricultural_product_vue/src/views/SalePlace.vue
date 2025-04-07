<template>
    <div class="salesPlace-info-container">
        <div class="main-container">
            <main class="content">
                <div class="salePlace-info-table">
                    <div class="table-header">
                        <button class="add-button" @click="handleAdd">新增</button>
                    </div>

                    <!-- 查询表单 -->
                    <div class="search-form">
                        <div class="search-row">
                            <div class="search-item">
                                <label>编号:</label>
                                <input type="text" v-model="searchParams.id" placeholder="请输入编号" />
                            </div>
                            <div class="search-item">
                                <label>地址:</label>
                                <input type="text" v-model="searchParams.address" placeholder="请输入地址" />
                            </div>
                            <div class="search-item">
                                <label>管理员:</label>
                                <input type="text" v-model="searchParams.administrator" placeholder="请输入管理员" />
                            </div>
                            <div class="search-item">
                                <label>联系电话:</label>
                                <input type="text" v-model="searchParams.phone" placeholder="请输入电话" />
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
                                    <th>地址</th>
                                    <th>管理员</th>
                                    <th>联系电话</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in salePlaceInfo" :key="item.id"
                                    :class="{ 'active-row': index % 2 === 0 }">
                                    <td>{{ item.id }}</td>
                                    <td>{{ item.address }}</td>
                                    <td>{{ item.administrator }}</td>
                                    <td>{{ item.phone }}</td>
                                    <td class="action-buttons">
                                        <button class="edit-button" @click="editInfo(item.id)">
                                            编辑
                                        </button>
                                        <button class="delete-button" @click="deleteInfo(item.id)">
                                            删除
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
                                    <h3>新增销售地信息</h3>
                                    <button @click="showAddModel = false" class="close-button">
                                        &times;
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="form-group">
                                        <label>地址:</label>
                                        <input type="text" v-model="currentAddItem.address" />
                                    </div>
                                    <div class="form-group">
                                        <label>管理员:</label>
                                        <input type="text" v-model="currentAddItem.administrator" />
                                    </div>
                                    <div class="form-group">
                                        <label>联系电话:</label>
                                        <input type="text" v-model="currentAddItem.phone" @input="handlePhoneInput"
                                            maxlength="11" :class="{ 'error': phoneError }" placeholder="请输入11位数字" />
                                        <div v-if="phoneError" class="error-message">必须输入11位数字</div>
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
                                        <label>地址:</label>
                                        <input type="text" v-model="currentEditItem.address" />
                                    </div>
                                    <div class="form-group">
                                        <label>管理员:</label>
                                        <input type="text" v-model="currentEditItem.administrator" />
                                    </div>
                                    <div class="form-group">
                                        <label>联系电话:</label>
                                        <input type="text" v-model="currentEditItem.phone" @input="handlePhoneInput"
                                            maxlength="11" :class="{ 'error': phoneError }" placeholder="请输入11位数字" />
                                        <div v-if="phoneError" class="error-message">必须输入11位数字</div>
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
            address: "",
            administrator: "",
            phone: "",
        });
        // 过滤后的数据
        const salePlaceInfo = ref([]);

        // 添加API请求方法
        const fetchSalePlace = async () => {
            try {
                const params = {
                    page: currentPage.value,
                    size: pageSize.value,
                    spId: searchParams.value.id,
                    spAddress: searchParams.value.address,
                    spAdministrator: searchParams.value.administrator,
                    spPhone: searchParams.value.phone,
                };
                console.log("实际发送的查询参数:", params);
                const response = await axios.post(
                    "http://localhost:8080/saleplace/page",
                    params
                );
                console.log("API响应数据:", response.data);

                if (response.data && response.data.code === 1) {
                    salePlaceInfo.value = response.data.data.records.map((item) => ({
                        id: item.spId,
                        address: item.spAddress,
                        administrator: item.spAdministrator,
                        phone: item.spPhone,
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
                        `http://localhost:8080/saleplace/${id}`
                    );
                    if (response.data.code === 1) {
                        handleSearch();
                    } else {
                        alert("删除失败: " + response.data.msg);
                    }
                } catch (error) {
                    console.error("删除出错:", error);
                }
            }
        };

        const pageCount = computed(() => {
            return Math.ceil(totalCount.value / pageSize.value);
        });

        const handleSearch = () => {
            currentPage.value = 1;
            fetchSalePlace();
        };

        const handleReset = () => {
            searchParams.value = {
                id: "",
                address: "",
                administrator: "",
                phone: "",
            };
            currentPage.value = 1;
            fetchSalePlace();
        };

        const showEditModel = ref(false);
        const showAddModel = ref(false);
        const currentEditItem = ref({
            id: null,
            address: "",
            administrator: "",
            phone: "",
        });
        const currentAddItem = ref({
            id: null,
            address: "",
            administrator: "",
            phone: "",
        });

        const phoneError = computed(() => {
            return (
                currentEditItem.value.phone.length > 0 &&
                !/^\d{11}$/.test(currentEditItem.value.phone)
            );
        });

        const handlePhoneInput = (e) => {
            // 1. 过滤非数字
            currentEditItem.value.phone = e.target.value.replace(/\D/g, "");
            // 2. 截断到11位
            if (currentEditItem.value.phone.length > 11) {
                currentEditItem.value.phone = currentEditItem.value.phone.slice(0, 11);
            }
        };

        const handleAdd = () => {
            currentAddItem.value = {
                id: null,
                address: "",
                administrator: "",
                phone: "",
            };
            showAddModel.value = true; // 打开弹窗
        };

        const editInfo = async (id) => {
            const item = salePlaceInfo.value.find((item) => item.id === id);
            if (item) {
                currentEditItem.value = {
                    id: item.id,
                    address: item.address,
                    administrator: item.administrator,
                    phone: item.phone,
                };
                showEditModel.value = true;
            }
        };

        const saveInfo = async () => {

            try {
                let response;
                if (currentAddItem.value.address != "") {
                    const backendData = {
                        spAddress: currentAddItem.value.address,
                        spAdministrator: currentAddItem.value.administrator,
                        spPhone: currentAddItem.value.phone,
                    };
                    if (!/^\d{11}$/.test(currentAddItem.value.phone)) {
                        alert("电话号码必须是11位数字！");
                        return; // 直接返回，不执行后续保存逻辑
                    }
                    console.log("add的内容：", backendData);
                    response = await axios.post(
                        "http://localhost:8080/saleplace",
                        backendData
                    );
                } else {
                    // 字段映射转换
                    const backendData = {
                        spId: currentEditItem.value.id,
                        spAddress: currentEditItem.value.address,
                        spAdministrator: currentEditItem.value.administrator,
                        spPhone: currentEditItem.value.phone,
                    };
                    if (!/^\d{11}$/.test(currentEditItem.value.phone)) {
                        alert("电话号码必须是11位数字！");
                        return; // 直接返回，不执行后续保存逻辑
                    }
                    console.log("edit的内容：", backendData);
                    response = await axios.put(
                        "http://localhost:8080/saleplace",
                        backendData
                    );
                }
                console.log(response);
                if (response.data.code === 1) {
                    currentAddItem.value = {
                        id: null,
                        address: "",
                        administrator: "",
                        phone: "",
                    };
                    showEditModel.value = false;
                    showAddModel.value = false;
                    fetchSalePlace(); // 保存成功后刷新数据
                } else {
                    console.error("保存失败:", response.data.msg);
                }
            } catch (error) {
                console.error("保存出错:", error);
            }
        };

        // 上一页
        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
                fetchSalePlace();
            }
        };

        // 下一页
        const nextPage = () => {
            if (currentPage.value < pageCount.value) {
                currentPage.value++;
                fetchSalePlace();
            }
        };

        // 每页条数变化
        const handlePageSizeChange = () => {
            currentPage.value = 1;
            fetchSalePlace();
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
            fetchSalePlace();
        });

        return {
            currentUser,
            salePlaceInfo: salePlaceInfo,
            currentPage,
            pageSize,
            pageCount,
            searchParams,
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
            phoneError,
            deleteInfo,
            handlePhoneInput,
            prevPage,
            nextPage,
            handlePageSizeChange,
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

.error {
    border: 1px solid red;
}

.error-message {
    color: red;
    font-size: 12px;
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

.salePlace-info-table {
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

.add-button:hover {
    background-color: #008d4c;
}

.search-form {
    background-color: #f9f9f9;
    padding: 15px 15px 15px 0;
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