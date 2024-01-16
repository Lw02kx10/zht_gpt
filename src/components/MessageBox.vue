<template>
    <Transition name="message-fade">
        <div class="message-root" v-show="isShow">
            <div class="message-box">
                <div class="message-icon">
                    <el-icon color="#67c23a">
                        <SuccessFilled />
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
import { SuccessFilled } from '@element-plus/icons-vue';

defineProps(['message', 'isShow']);
</script>

<style lang="scss" scoped>
$green: #67c23a;
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
            color: $green;
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