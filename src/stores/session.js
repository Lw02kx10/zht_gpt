import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useSessionStore = defineStore('session', {
    state: () => {
        return {
            nowChoose: '', // 默认为空字符串，表示哪个会话都没有选择
            chatIdList: [],
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