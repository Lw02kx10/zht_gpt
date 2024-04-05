<template>
    <div class="user-root">
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
    </div>
</template>

<script setup lang="js">
defineProps(['time', 'content', 'loading']);
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
}
</style>