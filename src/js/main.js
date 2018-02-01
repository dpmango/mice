// PRELOADER

$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  function isRetinaDisplay() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
  }

  var _mobileDevice = isMobile();
  // detect mobile devices
  function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true
    } else {
      return false
    }
  }

  function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      return true
    } else {
      return false
    }
  }

  if ( msieversion() ){
    $('body').addClass('is-ie');
  }

  if ( _mobileDevice ){
    $('body').addClass('is-mobile');
  }

  // BREAKPOINT SETTINGS
  var bp = {
    mobileS: 375,
    mobile: 568,
    tablet: 768,
    desktop: 992,
    wide: 1336,
    hd: 1680
  }

  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint(){
    var wWidth = _window.width();

    var content = "<div class='dev-bp-debug'>"+wWidth+"</div>";

    $('.page').append(content);
    setTimeout(function(){
      $('.dev-bp-debug').fadeOut();
    },1000);
    setTimeout(function(){
      $('.dev-bp-debug').remove();
    },1500)
  }

  _window.on('resize', debounce(setBreakpoint, 200))

  ////////////
  // READY - triggered when PJAX DONE
  ////////////
  function pageReady(){
    legacySupport();
    initBuggifill();

    updateHeaderActiveClass();
    initHeaderScroll();

    initPopups();
    // initSliders();
    runScrollMonitor();
    initMasks();

    // revealFooter();
    // _window.on('resize', throttle(revealFooter, 100));

    fitText();
    _window.on('resize', throttle(fitText, 200));

    teleportQmark();
    // _window.on('resize', debounce(teleportQmark, 200));
    dirtyFixes()
    _window.on('resize', debounce(dirtyFixes, 200));

    // temp - developer
    _window.on('resize', debounce(setBreakpoint, 200));

  }

  pageReady();

  window.onload = function(){
    setTimeout(dirtyFixes, 300)
    initSliders();
    forceAutoplay();
  }


  //////////
  // COMMON
  //////////

  function legacySupport(){
    // svg support for laggy browsers
    svg4everybody();
  }

  function initBuggifill(){
    // Viewport units buggyfill
    // window.viewportUnitsBuggyfill.init({
    //   force: false,
    //   refreshDebounceWait: 150,
    //   appendToBody: false
    // });
  }


  // Prevent # behavior
	_document
    .on('click', '[href="#"]', function(e) {
  		e.preventDefault();
  	})
    .on('click', 'a[href^="#section"]', function() { // section scroll
      var el = $(this).attr('href');
      $('body, html').animate({
          scrollTop: $(el).offset().top}, 1000);
      return false;
    })

  // FOOTER REVEAL
  // function revealFooter() {
  //   var footer = $('[js-reveal-footer]');
  //   if (footer.length > 0) {
  //     var footerHeight = footer.outerHeight();
  //     var maxHeight = _window.height() - footerHeight > 100;
  //     if (maxHeight && !msieversion() ) {
  //       $('body').css({
  //         'margin-bottom': footerHeight
  //       });
  //       footer.css({
  //         'position': 'fixed',
  //         'z-index': -10
  //       });
  //     } else {
  //       $('body').css({
  //         'margin-bottom': 0
  //       });
  //       footer.css({
  //         'position': 'static',
  //         'z-index': 10
  //       });
  //     }
  //   }
  // }

  // HEADER SCROLL
  // add .header-static for .page or body
  // to disable sticky header
  function initHeaderScroll(){
    if ( _document.find('.header-static').length == 0 ){
      _window.on('scroll', throttle(function() {
        var vScroll = _window.scrollTop();
        if (vScroll > 150) {
          $('.menu').addClass('menu_fixed');
        } else {
          $('.menu').removeClass('menu_fixed');
        }
      }, 25));

    }
  }

  function forceAutoplay(){
    if ( $('.header_slider video').length > 0 ){
      $('.header_slider video').get(0).play()
    }
  }

  function fitText(){
    var defaults = {
      headerSlide: 50,
      forms: 70
    }
    // make it a bit smaller to fit
    if ( _window.width() < 1250 ){
      defaults.headerSlide = 45;
      defaults.forms = 60
    }
    $('.header_slider .slide .right h3').css({
      'font-size':''+ Math.floor(defaults.headerSlide*(_document.width()/1440)) +'px'
    });
    $('.partnership__container .right h4, .partnership__container .left h4, h2').css({
      'font-size':''+ Math.floor(defaults.forms*(_document.width()/1440)) +'px'
    });
  }


  // HAMBURGER TOGGLER
  _document.on('click', '[js-toggleMenu]', function(){
    $('[js-toggleMenu]').toggleClass('menu_focus');
    $('.menu-box').toggleClass('menu_acive');
    $('body').toggleClass('overflow_mobile');

    blockScroll();
  });

  // hide on content click when opened
  _document.on('click', '.page', function(){
    if ( _document.find('body').is('.overflow_mobile') ){
      closeMobileMenu();
    }
  })

  function closeMobileMenu(){
    blockScroll(true); // true is for the unlock option
    $('[js-toggleMenu]').removeClass('menu_focus');
    $('.menu-box').removeClass('menu_acive')
    $('body').removeClass('overflow_mobile')
  }

  var preventKeys = {
    37: 1, 38: 1, 39: 1, 40: 1
  };

  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
      e.preventDefault();
    e.returnValue = false;
  }

  function preventDefaultForScrollKeys(e) {
    if (preventKeys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  }

  function disableScroll() {
    if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
  }

  function enableScroll() {
    if (window.removeEventListener)
      window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
  }

  function blockScroll(unlock) {
    if ($('[js-toggleMenu]').is('.menu_focus')) {
      disableScroll();
    } else {
      enableScroll();
    }

    if (unlock) {
      enableScroll();
    }
  };

  // SET ACTIVE CLASS IN HEADER
  // * could be removed in production and server side rendering
  // user .active for li instead
  function updateHeaderActiveClass(){
    $('.header__menu li').each(function(i,val){
      if ( $(val).find('a').attr('href') == window.location.pathname.split('/').pop() ){
        $(val).addClass('is-active');
      } else {
        $(val).removeClass('is-active')
      }
    });
  }


  // VIDEO PLAY
  // _document.on('click', '[js-openVideoHeader]', function(){
  //   $('[js-openVideoHeader]').toggleClass('is-active');
  //   $('body').toggleClass('overflow');
  //   // $(this).closest('.promo-video').toggleClass('playing');
  //   // $(this).closest('.promo-video').find('iframe').attr("src", $("iframe").attr("src").replace("autoplay=0", "autoplay=1"));
  // });

  //////////
  // FORM TOGGLERS
  //////////
  _document
    // open
    .on('click', '[js-openCoopForm]', function(){
      $('.left .form').removeClass('hidden');
      $('.left .content').addClass('hidden')
    })
    // close
    .on('click', '[js-closeCoopForm]', function(){
      $('.left .form').addClass('hidden');
      $('.left .content').removeClass('hidden')

      if ( $(this).closest('.thanks') ){
        $(this).closest('.thanks').addClass('hidden')
      }
    })

    // open
    .on('click', '[js-openSubsForm]', function(){
      $('.right .form').removeClass('hidden');
      $('.right .content').addClass('hidden')
    })
    // close
    .on('click', '[js-closeSubsForm]', function(){
      $('.right .form').addClass('hidden');
      $('.right .content').removeClass('hidden')

      if ( $(this).closest('.find') ){
        $(this).closest('.thanks').addClass('hidden')
      }
    })


  //////////
  // TELEPORT Q MARK
  //////////

  function teleportQmark(){
    _document.find('.weekly__week__content h4').each(function(i, el){
      var elText = $(el).text();
      if ( elText.slice(0,1) == "«" ){
        $(el).text(elText.substring(1)) // remove first letter
        $(el).prepend("<span class='teleported-q'>«</span>") // create and append el
      }

      if ( _window.width() < bp.desktop ){

      }
    })
  }


  //////////
  // dirtyFixes
  //////////
  function dirtyFixes(){
    if ( _window.width() > 1680 ){
      var wWidth2 = ( _window.width() - 1680 ) / 2 // calf free space on edges of 1680
      _document.find('#reviews .bg-hotfix').css({
        width: wWidth2 + 'px',
        height: _document.find('#reviews .reviews__slider.slick-initialized .reviews_slide .left .bg').height() + 'px'
      })
      _document.find('.awards__slider-bg').css({
        right: (-50 - wWidth2) + 'px',
      })
      _document.find('.footer-bg-top').css({
        right: (25 - wWidth2) + 'px',
        left: (25 - wWidth2) + 'px',
      })
      _document.find('footer hr').css({
        width: 'calc(100% + ' + ( wWidth2) + 'px)'
      })
    } else {
      _document.find('#reviews .bg-hotfix').attr('style', '')
      _document.find('.awards__slider-bg').attr('style', '')
      _document.find('.footer-bg-top').attr('style', '')
      _document.find('footer hr').attr('style', '')

    }

  }


  //////////
  // SLIDERS
  //////////

  function initSliders(){
    // var slickNextArrow = '<div class="slick-prev"><svg class="ico ico-back-arrow"><use xlink:href="img/sprite.svg#ico-back-arrow"></use></svg></div>';
    // var slickPrevArrow = '<div class="slick-next"><svg class="ico ico-next-arrow"><use xlink:href="img/sprite.svg#ico-next-arrow"></use></svg></div>'
    //
    // // General purpose sliders
    // $('[js-slider]').each(function(i, slider){
    //   var self = $(slider);
    //
    //   // set data attributes on slick instance to control
    //   if (self && self !== undefined) {
    //     self.slick({
    //       autoplay: self.data('slick-autoplay') !== undefined ? true : false,
    //       dots: self.data('slick-dots') !== undefined ? true : false,
    //       arrows: self.data('slick-arrows') !== undefined ? true : false,
    //       prevArrow: slickNextArrow,
    //       nextArrow: slickPrevArrow,
    //       infinite: self.data('slick-infinite') !== undefined ? true : true,
    //       speed: 300,
    //       slidesToShow: 1,
    //       accessibility: false,
    //       adaptiveHeight: true,
    //       draggable: self.data('slick-no-controls') !== undefined ? false : true,
    //       swipe: self.data('slick-no-controls') !== undefined ? false : true,
    //       swipeToSlide: self.data('slick-no-controls') !== undefined ? false : true,
    //       touchMove: self.data('slick-no-controls') !== undefined ? false : true
    //     });
    //   }
    //
    // })

    // other individual sliders goes here

    $('.reviews__slider').not('.slick-initialized').slick({
      fade: true,
      draggable: false,
      prevArrow: '<div class="btn"><div class="item"></div><div class="item"></div><div class="item"></div><div class="item"></div><img src="img/reviews_slider/slider_prev.svg"></div>',
      nextArrow: '<div class="btn"><div class="item"></div><div class="item"></div><div class="item"></div><div class="item"></div><img src="img/reviews_slider/slider_next.svg"></div>',
    });

    // $('.awards__slider .carousel').not('.slick-initialized').slick({
    //   centerMode: true,
    //   // adaptiveHeight: true,
    //   // centerPadding: '0%',
    //   slidesToShow: 3,
    //   // slidesToScroll: 1,
    //   // draggable: false,
    //   arrows: true,
    //   dots: false,
    //   // infinite: true
    // });
    //
    // $('.awards__slider .slick-slide').on('mouseenter', function(){
    //   $(this).addClass('is-hovered')
    // })
    // $('.awards__slider .slick-slide').on('mouseleave', function(){
    //   $(this).removeClass('is-hovered')
    // })
    // $('.awards__slider .slick-slide').on('click', function(){
    //   var thisIndex = $(this).index();
    //
    //   $('.awards__slider .carousel').slick('slickNext')
    // })

    var owl = $('.awards__slider .carousel');
    owl.owlCarousel({
      center: true,
      items: 3,
      loop: true,
      margin: 10,
      dots: false,
      // rewind: false,

    });
    _document.on('click', '.awards__slider .owl-item', function(){
      var thisIndex = $(this).index();
      var curIndex = $(this).parent().find('.center').index();

      if (thisIndex > curIndex) {
        owl.trigger('next.owl.carousel');
      } else {
        owl.trigger('prev.owl.carousel');
      }
    })

    _document.on('mouseenter', '.awards__slider .owl-item', function(){
      $(this).addClass('is-hovered')
    })
    _document.on('mouseleave', '.awards__slider .owl-item', function(){
      $(this).removeClass('is-hovered')
    })


    $('.header_slider').not('.slick-initialized').slick({
      vertical: true,
      dots: true,
      slidesToShow: 1,
      draggable: false,
      prevArrow: '',
      nextArrow: '',
      autoplay: true,
      autoplaySpeed: 4000,
      pauseOnHover: false,
      pauseOnFocus: false,
      pauseOnDotsHover: false,
      infinite: true,
      fade: true,
      customPaging: function(slick,index) {
            return '<a>0' + (index + 1) + '</a>';
      }
    });

    $('.header_slider').on('beforeChange', function(event, slick, currentSlide, nextSlide){
      slick.$list.addClass('is-ready')
    });

    // SLICK - UNSLICK EXAMPLE
    // used when slick should be disabled on certain breakpoints

    // var _socialsSlickMobile = $('.socials__wrapper');
    // var socialsSlickMobileOptions = {
    //   mobileFirst: true,
    //   dots: true,
    //   responsive: [
    //     {
    //       breakpoint: 0,
    //       settings: {
    //         slidesToShow: 1,
    //         slidesToScroll: 1,
    //       }
    //     },
    //     {
    //       breakpoint: 568,
    //       settings: {
    //         slidesToShow: 2,
    //         slidesToScroll: 2,
    //       }
    //
    //     },
    //     {
    //       breakpoint: 992,
    //       settings: "unslick"
    //     }
    //
    //   ]
    // }
    // _socialsSlickMobile.slick(socialsSlickMobileOptions);
    //
    // _window.on('resize', debounce(function(e){
    //   if ( _window.width() > 992 ) {
    //     if (_socialsSlickMobile.hasClass('slick-initialized')) {
    //       _socialsSlickMobile.slick('unslick');
    //     }
    //     return
    //   }
    //   if (!_socialsSlickMobile.hasClass('slick-initialized')) {
    //     return _socialsSlickMobile.slick(socialsSlickMobileOptions);
    //   }
    // }, 300));

  }

  //////////
  // MODALS
  //////////

  function initPopups(){
    // Magnific Popup
    var startWindowScroll = 0;
    $('[js-popup]').magnificPopup({
      type: 'inline',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'popup-buble',
      callbacks: {
        beforeOpen: function() {
          startWindowScroll = _window.scrollTop();
          // $('html').addClass('mfp-helper');
        },
        close: function() {
          // $('html').removeClass('mfp-helper');
          _window.scrollTop(startWindowScroll);
        }
      }
    });

    $('[js-popupVideo]').magnificPopup({
      // disableOn: 700,
      type: 'iframe',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'popup-buble',
      callbacks: {
        beforeOpen: function() {
          // startWindowScroll = _window.scrollTop();
          // $('html').addClass('mfp-helper');
        }
      },
      patterns: {
        youtube: {
          index: 'youtube.com/',
          id: 'v=', // String that splits URL in a two parts, second part should be %id%
          // Or null - full URL will be returned
          // Or a function that should return %id%, for example:
          // id: function(url) { return 'parsed id'; }

          src: '//www.youtube.com/embed/%id%?autoplay=1&controls=0&showinfo=0' // URL that will be set as a source for iframe.
        }
      },
      closeMarkup: '<button class="mfp-close"><div class="video-box__close-button btn"><div class="item"></div><div class="item"></div><div class="item"></div><div class="item"></div><img src=img/setting/video_close.svg alt=></img></div></button>'
    });

    $('[js-popup-gallery]').magnificPopup({
  		delegate: 'a',
  		type: 'image',
  		tLoading: 'Загрузка #%curr%...',
  		mainClass: 'popup-buble',
  		gallery: {
  			enabled: true,
  			navigateByImgClick: true,
  			preload: [0,1]
  		},
  		image: {
  			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
  		}
  	});
  }

  _document.on('click', '.mfp-close', closeMfp);

  function closeMfp(){
    $.magnificPopup.close();
  }

  ////////////
  // UI
  ////////////

  // custom selects
  _document
  .on('click', '[js-dropdown]', function(e){
    // var that = this
    // hide parents
    // $(this).parent().parent().parent().find('.ui-select__visible').each(function(i,val){
    //   if ( !$(val).is($(that)) ){
    //     $(val).parent().removeClass('active')
    //   }
    // });
    var parent = $(this).closest('.input-field')

    parent.find('.down').toggleClass('rotate'); // arrow
    parent.find('.dropdown_label').toggleClass('dropdown_label_translate') // label
    parent.find('.dropdown').toggleClass('dropdown_open') // dropdown

    // if ( parent.find('input').val() !== "" ){
    //   parent.find('.dropdown_label').removeClass('dropdown_label_translate')
    // }
  })
  .on('click', '.input-field .dropdown span', function(){
    // parse value and toggle active
    var value = $(this).data('val');
    if (value){
      $(this).siblings().removeClass('is-active');
      $(this).addClass('is-active');

      // set visible
      var parent = $(this).closest('.input-field')
      parent.find('.down').removeClass('rotate'); // arrow
      parent.find('.dropdown_label').addClass('dropdown_label_translate_2') // label
      parent.find('.dropdown').removeClass('dropdown_open') // dropdown

      // populate values
      $(this).closest('.input-field').find('input').val(value);
      $(this).closest('.input-field').find('[js-dropdown] span').text(value);
    }

  });

  // textarea autoExpand
  _document
    .one('focus.autoExpand', '.ui-group textarea', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', '.ui-group textarea', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;
    });


  // FLOATING LABELS
  // focus in
  _document.on('focus', '.input-field', function(){
    $(this).find('input, textarea').addClass('focus');
  })

  // focus out
  _document.on('blur', '.input-field', function(){
    var thisEl = $(this).find('input, textarea')
    if ( thisEl.val() !== "" ){
      thisEl.addClass('focus');
    } else {
      thisEl.removeClass('focus');
    }
  })

  // Masked input
  function initMasks(){
    $(".js-dateMask").mask("99.99.99",{placeholder:"ДД.ММ.ГГ"});
    $("input[type='tel']").mask("+7 (000) 000-0000", {placeholder: "+7 (___) ___-____"});
  }

  ////////////
  // SCROLLMONITOR - WOW LIKE
  ////////////
  function runScrollMonitor(){
    $('.wow').each(function(i, el){

      var elWatcher = scrollMonitor.create( $(el) );

      var delay;
      if ( $(window).width() < 768 ){
        delay = 0
      } else {
        delay = $(el).data('animation-delay');
      }

      var animationClass

      if ( $(el).data('animation-class') ){
        animationClass = $(el).data('animation-class');
      } else {
        animationClass = "wowFadeUp"
      }

      var animationName

      if ( $(el).data('animation-name') ){
        animationName = $(el).data('animation-name');
      } else {
        animationName = "wowFade"
      }

      elWatcher.enterViewport(throttle(function() {
        $(el).addClass(animationClass);
        $(el).css({
          'animation-name': animationName,
          'animation-delay': delay,
          'visibility': 'visible'
        });
      }, 100, {
        'leading': true
      }));
      elWatcher.exitViewport(throttle(function() {
        $(el).removeClass(animationClass);
        $(el).css({
          'animation-name': 'none',
          'animation-delay': 0,
          'visibility': 'hidden'
        });
      }, 100));
    });

  }

  //////////
  // BARBA PJAX
  //////////

  Barba.Pjax.Dom.containerClass = "page";

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
      return $(this.oldContainer).animate({ opacity: .5 }, 200).promise();
    },

    fadeIn: function() {
      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility : 'visible',
        opacity : .5
      });

      $el.animate({ opacity: 1 }, 200, function() {
        document.body.scrollTop = 0;
        _this.done();
      });
    }
  });

  Barba.Pjax.getTransition = function() {
    return FadeTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {

    // $('body, html').animate({scrollTop: 0}, 200);
    $('.page').addClass('animated_load');
    pageReady();
    initSliders();
    forceAutoplay();
    closeMobileMenu();

  });

});
