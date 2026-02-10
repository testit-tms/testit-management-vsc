import * as vscode from 'vscode';
import { TreeDataProvider, TreeItem } from './windows/tools';
import { CodeSnippetUtils, FileUtils } from './utils';
import { TextDiffProvider } from './windows/tools/diff.provider';

export function activate(context: vscode.ExtensionContext) {
    const provider = new TreeDataProvider();
    vscode.window.registerTreeDataProvider(
        'testitManagement',
        provider
    );
    const treeView = vscode.window.createTreeView('testitManagement', {
        treeDataProvider: provider,
        showCollapseAll: true
    });

    vscode.commands.registerCommand('testitManagement.refreshEntry', () =>
        provider.changeView('Tms')
    );
    vscode.commands.registerCommand('testitManagement.openSettings', () =>
        vscode.commands.executeCommand('workbench.action.openSettings', '@testit-management')
    );
    vscode.commands.registerCommand('testitManagement.copyItem', (item: TreeItem) => {
        vscode.env.clipboard.writeText(CodeSnippetUtils.getNewSnippet(item.label, item.id)).then();
        vscode.window.showInformationMessage(`Copied: "${item.label}"`).then();
    });
    vscode.commands.registerCommand('testitManagement.parsingAllure', () =>
        provider.changeView('Allure')
    );
    vscode.commands.registerCommand('testitManagement.itemClick', (item: TreeItem) => {
        if (item.info) {
            TextDiffProvider.showDiff(item.info);
        }
    });
    vscode.commands.registerCommand('testitManagement.replace', (item: TreeItem) => {
        FileUtils.replaceFile(item.info);
        provider.changeView('Allure');
    });
    vscode.commands.registerCommand('testitManagement.replaceAll', (item: TreeItem) => {
        item.children.forEach(child => FileUtils.replaceFile(child.info));

        provider.changeView('Allure');
    });

    context.subscriptions.push(
        treeView
    );
}

export function deactivate() {
        // empty
}
