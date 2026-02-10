import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { ParsingAnnotationsUtils } from './parsing.annotations.utils';
import { FileInfo } from '../parsers';
import { TmsConfiguration } from '../configuration';
import { ExtOption, FrameworkOption } from '../enums';


export class FileUtils {
    public static getAllFileInfo(dirPath: string): Array<FileInfo> {
        let infos: Array<FileInfo> = [];
        const ext = this.getExt();

        const names = fs.readdirSync(dirPath);
        
        for (const name of names) {
            const filepath = path.join(dirPath, name);
            const stats = fs.statSync(filepath);

            if (!stats.isFile()) {
                const innerInfos = this.getAllFileInfo(filepath);

                infos = infos.concat(innerInfos);

                continue;
            }

            const fileExt = path.extname(name);

            if (fileExt !== ext) continue;

            const info = this.buildFileInfo(filepath);

            if (info.oldContent !== info.newContent) {
                infos.push(info);
            }
        }
        
        return infos;
    }

    private static getExt(): string {
        const framework = TmsConfiguration.getSelectedFramework();

        switch (framework) {
            case FrameworkOption.BEHAVE.toString(): return ExtOption.GHERKIN.toString();
            case FrameworkOption.NOSE.toString(): return ExtOption.PYTHON.toString();
            case FrameworkOption.PYTEST.toString(): return ExtOption.PYTHON.toString();
            case FrameworkOption.ROBOTFRAMEWORK.toString(): return ExtOption.ROBOT.toString();
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
        const content = fs.readFileSync(path, 'utf-8');
        let newContent = content;
        const patterns = ParsingAnnotationsUtils.getAllPatterns();

        for (const pattern of patterns) {
            newContent = this.replacePattern(newContent, pattern);
        }

        return new FileInfo(path, content, newContent);
    }

    private static replacePattern(content: string, pattern: RegExp): string {
        var offsetAdjustment = 0;
        const matches = Array.from(content.matchAll(pattern));

        for (const match of matches) {
            const code = match[0];
            const matchStart = match['index'];
            const replacement = ParsingAnnotationsUtils.parse(code);
            const replacementStart = matchStart + offsetAdjustment;
            content = content.substring(0, replacementStart) + replacement + content.substring(replacementStart + code.length);
            offsetAdjustment += replacement.length - code.length;
        }

        return content;
    }

    public static async replaceFile(info?: FileInfo): Promise<void> {
        if (!info) {
            vscode.window.showErrorMessage(`This object don't have info!`).then();

            return;
        }

        try {
            const document = await vscode.workspace.openTextDocument(info.filePath);
            const editor = await vscode.window.showTextDocument(document, {
                preview: false,
                preserveFocus: true
            });

            await new Promise(resolve => setTimeout(resolve, 300));

            await editor.edit(editBuilder => {
                const fullRange = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(document.getText().length)
                );
                editBuilder.replace(fullRange, info.newContent);
            });

            await document.save();

        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`).then();
        }
    }
}
