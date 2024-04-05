<template>
    <div class="chat-context-root">
        <div class="main-context">
            <el-scrollbar>
                <component v-for="(item, index) in msgList" :key="index" 
                :time="item.dateTime" :content="item.content" :is="item.isUser ? UserMessage : RobotMessage" class="chat-item"></component>
            </el-scrollbar>
        </div>
        <div class="text-input-line">
            <div class="input-wrapper">
                <el-input 
                    ref="inputNode"
                    v-model="userInput"
                    :autosize = "{ maxRows:1 }"
                    type="textarea"
                    placeholder="请输入您的问题（Shift+Enter = 换行）"
                    resize="none" 
                    @keyup.enter="launchMsg"
                />
            </div>
            <div class="launch-btn-wrapper">
                <div class="launch-btn" @click="launchMsg">
                    <Promotion color="#fff" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="js">
import { ref, watch, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import UserMessage from "./UserMessage.vue";
import RobotMessage from "./RobotMessage.vue";
import timeFormat from '../utils/timeFormat';
import { ElInput, ElScrollbar } from "element-plus";
import { Promotion } from '@element-plus/icons-vue';
import { useSessionStore } from "../stores/session";
import { getChatIndexList, retrieveChatStorage, refreshStorage,
    retrieveTotalChatList, getChatIndex } from "../utils/storage";

const session = useSessionStore();
const route = useRoute();
const devEnv = "http://172.23.148.156:5601"; // 测试环境后端地址

let userInput = ref("");
let inputNode = ref();
let isDisableLaunch = ref(true); // 是否禁止发送
let launchBtnColor = ref("rgba(108, 108, 108, 0.6)");
let launchBtnCursor = ref("not-allowed");

let msgList = reactive([]); // 是一个结构体数组，结构体中有时间、内容、需要渲染的组件（是UserMessage还是RobotMessage）


// 发送信息
const launchMsg = () => {
    if (isDisableLaunch.value) return; // 不能发送空消息

    const chatIdx = session.nowChoose;
    const now = new Date();
    const timeFormatStr = timeFormat(now);
    const chatContent = userInput.value;
    userInput.value = "";

    let userMsg = {
        isUser: true,
        content: chatContent,
        dateTime: timeFormatStr,
        error: false,
        loading: false,
    }

    msgList.push(userMsg);

    // chatgpt作回复的逻辑写在这里
    axios.get(devEnv + '/query?text=' + userMsg.content).then(res => {
        // console.log(res);
        const robotAns = res.data.data.ans;
        const now = new Date();
        const robotReplyTime = timeFormat(now);
        let robotMsg = {
            isUser: false,
            content: robotAns,
            dateTime: robotReplyTime,
            error: false,
            loading: false,
        }

        msgList.push(robotMsg);
        
        session.chatList[chatIdx] = msgList;
        refreshStorage(session.chatList, null);
    })
}

// 切换路由时用于重新刷新页面数据
const refreshInfo = () => {
    inputNode.value.focus();
    msgList.length = 0; // 先清空msgList数组
    // 恢复该会话的聊天内容
    if (session.nowChoose == '') session.nowChoose = getChatIndex();
    const chatIdx = session.nowChoose;
    const chatItem = retrieveChatStorage(chatIdx);
    let len = 0;
    if (chatItem != null) {
        len = chatItem.length;
        for (let i=0; i<len; i++)
            msgList.push(chatItem[i]);
    }
    
    session.chatList = retrieveTotalChatList();
}

watch(userInput, (newVal) => {
    if (newVal.trim() == "") { // 用户输入的是空字符串
        isDisableLaunch.value = true;
        launchBtnColor.value = "rgba(108,108,108,0.6)";
        launchBtnCursor.value = "not-allowed";
    } else {
        isDisableLaunch.value = false;
        launchBtnColor.value = "rgba(108,108,108,1)";
        launchBtnCursor.value = "pointer";
    }
})
watch(() => route.params.chat_id, () => {
    refreshInfo();
})

onMounted(() => {
    refreshInfo();
})
</script>

<style lang="scss" scoped>
$gray: #e5e7eb;
.chat-context-root {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .main-context {
        flex-grow: 1;
        background-image: url("../assets/logo.png");
        background-size: 50%;
        background-repeat: no-repeat;
        background-position: center center;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .text-input-line {
        display: flex;
        height: 40px;
        border-top: 1px solid $gray;
        flex-shrink: 0;
        .input-wrapper {
            flex-grow: 1;
            display: flex;
            align-items: center;
            .el-textarea {
                height: 25px;
                margin-top: 2px;
                padding: 0 7px;
            }
        }
        .launch-btn-wrapper {
            width: 38px;
            .launch-btn {
                position: relative;
                top: 50%;
                transform: translateY(-50%);
                margin: 0 10px 0 0;
                background-color: v-bind(launchBtnColor);
                border-radius: 2px;
                cursor: v-bind(launchBtnCursor);
                svg {
                    padding: 2px 6px;
                }
            }
        }
    }
}
</style>