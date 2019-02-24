import { IJsonCommand } from "./ICommand";

type TestCommandReturnType = (command: string) => boolean;

const testCommand = (command: IJsonCommand): TestCommandReturnType => {
    const strRe = [].concat(
        command.cmd,
        command.aliases || [],
    ).join('|');
    const regex = new RegExp(`^\/(${strRe})`);
    return (commandStr: string) => {
        return regex.test(commandStr);
    }
};

export default testCommand;