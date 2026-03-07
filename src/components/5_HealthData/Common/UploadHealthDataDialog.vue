<template>
    <el-dialog
        class="upload-health-data-dialog"
        v-model="visible"
        :title="'添加' + typeLabel"
        width="25rem"
        @close="handleClose"
        append-to-body
    >
        <el-form :model="form" label-width="80px" label-position="top">
        
            <template v-if="dataType === 'blood_pressure'">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="高压 (收缩压)">
                            <el-input-number v-model="form.systolic" :min="50" :max="250" controls-position="right" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="低压 (舒张压)">
                            <el-input-number v-model="form.diastolic" :min="30" :max="150" controls-position="right" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="心率 (次/分)">
                    <el-input-number v-model="form.heartRate" :min="30" :max="200" style="width: 100%" />
                </el-form-item>
            </template>

            <template v-else-if="dataType === 'blood_sugar'">
                <el-form-item label="血糖值 (mmol/L)">
                    <el-input-number v-model="form.bloodSugar" :precision="1" :step="0.1" style="width: 100%" />
                </el-form-item>
                <el-form-item label="测量状态">
                    <el-radio-group v-model="form.mealStatus">
                        <el-radio :label="0">空腹</el-radio>
                        <el-radio :label="1">餐后</el-radio>
                    </el-radio-group>
                </el-form-item>
            </template>

            <template v-else-if="dataType === 'bmi'">
                <el-form-item label="身高 (cm)">
                    <el-input-number v-model="form.height" :precision="1" :min="50" :max="250" style="width: 100%" />
                </el-form-item>
                <el-form-item label="体重 (kg)">
                    <el-input-number v-model="form.weight" :precision="1" :min="10" :max="300" style="width: 100%" />
                </el-form-item>
                <div v-if="estimatedBmi" style="margin-bottom: 15px; color: #67C23A; font-size: 14px;">
                    预估 BMI: <strong>{{ estimatedBmi }}</strong>
                </div>
            </template>

            <template v-else>
                <el-form-item :label="typeLabel + '数值'">
                    <el-input-number v-model="form.value" style="width: 100%" />
                </el-form-item>
            </template>

            <el-form-item label="记录时间">
                <el-date-picker
                v-model="form.recordDate"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 100%"
                />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" :loading="loading" @click="submitData">提交</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
    import { ref, computed, reactive } from 'vue';
    import request from '@/utils/request';
    import { ElMessage } from 'element-plus';
    import dayjs from 'dayjs';

    // 定义属性
    const props = defineProps(['modelValue', 'dataType', 'userId']);
    const emit = defineEmits(['update:modelValue', 'success']);

    // 状态
    const visible = computed({
        get: () => props.modelValue,
        set: (val) => emit('update:modelValue', val)
    });

    const loading = ref(false);
    const form = reactive({
        systolic: 120,
        diastolic: 80,
        heartRate: 75,
        bloodSugar: 5.0,
        mealStatus: 0,
        height: 170,
        weight: 65,
        value: 0,
        recordDate: new Date()
    });

    // 标题显示
    const typeLabel = computed(() => {
        const map = {
            'blood_pressure': '血压',
            'blood_sugar': '血糖',
            'bmi': '体重',
        };
        return map[props.dataType] || '数据';
    });

    // 计算预览bmi
    const estimatedBmi = computed(() => {
        if (props.dataType === 'bmi' && form.height > 0 && form.weight > 0) {
            const h = form.height / 100;
            return (form.weight / (h * h)).toFixed(2);
        }
        return null;
    });

    // 提交数据
    const submitData = async () => {
        loading.value = true;
        try {
            const { recordDate, ...restForm } = form;
            const formattedDate = dayjs(recordDate).format('YYYY-MM-DD HH:mm:ss');
            const postData = {
                userId: props.userId,
                type: props.dataType,
                recordDate: formattedDate, // 使用格式化后的时间
                ...restForm 
            };

            console.log("提交给后端的 Payload:", postData);

            await request.post('/health/add', postData);
            ElMessage.success('数据添加成功');
            emit('success');
            visible.value = false;
        } catch (error) {
            ElMessage.error('保存失败: ' + error);
        } finally {
            loading.value = false;
        }
    };
    
    // 重置状态 
    const handleClose = () => {
        // 重置表单到初始状态
        Object.assign(form);
    };

</script>

<style scoped>

    @media (max-width: 768px) { 
        .upload-health-data-dialog {
            width: 10rem;
        }

    }
    
</style>