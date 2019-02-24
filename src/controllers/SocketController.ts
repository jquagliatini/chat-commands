const sanitize = require('sanitize-html');

import { nameGenerator, Maybe, getUserFromSocketId } from '../utils';
import { Room, IState } from '../types/index';
import * as User from '../models/User';
import getImplementedCommands from '../commands/impl';
import ICommand, { IJsonCommand } from '../commands/ICommand';
import parseCommand from '../commands/parseCommand';
import remove from '../utils/remove';
import SocketMessage from '../types/SocketMessage';
import testCommand from '../commands/testCommand';

/** @mutable */
let state: IState = {
    users: [],
    banned: [],
    commands: [],
    socket: {
        user: undefined,
        broadcast: {},
        reply: {}
    },
}

const COMMANDS = require('../../commands.json');
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

const socketController = (io) => {
    io.on(SocketMessage.Connection, (socket) => {
        socket.join(Room.EVERYONE);
        const name = nameGenerator();
        const user = User.createUser(name, socket);

        console.log(`${new Date()} | ${name} just connected`);

        const getCurrentUser = getUserFromSocketId(socket.id);
        
        socket.broadcast.emit(SocketMessage.NewUser, { name });
        socket.emit(
            SocketMessage.UserName,
            { name, userList: state.users.map(u => ({ username: u.username, admin: u.admin })) }
        );
        if (state.users.length === 0) {
            // when no user is logged, the first user to log in is the admin
            // may change in the future
            const promoted = User.promote(user);
            state.users.push(promoted);
            state.socket.user = promoted;
            state.commands = COMMANDS;
        } else {
            state.users.push(user);
            state.socket.user = user;
            state.commands = COMMANDS.filter(c => !c.privileged);
        }
        const implementedCommands = getImplementedCommands(state.commands);
    
        socket.on(SocketMessage.AddMessage, (message) => {
            const currentUser = getCurrentUser(state.users.concat(state.banned));
            state = changeCurrentUser(state, currentUser);
            console.log(`${new Date()} | ${currentUser.username}: ${message}`);
    
            const maybeCommand: Maybe<IJsonCommand> = findCommand(implementedCommands)(message);
            if (!maybeCommand.exists()) {
                socket.broadcast.to(currentUser.room).emit(SocketMessage.Message, message);
                return;
            }
    
            const command = maybeCommand.value() as ICommand;
            state = command.launch(message, state);

            state.socket.reply
                ? state.socket.reply.stderr
                    ? socket.emit(SocketMessage.MessageError, state.socket.reply.stderr)
                    : socket.emit(SocketMessage.Message, state.socket.reply.stdout)
                : state.socket.broadcast.stderr
                    ? socket
                        .broadcast
                        .to(currentUser.room)
                        .emit(SocketMessage.MessageError, state.socket.broadcast.stderr)
                    : state.socket.broadcast.stdout
                        ? socket
                            .broadcast
                            .to(currentUser.room)
                            .emit(SocketMessage.Message, state.socket.broadcast.stdout)
                        : doNothing();
        });

        socket.on(SocketMessage.Disconnection, (reason) => {
            
            let currentUser = getCurrentUser(
                state.users,
            );

            if (!currentUser) {
                currentUser = getCurrentUser(
                    state.banned,
                );

                if (!currentUser) {
                    console.warn(`${socket.id} does not refer to any user...`);
                    return; // there is something strange here
                }

                state = ({
                    ...state,
                    banned:
                        remove((u: User.User) => u.username === currentUser.username)
                            (state.banned)[1],
                });
            } else {
                state = {
                    ...state,
                    users:
                        remove((u: User.User) => u.username === currentUser.username)
                            (state.users)[1],
                };
            }

            console.log(`${new Date()} | ${currentUser.username} left!`);

            socket.broadcast.emit(
                SocketMessage.UserList,
                state.users.map(u => ({ username: u.username, admin: u.admin }))
            );
        });
    });
}

export default socketController;
