<template>
    <Transition name="overlay-fade">
        <div class="dialog-root" v-show="isShow">
            <div class="dialog-container">
                <div class="dialog-title">
                    <el-icon class="warning-icon" color="#f5db05">
                        <WarnTriangleFilled />
                    </el-icon>
                    <div class="info-text">
                        <span>注意</span>
                    </div>
                </div>
                <div class="dialog-content">
                    <span>确认要删除该会话吗？</span>
                </div>
                <div class="dialog-btn-wrapper">
                    <div class="left-btn" @click="$emit('cancel-click')">取消</div>
                    <div class="right-btn" @click="$emit('confirm-click')">确认</div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="js">
import { WarnTriangleFilled } from '@element-plus/icons-vue';
import { ElIcon } from 'element-plus';

defineProps(['isShow']);
defineEmits(['cancel-click', 'confirm-click']);

</script>

<style lang="scss" scoped>
@mixin btn-style {
    width: 50%;
    font-size: 12px;
    text-align: center;
    border-top: 1.5px solid #e7e7e7;
    padding: 5px 0;
    cursor: pointer;
    &:hover {
        transform: scale(0.95);
    }
}
@mixin dialog-container-style {
    background-color: #fff;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    border-radius: 12px;
    box-shadow: 2px 2px 10px rgba($color: #000000, $alpha: 0.5);
    display: flex;
    flex-direction: column;
}
.dialog-root {
    width: 100vw;
    height: 100vh;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 100;
    .dialog-container {
        @include dialog-container-style;
        .dialog-title {
            display: flex;
            margin: 0 auto;
            font-size: 13px;
            font-weight: bold;
            margin-top: 7px;
            .warning-icon {
                align-self: center;
                margin-right: 2px;
                font-size: 15px;
            }
        }
        .dialog-content {
            padding: 8px;
            font-size: 11px;
            line-height: 18px;
            text-align: center;
        }
        .dialog-btn-wrapper {
            display: flex;
            .left-btn {
                @include btn-style;
                border-right: 1.5px solid #e7e7e7;
            }
            .right-btn {
                @include btn-style;
                background-color: #6c6c6c;
                border-top: #6c6c6c;
                border-radius: 0 0 12px 0;
                color: #fff;
            }
        }
    }
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
    opacity: 0;
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
    transition: opacity 0.5s;
}

.overlay-fade-enter-to,
.overlay-fade-leave-from {
    opacity: 1;
}
</style>