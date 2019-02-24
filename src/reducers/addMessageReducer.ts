import { IState, SocketMessage } from "../types";
import ICommand, { IJsonCommand } from "../commands/ICommand";
import { Maybe, getUserFromSocketId } from "../utils";
import testCommand from "../commands/testCommand";
import * as User from "../models/User";
import getImplementedCommands from "../commands/impl";

const findCommand = (commandList: IJsonCommand[]) => (commandStr: string): Maybe<IJsonCommand> =>
    new Maybe(
        commandList.find(c => testCommand(c)(commandStr))
    );

const changeCurrentUser = (state: IState, newUser: User.User) => ({
    ...state,
    socket: {
        ...state.socket,
        user: newUser,
    },
});

const doNothing = () => {};

const broadcast = (socket, user) =>
    Array.isArray(user.room)
        ? user.room.reduce(
            (n, r) => n.to(r),
            socket.broadcast
        )
        : socket.broadcast.to(user.room);

const addMessageReducer = (socket: any, state: IState) => (message: string): IState => {
    const getCurrentUser = getUserFromSocketId(socket.id);
    const implementedCommands = getImplementedCommands(state.commands);

    const currentUser = getCurrentUser(state.users.concat(state.banned));
    const newState = changeCurrentUser(state, currentUser);

    console.log(`${new Date()} | ${currentUser.username}: ${message}`);

    const maybeCommand: Maybe<IJsonCommand> = findCommand(implementedCommands)(message);
    if (!maybeCommand.exists()) {
        socket.broadcast.to(currentUser.room).emit(SocketMessage.Message, message);
        return;
    }

    const command: ICommand = maybeCommand.value() as ICommand;
    const finalState: IState = command.launch(message, newState);

    finalState.socket.reply
        ? finalState.socket.reply.stderr
            ? socket.emit(SocketMessage.MessageError, finalState.socket.reply.stderr)
            : socket.emit(SocketMessage.Message, finalState.socket.reply.stdout)
        : finalState.socket.broadcast.stderr
            ? broadcast(socket, currentUser)
                .emit(SocketMessage.MessageError, finalState.socket.broadcast.stderr)
            : finalState.socket.broadcast.stdout
                ? broadcast(socket, currentUser)
                    .emit(SocketMessage.Message, finalState.socket.broadcast.stdout)
                : doNothing();

    return finalState;
};