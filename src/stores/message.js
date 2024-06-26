import { defineStore } from "pinia";

export const useMessageStore = defineStore('message', {
    state: () => {
        return {
            isShowCopyPrompt: false,
            isShowDeletePrompt: false,
            isShowPreDelInfo: false,
            msgDelIdx: -1,
            isResponsing: false, // 是否正在响应
        }
    }
})