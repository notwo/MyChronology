$(function() {
  class CanvasItem {
    #$canvas;
    #$contents;

    constructor(canvas, contents) {
      this.$canvas = $(`#${canvas}`);
      this.$contents = $(`#${contents}`);
    }

    canvasNode() {
      return $(
        '<section></section>',
        { class: 'p-historyCanvas__node' }
      );
    }

    getCanvas() {
      return this.$canvas;
    }

    getContents() {
      return this.$contents;
    }

    canvasLine() {
      return $(
        '<section></section>',
        { class: 'p-historyCanvas__line' }
      );
    }

    lastCanvasNode() {
      return this.$canvas.find('.p-historyCanvas__node:last-child');
    }

    contentsNode() {
      return $(
        '<section></section>',
        { class: 'p-historyContents__node' }
      );
    }

    contentsYear() {
      return $(
        '<section></section>',
        { class: 'p-historyContents__year' }
      );
    }

    contentsEvent() {
      return $(
        '<section></section>',
        { class: 'p-historyContents__event' }
      );
    }

    inputYear() {
      var $input = $(
        '<input>',
        {
          type: "number",
          maxlength: 4,
          class: 'p-tempInput__year'
        }
      );
      var $contentsNode = this.contentsNode();
      var $contentsYear = this.contentsYear();
      var $inputButton = this.inputButton();
      $contentsYear.append($input);
      $contentsYear.append($inputButton);
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
      var $contentsNode = $('.p-historyContents__node:last-child');
      var $contentsEvent = this.contentsEvent();
      $contentsEvent.append($input);
      $contentsNode.append($contentsEvent);

      return $contentsNode;
    }

    inputButton() {
      return $(
        '<button type="button" class="c-btn p-register p-contentsYear__button">登録</button>'
      );
    }
  }

  var htmlCanvas = new CanvasItem('history-canvas', 'history-contents');

  htmlCanvas.getCanvas().append(htmlCanvas.canvasNode());

  htmlCanvas.lastCanvasNode().on('click touchend', function() {
    if (!$('.p-tempInput__year').length) {
      htmlCanvas.getContents().append(htmlCanvas.inputYear());
      $('.p-tempInput__year').focus();
    }
  });

  $(document).on('click touchend', 'body', function(e) {
    var $target = $(e.target).closest('.p-historyCanvas__node:last-child');
    var $button = $(e.target).closest('.p-contentsYear__button');
    var $input = $(e.target).closest('.p-tempInput__year');
    if (!$target.length && !$input.length && !$button.length) {
      $('.p-tempInput__year').closest('.p-historyContents__node').remove();
    }
  });

  $(document).on('change', 'input', function(e) {
    var $target = $(e.target);
    if ($target.val().length > 4) {
      $target.val($target.val().substring(0, 4));
    }
  });
});

