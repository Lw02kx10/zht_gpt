import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useSessionStore = defineStore('session', {
    state: () => {
        return {
            nowChoose: '', // 默认为空字符串，表示哪个会话都没有选择
            nowTitle: '', // 当前选择会话的标题，用于移动端
            chatTitleList: [], // 所有会话的标题
            chatIdList: [], // 仅存储每一个会话的id
            chatList: {}, 
            isShowSessionSideBar: false,
            router: useRouter(),
        }
    },
    actions: {
        changeSession(chatId) { // 修改当前选择的会话
            this.nowChoose = chatId; 
            this.router.push(`/home/${this.nowChoose}`);
        }
    },
})