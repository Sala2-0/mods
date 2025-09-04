import * as gettextParser from 'gettext-parser';
import * as fs from 'fs';
import * as path from 'path';
import { cwd } from 'process';

import type { IFile } from "message";

const args = process.argv.slice(2);

const textFilePath = path.join(cwd(), "../global.mo");
const csvPath = args[0];

if (!fs.existsSync(textFilePath)) {
    console.error(`Error: File ${textFilePath} does not exist.`);
    process.exit(1);
}

if (!csvPath || path.extname(csvPath) !== ".csv") {
    console.error("Error: The provided file is not a CSV file.");
    process.exit(1);
}

const input = fs.readFileSync(textFilePath);

const mo = gettextParser.mo.parse(input) as IFile;
const csv = fs.readFileSync(csvPath, "utf-8");

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
fs.writeFileSync("output_global.mo", poOutput);