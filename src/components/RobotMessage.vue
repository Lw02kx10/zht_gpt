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
                <div class="text-content">
                    <span>{{ content }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="js">
defineProps(['time', 'content', 'loading']);
</script>

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
                span:before {
                    content: "\00a0";
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
</style>