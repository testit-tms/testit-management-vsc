import * as vscode from 'vscode';

export function handleHttpError(err: any, message = "") {
    vscode.window.showErrorMessage(`HttpError ${err.statusCode}: ${message}. Error body: \n`, err.body);
}
