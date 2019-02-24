import { CommandFactory, IJsonCommand } from "../ICommand";
import parseCommand from '../parseCommand';
import { IState } from "../../types";

const CatchPhraseCommand: CommandFactory = (commands: IJsonCommand[]) => {

    const catchPhraseCommand = commands.find(c => c.cmd === 'me');

    return {
        ...catchPhraseCommand,
        launch(command: string, state: IState): IState {
            const parsedCommand = parseCommand(catchPhraseCommand)(command);
            const phrase = parsedCommand.args.rest;

            return phrase
                ? {
                    ...state,
                    socket: {
                        ...state.socket,
                        broadcast: {
                            stdout: `${state.socket.user.username} says: ${phrase}`,
                        },
                    },
                }
                : state
        },
    };
};

export default CatchPhraseCommand;