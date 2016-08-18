'use strict';

$(function () {
  var ALLOWED_IMAGE_OVERLAP_X = 0.5;
  var ALLOWED_IMAGE_OVERLAP_Y = 0.75;

  var $window = $(window)
  var $splashImage = $('#splash-background > img')
    .css({ position: 'absolute' });

  function onLoad() {
    $('body').addClass('loaded');

    var imageWidth   = $splashImage.width();
    var imageHeight  = $splashImage.height();
    var resizeWidth  = $splashImage.width() * ALLOWED_IMAGE_OVERLAP_X;
    var resizeHeight = $splashImage.height() * ALLOWED_IMAGE_OVERLAP_Y;
    function setSplashImageSize() {
      var windowWidth  = $window.width();
      var windowHeight = $window.height();
      var widthScale  = windowWidth / resizeWidth;
      var heightScale = windowHeight / resizeHeight;
      var width = imageWidth;
      var height = imageHeight;
      if (widthScale < 1 && widthScale < heightScale) {
        width *= widthScale;
        height *= widthScale;
      } else if (heightScale < 1) {
        width *= heightScale;
        height *= heightScale;
      }

      var left = Math.round( ( windowWidth  - width  ) / 2 );
      var top  = Math.round( ( windowHeight - height ) / 2 );

      $splashImage
        .css({
          width: width + 'px',
          height: height + 'px',
          left: left + 'px',
          top: top + 'px',
        });
    }
    setSplashImageSize();
    $window.on('resize', setSplashImageSize);
  }
  $splashImage.get(0).isComplete && onLoad() || $splashImage.on('load', onLoad);
});
