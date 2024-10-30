$(function () {
  var no_auto_mee = 1;
  var data = window.location.search;
  var data = unescape(data.substring(1));
  var data = JSON.parse(data);
  data.latex = unencodeQuotes(data.latex);
  var equation = $('#equation');
  equation.css('font-size', data.fontsize);

  var tag;
  if (data.inline) {
    tag = $("<span>");
  } else {
    tag = $("<div>");
  }
  tag.attr('id', 'eqn_inner');
  tag.addClass('mee');
  tag.addClass('meeInMCE');
  tag.html(data.latex);
  equation.append(tag);

  $('body').on('mee/done',setupFrame);

  equation.on('click', function () {
    window.parent.parent.tinymce.activeEditor.plugins['maths-equation-editor'].clickMEEiFrame(window);
  });

});

/**
 * This method is run by a page inside an iframe to size it to fit the content.
 *
 * This code is run everytime the iframe is loaded.
 */
function setupFrame() {
  var iframe = window.frameElement;
  // Set the size of the frame to 0, so that we will only get the size of the content.
  iframe.width = 0;
  iframe.height = 0;
  // We also need to ensure that the style on the iframe does not override the size.
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  // Set the frame to be the amount of space the content takes up.
  iframe.style.width = '';
  iframe.style.height = '';
  iframe.style.verticalAlign = 'middle';
  iframe.width = document.body.scrollWidth;
  iframe.height = document.body.scrollHeight;
}

function unencodeQuotes(str) {
  str = str.replace(/~quot~/g,"'");
  str = str.replace(/~dblquot~/g,'"');
  return str;
}
