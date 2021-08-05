import { Editor, TinyMCE } from 'tinymce';
import {config} from "@ephox/bedrock-server/lib/main/ts/bedrock/cli/ClOptions";

declare const tinymce: TinyMCE;

let currentMee;

const getCurrentMee = function() {
  if (currentMee)
    return currentMee;
  return null;
}

const getFrameForDocument = function(document) {
  const w = document.defaultView || document.parentWindow;
  const frames = w.parent.document.getElementsByTagName('iframe');
  for (let i = frames.length; i-- > 0; ) {
    const frame = frames[i];
    try {
      const d = frame.contentDocument || frame.contentWindow.document;
      if (d === document)
        return frame;
    } catch (e) {
      // Intentionally blank.
    }
  }
}

const updateMEE = function(frame, w, h) {
  const iframe = $(getFrameForDocument(frame.document));
  iframe.css('width', w + 5 + 'px');
  iframe.css('height', h + 'px');
  iframe.css('vertical-align', 'middle');
}

const clickMEEiFrame = function(frame) {
  if (frame.document)
    frame = getFrameForDocument(frame.document);
  else
    frame = $(frame).children()[0];

  // we have the iframe element that we have clicked on
  // need to set the selection to it
  const e = tinymce.activeEditor;

  e.selection.select(frame);
  e.execCommand('mceMEE');
}

const setup = (editor: Editor, url: string) => {
  // Register commands
  editor.addCommand('mceMEE', function () {
    editor.selection.select(editor.plugins['maths-equation-editor'].getCurrentMee());
    tinymce.activeEditor.windowManager.open({
      title: 'mee',
      body: {
        type: 'panel',
        items: [
          {
            type: 'htmlpanel',
            html: '<iframe id="meedialog" name="meedialog" src="' + url + '/dialog.html" frameborder="0"></iframe>',
          }
        ]
      },
      size: 'large',
      buttons: [ // A list of footer buttons
        {
          type: 'custom',
          text: 'insert',
          name: 'insert',
          disabled: currentMee ? true : false
        },
        {
          type: 'custom',
          text: 'update',
          name: 'update',
          disabled: currentMee ? false : true
        },
        {
          type: 'cancel',
          text: 'cancel',
          name: 'cancel',
          primary: true
        }
      ],
      onAction: function (dialogApi) {
        window['meedialog'].insertMME();
        dialogApi.close();
      },
    });
    // Resize.
    $('.tox-form__group').css('height', '100%');
    $('#meedialog').css('height', '100%');
    $('#meedialog').css('width', '100%');
  });

  editor.ui.registry.addButton('maths-equation-editor', {
    icon: 'mee',
    tooltip: 'mee',
    onAction: () => {
      tinymce.activeEditor.windowManager.open({
        title: 'mee',
        body: {
          type: 'panel',
          items: [
            {
              type: 'htmlpanel',
              html: '<iframe id="meedialog" name="meedialog" src="' + url + '/dialog.html" frameborder="0" width="100%" height="100%"></iframe>',
            }
          ]
        },
        size: 'large',
        buttons: [ // A list of footer buttons
          {
            type: 'custom',
            text: 'insert',
            name: 'insert',
            disabled: currentMee ? true : false
          },
          {
            type: 'custom',
            text: 'update',
            name: 'update',
            disabled: currentMee ? false : true
          },
          {
            type: 'cancel',
            text: 'cancel',
            name: 'cancel',
            primary: true
          }
        ],
        onAction: function (dialogApi) {
          window['meedialog'].insertMME();
          dialogApi.close();
        },
      });
      // Resize.
      $('.tox-form__group').css('height', '100%');
      $('#meedialog').css('height', '100%');
      $('#meedialog').css('width', '100%');
    },
    onSetup: function (buttonApi) {
      const editorEventCallback = function (eventApi) {
        buttonApi.setDisabled(eventApi.element.nodeName.toLowerCase() === 'maths-equation-editor');
        const mee = findMee(eventApi.element.childNodes[0]);
        if (mee) {
          currentMee = mee;
          $(mee).css('border', '1px solid blue');
        } else {
          currentMee = null;
        }
      };

      editor.on('NodeChange', editorEventCallback);

      /* onSetup should always return the unbind handlers */
      return function (buttonApi) {
        editor.off('NodeChange', editorEventCallback);
      };
    },
  });

  editor.on('SetContent', function (evt) {
    const body = editor.getBody();
    const elems = $(body).find('.mee');
    for (let i = 0 ; i < elems.length; i++){
      const elem = elems[i];
      const data = {};
      const eltype = elem.tagName;
      if (eltype == "DIV"){
        data.inline = false;
      } else {
        data.inline = true;
      }
      data.latex = encodeQuotes($(elem).html());
      data.fontsize = $(elem).css('font-size');

      const datatxt = JSON.stringify(data);

      const html = "<iframe class='mee_iframe' src='" + url + "/frame.html?" + datatxt + "' frameborder='0'></iframe>";
      const newelem = $(html);

      $(newelem).insertBefore(elem);
      if (!data.inline)
        newelem.attr('align','middle');

      $(elem).remove();
    }
  });

  editor.on('SaveContent', function (evt) {
    const doc = $('<div>');
    doc.html(evt.content);
    $(doc).find('.mee_iframe').each(function () {
      const src = $(this).attr('src');
      let data = src.substr(src.indexOf('?'));
      data = data.substr(1);
      data = $.parseJSON(data);
      data.latex = unencodeQuotes(data.latex);

      $(this).removeClass('mee_iframe');
      let newelem;
      if (data.inline) {
        newelem = $('<span>');
      } else {
        newelem = $('<div>');
      }
      $(newelem).html(data.latex);
      $(newelem).addClass('mee');
      $(newelem).insertBefore(this);
      $(this).remove();
    });
    evt.content = doc.html();
  });

  function unencodeQuotes(str) {
    str = str.replace(/~quot~/g,"'");
    str = str.replace(/~dblquot~/g,'"');
    return str;
  }

  function encodeQuotes(str) {
    str = str.replace(/'/g,'~quot~');
    str = str.replace(/"/g,'~dblquot~');
    return str;
  }

  function findMee(element) {
    if ($(element).hasClass('mee_iframe'))
      return element;
    if (!element.parentNode)
      return null;
    return findMee(element.parentNode);
  }

  return get$1(editor);
};

const get$1 = function (editor) {
  return {
    getCurrentMee: function () {
      return getCurrentMee();
    },
    updateMEE: function (frame, w, h) {
      return updateMEE(frame, w, h);
    },
    clickMEEiFrame: function (frame) {
      return clickMEEiFrame(frame);
    }
  };
};

export default (): void => {
  // Load the required translation files
  const supportedLangs = ['en', 'cs', 'pl', 'sk'];
  supportedLangs.forEach(function (item) {
    tinymce.PluginManager.requireLangPack('maths-equation-editor', item)
  });
  // Register the custom plugin
  tinymce.PluginManager.add('maths-equation-editor', setup);
};
