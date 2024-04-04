// 刷新localStorage
export function refreshStorage(chatList, historyList) {
    const chatKey = 'chatInfo';
    const historyKey = 'historyInfo';

    let chat, history;

    // 传null表示不更新这个list
    if (chatList != null) {
        chat = chatList; // 每一个chatItem里的具体chat信息
        localStorage.setItem(chatKey, JSON.stringify(chat));
    }
    if (historyList != null) {
        history = historyList; // 每一个chatItem，包括该item的title信息
        localStorage.setItem(historyKey, JSON.stringify(history));
    }
}

// 获取localStorage中存储的chatList数据
export function retrieveChatStorage(index) {
    const chatKey = 'chatInfo';

    let jsonChatStr = localStorage.getItem(chatKey);
    let chatList = JSON.parse(jsonChatStr);

    return chatList[index];
}

// 获取localStorage中存储的historyList数据
export function retrieveHistoryStorage() {
    const historyKey = 'historyInfo';

    let jsonHistoryStr = localStorage.getItem(historyKey);
    let historyList = JSON.parse(jsonHistoryStr);

    return (historyList == null) ? [] : historyList;
}

// 记录chat_id
export function setChatIndex(index) {
    const chatIndexKey = 'chatIndex';
    localStorage.setItem(chatIndexKey, index);
}

// 获取用户刷新或关闭网页前停留在哪个chat_id
export function getChatIndex() {
    const chatIndexKey = 'chatIndex';
    let chatIndex = localStorage.getItem(chatIndexKey);
    return (chatIndex == null) ? 0 : chatIndex;
}


