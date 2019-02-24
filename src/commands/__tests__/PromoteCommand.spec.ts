import PromoteCommand from '../impl/PromoteCommand';
import IState from '../../types/IState';
import { AvailableStatus, User } from '../../models/User';

const fakeCommands = [{
    cmd: 'promote',
    description: 'promoteDescription',
    args: [{
        name: 'user',
    }]
}];

const johnDoe: User = {
    username: 'john.doe',
    id: '0',
    admin: false,
    status: AvailableStatus.AVAILABLE,
    socket: {},
};
const aliceSmith: User = {
    username: 'alice.smith',
    id: '1',
    admin: true,
    status: AvailableStatus.AVAILABLE,
    socket: {},
};

const fakeState: IState = {
    users: [
        johnDoe,
        aliceSmith,
    ],
    socket: {
        user: aliceSmith,
    },
};

let promoteCommand;
beforeAll(() => {
    promoteCommand = PromoteCommand(fakeCommands);
});

describe('PromoteCommand', () => {
    it('should return the user list with the promoted user', () => {
        const newState = promoteCommand.launch('/promote john.doe', fakeState);
        expect(newState.users[0]).toEqual({
            username: 'john.doe',
            admin: true,
            status: AvailableStatus.AVAILABLE,
            id: '0',
        });
    });

    it('should return the same state if the user is already admin', () => {
        const newState = promoteCommand.launch('/promote alice.smith', fakeState);
        expect(newState).toEqual(fakeState);
    });

    it('should return the same state if the current user is not admin', () => {
        const subFakeState = {
            ...fakeState,
            socket: {
                user: johnDoe
            }
        };
        const newState = promoteCommand.launch(
            '/promote alice.smith',
            subFakeState,
        );
        expect(newState).toEqual(subFakeState);
    });

    it('should return an error message if the user doesn\'t exist', () => {
        const newState = promoteCommand.launch('/promote jane.doe', fakeState);
        expect(newState.socket.reply.stderr).toEqual(
            'jane.doe is not an existing username',
        );
    });
});