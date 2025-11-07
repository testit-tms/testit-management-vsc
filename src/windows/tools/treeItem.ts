import { join, resolve } from 'path';
import * as vscode from 'vscode';

const basePath = resolve(__dirname, '..', '..', '..', 'icons');
const iconPath = {
	testcases: join(basePath, 'test_case', 'testCase.svg'),
	checklists: join(basePath, 'check_list', 'checkList.svg'),
    sharedsteps: join(basePath, 'shared_step', 'sharedStep.svg'),
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
                return iconPath.testcases;
            case 'CheckLists':
                return iconPath.checklists;
            case 'SharedSteps':
                return iconPath.sharedsteps;
            default:
                return new vscode.ThemeIcon('file');
        }
    }
}
