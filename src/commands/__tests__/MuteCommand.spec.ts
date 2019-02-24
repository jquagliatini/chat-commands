import { AvailableStatus, User } from "../../models/User";
import { IState } from "../../types";
import MuteCommand from "../impl/MuteCommand";

const fakeCommands = [{
    cmd: 'mute',
    description: 'muteDescription',
    args: [{
        name: 'user',
    }],
    aliases: [
        'm', 'kick',
    ]
}];

const johnDoe = {
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

let muteCommand;
beforeAll(() => {
    muteCommand = MuteCommand(fakeCommands);
});

describe('MuteCommand', () => {
    const commands = fakeCommands[0].aliases.concat(fakeCommands[0].cmd)
    for (let command of commands) {
        test(`/${command} john.doe`, () => {
            const newState = muteCommand.launch(`/${command} john.doe`, fakeState);
            expect(newState.users.length).toBe(1);
            expect(newState.banned.length).toBe(1);
            expect(newState.socket.reply.stdout).toBe('john.doe was muted');
        });
    }

    it('should throw an error when the user does not exist', () => {
        const newState = muteCommand.launch('/mute zorglu', fakeState);
        expect(newState.users.length).toBe(2);
        expect(newState.socket.reply.stderr).toBe('no user zorglu found!');
    });

    it('should return the same state if the user is not admin', () => {
        const newFakeState: IState = {
            ...fakeState,
            socket: {
                ...fakeState.socket,
                user: {
                    ...aliceSmith,
                    admin: false,
                },
            },
        };
        const newState = muteCommand.launch('/mute john.doe', newFakeState);
        expect(newState).toEqual(newFakeState);
    });
});