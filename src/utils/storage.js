// 刷新localStorage
/*
    chatList的数据结构如下：
    chatList: {
        // chatIndex为某会话的uuid
        chatIndex: [ 
            {
                isUser: bool,  用户或机器人的信息
                content: string,  具体文字内容
                dateTime: string, 信息发送时间
                error: bool,  是否发送失败
                loading: bool, 仅针对于机器人信息，是否正在等待响应
            }    
            ...   
        ]
        ...
    }
*/

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

// 获取localStorage中存储的chatList中的某条数据
export function retrieveChatStorage(chatIndex) {
    const chatKey = 'chatInfo';

    let jsonChatStr = localStorage.getItem(chatKey);
    let chatList = JSON.parse(jsonChatStr);

    return (jsonChatStr == null) ? null : chatList[chatIndex];
}

// 获取localStorage中的整个chatList
export function retrieveTotalChatList() {
    const chatKey = 'chatInfo';
    let jsonChatStr = localStorage.getItem(chatKey);
    let chatList = JSON.parse(jsonChatStr);

    return (jsonChatStr == null) ? {} : chatList;
}

// 获取localStorage中存储的historyList数据
export function retrieveHistoryStorage() {
    const historyKey = 'historyInfo';

    let jsonHistoryStr = localStorage.getItem(historyKey);
    let historyList = JSON.parse(jsonHistoryStr);

    return (historyList == null) ? [] : historyList;
}

// 记录停留的chat_id
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

// 存储chat_id列表
export function setChatIndexList(list) {
    const chatIndexListKey = 'chatIndexList';
    localStorage.setItem(chatIndexListKey, JSON.stringify(list));
}

// 获取chat_id列表
export function getChatIndexList() {
    const chatIndexListKey = 'chatIndexList';
    let chatIndexListJson = localStorage.getItem(chatIndexListKey);
    return (chatIndexListJson == null) ? [] : JSON.parse(chatIndexListJson);
}


// -------------- debug --------------
// 清除整个chatList（debug用）
export function clearChatListDebug() {
    const key = 'chatInfo';
    localStorage.removeItem(key);
}


