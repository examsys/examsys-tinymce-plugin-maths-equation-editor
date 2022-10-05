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

function setupFrame() {
  var eqn = $('#equation');
  window.parent.parent.tinymce.activeEditor.plugins['maths-equation-editor'].updateMEE(window, eqn.width(), eqn.height());
}

function unencodeQuotes(str) {
  str = str.replace(/~quot~/g,"'");
  str = str.replace(/~dblquot~/g,'"');
  return str;
}
