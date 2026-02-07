<template>
    <div class="container">
        <el-row>
            <el-col :span="24">
                <span class="title">服务管理</span>
            </el-col>
        </el-row>
        <el-row :span="24"> 
            <el-col>
                <el-table :data="tableData" border style="width: 100%">
                    <!-- 序号 -->
                    <el-table-column type="index" label="序号" width="100rem" align="center"/>
                    <!-- 标题 -->
                    <el-table-column label="标题" width="200rem" align="center">
                        <template #default="scope">
                            <el-input v-model="scope.row.title" placeholder="请输入内容"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 服务类型 -->
                    <el-table-column label="服务类型" width="200rem" align="center">
                        <template #default="scope">
                            <el-input v-model="scope.row.type" placeholder="请输入内容"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 简介 -->
                    <el-table-column label="简介" width="200rem" align="center">
                        <template #default="scope">
                            <el-input v-model="scope.row.introduce" placeholder="请输入内容"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 内容 -->
                    <el-table-column label="内容" width="200rem" align="center">
                        <template #default="scope">
                            <div class="upload-cell">
                                <!-- 需要完善！ -->
                                <label v-if="scope.row.contentUrl" class="cell-content">
                                    {{ $getFileUrl(scope.row.contentUrl) }}
                                </label>
                                <el-upload
                                    class="upload"
                                    action="#"
                                    :auto-upload="false"
                                    :show-file-list="false"
                                    :on-change="(file) => UploadMarkdown(file, scope.$index)"
                                >
                                    <el-button type="primary" size="small">
                                        {{ scope.row.contentUrl ? '更换' : '上传' }}
                                    </el-button>
                                </el-upload>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- 提供方 -->
                    <el-table-column label="提供方" width="200rem" align="center">
                        <template #default="scope">
                            <el-input v-model="scope.row.provider" placeholder="请输入内容"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 地区 -->
                    <el-table-column label="地区" width="200rem" align="center">
                        <template #default="scope">
                            <el-input v-model="scope.row.location" placeholder="请输入内容"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 价格 -->
                    <el-table-column label="服务价格" width="200rem" align="center">
                        <template #default="scope">
                            <el-input v-model="scope.row.price" placeholder="请输入内容"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 工作时间 -->
                    <el-table-column label="工作时间" width="200rem" align="center">
                        <template #default="scope">
                            <el-input v-model="scope.row.workTime" placeholder="请输入内容"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 图片 -->
                    <el-table-column label="图片" width="200rem" align="center">
                        <template #default="scope">
                            <div class="upload-cell">
                                <img v-if="scope.row.imgUrl"
                                    :src="$getFileUrl(scope.row.imgUrl)"
                                    :key="scope.row.imgUrl"
                                    class="cell-img"
                                />
                                <el-upload
                                    class="upload"
                                    action="#"
                                    :auto-upload="false"
                                    :show-file-list="false"
                                    :on-change="(file) => UploadImg(file, scope.$index)"
                                >
                                    <el-button type="primary" size="small">
                                        {{ scope.row.imgUrl ? '更换' : '上传' }}
                                    </el-button>
                                </el-upload>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- 链接 -->
                    <el-table-column label="链接" width="200rem" align="center">
                        <template #default="scope">
                            <el-input v-model="scope.row.link" placeholder="请输入链接"></el-input>
                        </template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column label="操作" width="200rem" align="center" class="operation">
                        <template #default="scope">
                            <div class="oper-btns"> 
                                <!-- 上移 -->
                                <el-button size="small"
                                    :disabled="scope.$index === 0"
                                    @click="moveUp(scope.$index)"
                                >前移</el-button>
                                <!-- 下移 -->
                                <el-button size="small"
                                    :disabled="scope.$index === tableData.length - 1"
                                    @click="moveDown(scope.$index)"
                                >后移</el-button>                                 
                                <!-- 删除 -->
                                <el-button type="danger" @click="deleteRow(scope.$index)">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-button type="primary" @click="addRow">添加服务</el-button>
                <el-button type="primary" @click="saveRow">保存</el-button>
            </el-col>
        </el-row>


    </div>
</template>

<script>
    export default {
        name: 'ManageService',
        data() {
            return {
                tableData: [],
            }
        },
        created() {
            this.getRow();
        },
        methods: {
            // 获取服务信息
            async getRow() {
                try {
                    const res = await this.$http.get('/service/all');
                    this.tableData = res;
                } catch (error) {
                    console.log('服务数据获取失败：' + error);

                }
            },
            // 添加服务
            addRow() {
                this.tableData.push({
                    id: 0,
                    sortOrder: this.tableData.length,
                    title: "新标题",
                    type: "类型",
                    introduce: "新简介",
                    contentUrl: "",
                    provider: "提供者",
                    workTime: "00:00-00:00",
                    location: "地点",
                    price: "价格",
                    imgUrl: '',
                    link: '新链接',
                });
            },
            // 删除服务
            deleteRow(index) {
                this.tableData.splice(index, 1);
            },
            // 上传图片
            async UploadImg(file, index) {
                if (!file || !file.raw) {
                    return;
                }

                if (this.tableData[index] === undefined) {
                    this.$message.error('请稍后再试');
                    return;
                }

                let formData = new FormData();
                formData.append('file', file.raw); // file.raw 是原始文件对象

                if (this.tableData[index].imgUrl) {
                    formData.append('oldUrl', this.tableData[index].imgUrl);
                }

                try {
                    const res = await this.$http.post('/service/upload/img', formData);
                    this.tableData[index].imgUrl = res;
                    this.$message.success("操作成功");
                } catch (error) {
                    this.$message.error("操作失败");
                }
            },
            // 上传Markdown
            async UploadMarkdown(file, index) {
                if (!file || !file.raw) {
                    return;
                }

                if (this.tableData[index] === undefined) {
                    this.$message.error('请稍后再试');
                    return;
                }

                let formData = new FormData();
                formData.append('file', file.raw); // file.raw 是原始文件对象

                if (this.tableData[index].imgUrl) {
                    formData.append('oldUrl', this.tableData[index].contentUrl);
                }

                try {
                    const res = await this.$http.post('/service/upload/markdown', formData);
                    this.tableData[index].contentUrl = res;
                    this.$message.success("操作成功");
                } catch (error) {
                    this.$message.error("操作失败");
                }
            },
            // 保存服务信息
            async saveRow() {
                try {
                    await this.$http.post('/service/save', this.tableData);
                    this.$message.success("保存成功");
                    await this.getRow();
                } catch (error) {
                    this.$message.error("保存失败");
                }
            },
            
            // 上移服务
            moveUp(index) {
                if (index > 0) {
                    this.swapRows(index, index - 1);
                }
            },
            // 下移服务
            moveDown(index) {
                if (index < this.tableData.length - 1) {
                    this.swapRows(index, index + 1);
                }
            },
            // 交换服务位置逻辑
            swapRows(index1, index2) {
                // 获取两行数据
                const row1 = this.tableData[index1];
                const row2 = this.tableData[index2];
                // 交换位置
                this.tableData.splice(index1, 1, row2)
                this.tableData.splice(index2, 1, row1)
                // 提示
                this.$message.success("操作成功");                
            },
        },

    }
</script>

<style scope>
    .container {
        width: 100%;
        height: 100%;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;

    }

    .title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #132843;
    }

    .cell-img {
        width: 120px;
        height: 67.5px;
        object-fit: cover;
        border-radius: 4px;
    }

    .oper-btns { 
        display: flex;
        flex-direction: row;
        align-items: center;
    }
</style>