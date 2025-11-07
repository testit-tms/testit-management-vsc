import * as vscode from 'vscode';
import { TmsTreeDataProvider, TreeItem } from './windows/tools';
import { CodeSnippetUtils } from './utils';

export function activate(context: vscode.ExtensionContext) {
    const provider = new TmsTreeDataProvider();
        vscode.window.registerTreeDataProvider(
            'testitManagement',
            provider
        );
    const treeView = vscode.window.createTreeView('testitManagement', {
        treeDataProvider: provider,
        showCollapseAll: true
    });

    vscode.window.createTreeView('testitManagement', {
        treeDataProvider: provider
    });
    vscode.commands.registerCommand('testitManagement.refreshEntry', () =>
        provider.refresh()
    );
    vscode.commands.registerCommand('testitManagement.openSettings', () =>
        vscode.commands.executeCommand('workbench.action.openSettings', '@testit-management')
    );
    vscode.commands.registerCommand('testitManagement.copyItem', (item: TreeItem) => {
        vscode.env.clipboard.writeText(CodeSnippetUtils.getNewSnippet(item.label, item.id));
        vscode.window.showInformationMessage(`Copied: "${item.label}"`);
    });

    context.subscriptions.push(
        treeView
    );
}

export function deactivate() {}
