var selelem = null;
$(function () {
    // fetch any selected item from the parent, and build an editor page for it
    var elem = window.parent.tinymce.activeEditor.plugins['maths-equation-editor'].getCurrentMee();
    var latex = "";
    var inline = false;
    if (elem) {
        selelem = elem;
        var url = elem.src;

        var data = url.substr(url.indexOf('?'));
        var data = unescape(data.substr(1));
        var data = $.parseJSON(data);

        latex = unencodeQuotes(data.latex);
        inline = data.inline;
    }

    var newinput = $('<input>');

    newinput.attr('name', 'eleminput');
    newinput.addClass('mee');
    newinput.addClass('activate');
    newinput.addClass('tabopen:symbols');
    $('#editor_cont').append(newinput);
    $(newinput)[0].value = latex;

    // if we are coming from a span element
    if (inline)
        newinput.addClass('inline');

    newinput.attr('latex', latex);

    if (latex) {
      document.getElementById("insert").style.display = "none";
    } else {
      document.getElementById("update").style.display = "none";
    }

    setTimeout("MEE.Base.Render();", 1);
});


function insertMME() {
  const edit = MEE.Base.edits[0];
  let html = "";

  const node = window.parent.tinymce.activeEditor.selection.getNode();
  const fontsize = $(node).css('font-size');

  const data = {};
  data.inline = edit.inline;
  data.latex = encodeQuotes(edit.latex);
  data.fontsize = fontsize;

  const datatxt = JSON.stringify(data);

  const url = document.URL.substring(0, document.URL.lastIndexOf("/"));
  const src = url+ "/frame.html?" + datatxt;

  const style = 'display:block';
  if (data.inline) {
    style = 'display:inline';
  }
  if (selelem) {
    selelem.src = src;
    $(selelem).attr('src', src);
  } else {
    html = "<iframe class='mee_iframe' style='" + style + "' src='" + src + "' frameborder='0'></iframe>";
    window.parent.tinymce.activeEditor.execCommand('mceInsertContent', true, html);
  }

  $(node).children('iframe').removeAttr('data-mce-style').css('display','inline');

  window.parent.tinymce.activeEditor.execCommand('mceRepaint');
  window.parent.tinymce.activeEditor.windowManager.close();
}

function encodeQuotes(str) {
  str = str.replace(/'/g,'~quot~');
  str = str.replace(/"/g,'~dblquot~');
  return str;
}

function unencodeQuotes(str) {
    str = str.replace(/~quot~/g,"'");
    str = str.replace(/~dblquot~/g,'"');
    return str;
}
