import { Editor, TinyMCE } from 'tinymce';

declare const tinymce: TinyMCE;

const setup = (editor: Editor, url: string): void => {
  editor.ui.registry.addButton('maths-equation-editor', {
    text: 'maths-equation-editor button',
    onAction: () => {
      editor.setContent('<p>content added from maths-equation-editor</p>');
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('maths-equation-editor', setup);
};
