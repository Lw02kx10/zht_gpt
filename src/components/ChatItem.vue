<template>
    <div class="chat-root">
        <div class="chat-wrapper">
            <el-icon class="chat-icon">
                <ChatDotSquare />
            </el-icon>
            <div class="chat-title">
                <span>{{ title }}</span>
            </div>
            <el-icon class="edit-icon">
                <EditPen />
            </el-icon>
            <el-icon class="delete-icon">
                <Delete />
            </el-icon>
        </div>
    </div>
</template>

<script setup lang="js">
import { ChatDotSquare, EditPen, Delete } from "@element-plus/icons-vue";
defineProps(['title']);
</script>

<style lang="scss" scoped>
$gray: #e5e7eb;
$green: #6c6c6c;
@mixin icon-style {
    width: 10px;
    display: flex;
    align-items: center;
}
.chat-root {
    margin-top: 5px;
    .chat-wrapper {
        display: flex;
        height: 23px;
        padding: 3px 0px;
        margin-left: 10px;
        margin-right: 10px;
        border: 1px solid $gray;
        font-size: 9.5px;
        line-height: 23px;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
            background-color: #f5f5f5;
        }
        .chat-icon {
            @include icon-style;
            margin-left: 6px;
            margin-right: 6px;
        }
        .chat-title {
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .edit-icon {
            @include icon-style;
            margin-left: 6px;
        }
        .delete-icon {
            @include icon-style;
            margin-left: 6px;
            margin-right: 6px;
        }
    }
}
</style>