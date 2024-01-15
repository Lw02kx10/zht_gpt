<template>
    <div class="root">
        <div class="container-wrapper">
            <div class="chat-record-wrapper-father">
                <div class="chat-record-wrapper">
                    <div class="chat-record">
                        <div class="logo-wrapper">
                            <div class="logo-image" @click="toZhtHome">
                                <img src="../assets/logo2.png">
                            </div>
                            <div class="logo-text">
                                <span>中航通客服机器人</span>
                            </div>
                        </div>
                        <div class="add-wrapper">
                            <div class="add-btn">
                                <span>新增会话</span>
                            </div>
                        </div>
                        <div class="chat-wrapper">
                            <ChatItem title="NAGA X4的特性" idx="0"/>
                            <ChatItem title="第二个会话" idx="1"/>
                        </div>
                    </div>
                    <div class="layout-toggle-btn" @click="toggleLayout">
                        <el-icon v-show="!isLargeLayout">
                            <ArrowLeft color="#333639"/>
                        </el-icon>
                        <el-icon v-show="isLargeLayout">
                            <ArrowRight color="#333639"/>
                        </el-icon>
                    </div>
                </div>
            </div>
            <div class="chat-context">
                <div class="main-context">
                    <component v-for="(item, index) in msgList" :key="index" :time="item.time" :content="item.content" :is="item.component"></component>
                </div>
                <div class="text-input-line">
                    <div class="input-wrapper">
                        <el-input 
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
        </div>
    </div>
</template>

<script setup lang="js">
import { ref, onMounted, reactive } from "vue";
import ChatItem from "../components/ChatItem.vue";
import UserMessage from "../components/UserMessage.vue";
import RobotMessage from "../components/RobotMessage.vue";
import { useSessionStore } from "../stores/session";
import { ElInput } from "element-plus";
import { Promotion, ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import timeFormat from '../utils/timeFormat';
import sleep from "../utils/sleep";

const session = useSessionStore();
const toggleNodeWidth = 0.42667;

let userInput = ref("");
let leftBarPos = ref("0%");
let leftBarHidden = ref("visible");
let leftBarWidth = ref("4.8rem"); 
let isLargeLayout = ref(false); // 是否为宽广布局模式，初始情况下不是宽广布局
let msgList = reactive([]); // 是一个结构体数组，结构体中有时间、内容、需要渲染的组件（是UserMessage还是RobotMessage）

//跳转到中航通官网
const toZhtHome = () => {
    let link = document.createElement("a");
    link.href = "https://www.zhtaero.com";
    link.target = "_blank";
    link.click();
}

// 发送信息
const launchMsg = () => {
    const now = new Date();
    const timeFormatStr = timeFormat(now);
    const chatContent = userInput.value;
    userInput.value = "";

    let userMsg = {
        time: timeFormatStr,
        content: chatContent,
        component: UserMessage,
    }

    msgList.push(userMsg);

    // chatgpt作回复的逻辑写在这里
    let robotMsg = {
        time: timeFormatStr,
        content: chatContent,
        component: RobotMessage,
    }

    msgList.push(robotMsg);
}

// 切换布局
const toggleLayout = async () => {
    let cnt = 0; // 收缩或扩张8次停止
    if (!isLargeLayout.value) {
        leftBarHidden.value = "hidden";
        isLargeLayout.value = true;
        leftBarPos.value = "-100%";
        let timeHandler = setInterval(() => {
            let nowWidth = parseFloat(leftBarWidth.value);
            if (cnt != 8) {
                if (cnt == 7) {
                    nowWidth = toggleNodeWidth / 2;
                }
                else nowWidth -= 0.6;
                cnt++;
                leftBarWidth.value = String(nowWidth) + "rem";
            } else clearInterval(timeHandler);
        }, 50)
    } else {
        isLargeLayout.value = false;
        leftBarPos.value = "0%";
        let timeHandler = setInterval(() => {
            let nowWidth = parseFloat(leftBarWidth.value);
            if (cnt != 8) {
                if (cnt == 7) {
                    nowWidth = 4.8;
                }
                else nowWidth += 0.6;
                cnt++;
                leftBarWidth.value = String(nowWidth) + "rem";
            } else clearInterval(timeHandler);
        }, 50)
        await sleep(400); // 等待过渡时间到了
        leftBarHidden.value = "visible";
    }
}

onMounted(() => {

})
</script>

<style>
.el-textarea__inner {
    height: 23px !important;
    min-height: 23px !important;
    overflow-y: auto !important;
    font-size: 10px !important;
    line-height: 23px !important;
    padding: 0px 8px !important;
}
.el-textarea__inner::-webkit-scrollbar {
    width: 1px;
}
.el-textarea__inner::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0,3);
}
.el-textarea__inner:focus {
    outline: #6c6c6c auto 1px !important;
    box-shadow: 0 0 0 1px #6c6c6c inset !important;
}
</style>

