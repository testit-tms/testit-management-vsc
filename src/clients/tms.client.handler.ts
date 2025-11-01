import { HttpError } from "testit-api-client";
import * as vscode from 'vscode';

export function handleHttpError(err: unknown, message = "") {
  if (err instanceof HttpError) {
    vscode.window.showErrorMessage(`HttpError ${err.statusCode}: ${message}. Error body: \n`, err.body);
  }
}
