$(function() {
  class CanvasItem {
    #$canvas;
    #$contents;
    #$latestCount;
    #$currentCanvasWidth;

    constructor(canvas, contents) {
      this.$canvas = $(`#${canvas}`);
      this.$contents = $(`#${contents}`);
      this.$latestCount = 1;
      this.$currentCanvasWidth = 100;
    }

    exec() {
      this.$latestCount++;
      this.appendCanvasNode();

      this.setLatestTempYearEvent();
      this.setTempYearEvent();
      this.setTempEventsEvent();
      this.setUpdateEvent();
      this.setDeleteContentsEvent();
      this.setSnapTempYearEvent();

      this.setHistoryToImageButtonEvent();
      this.setDownloadButtonEvent();
    }

    getCanvas() {
      return this.$canvas;
    }
    getContents() {
      return this.$contents;
    }

    /***************************************************************************************/
    /**************************************** parts ****************************************/
    /***************************************************************************************/
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
        { class: 'p-historyContents__event js-historyContents__event' }
      );
    }

    spanYear(year) {
      return $(
        `<span>${year}</span>`
      );
    }

    spanEvents(event) {
      return $(
        `<span>${event}</span>`
      );
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
          class: 'p-tempInput__event js-tempInput__event',
          placeholder: 'この年でやったこと'
        }
      );
    }

    addEventElement() {
      return $(
        '<section></section>',
        { class: 'p-historyContents__eventAdd js-historyContents__eventAdd' }
      );
    }

    editEventElement() {
      return $(
        '<section></section>',
        { class: 'p-historyContents__eventEdit js-historyContents__eventEdit' }
      );
    }

    deleteEventElement() {
      return $(
        '<section></section>',
        { class: 'p-historyContents__eventDelete js-historyContents__eventDelete' }
      );
    }

    inputEventBlock() {
      var $contentsEventElement = this.contentsEventElement();
      $contentsEventElement.append(this.inputEventElement());
      $contentsEventElement.append(this.editEventElement());
      $contentsEventElement.append(this.deleteEventElement());

      return $contentsEventElement;
    }

    downloadLinkElement(canvas) {
      return $(
        '<a></a>',
        { href: canvas.toDataURL("image/png"), download: "download.png" }
      );
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

    appendEventAdder() {
      var $contentsEventElements = this.contentsEventElements();
      $('#temp-year').closest('.js-historyContents__node').append($contentsEventElements);
      $('#temp-year').closest('.js-historyContents__node').append(this.addEventElement());
    }

    extendHistoryArea() {
      var nodeWidth = $('.p-historyCanvas__node').width() + ($('.p-historyCanvas__node').width() + $('.p-historyCanvas__line').width()) * this.$latestCount;
      if ($('.p-history').width() <= nodeWidth && $('.p-historyCanvasWrap').width() <= nodeWidth) {
        this.$currentCanvasWidth += 70;
        $('.p-history').addClass('p-scroll');
        $('.p-historyCanvasWrap').css('width', this.$currentCanvasWidth + '%');
        $('.p-historyContentsWrap').css('width', this.$currentCanvasWidth + '%');
      }
    }

    /****************************************************************************************/
    /**************************************** events ****************************************/
    /****************************************************************************************/
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
        if (!$(`#temp-year-${canvasNodeId}`).length) {
          $($(`#contents-node-${canvasNodeId}`).find('.js-historyContents__year')[0]).html($this.inputUpdateYearElement(canvasNodeId, currentYear));
        }
        $(`#temp-year-${canvasNodeId}`).focus();
      });
    }

    setTempEventsEvent() {
      var $this = this;

      $(document).on('click touchend', '.js-historyContents__eventAdd', function(e) {
        var $contentsNode = $(e.target).closest('.js-historyContents__node');
        var $events = $contentsNode.find('.js-historyContents__events');
        $events.append($this.inputEventBlock());
        $events.find('.p-tempInput__event').focus();
      });

      $(document).on('click touchend', '.js-historyContents__eventEdit', function() {
        var $tempEventInput = $(this).closest('.js-historyContents__node').find('.js-tempInput__event');
        if ($tempEventInput.length) {
          return;
        }

        var eventText = $(this).prev().text();
        $(this).prev().remove();
        $(this).parent().prepend($this.inputEventElement());
        $(this).prev().val(eventText);
      });
    }

    setUpdateEvent() {
      var $this = this;

      $(document).on('click touchend', 'body', function(e) {
        /* 最新ノード */
        var $lastCanvasNode = $(e.target).closest('.js-historyCanvas__node:last-child');
        var $tempYearInput = $(e.target).closest('#temp-year');

        if (!$lastCanvasNode.length && !$tempYearInput.length) {
          if ($('#temp-year').val()) {
            $this.appendEventAdder();
            $this.appendYear();

            $this.appendLine();
            $this.$latestCount++;
            $this.appendCanvasNode();

            $this.extendHistoryArea();
          } else {
            $('#temp-year').closest('.js-historyContents__node').remove();
          }
        }

        /* 最新ノード以外 */
        var canvasNodeId = $(e.target).closest('.js-historyContents__node').data('id');
        canvasNodeId = !canvasNodeId ? $(e.target).closest('.js-historyCanvas__node').data('id') : canvasNodeId;
        var $canvasNode = $('.js-historyCanvas__node').filter(function(_i, node) {
          return $(node).data('id') === canvasNodeId;
        });
        var $yearInput = $(e.target).closest(`#temp-year-${canvasNodeId}`);

        if (!$canvasNode.length && !$yearInput.length) {
          $yearInput = $('.js-historyContents__year input');
          var $section = $yearInput.closest('.js-historyContents__year');
          if ($yearInput.val()) {
            $section.html($this.spanYear($yearInput.val()));
          } else {
            $yearInput.remove();
          }
        }

        var $eventInput = $(e.target).closest('.p-tempInput__event');
        if (!$canvasNode.length && !$eventInput.length) {
          $('.p-tempInput__event').filter(function() {
            return String($(this).val()).length === 0
          }).closest('.js-historyContents__event').remove();

          $('.p-tempInput__event').each(function() {
            var $historyCanvasEvent = $(this).closest('.js-historyContents__event');
            var eventVal = $historyCanvasEvent.find('.js-tempInput__event').val();
            $historyCanvasEvent.find('.js-tempInput__event').remove();
            $historyCanvasEvent.prepend($this.spanEvents(eventVal));
          });
        }
      });
    }

    setDeleteContentsEvent() {
      $(document).on('click touchend', '.js-historyContents__eventDelete', function(e) {
        var $contentsEvent = $(e.target).closest('.js-historyContents__event');
        $contentsEvent.remove();
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

    setHistoryToImageButtonEvent() {
      var $this = this;

      $(document).on('click touchend', '#to-history-image', function() {
        $('.js-downloadButton__buttonWrap').removeClass('c-hidden');
        $('canvas').attr('width', $('.p-historyCanvasWrap').width() + 50);
        $('canvas').attr('height', $('#history').height());
        if ($('.p-history').hasClass('p-scroll')) {
          $('.js-canvasWrap').addClass('p-scroll');
        }

        var $canvas = $('canvas')[0];
        if ($canvas.getContext) {
          var context = $canvas.getContext("2d");

          // 先に線を全部引いてから円を描画することで重なり順を調整する
          context.lineWidth = 11;
          var lineLength = 250;
          var firstCenterPosX = 40;
          var centerPosY = 40;
          var radius = centerPosY / 2;

          var textFirstPosX = 23;
          var textFirstPosY = 100;
          var eventHeight = 40;
          var eventFirstPosY = textFirstPosY;

          var eventTextHeight = 50;
          for (var i = 0;i < $this.$latestCount - 1;i++) {
            context.strokeStyle = "rgba(200,255,120,1)";
            context.moveTo(firstCenterPosX + i * lineLength, centerPosY);
            context.lineTo(firstCenterPosX + (i+1) * lineLength, centerPosY);
            context.stroke();

            context.font = "29px Arial";
            var year = $('#contents-node-' + (i+1)).find('.js-historyContents__year span').text();
            context.fillText(year, textFirstPosX + (i * lineLength), textFirstPosY);
            var $events = $('#contents-node-' + (i+1)).find('.js-historyContents__event');
            for (var j = 0;j < $events.length;j++) {
              context.font = "20px Arial";
              var eventText = $($events[j]).find('span').text();
              context.fillText(eventText, textFirstPosX + (i * lineLength), eventFirstPosY + (j+1) * eventHeight);
            }
          }

          context.beginPath();
          context.arc(firstCenterPosX, centerPosY, radius, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
          context.fillStyle = "rgba(150,255,150,1)";
          context.fill();
          for (var i = 0;i < $this.$latestCount - 1;i++) {
            context.beginPath();
            context.arc(firstCenterPosX + (i+1) * lineLength, centerPosY, radius, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
            context.fillStyle = "rgba(150,255,150,1)";
            context.fill();
          }
        }
      });
    }

    setDownloadButtonEvent() {
      var $this = this;

      $(document).on('click touchend', '#download', function() {
        var $canvas = $('#canvas');
        $this.downloadLinkElement($canvas[0])[0].click();
      });
    }
  }

  var htmlCanvas = new CanvasItem('history-canvas', 'history-contents');
  htmlCanvas.exec();
});
