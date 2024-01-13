import { defineStore } from "pinia";

export const useSessionStore = defineStore('session', {
    state: () => {
        return {
            nowChoose: 0, // 默认选择的是第一个会话
        }
    },
    actions: {
        changeSession(idx) { // 修改当前选择的会话
            this.nowChoose = idx; 
        }
    }
})