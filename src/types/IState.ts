import { User } from '../models/User';
import { IJsonCommand } from '../commands/ICommand';

type broadcastOrReplyKey = 'stdout' | 'stderr';

type streamOutput = {
    [K in broadcastOrReplyKey]?: string;
}

export interface ISocket {
    user: User;
    broadcast?: streamOutput;
    reply?: streamOutput;
}

export default interface IState {
    users: User[],
    banned?: User[],
    commands?: IJsonCommand[],
    socket: ISocket,
}