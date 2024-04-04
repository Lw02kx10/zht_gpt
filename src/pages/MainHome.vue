<template>
    <div class="root">
        <DialogOverlay 
            :isShow="isShow"
            @cancel-click="isShow = !isShow"
            @confirm-click="deleteSession(deleteIdx)"
        />
        <MessageBox 
            message="删除成功"
            :isShow="isShowDeleteSuccess"
            type="success"
        />
        <MessageBox 
            message="输入不可为空"
            :isShow="isShowInputMustNotNull"
            type="warning"
        />
        <div class="container-wrapper">
            <div class="chat-record-wrapper-father">
                <div class="chat-record-wrapper">
                    <div class="chat-record">
                        <div class="logo-wrapper" v-show="!isLargeLayout">
                            <div class="logo-image" @click="toZhtHome">
                                <img src="../assets/logo2.png">
                            </div>
                            <div class="logo-text">
                                <span>中航通客服机器人</span>
                            </div>
                        </div>
                        <div class="add-wrapper">
                            <div class="add-btn" @click="preAddSession">
                                <span>{{ addInputMargin === "-0.58667rem" ? "新增会话" : "取消新增" }}</span>
                            </div>
                        </div>
                        <div class="add-input-wrapper-father">
                            <div class="add-input-wrapper">
                                <div class="add-input">
                                    <input type="text" placeholder="请输入会话标题" ref="sessionTitleInputNode" v-model="sessionTitle" @keyup.enter="confirmAddSession">
                                </div>
                                <div class="confirm-add-btn" @click="confirmAddSession">确认</div>
                            </div>
                        </div>
                        <div class="chat-wrapper">
                            <component v-for="(item, idx) in chatItemList" :key="idx" :idx="idx" v-model:title="item.title" :is="ChatItem" @delete-session="preDelete(idx)"></component>
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
            <!-- <div class="chat-context"> -->
                <!-- 该路由显示部分，为chat部分 -->
                <keep-alive> 
                    <router-view :key="route.fullPath" />
                </keep-alive>
            <!--  </div> -->
        </div>
    </div>
</template>

<script setup lang="js">
import { ref, onMounted, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import ChatItem from "../components/ChatItem.vue";
import DialogOverlay from "../components/DialogOverlay.vue";
import MessageBox from "../components/MessageBox.vue";
import { useSessionStore } from "../stores/session";
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import sleep from "../utils/sleep";
import { retrieveChatStorage, retrieveHistoryStorage, 
    refreshStorage, setChatIndex, getChatIndex } from "../utils/storage";

const session = useSessionStore();
const route = useRoute();

let deleteIdx = 0; // 待删除的索引
let userInput = ref("");
let leftBarPosMargin = ref("0");
let leftBarHidden = ref("visible");
let isLargeLayout = ref(false); // 是否为宽广布局模式，初始情况下不是宽广布局
let isDisableLaunch = ref(true); // 是否禁止发送
let launchBtnColor = ref("rgba(108, 108, 108, 0.6)");
let launchBtnCursor = ref("not-allowed");
let addInputMargin = ref("-0.58667rem");
let sessionTitleInputNode = ref();
let sessionTitle = ref("");
let isShow = ref(false);  // 是否显示删除的遮罩层
let isShowDeleteSuccess = ref(false); // 是否显示删除成功的提示
let isShowInputMustNotNull = ref(false); // 输入空字符串的提示

let chatItemList = reactive([])

//跳转到中航通官网
const toZhtHome = () => {
    let link = document.createElement("a");
    link.href = "https://www.zhtaero.com";
    link.target = "_blank";
    link.click();
}

// 切换布局
const toggleLayout = async () => {
    if (!isLargeLayout.value) {
        leftBarHidden.value = "hidden";
        leftBarPosMargin.value = "-4.592rem";
        await sleep(700);
        isLargeLayout.value = true;
        leftBarHidden.value = "visible";
    } else {
        leftBarHidden.value = "hidden";
        isLargeLayout.value = false;
        leftBarPosMargin.value = "0";
        await sleep(700); // 等待过渡时间到了
        leftBarHidden.value = "visible";
    }
}

// 新增会话前的准备工作
const preAddSession = () => {
    if (addInputMargin.value === "-0.58667rem") { // 隐藏状态切换为显现状态
        addInputMargin.value = "0.37333rem";
        sessionTitle.value = "";
        sessionTitleInputNode.value.focus();
    } else { // 切换为隐藏状态
        addInputMargin.value = "-0.58667rem";
    }
}

// 新增会话
const confirmAddSession = () => {
    let title = sessionTitle.value;
    if (title.trim() == "") {
        sessionTitle.value = "";
        // 提示输入不可为空
        isShowInputMustNotNull.value = true;
        setTimeout(() => {
            isShowInputMustNotNull.value = false;
        }, 2000);
        return;
    }
    let newChatItem = {
        title: title.trim()
    };
    chatItemList.unshift(newChatItem);
    refreshStorage(null, chatItemList);
    addInputMargin.value = "-0.58667rem";
    session.changeSession(0); // 将会话路由转移到新建的会话上 // TODO: 同时新增一个chat到storage中去
    setChatIndex(0);
}

// 删除会话的前置操作
const preDelete = (idx) => {
    if (idx != session.nowChoose) return;
    isShow.value = true;
    deleteIdx = idx;
}

// 删除会话
const deleteSession = (idx) => {
    let len = chatItemList.length;
    chatItemList.splice(idx, 1);
    refreshStorage(null, chatItemList); // TODO: 这个地方同时要删除该chatItem里的chat数据
    isShow.value = false;
    if (idx == len - 1) { // 如果是删除的最后一个，则需要重新选择一个会话
        session.changeSession(idx - 1);
        setChatIndex(idx - 1);
    }

    // 提示删除成功
    isShowDeleteSuccess.value = true;
    setTimeout(() => {
        isShowDeleteSuccess.value = false;
    }, 2000);
}

const refreshChatItemList = () => {
    let historyList = retrieveHistoryStorage();
    for (let item of historyList) {
        chatItemList.push(item);
    }
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

onMounted(() => {
    refreshChatItemList();
    // 恢复上次选择的会话
    let lastChooseIndex = getChatIndex();
    setChatIndex(lastChooseIndex);
    
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
                transition: all 0.7s;
                // left: v-bind(leftBarPos);
                margin-left: v-bind(leftBarPosMargin);
                .chat-record {
                    // width: v-bind(leftBarWidth);
                    border-right: 1px solid $gray;
                    border-radius: 5px 0 0 5px;
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
                    .add-input-wrapper-father { // 用于实现子元素的top的相对定位相对于父亲
                        overflow: hidden;
                        .add-input-wrapper {
                            display: flex;
                            margin-top: v-bind(addInputMargin);
                            padding: 0 10px;
                            justify-content: space-between;
                            transition: all 0.7s;
                            // position: relative;
                            // top: -100%;
                            .add-input {
                                width: 70%;
                                height: 14px;
                                input {
                                    width: 100%;
                                    height: 100%;
                                    padding: 2px 5px;
                                    outline: #dcdfe6 auto 1px;
                                    border-radius: 5px;
                                    &:focus {
                                        outline: $green auto 1px;
                                    }
                                }
                            }
                            .confirm-add-btn {
                                line-height: 18px;
                                background-color: $green;
                                color: #fff;
                                border-radius: 4px;
                                font-size: 9px;
                                padding: 1.5px 4px;
                                cursor: pointer;
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
    }
}
</style>