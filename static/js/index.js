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
      this.$latestCount++;
      $this.getCanvas().append(this.canvasNode());

      $this.lastCanvasNode().on('click touchend', function() {
        if (!$('.js-tempInput__year').length) {
          $this.getContents().append($this.inputYear());
        }
        $('.js-tempInput__year').focus();
      });

      $(document).on('click touchend', 'body', function(e) {
        var $lastCanvasNode = $(e.target).closest('.js-historyCanvas__node:last-child');
        var $input = $(e.target).closest('.js-tempInput__year');
        if (!$lastCanvasNode.length && !$input.length) {
          $('.js-tempInput__year').closest('.js-historyContents__node').remove();
        }
      });

      $(document).on('change', 'input', function(e) {
        var $target = $(e.target);
        if ($target.val().length > 4) {
          $target.val(Number($target.val().substring(0, 4)));
        }
      });
    }

    getCanvas() {
      return this.$canvas;
    }
    getContents() {
      return this.$contents;
    }

    canvasNode() {
      return $(
        '<section></section>',
        { "data-id": this.$latestCount, class: 'p-historyCanvas__node js-historyCanvas__node' }
      );
    }

    canvasLine() {
      return $(
        '<section></section>',
        { class: 'p-historyCanvas__line' }
      );
    }

    lastCanvasNode() {
      return this.$canvas.find('.js-historyCanvas__node:last-child');
    }

    contentsNode() {
      return $(
        '<section></section>',
        { id: `contents-node-${this.$latestCount}`, class: 'p-historyContents__node js-historyContents__node' }
      );
    }

    contentsYear() {
      return $(
        '<section></section>',
        { class: 'p-historyContents__year js-historyContents__year' }
      );
    }

    contentsEvent() {
      return $(
        '<section></section>',
        { class: 'p-historyContents__event js-historyContents__event' }
      );
    }

    inputYear() {
      var $input = $(
        '<input>',
        {
          type: "number",
          maxlength: 4,
          class: 'p-tempInput__year js-tempInput__year'
        }
      );
      var $contentsNode = this.contentsNode();
      var $contentsYear = this.contentsYear();
      $contentsYear.append($input);
      $contentsNode.append($contentsYear);

      return $contentsNode;
    }

    inputEvent() {
      var $input = $(
        '<input>',
        {
          type: "text",
          maxlength: 50,
          class: 'p-tempInput__event'
        }
      );
      var $contentsNode = $('.js-historyContents__node:last-child');
      var $contentsEvent = this.contentsEvent();
      $contentsEvent.append($input);
      $contentsNode.append($contentsEvent);

      return $contentsNode;
    }
  }

  var htmlCanvas = new CanvasItem('history-canvas', 'history-contents');
  htmlCanvas.exec();
});
