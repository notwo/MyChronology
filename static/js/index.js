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
      this.$latestCount++;
      this.appendCanvasNode();

      this.setLatestTempYearEvent();
      this.setTempYearEvent();
      this.setUpdateLastContentsNodeEvent();
      this.setUpdateContentsNodeEvent();
      this.setUpdateContentsEventsEvent();
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
        { "data-id": this.$latestCount, id: `contents-node-${this.$latestCount}`, class: 'p-historyContents__node js-historyContents__node' }
      );
    }

    contentsYearElement() {
      return $(
        '<section></section>',
        { class: 'p-historyContents__year js-historyContents__year' }
      );
    }

    contentsEventElements() {
      return $(
        '<section></section>',
        { class: 'p-historyContents__events js-historyContents__events' }
      );
    }
    contentsEventElement() {
      return $(
        '<section></section>',
        { class: 'p-historyContents__eventInput' }
      );
    }

    spanYear(year) {
      return $(
        `<span>${year}</span>`
      );
    }

    spanEvents() {
    }

    inputTempYearElement() {
      return $(
        '<input>',
        {
          type: "number",
          maxlength: 4,
          id: 'temp-year',
          class: 'p-tempInput__year',
          placeholder: '年'
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

    inputUpdateYearElement(canvasNodeId, currentYear) {
      return $(
        '<input>',
        {
          type: "number",
          maxlength: 4,
          id: `temp-year-${canvasNodeId}`,
          class: 'p-updateInput__year',
          placeholder: '年',
          value: currentYear
        }
      );
    }

    inputEventElement() {
      return $(
        '<textarea>',
        {
          maxlength: 50,
          class: 'p-tempInput__event',
          placeholder: 'この年でやったこと'
        }
      );
    }
    inputEventBlock() {
      var $contentsEventElement = this.contentsEventElement();
      $contentsEventElement.append(this.inputEventElement());

      return $contentsEventElement;
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

    setTempYearEvent() {
      var $this = this;
      $(document).on('click touchend', '.js-historyCanvas__node', function(e) {
        var canvasNodeId = $(e.target).data('id');
        var lastCanvasId = $(e.target).closest('.js-historyCanvas__node:last-child').data('id');
        if (canvasNodeId === lastCanvasId) { return; }
        var $currentYearSpan = $(`#contents-node-${canvasNodeId}`).find('.js-historyContents__year span');
        var currentYear = $currentYearSpan.text();
        // ここを条件分岐させてjs-historyContents__yearの中身を書き換える
        if (!$(`#temp-year-${canvasNodeId}`).length) {
          $($(`#contents-node-${canvasNodeId}`).find('.js-historyContents__year')[0]).html($this.inputUpdateYearElement(canvasNodeId, currentYear));
        }
        $(`#temp-year-${canvasNodeId}`).focus();
      });
    }

    setUpdateLastContentsNodeEvent() {
      var $this = this;
      $(document).on('click touchend', 'body', function(e) {
        var $lastCanvasNode = $(e.target).closest('.js-historyCanvas__node:last-child');
        var $tempYearInput = $(e.target).closest('#temp-year');

        if (!$lastCanvasNode.length && !$tempYearInput.length) {
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

    setUpdateContentsNodeEvent() {
      var $this = this;
      $(document).on('click touchend', 'body', function(e) {
        var canvasNodeId = $(e.target).closest('.js-historyContents__node').data('id');
        canvasNodeId = !canvasNodeId ? $(e.target).closest('.js-historyCanvas__node').data('id') : canvasNodeId;
        var $canvasNode = $('.js-historyCanvas__node').filter(function(_i, node) {
          return $(node).data('id') === canvasNodeId;
        });
        var $input = $(e.target).closest(`#temp-year-${canvasNodeId}`);

        if (!$canvasNode.length && !$input.length) {
          $input = $('.js-historyContents__year input');
          var $section = $input.closest('.js-historyContents__year');
          if ($input.val()) {
            $section.html($this.spanYear($input.val()));
          } else {
            $input.remove();
          }
        }
      });
    }

    setUpdateContentsEventsEvent() {
      var $this = this;
      $(document).on('click touchend', '.js-historyContents__eventAdd', function(e) {
        var $contentsNode = $(e.target).closest('.js-historyContents__node');
        var $events = $contentsNode.find('.js-historyContents__events');
        $events.append($this.inputEventBlock());
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
