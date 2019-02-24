const isCommand = (maybeCommand: string): boolean => maybeCommand.trim().startsWith('/')

export { isCommand };