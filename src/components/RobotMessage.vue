<template>
    <div class="robot-root">
        <div class="left-part">
            <div class="robot-avatar">
                <img src="../assets/robot.png">
            </div>
        </div>
        <div class="right-part">
            <div class="msg-time">
                <span>{{ time }}</span>
            </div>
            <div class="msg-content">
                <div class="simulation-cursor" v-show="loading == true"> </div>
                <div class="text-content" ref="textNode">
                    <span id="first-span" v-if="loading == true"></span>
                    <span v-html="markedText" id="second-span" v-if="loading == false"></span>
                </div>
            </div>
        </div>
        <div class="more-operation" v-if="!isResponsing">
            <div class="copy-btn" :data-clipboard-text="needCopyContent">
                <CopyDocument color="#000"/>
            </div>
            <div class="delete-btn" @click="delMsg">
                <Delete color="#000"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="js">
const props = defineProps(['time', 'content', 'loading', 'idx', 'isResponsing']);

import { marked } from 'marked';
import { computed, onMounted, ref } from 'vue';
import { useMessageStore } from '../stores/message';
import { Delete, CopyDocument } from '@element-plus/icons-vue';

const clipboard = new ClipboardJS('.copy-btn');
const message = useMessageStore();

let needCopyContent = ref("");

clipboard.on('success', (e) => {
    message.isShowCopyPrompt = true;
    setTimeout(() => message.isShowCopyPrompt = false, 2000);
})
const delMsg = () => {
    message.isShowPreDelInfo = true;
    message.msgDelIdx = props.idx;
}
const markedText = computed(() => {
    return marked(props.content);
})

onMounted(() => {
    needCopyContent.value = props.content;
    needCopyContent.value = needCopyContent.value.trimEnd();
})
</script>

<style lang="scss">
ul, ol {
    padding-left: 10px;
    li {
        margin-top: 5px;
    }   
    ~p {
        margin-top: 3px;
    }
}
</style>
<style lang="scss" scoped>
.robot-root {
    display: flex;
    flex-direction: row;
    margin: 12px 32px 0 16px;
    .left-part {
        .robot-avatar {
            width: 32px;
            height: 32px;
            margin-right: 6px;
            img {
                width: 100%;
                height: 100%;
                border-radius: 100%;
            }
        }
    }
    .right-part {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .msg-time {
            color: #b4bbc4;
            text-align: left;
            margin-bottom: 3px;
            font-size: 9px;
        }
        .msg-content {
            display: flex;
            background-color: #f4f6f8;
            padding: 7px;
            border-radius: 3px;
            font-size: 10px;
            .simulation-cursor {
                width: 2.5px;
                opacity: 1;
                background-color: #000000;
                animation: 0.7s linear infinite simu-cursor;
            }
            .text-content {
                #first-span::before {
                    content: "\00a0";
                }
            }
        }
    }
    .more-operation {
        display: flex;
        align-items: end;
        .delete-btn {
            margin-left: 2px;
            width: 9px;
            cursor: pointer;
            &:hover {
                svg {
                    color: #6c6c6c;
                }
            }
        }
        .copy-btn {
            margin-left: 2px;
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

@keyframes simu-cursor {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

@media screen and (max-width: 750px) {
    .right-part {
        .msg-time {
            font-size: 10.5px !important;
        }
        .msg-content {
            font-size: 12px !important;
        }
    }
}
</style>