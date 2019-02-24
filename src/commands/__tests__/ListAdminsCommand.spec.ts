import { IState } from "../../types/index";
import { promote, createUser } from "../../models/User";
import ListAdminsCommand from '../impl/ListAdminsCommand';
import { IJsonCommand } from "../ICommand";

describe('ListAdminsCommand', () => {
    const johnDoe = createUser('john.doe');
    const fakeState: IState = {
        users: [
            promote(createUser('alice.smith')),
            johnDoe,
            createUser('jane.doe'),
            promote(createUser('sarah.jones')),
        ],
        socket: {
            user: johnDoe,
        },
    };

    const fakeCommands: IJsonCommand[] = [
        {
            cmd: 'admins',
            description: 'admins description',
        },
        {
            cmd: 'foo',
            description: 'fooCommand description',
        },
    ];

    it('should return a list of adminUsers', () => {
        const got: IState = ListAdminsCommand(fakeCommands).launch(
            '/admins',
            fakeState,
        );
        expect(
            got.socket.reply.stdout
        ).toBe(
            'alice.smith\n' +
            'sarah.jones',
        );
    });
});