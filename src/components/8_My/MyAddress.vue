<template>
    <div class="my-address-container">
        <label class="title">地址管理</label>
        <div class="form-row">
            <el-button type="primary" @click="showEditForm">添加地址</el-button>
        </div>
        <!-- 编辑表单 -->
        <div class="edit" v-if="isEditing">
            <el-input
                v-model="address.contact"
                placeholder="请输入联系人"
                style="width: 25rem;" 
            />
            <el-input
                v-model="address.phone"
                placeholder="请输入电话号码"
                style="width: 25rem;" 
            />
            <SelectLocation v-model="address.area"></SelectLocation>
            <el-input
                v-model="address.detail"
                placeholder="请输入详细地址"
                style="width: 25rem;" 
            />
            <el-button type="primary" @click="handleSave">保存</el-button>
        </div>
        <!-- 显示表单 -->
        <div class="display" v-else>
            <my-address-item
                v-for="item in addressStore.addressList"
                :key="item.id"
                :addressInfo="item"
                @set-default="handleSetDefault"
                @delete="handleDelete"
            />
        </div>
    </div>
</template>

<script> 
    import { useAuthStore } from '@/stores/auth';
    import { useAddressStore } from '@/stores/address';
    import SelectLocation from './Common/SelectLocation.vue';
    import MyAddressItem from './Common/MyAddressItem.vue';

    export default {
        name: 'PageHealthData',
        components: {
            SelectLocation,
            MyAddressItem,
        },
        setup() {
            const authStore = useAuthStore();
            const addressStore = useAddressStore();
            return { authStore, addressStore }
        },

        data() {
            return {
                isEditing: false, // 是否显示编辑表单
                address: {
                    contact: '', // 联系人
                    phone: '', // 手机号
                    area: [], // 选中的地区
                    detail: '', // 详细地址
                },
            }
        },
        mounted() {
            this.addressStore.getAddressList();
        },
        methods: {
            showEditForm() {
                this.isEditing = !this.isEditing;
            },
            async handleSave() {
                if (this.address.area.length === 0 || !this.address.detail) {
                    this.$message.error('请填写完整地址');
                    return;
                }
                // 拼接地址
                // const fullAddress = this.area.join('') + this.detail;
                try {
                    // 发送请求保存地址
                    const res = await this.$http.post('/address/add', {
                        userId: this.authStore.userInfo.id,
                        contact: this.address.contact,
                        phone: this.address.phone,
                        area: this.address.area.join('/'),
                        detail: this.address.detail,
                    });
                    this.$message.success('地址保存成功');
                    await this.addressStore.getAddressList();
                    this.showEditForm();
                } catch (error) {
                    this.$message.error('地址保存失败');
                    console.log(error);
                }
            },
            handleDelete(id) {
                this.$confirm('确定要删除该地址吗?', '提示', { type: 'warning' })
                    .then(() => {
                        this.addressStore.deleteAddress(id);
                    });
            },
            handleSetDefault(id) {
                this.addressStore.setDefaultAddress(id).then(() => {
                    this.$message.success('已设为默认地址');
                });
            },
        }
    }
</script>

<style scoped>
    .my-address-container{
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        /* align-items: center; */

        gap: 0.5rem;
    }

    /* 标题 */
    .title {
        /* font-size: 36px; */
        font-size: clamp(1.5rem, 2vw, 2rem);
        font-weight: 700;
        margin-left: 1rem;

        position: relative;
    }

    /* 标题装饰线 */
    .title::after {
        content: "";
        height: clamp(1.8rem, 2.2vw, 2.2rem);
        width: 0.5rem;

        position: absolute;
        left: -1rem;
        top: 52%;
        transform: translateY(-50%);

        background-color: #ff2e63;

    }

    .form-row {
        width: 100%;
        height: auto;
        min-height: 10rem;

        /* background-color: #6eb6ff; */

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        gap: 0.5rem;
    }

    /* .display {
        width: 100%;
        height: auto;
        min-height: 10rem;

        background-color: #6eb6ff;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

        gap: 0.5rem;
    } */

    
</style>