import { CommandFactory, IJsonCommand } from "../ICommand";
import { IState } from "../../types";

const ListAdminsCommand: CommandFactory = (commands: IJsonCommand[]) => {
    const listAdminCommand = commands.find(c => c.cmd === 'admins');
    return {
        ...listAdminCommand,
        launch(command: string, state: IState): IState {
            const stdout = state.users
                .filter(u => u.admin)
                .map(u => u.username)
                .join('\n')
            return {
                ...state,
                socket: {
                    ...state.socket,
                    reply: {
                        stdout,
                    },
                },
            };
        }
    }
};

export default ListAdminsCommand;