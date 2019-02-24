import { AvailableStatus, User } from "../../models/User";
import IState from "../../types/IState";
import LeaveCommand from '../impl/LeaveCommand';

const fakeCommands = [{
    cmd: 'leave',
    description: 'description',
}];

const johnDoe: User = {
    username: 'john.doe',
    id: '0',
    admin: false,
    status: AvailableStatus.AVAILABLE,
    socket: {},
}

let leaveCommand;

beforeAll(() => {
    leaveCommand = LeaveCommand(fakeCommands);
})

describe('LeaveCommand', () => {
    it('should change the status of an available user', () => {
        const fakeState: IState = {
            users: [johnDoe],
            socket: {
                user: johnDoe
            },
        };        
        const newState = leaveCommand.launch('/leave', fakeState);
        expect(newState.socket.user.status).toBe(
            AvailableStatus.UNAVAILABLE,
        );
    });

    it('should NOT change the status of an unavailable user', () => {
        const fakeState: IState = {
            users: [johnDoe],
            socket: {
                user: {
                    ...johnDoe,
                    status: AvailableStatus.UNAVAILABLE,
                },
            }
        };        
        const newState = leaveCommand.launch('/leave', fakeState);
        expect(newState.socket.user.status).toBe(
            AvailableStatus.UNAVAILABLE,
        );
    });

    it('should NOT change the status of a disconnected user', () => {
        const fakeState: IState = {
            users: [johnDoe],
            socket: {
                user: {
                    ...johnDoe,
                    status: AvailableStatus.DISCONNECTED,
                },
            }
        };
        const newState = leaveCommand.launch('/leave', fakeState);
        expect(newState.socket.user.status).toBe(
            AvailableStatus.DISCONNECTED,
        );
    });
});