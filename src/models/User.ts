import { v4 as uuidv4,  } from 'uuid';
import { Room } from '../types/index';

enum AvailableStatus {
    AVAILABLE,
    UNAVAILABLE,
    DISCONNECTED
};

type User = {
    id: string,
    username: string,
    status: AvailableStatus,
    admin: boolean,
    socket: any,
    room: Room,
};

function createUser(name, socket = null, room = Room.EVERYONE): User {
    return {
        username: name,
        status: AvailableStatus.AVAILABLE,
        id: uuidv4(),
        admin: false,
        socket,
        room
    };
}

function renameUser(user: User, newName): User {
    return { ...user, username: newName };
}

function updateUserStatus(user: User, status: AvailableStatus): User {
    return (status in AvailableStatus)
        ? { ...user, status }
        : user;
}

function promote(user): User {
    return { ...user, admin: true };
}

function dismiss(user): User {
    return { ...user, admin: false };
}

function changeRoom(user, room): User {
    return { ...user, room };
}

export {
    createUser,
    renameUser,
    updateUserStatus,
    dismiss,
    promote,
    User,
    AvailableStatus,
    changeRoom,
};