<style lang="scss" scoped>
$gray: #e5e7eb;
$green: #6c6c6c;
.root {
    width: 100vw;
    height: 100vh;
    display: flex;
    .container-wrapper {
        margin: 10px;
        flex-grow: 1;
        border-radius: 5px;
        box-shadow: 3px 3px 13px rgba(0, 0, 0, 0.5);
        background-color: #fff;
        display: flex;
        .chat-record-wrapper-father { // 添加chat-record-wrapper-father是为了让left:-100%相对于父容器进行定位
            display: flex;
            overflow: v-bind(leftBarHidden);
            .chat-record-wrapper { // 添加chat-record-wrapper的作用是让toggle-btn相对于这里定位
                display: flex;
                position: relative;
                transition: all 0.4s;
                left: v-bind(leftBarPos);
                .chat-record {
                    width: v-bind(leftBarWidth);
                    border-right: 1px solid $gray;
                    border-radius: 5px 0 0 5px;
                    overflow: v-bind(leftBarHidden);
                    /* background-color: #6c6c6c; */
                    display: flex;
                    flex-direction: column;
                    flex-shrink: 0; // 默认为1，设置为0后不会被右边对话框的flex容器挤压
                    .logo-wrapper {
                        display: flex;
                        height: 25px;
                        padding: 6px 10px 6px 8px;
                        border-radius: 5px 0 0 0;
                        background-color: $green;
                        
                        .logo-image {
                            height: 23px;
                            cursor: pointer;
                            img {
                                height: 100%;
                            }
                        }
                        .logo-text {
                            line-height: 25px;
                            margin-left: 3px;
                            font-size: 10px;
                            color: #fff;
                            font-weight: 600;
                        }
                    }
                    .add-wrapper {
                        height: 30px;
                        .add-btn {
                            height: 18px;
                            padding: 3px 0;
                            margin-top: 6px;
                            margin-left: 10px;
                            margin-right: 10px;
                            border: 1.5px dashed $gray;
                            line-height: 18px;
                            text-align: center;
                            font-size: 9.5px;
                            cursor: pointer;
                            transition: all 0.5s;
                            border-radius: 3px;
                            &:hover {
                                border: 1.5px dashed $green;
                                color: $green;
                            }
                        }
                    }
                    .chat-wrapper {
                        margin-top: 8px;
                    }
                }
                .layout-toggle-btn {
                    width: 16px;
                    height: 16px;
                    position: absolute;
                    top: 50%;
                    right: 0;
                    background-color: #fff;
                    box-shadow: 0 2px 4px 0px rgba($color: #000, $alpha: 0.06);
                    z-index: 1;
                    border-radius: 50%;
                    border: 1px solid rgb(239, 239, 245);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform: translate(50%, -50%);
                    cursor: pointer;
                    font-size: 10px;
                }
            }
        }
        .chat-context {
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
            }
            .text-input-line {
                display: flex;
                height: 40px;
                border-top: 1px solid $gray;
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
                        background-color: $green;
                        border-radius: 2px;
                        cursor: pointer;
                        svg {
                            padding: 2px 6px;
                        }
                    }
                }
            }
        }
    }
}
</style>