import { CommandFactory, IJsonCommand } from "../ICommand";
import parseCommand from '../parseCommand';
import { IState, Room } from "../../types";
import { remove } from "../../utils";
import { User, changeRoom } from "../../models/User";

const MuteCommand: CommandFactory = (commands: IJsonCommand[]) => {
    const muteCommand = commands.find(c => c.cmd === 'mute');
    return {
        ...muteCommand,
        launch(command: string, state: IState): IState {
            if (!state.socket.user.admin) return state;
            const username = parseCommand(muteCommand)(command).args.user;
            const [removedUser, newUserList] =
                remove((u: User) => u.username === username)(state.users);

            if (!removedUser) {
                return {
                    ...state,
                    socket: {
                        ...state.socket,
                        reply: {
                            stderr: `no user ${username} found!`,
                        },
                    },
                };
            }

            const mutedUser = changeRoom(removedUser, Room.BANNED);
            // @warning side effect
            mutedUser.socket.leave(removedUser.room).join(mutedUser.room);

            return {
                ...state,
                users: newUserList,
                banned: Array.isArray(state.banned)
                    ? state.banned.concat(mutedUser)
                    : [mutedUser],
                socket: {
                    ...state.socket,
                    reply: {
                        stdout: `${username} was muted`,
                    },
                },
            };
        },
    };
};

export default MuteCommand;