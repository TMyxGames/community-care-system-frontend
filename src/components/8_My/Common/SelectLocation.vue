<template>
    <el-cascader 
        v-model="value" 
        :options="options" 
        placeholder="请选择区域"
        clearable
        @change="handleChange" 
    />
</template>
  
<script>
    export default {
        name: 'SelectLocation',
        props: ['value'],
        data() {
            return {
                value: [],
                options: [{
                    value: '南宁市',
                    label: '南宁市',
                    children: [
                        { value: '青秀区', label: '青秀区'},
                        { value: '兴宁区', label: '兴宁区'},
                        { value: '西乡塘区', label: '西乡塘区'},
                        { value: '江南区', label: '江南区'},
                        { value: '良庆区', label: '良庆区'},
                        { value: '武鸣区', label: '武鸣区'},
                        { value: '邕宁区', label: '邕宁区'},
                    ]
                }]
            }
        },
        methods: {
            handleChange(val) { 
                this.$emit('change', val)
            },

        }
      
    }
</script>
  