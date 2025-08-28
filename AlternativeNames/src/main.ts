import * as gettextParser from 'gettext-parser';
import * as fs from 'fs';
import * as path from 'path';
import { cwd } from 'process';

interface Message {
    msgid: string;
    msgstr: string[];
};

interface File {
    charset: string;
    headers: Record<string, string>;
    translations: {
        [context: string]: {
            [msgid: string]: Message;
        };
    };
};

const input = fs.readFileSync(path.join(__dirname, "../global.mo"));

const mo = gettextParser.mo.parse(input) as File;
const csv = fs.readFileSync(path.join(__dirname, "../names.csv"), "utf-8");

const lines = csv.split("\n").slice(1); // Skip header line

for (const line of lines) {
    const [originalName, msgid, fullName, shortName] = line.split(",");
    const MSGID_FULL = `IDS_${msgid}_FULL`;
    const MSGID = `IDS_${msgid}`;

    for (const context in mo.translations) {
        for (const msgid in mo.translations[context]) {
            const message = mo.translations[context][msgid];

            if (message.msgid === MSGID_FULL)
                message.msgstr[0] = fullName;
            else if (message.msgid === MSGID)
                message.msgstr[0] = shortName;
        }
    }
}

const poOutput = gettextParser.mo.compile(mo);
fs.writeFileSync("u_global.mo", poOutput);