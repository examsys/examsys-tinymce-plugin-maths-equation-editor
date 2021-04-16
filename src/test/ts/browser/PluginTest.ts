import { TinyAssertions, TinyHooks, TinyUiActions } from '@ephox/mcagar';

import Plugin from '../../../main/ts/Plugin';

// This an example of a browser test of the editor.
describe('browser.PluginTest', () => {
  const hook = TinyHooks.bddSetup({
    plugins: 'maths-equation-editor',
    toolbar: 'maths-equation-editor'
  }, [ Plugin ]);

  it('test click on button', () => {
    const editor = hook.editor();
    TinyUiActions.clickOnToolbar(editor, 'button:contains("maths-equation-editor button")');
    TinyAssertions.assertContent(editor, '<p>content added from maths-equation-editor</p>');
  });
});
