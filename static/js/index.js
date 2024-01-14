$(function() {
  class CanvasItem {
    #$canvas;
    #$contents;
    #$latestCount;

    constructor(canvas, contents) {
      this.$canvas = $(`#${canvas}`);
      this.$contents = $(`#${contents}`);
      this.$latestCount = 1;
    }

    exec() {
      var $this = this;

      $this.$latestCount++;
      this.appendCanvasNode();

      this.setLatestTempYearEvent();
      this.setUpdateContentsNodeEvent();
      this.setUpdateLastContentsNodeEvent();
      this.setSnapTempYearEvent();
    }

    getCanvas() {
      return this.$canvas;
    }
    getContents() {
      return this.$contents;
    }

    /********************** parts **********************/
    canvasNodeElement() {
      return $(
        '<section></section>',
        { "data-id": this.$latestCount, class: 'p-historyCanvas__node js-historyCanvas__node' }
      );
    }

    canvasLineElement() {
      return $(
        '<section></section>',
        { class: 'p-historyCanvas__line' }
      );
    }

    contentsNodeElement() {
      return $(
        '<section></section>',
        { id: `contents-node-${this.$latestCount}`, class: 'p-historyContents__node js-historyContents__node' }
      );
    }

    contentsYearElement() {
      return $(
        '<section></section>',
        { class: 'p-historyContents__year js-historyContents__year' }
      );
    }

    contentsEventElement() {
      return $(
        '<section></section>',
        { class: 'p-historyContents__event js-historyContents__event' }
      );
    }

    spanYear(year) {
      return $(
        `<span>${year}</span>`
      );
    }

    inputTempYearElement() {
      return $(
        '<input>',
        {
          type: "number",
          maxlength: 4,
          id: 'temp-year',
          class: 'p-tempInput__year'
        }
      );
    }
    inputYearBlock() {
      var $contentsNodeElement = this.contentsNodeElement();
      var $contentsYearElement = this.contentsYearElement();
      $contentsYearElement.append(this.inputTempYearElement());
      $contentsNodeElement.append($contentsYearElement);

      return $contentsNodeElement;
    }

    inputUpdateYearElement(canvasNodeId) {
      return $(
        '<input>',
        {
          type: "number",
          maxlength: 4,
          id: `temp-year-${canvasNodeId}`,
          class: 'p-updateInput__year'
        }
      );
    }

    inputEventElement() {
      var $input = $(
        '<input>',
        {
          type: "text",
          maxlength: 50,
          class: 'p-tempInput__event'
        }
      );
      var $contentsNodeElement = $('.js-historyContents__node:last-child');
      var $contentsEventElement = this.contentsEventElement();
      $contentsEventElement.append($input);
      $contentsNodeElement.append($contentsEventElement);

      return $contentsNodeElement;
    }

    appendLine() {
      this.getCanvas().append(this.canvasLineElement());
    }
    appendCanvasNode() {
      this.getCanvas().append(this.canvasNodeElement());
    }

    appendYear() {
      var year = Number($('#temp-year').val());
      $('#temp-year').remove();
      const $contentsYearElement = $(`#contents-node-${this.$latestCount}`).find('.js-historyContents__year');
      $($contentsYearElement).append(this.spanYear(year));
    }

    /********************** events **********************/
    setLatestTempYearEvent() {
      var $this = this;
      $(document).on('click touchend', '.js-historyCanvas__node:last-child', function(e) {
        if (!$('#temp-year').length) {
          $this.getContents().append($this.inputYearBlock());
        }
        $('#temp-year').focus();
      });
    }

    setUpdateContentsNodeEvent() {
      var $this = this;
      $(document).on('click touchend', '.js-historyCanvas__node', function(e) {
        var canvasNodeId = $(e.target).data('id');
        var lastCanvasId = $(e.target).closest('.js-historyCanvas__node:last-child').data('id');
        if (canvasNodeId === lastCanvasId) { return; }
        var $currentYearSpan = $(`#contents-node-${canvasNodeId}`).find('.js-historyContents__year span');
        var currentYear = $currentYearSpan.text();
        // ここを条件分岐させてjs-historyContents__yearの中身を書き換える
        $($(`#contents-node-${canvasNodeId}`).find('.js-historyContents__year')[0]).html($this.inputUpdateYearElement(canvasNodeId));
      });
    }

    setUpdateLastContentsNodeEvent() {
      var $this = this;
      $(document).on('click touchend', 'body', function(e) {
        var $lastCanvasNode = $(e.target).closest('.js-historyCanvas__node:last-child');
        var $input = $(e.target).closest('#temp-year');
        if (!$lastCanvasNode.length && !$input.length) {
          if ($('#temp-year').val()) {
            $this.appendYear();

            $this.appendLine();
            $this.$latestCount++;
            $this.appendCanvasNode();
          } else {
            $('#temp-year').closest('.js-historyContents__node').remove();
          }
        }
      });
    }

    setSnapTempYearEvent() {
      $(document).on('change', 'input', function(e) {
        var $target = $(e.target);
        if ($target.val().length > 4) {
          $target.val(Number($target.val().substring(0, 4)));
        }
      });
    }
  }

  var htmlCanvas = new CanvasItem('history-canvas', 'history-contents');
  htmlCanvas.exec();
});
