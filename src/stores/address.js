import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import request from "@/utils/request";

export const useAddressStore = defineStore("address", {
  state: () => ({
    addressList: [],
    loading: false,
  }),
  actions: {
    // 获取地址列表
    async getAddressList() {
      const authStore = useAuthStore();
      const userId = authStore.userInfo?.id;
      if (!userId) return;

      this.loading = true;

      try {
        const res = await request.get('/address/get', {
            params: { userId }
        });
        const result = res.data
        this.addressList = result.data;
      } catch (error) {
        console.log("地址加载失败：", error);
      } finally {
        this.loading = false;
      }
    },
    // 删除地址
    async deleteAddress(addressId) {
      try {
        const res = await request.delete(`/address/delete/${addressId}`);
        if (res.data.code === '删除成功') {
            this.addressList = this.addressList.filter(item => item.id !== addressId);
            this.$message.success('地址删除成功');
        }
      } catch (error) {
        console.log("删除地址失败：", error);
      }
    },
    // 设置默认地址
    async setDefaultAddress(addressId) {
        const authStore = useAuthStore();
        const userId = authStore.userInfo?.id;

        try {
            const res = await request.put('/address/setDefault', null, {
                params: { id: addressId, userId: userId }
            });
            if (res.data === '设置成功') {
                await this.getAddressList();
            }
        } catch (error) {
            console.log("设置默认地址失败：", error);
        }
      
    },
  }



})