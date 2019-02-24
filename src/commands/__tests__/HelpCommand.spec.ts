import { IJsonCommand } from "../ICommand";
import HelpCommand from '../impl/HelpCommand';
import { IState } from "../../types/index";

const commands: IJsonCommand[] = [
    {
        cmd: 'fooCommand',
        description: 'fooCommand description'
    },
    {
        cmd: 'barCommand',
        description: 'barCommand description',
    },
    {
        cmd: 'help',
        aliases: ['h'],
        description: 'display an help message',
    }
];

describe('HelpCommand', () => {
    it('should display a message with all the commands', () => {
        const got: IState = HelpCommand(commands).launch('/help', { socket: {} } as IState);
        expect(got.socket.reply.stdout).toBe(
            '/fooCommand\t- fooCommand description' + '\n\n' +

            '/barCommand\t- barCommand description' + '\n\n' +

            '/help, /h\t- display an help message'
        );
    });
});