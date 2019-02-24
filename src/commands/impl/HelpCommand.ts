import { IJsonCommand, CommandFactory } from '../ICommand';
import { IState } from '../../types';

// FIXME commands should contain only commands that the current user can launch
const HelpCommand: CommandFactory = (commands: IJsonCommand[]) => {
    const commandJson = commands.find(command => command.cmd === 'help');
    return {
        ...commandJson,
        launch(command: string, state: IState): IState {
            const output = commands.map(
                (jsonCommand) =>
                    [].concat(
                        jsonCommand.cmd,
                        jsonCommand.aliases || [],
                    ).map(c => `/${c}`).join(', ') + '\t- ' + jsonCommand.description
            ).join('\n\n');

            return {
                ...state,
                socket: {
                    ...state.socket,
                    reply: {
                        ...state.socket.reply,
                        stdout: output,
                    },
                }
            };
        }
    };
}

export default HelpCommand;