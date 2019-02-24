import { IState } from '../types';

interface ICommandArg {
    name: string;
    description?: string;
}

/**
 * This is the interface used in the file `commands.json`
 * 
 * the best practice is to add no args when the arg need the whole line.
 * It will be sent in the `args.rest` object.
 */
export interface IJsonCommand {
    cmd: string;
    description: string;
    args?: ICommandArg[];
    aliases?: string[];
    usage?: string;
    privileged?: boolean;
}

export default interface ICommand extends IJsonCommand {
    launch: (command: string, state: IState) => IState; 
    test?: (command: string) => boolean;
}

/**
 * A CommandFactory takes every command available in the system
 * it is required to get its own command.
 * This is a way to link the configuration to the logic,
 * made thinking to the extensibility of the system.
 * 
 * In addition this is quite useful when it comes to displaying
 * help messages with every command available.
 */
export type CommandFactory = (commands: IJsonCommand[]) => ICommand;
