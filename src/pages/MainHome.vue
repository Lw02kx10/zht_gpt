<template>
    <div class="root">
        <div class="container-wrapper">
            <div class="chat-record">
                <div class="add-wrapper">
                    <div class="add-btn">
                        <span>新增会话</span>
                    </div>
                </div>
                <div class="chat-wrapper">
                    <ChatItem title="crx的意思"/>
                </div>
            </div>
            <div class="chat-context"></div>
        </div>
    </div>
</template>

<script setup lang="js">
import { ref, onMounted } from "vue";
import ChatItem from "../components/ChatItem.vue";

onMounted(() => {

})
</script>

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
        box-shadow: 3px 3px 13px;
        background-color: #fff;
        display: flex;
        .chat-record {
            width: 23%;
            border-right: 1px solid $gray;
            border-radius: 5px 0 0 5px;
            /* background-color: #6c6c6c; */
            display: flex;
            flex-direction: column;
            .add-wrapper {
                height: 30px;
                .add-btn {
                    height: 18px;
                    padding: 3px 0;
                    margin-top: 6px;
                    margin-left: 10px;
                    margin-right: 10px;
                    border: 1px dashed $gray;
                    line-height: 18px;
                    text-align: center;
                    font-size: 9.5px;
                    cursor: pointer;
                    transition: all 0.5s;
                    border-radius: 3px;
                    &:hover {
                        border: 1px dashed $green;
                        color: $green;
                    }
                }
            }
            .chat-wrapper {
                margin-top: 8px;
            }
        }
        .chat-context {
            width: 77%;
        }
    }
}
</style>