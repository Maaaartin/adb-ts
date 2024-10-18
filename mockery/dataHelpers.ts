import fs from 'fs/promises';
import path from 'path';

export const readFile = (
    dir: string,
    file: 'raw.log' | 'output.json'
): Promise<Buffer> =>
    fs.readFile(path.join(__dirname, `./data/${dir}/${file}`));

export const readOutputFile = (dir: string): Promise<string[]> =>
    readFile(dir, 'output.json')
        .then(String)
        .then(JSON.parse)
        .then((output_) => output_.map((val: string) => JSON.stringify(val)));
