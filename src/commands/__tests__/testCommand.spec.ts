import testCommand from '../testCommand';
import { IJsonCommand } from '../ICommand';

const fakeCommand: IJsonCommand = {
    cmd: 'fake',
    description: 'fake description',
    aliases: ['f'],
};

describe('testCommand', () => {
    it('should return true if the str is the complete command', () => {
        expect(testCommand(fakeCommand)('/fake command')).toBeTruthy();
    });

    it('should return true if the str is one alias command', () => {
        expect(testCommand(fakeCommand)('/f command')).toBeTruthy();
    });

    it('should return false if the str is not the command', () => {
        expect(testCommand(fakeCommand)('/help arguments')).toBeFalsy();
    });
});