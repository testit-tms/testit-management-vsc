import * as vscode from 'vscode';
import { ITmsClient, TmsClient } from '../../clients';
import { SectionModel } from 'testit-api-client';
import { TmsConfiguration } from '../../configuration';
import { FileUtils } from '../../utils';
import { TreeItem } from './tree.item';

export class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;
    private tmsClient: ITmsClient | undefined; 
    private currentView: 'Tms' | 'Allure' = 'Tms';

    public changeView(viewType: 'Tms' | 'Allure'): void {
        this.currentView = viewType;
        
        this._onDidChangeTreeData.fire();
    }

    private getTmsClient(): ITmsClient {
        if (this.tmsClient === undefined) {
            this.tmsClient = new TmsClient(TmsConfiguration.getUrl(), TmsConfiguration.getToken())
        }

        return this.tmsClient;
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

    private async getRootItems(): Promise<TreeItem[]> {
        if (this.currentView === 'Tms') {
            return await this.getTmsTreeItems();
        }

        return this.getAllureTreeItems();
    }

    private async getChildItems(element: TreeItem): Promise<TreeItem[]> {
        if (this.currentView === 'Tms') {
            return await this.getTmsChildItems(element);
        }

        return element.children;
    }

    private getAllureTreeItems(): TreeItem[] {
        const workspaceFolders = vscode.workspace.workspaceFolders;
    
        if (!workspaceFolders || workspaceFolders.length == 0) {
            vscode.window.showInformationMessage('No workspace opened');
            throw new Error('No workspace opened!');
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        const infos = FileUtils.getAllFileInfo(workspacePath);
        const children = infos.map((info) => 
            new TreeItem(
                info.filePath,
                vscode.TreeItemCollapsibleState.None,
                'file',
                info.filePath,
                [],
                info
            )
        );
        const root = new TreeItem(
            "Allure results",
            vscode.TreeItemCollapsibleState.Collapsed,
            'folder',
            "Allure results",
            children
        );

        return [root];
    }

    private async getTmsTreeItems(): Promise<TreeItem[]> {
            const projectId = TmsConfiguration.getProjectId();
            const sections = await this.getTmsClient().getSectionsByProjectId(projectId);
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
    
    private buildChildSections(sections: Array<SectionModel>, parentId: string): TreeItem[] {
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

    private async getTmsChildItems(element: TreeItem): Promise<TreeItem[]> {
        if (element.type !== "section") {
            return [];
        }

        const children = element.children ?? [];
        const workitems = await this.getTmsClient().getWorkItemsBySectionId(element.id);

        return children.concat(workitems.map((workitem) => 
            new TreeItem(
                workitem.name,
                vscode.TreeItemCollapsibleState.None,
                workitem.entityTypeName,
                workitem.globalId.toString(),
                []
            )
        ));
    }
}
