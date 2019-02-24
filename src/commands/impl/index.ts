import CatchPhraseCommand from './CatchPhraseCommand';
import HelpCommand from './HelpCommand';
import LeaveCommand from './LeaveCommand';
import ListAdminsCommand from './ListAdminsCommand';
import MuteCommand from './MuteCommand';
import PromoteCommand from './PromoteCommand';
import ICommand, { IJsonCommand } from '../ICommand';


const IMPLEMENTED_COMMANDS_FACTORIES = [
    CatchPhraseCommand,
    HelpCommand,
    LeaveCommand,
    ListAdminsCommand,
    MuteCommand,
    PromoteCommand,
]

export default function getImplementedCommands(commands: IJsonCommand[]): ICommand[] {
    return IMPLEMENTED_COMMANDS_FACTORIES.map(
        factory => factory(commands)
    );
}