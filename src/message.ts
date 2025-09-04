interface IMessage {
    msgid: string;
    msgstr: string[];
};

export interface IFile {
    charset: string;
    headers: Record<string, string>;
    translations: {
        [context: string]: {
            [msgid: string]: IMessage;
        };
    };
};