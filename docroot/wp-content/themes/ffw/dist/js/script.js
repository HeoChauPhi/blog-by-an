/*jslint browser: true*/
/*global $, jQuery, Modernizr, enquire, audiojs*/

(function($) {
  // Header Scroll
  function headerScroll() {
    var scroll_top = $(window).scrollTop();
    var height_header = $('#header').outerHeight();
    var offset_header = $('#header').offset();

    $('#header').css('min-height', height_header);

    if ( $('#feature').length > 0 ) {
      var height_feature = $('#feature').outerHeight();
    } else {
      var height_feature = 100;
    }
    
    if ( scroll_top > (height_feature / 2) ) {
      $('#header .header-navigation').addClass('header-fixed').css({'position': 'fixed', 'left': 0, 'right': 0, 'top': offset_header.top});
    } else {
      $('#header .header-navigation').removeClass('header-fixed').css({'position': 'relative', 'top': 0});
    }
  }

  // Swich when web loading on mobile or small device
  function mobileMenu() {
    if( $(this).hasClass('menu-responsive') ) {
      $(this).toggleClass('active');
      $('#header .main-menu').toggleClass('menu-show');
    }
    if ( $(this).hasClass('menu-close') ) {
      $('.menu-responsive').removeClass('active');
      $('#header .main-menu').removeClass('menu-show');
    }
  }

  function menuExpand() {
    $(this).parent().next('ul.nav-drop').slideToggle();
    $(this).toggleClass('icon-active');

    return false;
  }

  // Back to Top
  function backToTopShow() {
    var height_show = 100;

    if ($(this).scrollTop() > height_show) {
      $('.js-back-top').addClass('btn-show');
    } else {
      $('.js-back-top').removeClass('btn-show');
    }
  }

  function backToTop() {
    $("html, body").animate({ scrollTop: 0 }, 600);
  }

  // Scroll Down
  function scrollDown() {
    var height_scroll = $('.header-full').outerHeight(true);

    $("html, body").animate({ scrollTop: height_scroll }, 600);
  }

  /*
   * ================================
   * Animate block when scroll window
   * ================================
  */
  function blockAnimateScroll() {
    var $animation_elements = $('.animation-element');
    var $window = $(window);

    function check_if_in_view() {
      var window_height = $window.height();
      var window_top_position = $window.scrollTop();
      var window_bottom_position = (window_top_position + window_height);
     
      $.each($animation_elements, function() {
        var $element = $(this);
        var element_height = $element.outerHeight();
        var element_top_position = $element.offset().top;
        var element_bottom_position = (element_top_position + element_height);
        if ($element.data('animate')) {
          var animate_name = $element.data('animate');
        } else {
          var animate_name = 'fadeIn';
        }
     
        //check to see if this current container is within viewport
        if ((element_bottom_position >= window_top_position) &&
            (element_top_position <= window_bottom_position)) {
          $element.addClass('animated' + ' ' + animate_name);
        } else {
          $element.removeClass('animated' + ' ' +  animate_name);
        }
      });
    }

    $window.on('scroll resize', check_if_in_view);
    $window.trigger('scroll');
  }

  /*
   * ===============================================
   * Slick slider function.
   * @param $name type String Class wrapper of slide
   * @param $item type Number item to show 
   * ===============================================
  */
  function jcarousel_slider($name, $item) {
    if ($item < 4) {
      $($name).slick({
        adaptiveHeight: true,
        dots: false,
        fade: true,
        infinite: true,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 3500,
      });
    } else {
      $($name).slick({
        infinite: true,
        slidesToShow: $item,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 892,
            settings: {
              slidesToShow: 2
            }
          },
          {
            breakpoint: 568,
            settings: {
              slidesToShow: 1
            }
          }
        ]
      });
    }
  }

  // Counter up
  function counterUp() {
    $('.js-count-up').counterUp({
      delay: 5,
      time: 500
    });
  }

  /* ==================================================================
   *
   * Loading Jquery
   *
   ================================================================== */
  $(document).ready(function() {
    // Call to function
    //$('.js-toogle--menu').on('click', mobileMenu);
    headerScroll();
    $('.menu-responsive').on('click', mobileMenu);
    $('.main-menu .menu-close').on('click', mobileMenu);
    $('.main-menu .js-toggle-menu-expanded').on('click', menuExpand);
    $('.js-back-top').on('click', backToTop);
    $('.js-scroll-down').on('click', scrollDown);
    jcarousel_slider('.feature-slide', 1);
    jcarousel_slider('.facebook-image-slide', 5);
    $( "ul.wp-block-gallery" ).each(function( index ) {
      $(this).find('.blocks-gallery-item a').attr('data-fancybox', 'wp-block-gallery-' + index);
    });
  });

  $(window).scroll(function() {
    headerScroll();
    backToTopShow();
  });

  $(window).on('load', function() {
    // Call to function
  });

  $(window).resize(function() {
    // Call to function
  });

})(jQuery);