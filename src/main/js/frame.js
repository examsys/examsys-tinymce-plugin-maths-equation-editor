$(function () {
  var no_auto_mee = 1;
  var data = window.location.search;
  var data = unescape(data.substr(1));
  var data = $.parseJSON(data);
  data.latex = unencodeQuotes(data.latex);
  $('#equation').css('font-size', data.fontsize);

  if (data.inline) {
    tag = $("<span>");
  } else {
    tag = $("<div>");
  }
  tag.attr('id', 'eqn_inner');
  tag.addClass('mee');
  tag.addClass('meeInMCE');
  tag.html(data.latex);
  $('#equation').append(tag);

  $('body').bind('mee/done',setupFrame);

  $('#equation').click(function () {
    window.parent.parent.tinymce.activeEditor.plugins['maths-equation-editor'].clickMEEiFrame(window);
  });

});

function setupFrame() {
  var eqn = $('#equation');
  window.parent.parent.tinymce.activeEditor.plugins['maths-equation-editor'].updateMEE(window, eqn.width(), eqn.height());
}

function unencodeQuotes(str) {
  str = str.replace(/~quot~/g,"'");
  str = str.replace(/~dblquot~/g,'"');
  return str;
}
