import { CommandFactory, IJsonCommand } from "../ICommand";
import { IState } from "../../types";
import { AvailableStatus } from "../../models/User";

const LeaveCommand: CommandFactory = (commands: IJsonCommand[]) => {
    const leaveCommand = commands.find(c => c.cmd === 'leave');
    return {
        ...leaveCommand,
        launch(command: string, state: IState): IState {
            return state.socket.user.status === AvailableStatus.AVAILABLE
                ? {
                    ...state,
                    socket: {
                        ...state.socket,
                        user: {
                            ...state.socket.user,
                            status: AvailableStatus.UNAVAILABLE,
                        },
                    },
                }
                : state;
        },
    };
};

export default LeaveCommand;