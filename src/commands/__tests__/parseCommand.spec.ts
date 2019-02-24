import { IJsonCommand } from "../ICommand";
import parseCommand from '../parseCommand';

const fakeCommand: IJsonCommand = {
    cmd: 'fake',
    description: 'fake command',
    args: [{
        name: 'name',
    }]
};

describe('parseCommand', () => {
    it('should return every argument from the command', () => {
        const parseCommandOutput = parseCommand(fakeCommand)('/fake john');
        expect(parseCommandOutput).toEqual({
            cmd: 'fake', 
            args: {
                name: 'john',
                rest: '',
            }
        });
    });

    it('should put the rest of the command inside the rest parameter', () => {
        const parseCommandOutput = parseCommand(fakeCommand)('/fake john lorem ipsum dolor');
        expect(parseCommandOutput).toEqual({
            cmd: 'fake', 
            args: {
                name: 'john',
                rest: 'lorem ipsum dolor',
            }
        });
    });

    it('should remove multiple spaces', () => {
        const parseCommandOutput = parseCommand(fakeCommand)('/fake   john lorem    ipsum dolor');
        expect(parseCommandOutput).toEqual({
            cmd: 'fake', 
            args: {
                name: 'john',
                rest: 'lorem ipsum dolor',
            }
        });
    });

    it('should output only rest when no args are defined', () => {
        const parseCommandOutput =
            parseCommand({ cmd: 'noargs', description: 'foobar' })('/noargs lorem ipsum dolor');
        expect(parseCommandOutput).toEqual({
            cmd: 'noargs', 
            args: {
                rest: 'lorem ipsum dolor',
            }
        });
    });
});