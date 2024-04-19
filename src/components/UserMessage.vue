<template>
    <div class="user-root" v-if="!isHideMsg">
        <div class="right-part">
            <div class="user-avatar">
                <img src="../assets/avatar.png">
            </div>
        </div>
        <div class="left-part">
            <div class="msg-time">
                <span>{{ time }}</span>
            </div>
            <div class="msg-content">
                <span>{{ content }}</span>
            </div>
        </div>
        <div class="more-operation">
            <div class="delete-btn" @click="delMsg">
                <Delete color="#000"/>
            </div>
            <div class="copy-btn" :data-clipboard-text="needCopyContent">
                <CopyDocument color="#000"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="js">
let propsObj = defineProps(['time', 'content', 'loading', 'idx']);

import { ref, onMounted } from 'vue';
import { Delete, CopyDocument } from '@element-plus/icons-vue';
import { useMessageStore } from '../stores/message';

const clipboard = new ClipboardJS('.copy-btn');
const message = useMessageStore();

let needCopyContent = ref("");
let isHideMsg = ref(false);

clipboard.on('success', (e) => {
    message.isShowCopyPrompt = true;
    setTimeout(() => message.isShowCopyPrompt = false, 2000);
})
const delMsg = () => {
    message.isShowPreDelInfo = true;
    message.msgDelIdx = propsObj.idx;
}

onMounted(() => {
    isHideMsg.value = propsObj.isDel;
    needCopyContent.value = propsObj.content;
    needCopyContent.value = needCopyContent.value.trimEnd();
})
</script>

<style lang="scss" scoped>
.user-root {
    display: flex;
    flex-direction: row-reverse;
    margin-top: 12px;
    margin-right: 16px;
    margin-left: 32px;
    .left-part {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .msg-time {
            color: #b4bbc4;
            text-align: right;
            margin-bottom: 3px;
            font-size: 9px;
        }
        .msg-content {
            background-color: #d2f9d1;
            padding: 7px 7px;
            border-radius: 3px;
            font-size: 10px;
        }
    }
    .right-part {
        .user-avatar {
            width: 32px;
            height: 32px;
            margin-left: 6px;
            img {
                width: 100%;
                height: 100%;
                border-radius: 100%;
            }
        }
    }
    .more-operation {
        display: flex;
        align-items: end;
        .delete-btn {
            margin-right: 2px;
            width: 9px;
            cursor: pointer;
            &:hover {
                svg {
                    color: #6c6c6c;
                }
            }
        }
        .copy-btn {
            margin-right: 2px;
            width: 9px;
            cursor: pointer;
            &:hover {
                svg {
                    color: #6c6c6c;
                }
            }
        }
    }
}
</style>