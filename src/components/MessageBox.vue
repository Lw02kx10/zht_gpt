<template>
    <Transition name="message-fade">
        <div class="message-root" v-show="isShow">
            <div class="message-box">
                <div class="message-icon">
                    <el-icon color="#67c23a" v-if="type == 'success'">
                        <SuccessFilled />
                    </el-icon>
                    <el-icon color="#e6a23c" v-if="type == 'warning'">
                        <WarningFilled/>
                    </el-icon>
                    <el-icon color="#f56c6c" v-if="type == 'error'">
                        <WarningFilled/>
                    </el-icon>
                </div>
                <div class="message-content">
                    <span>{{ message }}</span>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="js">
let propObj = defineProps(['message', 'isShow', 'type']);

import { SuccessFilled, WarningFilled } from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue';

let textColor = ref('#67c23a');

onMounted(() => {
    if (propObj.type == 'success') 
        textColor.value = "#67c23a";
    else if (propObj.type == 'warning')
        textColor.value = "#e6a23c";
    else if (propObj.type == 'error')
        textColor.value = "#f56c6c";
})
</script>

<style lang="scss" scoped>
.message-root {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 90;
    .message-box {
        position: absolute;
        left: 50%;
        top: 5px;
        transform: translateX(-50%);
        display: flex;
        background-color: #f0f9eb;
        border: 1px solid #e1f3d8; 
        border-radius: 3px;
        padding: 5px 8px;
        .message-icon {
            font-size: 11px;
            display: flex;
            align-items: center;
        }
        .message-content {
            color: v-bind(textColor);
            font-size: 11px;
            margin-left: 3px;
        }
    }
}

.message-fade-enter-from,
.message-fade-leave-to {
    opacity: 0;
}

.message-fade-enter-active,
.message-fade-leave-active {
    transition: opacity 0.5s;
}

.message-fade-enter-to,
.message-fade-leave-from {
    opacity: 1;
}
</style>