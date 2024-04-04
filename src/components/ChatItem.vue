<template>
    <div class="chat-root">
        <div class="chat-wrapper" @click="changeSession">
            <el-icon class="chat-icon">
                <ChatDotSquare :color="iconColor"/>
            </el-icon>
            <div class="chat-title" v-show="!modifyState" ref="titleNode">
                <span>{{ title }}</span>
            </div>
            <div class="chat-title-modify-input" v-show="modifyState" ref="inputNode">
                <input type="text" v-model="title" />
            </div>
            <el-icon class="edit-icon" @click="handleEdit" v-show="!modifyState">
                <EditPen :color="iconColor" v-show="idx == session.nowChoose" />
            </el-icon>
            <el-icon class="delete-icon" @click="$emit('delete-session')" v-show="!modifyState">
                <Delete :color="iconColor" v-show="idx == session.nowChoose"/>
            </el-icon>
            <el-icon class="save-icon" v-show="modifyState" @click="handleSave">
                <Check :color="iconColor" v-show="idx == session.nowChoose" />
            </el-icon>
        </div>
    </div>
</template>

<script setup lang="js">
import { ChatDotSquare, EditPen, Delete, Check } from "@element-plus/icons-vue";
import { useSessionStore } from '../stores/session';
import { ref, watch, onMounted } from 'vue';
import { retrieveHistoryStorage, refreshStorage } from "../utils/storage";
import { useRouter } from "vue-router";
const props = defineProps(['title', 'idx']);
const title = defineModel('title');
const router = useRouter();
defineEmits(['delete-session', 'modify-session']);

const session = useSessionStore();
let wrapperBgc = ref("#ffffff");
let iconColor = ref("#000000");
let textColor = ref("#000000");
let borderColor = ref("#e5e7eb");
let modifyState = ref(false);
let titleNode = ref();
let inputNode = ref();

const changeSession = () => {
    session.changeSession(props.idx);
}
const handleEdit = () => {
    if (session.nowChoose != props.idx) return;
    modifyState.value = true;
}
const handleSave = () => {
    modifyState.value = false;
    let historyList = retrieveHistoryStorage();
    historyList[props.idx].title = props.title;
    refreshStorage(null, historyList);
}

watch(() => session.nowChoose, (newVal) => {
    if (newVal == Number(props.idx)) {
        wrapperBgc.value = "#f5f5f5";
        iconColor.value = "#6c6c6c";
        textColor.value = "#6c6c6c";
        borderColor.value = "#6caf7c"; 
    } else {
        modifyState.value = false; // 点击其他会话时取消该会话的修改状态
        wrapperBgc.value = "#ffffff";
        iconColor.value = "#000000";
        textColor.value = "#000000";
        borderColor.value = "#e5e7eb";
    }
}, { immediate: true })

onMounted(() => {
    const titleNodeRect = titleNode.value.getBoundingClientRect();
    inputNode.value.style.width = String(titleNodeRect.width) + "px"; // 保证input框的宽度和title的宽度相等 
})
</script>

<style lang="scss" scoped>
$gray: #e5e7eb;
$green: #6c6c6c;
@mixin icon-style {
    width: 11px;
    font-size: 10px;
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
        .chat-title-modify-input {
            flex-grow: 1;
            input {
                outline: #dcdfe6 auto 0.5px;
                width: 100%;
                &:focus {
                    outline: #6c6c6c auto 0.5px;
                }
            }
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
        .save-icon {
            @include icon-style;
            align-self: center;
            margin-left: 6px;
            margin-right: 6px;
        }
    }
}
</style>