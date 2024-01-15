<template>
    <div class="chat-root">
        <div class="chat-wrapper" @click="changeSession">
            <el-icon class="chat-icon">
                <ChatDotSquare :color="iconColor"/>
            </el-icon>
            <div class="chat-title">
                <span>{{ title }}</span>
            </div>
            <el-icon class="edit-icon">
                <EditPen :color="iconColor" v-show="idx == session.nowChoose"/>
            </el-icon>
            <el-icon class="delete-icon" @click="$emit('delete-session')">
                <Delete :color="iconColor" v-show="idx == session.nowChoose"/>
            </el-icon>
        </div>
    </div>
</template>

<script setup lang="js">
import { ChatDotSquare, EditPen, Delete } from "@element-plus/icons-vue";
import { useSessionStore } from '../stores/session';
import { ref, watch } from 'vue';
const props = defineProps(['title', 'idx']);
defineEmits(['delete-session']);

const session = useSessionStore();
let wrapperBgc = ref("#ffffff");
let iconColor = ref("#000000");
let textColor = ref("#000000");
let borderColor = ref("#e5e7eb");

const changeSession = () => {
    session.changeSession(props.idx);
}

watch(() => session.nowChoose, (newVal) => {
    if (newVal == Number(props.idx)) {
        wrapperBgc.value = "#f5f5f5";
        iconColor.value = "#6c6c6c";
        textColor.value = "#6c6c6c";
        borderColor.value = "#6caf7c"; 
    } else {
        wrapperBgc.value = "#ffffff";
        iconColor.value = "#000000";
        textColor.value = "#000000";
        borderColor.value = "#e5e7eb";
    }
}, { immediate: true })

</script>

<style lang="scss" scoped>
$gray: #e5e7eb;
$green: #6c6c6c;
@mixin icon-style {
    width: 11px;
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
        border: 1px solid v-bind(borderColor);
        font-size: 9.5px;
        line-height: 23px;
        border-radius: 4px;
        color: v-bind(textColor);
        background-color: v-bind(wrapperBgc);
        cursor: pointer;
        &:hover {
            background-color: #f5f5f5;
        }
        .chat-icon {
            @include icon-style;
            margin-left: 6px;
            margin-right: 6px;
            align-self: center;
        }
        .chat-title {
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
        }
        .edit-icon {
            @include icon-style;
            margin-left: 6px;
            align-self: center;
        }
        .delete-icon {
            @include icon-style;
            margin-left: 6px;
            margin-right: 6px;
            align-self: center;
        }
    }
}
</style>