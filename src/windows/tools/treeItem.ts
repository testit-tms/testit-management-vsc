import { join, resolve } from 'path';
import * as vscode from 'vscode';

const basePath = resolve(__dirname, '..', '..', '..', 'icons');
const iconPath = {
	testCases: join(basePath, 'test_case', 'testCase.svg'),
	checkLists: join(basePath, 'check_list', 'checkList.svg'),
    sharedSteps: join(basePath, 'shared_step', 'sharedStep.svg'),
};

export class TreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly type: string,
        public readonly id: string,
        public readonly childFolders?: Array<TreeItem>,
    ) {
        super(label, collapsibleState);

        this.id = id;
        this.label = label;
        this.childFolders = childFolders;

        this.iconPath = this.getIcon(type);
        this.contextValue = type;
    }

    private getIcon(type: string): vscode.ThemeIcon | string {
        switch (type) {
            case 'section':
                return new vscode.ThemeIcon('folder');
            case 'TestCases':
                return iconPath.testCases;
            case 'CheckLists':
                return iconPath.checkLists;
            case 'SharedSteps':
                return iconPath.sharedSteps;
            default:
                return new vscode.ThemeIcon('file');
        }
    }
}
