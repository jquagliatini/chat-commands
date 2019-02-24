enum SocketMessage {
    /**
     * This is a standard websocket message indicating
     * the connection of a new client
     */
    Connection = 'connection',
    /**
     * std message sent when a user disconnect from the websocket
     * connection
     */
    Disconnection = 'disconnect',
    /**
     * This is the standard message to broadcast from the server
     * this message can contain commands, in this case
     * the only person to receive the answer will be
     * the current user
     */
    Message = 'message',
    /**
     * This message will be used to send an error
     * to users
     */
    MessageError = 'message.error',
    /**
     * it will be used when the client will send a message
     * to broadcast or to send a command
     */
    AddMessage = 'message.add',
    /**
     * Used when a user log in to dispatch its name
     */
    NewUser = 'user.new',
    /**
     * Used when an update to the user list is required
     */
    UserList = 'user.list',
    /**
     * Used to send its generated name to the user
     */
    UserName = 'user.name',
};

export default SocketMessage;