import { join, resolve } from 'path';
import * as vscode from 'vscode';
import { FileInfo } from '../../parsers';

const basePath = resolve(__dirname, '..', 'icons');
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
        public readonly children: Array<TreeItem>,
        public readonly info?: FileInfo
    ) {
        super(label, collapsibleState);

        this.id = id;
        this.label = label;
        this.children = children;
        this.iconPath = this.getIcon(type);
        this.contextValue = type;
        this.command = {
            command: 'testitManagement.itemClick',
            title: 'Click',
            arguments: [this]
        };
        this.info = info;
    }

    private getIcon(type: string): vscode.ThemeIcon | string {
        switch (type) {
            case 'section':
                return new vscode.ThemeIcon('folder');
            case 'folder':
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
