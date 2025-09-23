
export const SOCKET_EVENTS = {
    // chat
    GET_CHAT_HISTORY: "get-chat-history",
    CHAT_HISTORY: "chat-history",
    NEW_MESSAGE: "new-message",
    MESSAGE_DELETED: "message-deleted",
    MESSAGE_REACTED: "message-reacted",
    MESSAGE_UPDATED: "message-updated",
    MORE_MESSAGES: "more-messages",
    LOAD_MORE_MESSAGES: "load-more-messages",
    SEND_MESSAGE: "send-message",
    EDIT_MESSAGE: "edit-message",
    DELETE_MESSAGE: "delete-message",
    REACT_MESSAGE: "react-message",
    REMOVE_REACT_MESSAGE: "remove-react-message",
    CHAT_ERROR: "chat-error",

    // users
    USERS_UPDATE: "users-update",
    REGISTER_USER: "register-user",
    LOGOUT_USER: "logout-user",

    // pages/tabs
    TABS_UPDATE: "tabs-update",
    REGISTER_TAB: "register-tab",
    UPDATE_TAB: "update-tab",
    REMOVE_TAB: "remove-tab",
} as const;