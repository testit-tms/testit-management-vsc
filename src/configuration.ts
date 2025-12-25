import * as vscode from 'vscode';

export class TmsConfiguration {
    public static getUrl(): string {
        const url = vscode.workspace.getConfiguration('testitManagement').get<string>('url');

        if (!url) {
            vscode.window.showErrorMessage('Url is not found!').then();
            throw new Error('Url is not found!');
        }

        return url;
    }

    public static getProjectId(): string {
        const projectId = vscode.workspace.getConfiguration('testitManagement').get<string>('projectId');

        if (!projectId) {
            vscode.window.showErrorMessage('Project id is not found!').then();
            throw new Error('Project id is not found!');
        }

        return projectId;
    }

    public static getToken(): string {
        const token = vscode.workspace.getConfiguration('testitManagement').get<string>('token');

        if (!token) {
            vscode.window.showErrorMessage('Token is not found!').then();
            throw new Error('Token is not found!');
        }

        return token;
    }

    public static getSelectedFramework(): string {
        const framework = vscode.workspace.getConfiguration('testitManagement').get<string>('framework');

        if (!framework) {
            vscode.window.showErrorMessage('Framework is not found!').then();
            throw new Error('Framework is not found!');
        }

        return framework;
    }
}
