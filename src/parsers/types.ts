export type PatternAction = string | ((code: string) => string);

export class MatchInfo {
    constructor(
        public text: string,
        public start: number,
        public end: number,
        public filePath: string,
    ) {}
}

export class ReplacementInfo {
    constructor(
        public text: string,
        public start: number,
        public end: number,
        public filePath: string,
    ) {}
}

export class FileInfo {
    constructor(
        public filePath: string,
        public oldContent: string,
        public newContent: string,
        public matches: Array<MatchInfo>,
        public replacements: Array<ReplacementInfo>,
    ) {}
}
