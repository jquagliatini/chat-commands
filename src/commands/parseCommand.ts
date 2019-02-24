import { IJsonCommand } from "./ICommand";
import { ParsedCommandType } from './types/ParsedCommandType';

const sanitizeSpaces = (str: string): string => str.replace(/\s{2,}/, ' ');

const parseCommand = (command: IJsonCommand): ParsedCommandType => {
    const strRe = [].concat(
        command.cmd,
        command.aliases,
    ).join('|');
    const re = new RegExp(`^\/(${strRe})(.*)$`);
    
    return (commandStr: string) => {
        const [_, cmd, rest] = re.exec(commandStr);
        const sanitizedRest = sanitizeSpaces(rest.trim());
        const restWords = sanitizedRest.split(' ');

        return {
            cmd,
            args:
                command.args
                    ? command.args.reduce(
                        (prev, arg, i) => Object.assign({}, prev, { [arg.name]: restWords[i] }),
                        {
                            rest: restWords.slice(command.args.length).join(' '),
                        }
                    )
                    : { rest: sanitizedRest },
        };
    };
};

export default parseCommand;