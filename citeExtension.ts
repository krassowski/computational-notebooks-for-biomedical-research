import { IDisposable, DisposableDelegate } from '@lumino/disposable';
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';
import { ToolbarButton } from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import {
  NotebookPanel,
  INotebookModel,
} from '@jupyterlab/notebook';


function insertAtCursor(panel: NotebookPanel, text: string) {
  console.log(panel)
  const activeCell = panel.content.activeCell;
  if (activeCell) {
    const cursor = activeCell.editor.getCursorPosition();
    const offset = activeCell.editor.getOffsetAt(cursor);
    const editor = activeCell.editor;
    activeCell.model.value.insert(offset, text);
    const updatedPosition = editor.getPositionAt(offset + text.length);
    if (updatedPosition) {
      editor.setCursorPosition(updatedPosition);
    }
  }
}

export class ButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    const clearOutput = () => {
      // task: use input dialog to get the query from user
      // use https://jupyterlab.readthedocs.io/en/stable/api/index.html
      const query = 'NCT04001244';
      (
          fetch(`https://clinicaltrials.gov/api/query/full_studies?expr=${query}&fmt=JSON`)
          .then(response => response.json())
          .then(data => {
              console.log(data['FullStudiesResponse']['FullStudies'][0]['Study'])
              insertAtCursor(panel, JSON.stringify(data['FullStudiesResponse']['FullStudies'][0]['Study']))
          })
      )
    };
    const button = new ToolbarButton({
      className: 'cite-button',
      label: 'Cite study',
      onClick: clearOutput,
      tooltip: 'Cite a study',
    });

    panel.toolbar.insertItem(10, 'clearOutputs', button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}


const plugin: JupyterFrontEndPlugin<void> = {
  id: 'hello-world:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
  },
};

export default plugin;
