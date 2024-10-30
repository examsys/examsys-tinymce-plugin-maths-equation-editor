// create MEE class
$.Class.extend("MEE.Base",
{
    Render: function (source, mcedoc) {
        this.fontwaitlimit = 10;
        // build all recursive definitions
        MEE.Base.displays = new Array();
        MEE.Base.edits = new Array();

        if (!source)
            source = document.body;

        var d = new Date;
        var eqns = $.makeArray($(source).find("div.mee, span.mee, input.mee").css('color','white'));
        var d = new Date;

        async.each(eqns, this.Process, function () {
                        var d = new Date;
                        console.log('MEE DONE ' + d.getTime());
                        $('body').trigger('mee/done',[]);
                    });

        $(document.body).click(this.callback('pageClick'));
    },

    pageClick: function () {
        if (MEE.Edit.toolbar && MEE.Edit.toolbar.currentEdit) {
            var edit = MEE.Edit.toolbar.currentEdit;
            if (!$(edit.inputelement).hasClass('activate')) {
                edit.deactivate();
            }
            return false;
        }
        return true;
    },

    //#region Process elements
    Process: function (elem, callback) {

        var proc = {
          elem : elem,
          type : 'display',
          inline : false
        };

        if(elem.tagName === 'SPAN') {
            proc.inline = true;
        }

        if(elem.tagName === 'INPUT') {
            delete proc.inline;
            proc.type = 'edit';
        }

        if (proc.type == "display") {
            //if ($(proc.elem).attr('latex'))
                //return;
            var meeeqn = new MEE.Display(proc.elem, proc.inline, this.tinymce);
            MEE.Base.displays.push(meeeqn);
            proc.eqn = meeeqn;
        } else if (proc.type == "edit") {
            var meeeqn = new MEE.Edit(proc.elem);
            MEE.Base.edits.push(meeeqn);
        }

        async.nextTick( function () {
            if (proc.eqn)
                proc.eqn.Align();

            $(proc.elem).css('color','');

            //add some hight and padding to the parent elments to help with layout.
            if(!$(proc.elem).hasClass('meeInMCE')) {
              var h = MEE.Base.replacePX(proc.elem.style.height)
                                                  + MEE.Base.replacePX(proc.elem.style.paddingTop)
                                                   + MEE.Base.replacePX(proc.elem.style.paddingBottom);

              var elem = proc.elem.parentNode;
              if(elem.tagName == 'SPAN') {
                elem = elem.parentNode; // if we are in a table set the height on the tr not the td
              }
              if(elem.tagName == 'TD') {
                elem = elem.parentNode; // if we are in a table set the height on the tr not the td
              }

              if(h == 0 && MEE.Base.replacePX(elem.style.height) == 0) {
                elem.style.height = 'auto';
              } else if(elem.style.height == '' || h > MEE.Base.replacePX(elem.style.height)) {
                elem.style.minHeight = h + 'px';
                elem.style.paddingTop = proc.elem.style.paddingTop;
              }
            } else {
               var w = MEE.Base.calcWidth(proc.elem);
               proc.elem.parentNode.style.width = w + 'px';
               var h = MEE.Base.calcHeight(proc.elem);
               proc.elem.parentNode.style.height = h + 'px';
            }
            callback();
        });
    },

    //#region Process elements

    ProcessNext_Fonts: function () {
        this.fontwaitlimit--;
        i = MEE.Base.current;
        if (i >= MEE.Base.to_process.length) {
            MEE.Base.removeProgress();
            return;
        }

        var proc = this.to_process[i];
        if (proc.eqn && this.fontwaitlimit > 0) {
            if (!proc.eqn.FontsLoaded()) {
                this.setProgressMessage("Waiting on Fonts");
                setTimeout("MEE.Base.ProcessNext_Fonts()", 5);
                return;
            }
        }
        setTimeout("MEE.Base.ProcessNext_Align()", 5);
    },

    //#endregion


    replacePX: function (val) {
      val = parseInt(val);
      if(!val || val == 'NaN') {
        return 0;
      } else {
        return val;
      }
    },
    /**
     * Calculate the width of the content of an element.
     *
     * @param {HTMLElement} e
     * @returns {Number}
     */
    calcWidth : function (e) {
        var originalWidth = e.style.width;
        // We set the width to 0, in case it is already set to be higher than the amount of space
        // the element's content takes up. If the element uses more space than needed the scrollWidth
        // would return the elements current width.
        e.style.width = '0px';
        var width = e.scrollWidth;
        e.width = originalWidth;
        return width;
    },
    /**
     * Calculate the height the content of an element.
     *
     * @param {HTLMElement}) e
     * @returns {Number}
     */
    calcHeight : function (e) {
        var originalHeight = e.style.height;
        // We set the height to 0, in case it is already set to be higher than the amount of space
        // the element's content takes up. If the element uses more space than needed the scrollHeight
        // would return the elements current height.
        e.style.height = '0px';
        var height = e.scrollHeight;
        e.style.height = originalHeight;
        return height;
    }
},
{
});

//#region class to handle element alignment
$.Class.extend("MEE.Align",
{
    width: 0,
    height: 0,
    top: 0,
    bottom: 0,
    init: function () {
    },
    Merge: function (align) {
        this.width += align.width;
        if (this.height == 0) {
            this.height = align.height;
        } else {
            if (align.top > this.top)
                this.height += align.top - this.top;
            if (align.bottom > this.bottom)
                this.height += align.bottom - this.bottom;
        }
        this.top = Math.max(this.top, align.top);
        this.bottom = Math.max(this.bottom, align.bottom);
    },
    toString: function () {
        return "w " + this.width + " h " + this.height + " t " + this.top + " b " + this.bottom;
    }
});
//#endregion