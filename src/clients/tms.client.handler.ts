import * as vscode from 'vscode';

export function handleHttpError(err: any, message = "") {
    const status = err?.status ?? err?.statusCode;
    const body = err?.body !== undefined
        ? (typeof err.body === 'string' ? err.body : JSON.stringify(err.body))
        : undefined;
    const details = body
        ?? err?.error?.message
        ?? err?.error
        ?? err?.message
        ?? '';

    vscode.window.showErrorMessage(
        `HttpError ${status ?? 'unknown'}: ${message}. Error body: ${details}`
    );
}
