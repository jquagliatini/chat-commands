/**
 * @           WARNING               @
 * @ These are integration tests,    @
 * @ it requires the file server.ts  @
 * @ to run                          @
 * @           WARNING               @
 */
import * as io from 'socket.io-client';

import SocketMessage from '../types/SocketMessage';
import { clearTimeout } from 'timers';

const SOCKET_URL = 'http://localhost:3000'

describe('integration tests', () => {
    let socket;

    beforeEach(() => {
        socket = io.connect(SOCKET_URL, {
            forceNew: true,
        });
    });

    afterEach(() => {
        socket.disconnect();
    })

    it('should receive a new name after connection', (done) => {
        socket.on(SocketMessage.UserName, (data) => {
            expect(data).toHaveProperty('name');
            expect(data).toHaveProperty('userList');
            expect(data.userList).toBeInstanceOf(Array);
            expect(data.userList.length).toBe(0);

            socket.disconnect();
            done();
        });
    });

    describe('/mute command', () => {
        let johnDoeSocket;

        beforeEach(() => {
            johnDoeSocket = io.connect(SOCKET_URL, { forceNew: true });
        });

        afterEach(() => {
            johnDoeSocket.disconnect();
        })

        it('should kick a user if I am an admin', (done) => {
            let callNb = 0;
            let timeoutid;

            johnDoeSocket.on(SocketMessage.UserName, ({ name }) => {
                socket.on(SocketMessage.Message, (message: string) => {
                    callNb += 1;
                    clearTimeout(timeoutid);

                    if (!message.endsWith('was muted')) {
                        done(
                            new Error('banned user should not be able to send messages to others')
                        );
                        return;
                    }

                    if (callNb == 1) {
                        expect(message).toBe(`${name} was muted`);
                        timeoutid = setTimeout(done, 30);
                    } else {
                        done(new Error('too many calls'));
                    }
                });
                console.log(`/mute ${name}`);
                socket.emit(SocketMessage.AddMessage, `/mute ${name}`);
                setTimeout(() => {
                    // just letting time to the kick to operate
                    johnDoeSocket.emit(SocketMessage.AddMessage, 'can you read me ?');
                }, 10);
            });

            socket.on(SocketMessage.MessageError, (err) => {
                console.log('ADMIN: error');
                done(new Error(err));
            });
        });

        it('should not kick a user if I am not an admin', (done) => {
            socket.on(SocketMessage.UserName, ({ name }) => {
                console.log(`/kick ${name}`);
                johnDoeSocket.emit(SocketMessage.AddMessage, `/kick ${name}`)

                johnDoeSocket.on(SocketMessage.Message, (message: string) => {
                    if (message.startsWith(name)) {
                        done(new Error());
                        return;
                    } else if (message.endsWith('muted')) {
                        // I don't know why but this callback answers to messages from previous calls
                        return;
                    }
                    expect(message).toBe('Hello!');
                    done();
                });

                socket.emit(SocketMessage.AddMessage, 'Hello!');
            });
        });
    });

    
});

