import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useSessionStore = defineStore('session', {
    state: () => {
        return {
            nowChoose: 0, // 默认选择的是第一个会话
            router: useRouter(),
        }
    },
    actions: {
        changeSession(idx) { // 修改当前选择的会话
            this.nowChoose = idx; 
            this.router.push(`/home/${this.nowChoose}`);
        }
    },
})