import { User } from "../models/User";

const getUserFromSocketId = (socketId: any) => (users: User[]) =>
    users.find(u => u.socket.id === socketId);

export default getUserFromSocketId;