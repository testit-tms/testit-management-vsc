import * as vscode from 'vscode';
import { FileInfo } from '../../parsers';

export class TextDiffProvider {
    public static async showDiff(info: FileInfo): Promise<void> {
        const originalUri = vscode.Uri.parse(`diff-original:${info.filePath}.original`);
        const modifiedUri = vscode.Uri.parse(`diff-modified:${info.filePath}.modified`);
        const originalProvider = new InMemoryTextDocumentProvider(info.oldContent);
        const modifiedProvider = new InMemoryTextDocumentProvider(info.newContent);
        const disposableOrigin = vscode.workspace.registerTextDocumentContentProvider('diff-original', originalProvider);
        const disposableModified = vscode.workspace.registerTextDocumentContentProvider('diff-modified', modifiedProvider);

        await vscode.commands.executeCommand(
            'vscode.diff',
            originalUri,
            modifiedUri,
            `Preview changes`,
            { preview: false }
        );

        setTimeout(() => {
            disposableOrigin.dispose();
            disposableModified.dispose();
        }, 1000);
    }
}

class InMemoryTextDocumentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private content: string;

    constructor(content: string) {
        this.content = content;
    }

    public provideTextDocumentContent(uri: vscode.Uri): string {
        return this.content;
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(content: string): void {
        this.content = content;
    }
}
