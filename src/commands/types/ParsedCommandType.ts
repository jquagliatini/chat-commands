export type ParsedCommandType = (command: string) => {
    cmd: string,
    args: {
        [id: string]: string,
        rest: string,
    },
};
