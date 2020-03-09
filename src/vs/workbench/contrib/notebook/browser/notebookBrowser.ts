/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from 'vs/base/browser/dom';
import { IMouseWheelEvent } from 'vs/base/browser/mouseEvent';
import { BareFontInfo } from 'vs/editor/common/config/fontInfo';
import { CodeEditorWidget } from 'vs/editor/browser/widget/codeEditorWidget';
import { CellViewModel } from 'vs/workbench/contrib/notebook/browser/viewModel/notebookCellViewModel';
import { OutputRenderer } from 'vs/workbench/contrib/notebook/browser/view/output/outputRenderer';
import { IOutput, CellKind, IRenderOutput } from 'vs/workbench/contrib/notebook/common/notebookCommon';
import { RawContextKey } from 'vs/platform/contextkey/common/contextkey';
import { NotebookViewModel, IModelDecorationsChangeAccessor } from 'vs/workbench/contrib/notebook/browser/viewModel/notebookViewModel';
import { FindMatch } from 'vs/editor/common/model';

export const KEYBINDING_CONTEXT_NOTEBOOK_FIND_WIDGET_FOCUSED = new RawContextKey<boolean>('notebookFindWidgetFocused', false);

export interface INotebookEditor {
	viewType: string | undefined;
	viewModel: NotebookViewModel | undefined;
	insertEmptyNotebookCell(cell: CellViewModel, type: CellKind, direction: 'above' | 'below'): Promise<void>;
	deleteNotebookCell(cell: CellViewModel): void;
	editNotebookCell(cell: CellViewModel): void;
	saveNotebookCell(cell: CellViewModel): void;
	focusNotebookCell(cell: CellViewModel, focusEditor: boolean): void;
	getActiveCell(): CellViewModel | undefined;
	layoutNotebookCell(cell: CellViewModel, height: number): void;
	createInset(cell: CellViewModel, output: IOutput, shadowContent: string, offset: number): void;
	removeInset(output: IOutput): void;
	triggerScroll(event: IMouseWheelEvent): void;
	getFontInfo(): BareFontInfo | undefined;
	getListDimension(): DOM.Dimension | null;
	getOutputRenderer(): OutputRenderer;

	/**
	 * Reveal cell into viewport.
	 * If `offset` is provided, `top(cell) + offset` will be scrolled into view.
	 */
	revealInView(cell: CellViewModel, offset?: number): void;

	/**
	 * Reveal cell into viewport center.
	 * If `offset` is provided, `top(cell) + offset` will be scrolled into view.
	 */
	revealInCenter(cell: CellViewModel, offset?: number): void;

	/**
	 * Reveal cell into viewport center if cell is currently out of the viewport.
	 * If `offset` is provided, `top(cell) + offset` will be scrolled into view.
	 */
	revealInCenterIfOutsideViewport(cell: CellViewModel, offset?: number): void;

	/**
	 * Reveal a line in notebook cell into viewport center.
	 * If `offset` is provided, `top(cell) + offset` will be scrolled into view.
	 */
	revealLineInCenter(cell: CellViewModel, line: number): void;

	/**
	 * Reveal a line in notebook cell into viewport center.
	 * If `offset` is provided, `top(cell) + offset` will be scrolled into view.
	 */
	revealLineInCenterIfOutsideViewport(cell: CellViewModel, line: number): void;

	/**
	 * Change the decorations on cells.
	 * The notebook is virtualized and this method should be called to create/delete editor decorations safely.
	 */
	changeDecorations(callback: (changeAccessor: IModelDecorationsChangeAccessor) => any): any;
	focus(): void;
	showFind(): void;
	hideFind(): void;
	focusNext(nextMatch: CellFindMatch, matchIndex: number): void;
}

export interface CellRenderTemplate {
	container: HTMLElement;
	cellContainer: HTMLElement;
	menuContainer?: HTMLElement;
	editingContainer?: HTMLElement;
	outputContainer?: HTMLElement;
	editor?: CodeEditorWidget;
}

export interface IOutputTransformContribution {
	/**
	 * Dispose this contribution.
	 */
	dispose(): void;

	render(output: IOutput, container: HTMLElement, preferredMimeType: string | undefined): IRenderOutput;
}

export interface CellFindMatch {
	cell: CellViewModel;
	matches: FindMatch[];
}

