import { readFileSync } from 'fs';

const parseDotEnvContent = (content: string) => {
    let lines = content.split('\n')
    if (lines[lines.length - 1].trim() === '') {
        lines = lines.slice(0, -1);
    }

    const envvarFromDotenv = lines.reduce(
        (env, line) => {
            if (line.indexOf('=') !== -1) {
                const [k, v] = line.split('=').map(e => e.trim());
                return {
                    ...env,
                    [k]: v,
                };
            } else if (line.length !== 0) {
                return {
                    ...env,
                    [line.trim()]: true,
                };
            }
            return env
        },
        {}
    )

    process.env = {
        ...process.env,
        ...envvarFromDotenv,
    };
}

const dotenv = (filepath: string, opts: { isFile: boolean } = { isFile: true }) => {
    if (!opts.isFile) {
        parseDotEnvContent(filepath);
        return;
    }
    
    const dotenvContent = readFileSync(filepath);
    const strContent = dotenvContent.toString();
    parseDotEnvContent(strContent);
}

export default dotenv;
