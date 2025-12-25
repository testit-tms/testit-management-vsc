import * as vscode from 'vscode';
import { TreeItem } from './treeItem';
import { ITmsClient, TmsClient } from '../../clients';
import { SectionModel } from 'testit-api-client';
import { TmsConfiguration } from '../../configuration';

export class TmsTreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;
    private tmsClient: ITmsClient = new TmsClient(TmsConfiguration.getUrl(), TmsConfiguration.getToken()); 

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TreeItem): Thenable<TreeItem[]> {
        if (!element) {
            return Promise.resolve(this.getRootItems());
        }
        return Promise.resolve(this.getChildItems(element));
    }

    private async getRootItems(): Promise<Array<TreeItem>> {
        const projectId = TmsConfiguration.getProjectId();
        const sections = await this.tmsClient.getSectionsByProjectId(projectId);
        const rootSections = sections.filter((section) => section.parentId == undefined);

        return rootSections.map((section) => 
            new TreeItem(
                section.name,
                vscode.TreeItemCollapsibleState.Collapsed,
                'section',
                section.id,
                this.buildChildSections(sections, section.id)
            )
        );
    }

    private buildChildSections(sections: Array<SectionModel>, parentId: string): Array<TreeItem> {
        const childSections = sections.filter((section) => section.parentId === parentId);

        return childSections.map((section) => 
            new TreeItem(
                section.name,
                vscode.TreeItemCollapsibleState.Collapsed,
                'section',
                section.id,
                this.buildChildSections(sections, section.id)
            )
        );
    }

    private async getChildItems(element: TreeItem): Promise<TreeItem[]> {
        if (element.type !== "section") {
            return [];
        }

        const childItems = element.childFolders ?? [];
        const workItems = await this.tmsClient.getWorkItemsBySectionId(element.id);

        return childItems.concat(workItems.map((workItem) =>
            new TreeItem(
                workItem.name,
                vscode.TreeItemCollapsibleState.None,
                workItem.entityTypeName,
                workItem.globalId.toString()
            )
        ));
    }
}
