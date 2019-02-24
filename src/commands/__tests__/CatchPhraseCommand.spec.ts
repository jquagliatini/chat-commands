import CatchPhraseCommand from '../impl/CatchPhraseCommand';
import { IJsonCommand } from '../ICommand';
import { createSecureServer } from 'http2';
import { createUser, promote, User } from '../../models/User';
import { IState } from '../../types/index';

const fakeCommands: IJsonCommand[] = [
    {
        cmd: 'me',
        description: 'me description',
    },
]

describe('CatchPhraseCommand', () => {
    const johnDoe: User = {
        id: '1',
        username: 'john.doe',
        admin: true,
        status: 0,
        socket: {},
    }
    const fakeState: IState = {
        users: [
            johnDoe
        ],
        socket: {
            user: johnDoe,
        }
    }

    it('should broadcast a catch phrase', () => {
        const newState: IState = CatchPhraseCommand(fakeCommands)
            .launch('/me greetings, nice to meet you all!', fakeState);

        expect(newState.socket.broadcast.stdout).toBe(
            'john.doe says: greetings, nice to meet you all!',
        );
    });

});