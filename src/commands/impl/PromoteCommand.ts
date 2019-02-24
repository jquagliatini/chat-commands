import { CommandFactory, IJsonCommand } from "../ICommand";
import parseCommand from '../parseCommand';
import { IState } from "../../types";
import { replace } from "../../utils";

const PromoteCommand: CommandFactory = (commands: IJsonCommand[]) => {
    const promoteCommand = commands.find(c => c.cmd === 'promote');

    return {
        ...promoteCommand,
        launch(command: string, state: IState): IState {
            if (!state.socket.user.admin) {
                return state;
            }

            const parsedCommand = parseCommand(promoteCommand)(command);
            const usernameToPromote = parsedCommand.args.user;

            if (!state.users.some(u => u.username === usernameToPromote)) {
                return {
                    ...state,
                    socket: {
                        ...state.socket,
                        reply: {
                            stderr: `${usernameToPromote} is not an existing username`,
                        },
                    },
                };
            }

            const userToPromote = state.users.find(u => u.username === usernameToPromote);

            if (userToPromote.admin) {
                return state;
            }

            const promotedUser = { ...userToPromote, admin: true };

            const newUserList = replace(
                u => u.username === usernameToPromote,
                promotedUser,
            )(state.users);

            return {
                ...state,
                users: newUserList,
                socket: {
                    ...state.socket,
                    broadcast: {
                        stdout: `${state.socket.user.username} promoted ${usernameToPromote}!`,
                    },
                },
            };
        }
    }
};

export default PromoteCommand;
