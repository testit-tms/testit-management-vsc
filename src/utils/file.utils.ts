import * as fs from 'fs';
import * as path from 'path';
import { ParsingAnnotationsUtils } from './parsing.annotations.utils';
import { FileInfo, MatchInfo, ReplacementInfo } from '../parsers';
import { TmsConfiguration } from '../configuration';
import { ExtOption, FrameworkOption } from '../enums';


export class FileUtils {
    public static getAllFileInfo(dirpath: string): Array<FileInfo> {
        var infos: Array<FileInfo> = [];
        const ext = this.getExt();

        var names = fs.readdirSync(dirpath);
        
        for (const name of names) {
            const filepath = path.join(dirpath, name);
            const stats = fs.statSync(filepath);

            if (!stats.isFile()) {
                const innerInfos = this.getAllFileInfo(filepath);

                infos = infos.concat(innerInfos);

                continue;
            }

            const fileExt = path.extname(name);

            if (fileExt !== ext) continue;

            const info = this.buildFileInfo(filepath);

            infos.push(info);
        }
        
        return infos;
    }

    private static getExt(): string {
        const framework = TmsConfiguration.getSelectedFramework();

        switch (framework) {
            case FrameworkOption.BEHAVE.toString(): return ExtOption.GHERKIN.toString();
            case FrameworkOption.NOSE.toString(): return ExtOption.PYTHON.toString();
            case FrameworkOption.PYTEST.toString(): return ExtOption.PYTHON.toString();
            case FrameworkOption.ROBOTFRAMEWORK.toString(): ExtOption.ROBOT.toString();
            case FrameworkOption.JUNIT.toString(): return ExtOption.JAVA.toString();
            case FrameworkOption.MSTEST.toString(): return ExtOption.CSHARP.toString();
            case FrameworkOption.NUNIT.toString(): return ExtOption.CSHARP.toString();
            case FrameworkOption.XUNIT.toString(): return ExtOption.CSHARP.toString();
            case FrameworkOption.SPECFLOW.toString(): return ExtOption.GHERKIN.toString();
            case FrameworkOption.CODECEPTJS.toString(): return ExtOption.TYPESCRIPT.toString();
            case FrameworkOption.CUCUMBER.toString(): return ExtOption.GHERKIN.toString();
            case FrameworkOption.JEST.toString(): return ExtOption.TYPESCRIPT.toString();
            case FrameworkOption.MOCHA.toString(): return ExtOption.TYPESCRIPT.toString();
            case FrameworkOption.PLAYWRIGHT.toString(): return ExtOption.TYPESCRIPT.toString();
            case FrameworkOption.TESTCAFE.toString(): return ExtOption.TYPESCRIPT.toString();
            default: return ExtOption.JAVA.toString();
        }
    }

    private static buildFileInfo(path: string): FileInfo {
        const matchInfos: Array<MatchInfo> = [];
        const replacementInfos: Array<ReplacementInfo> = [];
        var offsetAdjustment = 0;
        const content = fs.readFileSync(path, 'utf-8');
        var newContent = content;
        const patterns = ParsingAnnotationsUtils.getAllPatterns();

        for (const pattern of patterns) {
            const matches = Array.from(content.matchAll(pattern));

            for (const match of matches) {
                const code = match[0];
                const matchStart = match['index'];
                const matchEnd = matchStart + code.length;
                const matchInfo = new MatchInfo(code, matchStart, matchEnd, path);

                matchInfos.push(matchInfo);

                const replacement = ParsingAnnotationsUtils.parse(code);
                const replacementStart = matchStart + offsetAdjustment;
                const replacementEnd = replacementStart + replacement.length;
                const replacementInfo = new ReplacementInfo(replacement, replacementStart, replacementEnd, path);

                replacementInfos.push(replacementInfo);

                newContent = newContent.substring(0, matchStart) + replacement + newContent.substring(matchEnd);

                offsetAdjustment += replacement.length - (matchEnd - matchStart);
            }
        }

        return new FileInfo(path, content, newContent, matchInfos, replacementInfos);
    }
}
