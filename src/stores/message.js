import { defineStore } from "pinia";

export const useMessageStore = defineStore('message', {
    state: () => {
        return {
            isShowCopyPrompt: false,
            isShowDeletePrompt: false
        }
    }
})