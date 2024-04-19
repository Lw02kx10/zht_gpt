import { defineStore } from "pinia";

export const useMessageStore = defineStore('message', {
    state: () => {
        return {
            isShowCopyPrompt: false,
            isShowDeletePrompt: false,
            isShowPreDelInfo: false,
            msgDelIdx: -1,
        }
    }
})