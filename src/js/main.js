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

  var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
  var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
  var is_safari = navigator.userAgent.indexOf("Safari") > -1;
  var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
  if ((is_chrome)&&(is_safari)) {is_safari=false;}
  if ((is_chrome)&&(is_opera)) {is_chrome=false;}

  if (is_safari){
    $('html').addClass('is-safari');
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
    var wHost = window.location.host.toLowerCase()
    var displayCondition = wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0
    if (displayCondition){
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
  }

  _window.on('resize', debounce(setBreakpoint, 200))

  ////////////
  // READY - triggered when PJAX DONE
  ////////////
  var lazyInstance;

  function pageReady(){
    legacySupport();
    initBuggifill();

    updateHeaderActiveClass();
    initHeaderScroll();

    initPopups();
    // initSliders(); // moved to onload
    runScrollMonitor();
    initMasks();
    initLazyLoad();
    fitText();
    _window.on('resize', throttle(fitText, 200));

    teleportQmark();
    hoverTeam();
    positionPrevNext();
    _window.on('resize', debounce(positionPrevNext, 200));
    _window.on('scroll', throttle(positionPrevNext, 250, {
      'leading': true
    }));

    adjustBreadcrumbs();
    _window.on('resize', debounce(adjustBreadcrumbs, 200));
    Pace.on('hide', function(){
      $('.breadcrumbs').css('opacity', 1)
    });

    setArticleProgressBar();
    _window.on('scroll', throttle(ArticleProgressBar, 5))

    dirtyFixes();
    _window.on('resize', debounce(dirtyFixes, 200));

    // temp - developer
    _window.on('resize', debounce(setBreakpoint, 200));

    // map
    initMap();
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

  // HEADER SCROLL
  // add .header-static for .page or body
  // to disable sticky header
  function initHeaderScroll(){
    if ( _document.find('.header-static').length == 0 ){
      _window.on('scroll', throttle(function() {
        var vScroll = _window.scrollTop();
        if (vScroll > 25) {
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
      forms: 70,
      h2: 70
    }
    // make it a bit smaller to fit
    if ( _window.width() < 1250 ){
      defaults.headerSlide = 45;
      defaults.forms = 60,
      defaults.h2 = 70
    }
    if ( _window.width() < 992 ){
      // defaults.h2 = 80
    }
    $('.header_slider .slide .right h3').css({
      'font-size':''+ Math.floor(defaults.headerSlide*(_document.width()/1440)) +'px'
    });
    // $('.partnership__container .right h4, .partnership__container .left h4').css({
    //   'font-size':''+ Math.floor(defaults.forms*(_document.width()/1440)) +'px'
    // });
    $('.partnership__container .right h4, .partnership__container .left h4').fitText(0.8, {
      minFontSize: '28px', maxFontSize: '70px'
    })
    $('h2').css({
      'font-size':''+ Math.floor(defaults.h2*(_document.width()/1440)) +'px'
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
    var target = $('.page').get(0)
    if (window.addEventListener) // older FF
      target.addEventListener('DOMMouseScroll', preventDefault, false);
    target.onwheel = preventDefault; // modern standard
    target.onmousewheel = target.onmousewheel = preventDefault; // older browsers, IE
    target.ontouchmove = preventDefault; // mobile
    target.onkeydown = preventDefaultForScrollKeys;
  }

  function bindOverflowScroll(){
    var $menuLayer = $(".menu-box");
    $menuLayer.bind('touchstart', function (ev) {
        var $this = $(this);
        var layer = $menuLayer.get(0);

        if ($this.scrollTop() === 0) $this.scrollTop(1);
        var scrollTop = layer.scrollTop;
        var scrollHeight = layer.scrollHeight;
        var offsetHeight = layer.offsetHeight;
        var contentHeight = scrollHeight - offsetHeight;
        if (contentHeight == scrollTop) $this.scrollTop(scrollTop-1);
    });
  }
  bindOverflowScroll();
  var container = document.querySelector('.menu-box');
  var ps = new PerfectScrollbar(container);


  function enableScroll() {
    var target = $('.page').get(0)
    if (window.removeEventListener)
      target.removeEventListener('DOMMouseScroll', preventDefault, false);
    target.onmousewheel = target.onmousewheel = null;
    target.onwheel = null;
    target.ontouchmove = null;
    target.onkeydown = null;
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
  // BREADCRUMBS
  //////////
  function adjustBreadcrumbs(){
    if (_window.width() > bp.desktop) {
      if ($('.breadcrumbs').innerHeight() > 19) {
        $('.breadcrumbs').css('top', '40px')
      }
    }
  }

  //////////
  // ARTICLE PROGRESS
  //////////
  function setArticleProgressBar(){
    var menuPB = _document.find('.menu__progress')
    if ( _document.find('.one-article').length > 0 ){
      menuPB.addClass('is-visible');
    } else {
      menuPB.removeClass('is-visible');
    }
  }

  function ArticleProgressBar(){
    var wintop = _window.scrollTop();
    var targetHeight = _document.find('.one-article').height(); // get article height
    var winheight = _window.height();

    var totalScroll = Math.floor((wintop/(targetHeight-winheight)) * 100);

    $('.menu__progress-bar').css("width",totalScroll+"%");
  }

  //////////
  // SLIDERS
  //////////

  function initSliders(){

    // other individual sliders goes here
    var slickPrev = '<div class="btn"><div class="item"></div><div class="item"></div><div class="item"></div><div class="item"></div><img src="img/reviews_slider/slider_prev.svg"></div>';
    var slickNextBtn = '<div class="btn"><div class="item"></div><div class="item"></div><div class="item"></div><div class="item"></div><img src="img/reviews_slider/slider_next.svg"></div>'
    $('.reviews__slider').not('.slick-initialized').slick({
      fade: true,
      draggable: false,
      prevArrow: slickPrev,
      nextArrow: slickNextBtn,
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

    // POST SLIDER
    $('.one-article__slider').not('.slick-initialized').slick({
      dots: false,
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: false,
      pauseOnHover: false,
      pauseOnFocus: false,
      pauseOnDotsHover: false,
      infinite: true,
      fade: true,
      prevArrow: slickPrev,
      nextArrow: slickNextBtn,
    });

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
  // LAZY LOAD
  //////////
  function initLazyLoad(){
    _document.find('[js-lazy]').Lazy({
      threshold: 300,
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      // visibleOnly: true,
      // placeholder: "data:image/gif;base64,R0lGODlhEALAPQAPzl5uLr9Nrl8e7...",
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      },
      beforeLoad: function(element){
        element.attr('style', '')
      }
    });
  }


  function hoverTeam(){
    // _document.on('mouseenter', '.team-members__member', function(){
    //   $(this).find('.team-members__img:not(.team-members__img--flip)').animate({ opacity: .5 }, 200, function(){
    //     $(this).css({display: 'none'})
    //   });
    //   $(this).find('.team-members__img--flip').css({display: 'block'}).animate({ opacity: 1 }, 200)
    // })
    // _document.on('mouseleave', '.team-members__member', function(){
    //   $(this).find('.team-members__img--flip').animate({ opacity: .5 }, 200, function(){
    //     $(this).css({display: 'none'})
    //   });
    //   $(this).find('.team-members__img:not(.team-members__img--flip)').css({display: 'block'}).animate({ opacity: 1 }, 200)
    // })
    _document.on('mouseenter', '.team-members__member', function(){
      $(this).addClass('is-hovered');
    })
    _document.on('mouseleave', '.team-members__member', function(){
      $(this).removeClass('is-hovered');
    })
  }


  //////////
  // positionPrevNext
  /////////

  function positionPrevNext(e){
    if ( _document.find('.one-article__prev').length > 0 ){
      var topOffset = _document.find('.one-article__wrap').length > 0 ? _document.find('.one-article__wrap').offset().top :
                      _document.find('.one-member__wrapper').offset().top + 55;
      var prevBtn = _document.find('.one-article__prev');
      var nextBtn = _document.find('.one-article__next');
      var prevBtnW = prevBtn.width();
      var nextBtnW = nextBtn.width();

      prevBtn.css({
        'top': Math.floor(topOffset + prevBtnW) + 'px'
      })
      nextBtn.css({
        'top': Math.floor(topOffset + nextBtnW) + 'px'
      })

      // scroll, resize hooks
      if ( e ){
        var wScroll = _window.scrollTop();
        if ( wScroll > topOffset ){
          prevBtn.css({
            'top': Math.floor((_window.height() / 2) + (prevBtnW / 1.5)) + 'px'
          })
          nextBtn.css({
            'top': Math.floor((_window.height() / 2) + (nextBtnW / 1.5)) + 'px'
          })
        } else {
          prevBtn.css({
            'top': Math.floor(topOffset + prevBtnW) + 'px'
          })
          nextBtn.css({
            'top': Math.floor(topOffset + nextBtnW) + 'px'
          })
        }

        var stopStickyHeight = _document.find('.one-article').length > 0 ? _document.find('.one-article').height() :
                        _document.find('.one-member__wrapper').height();

        stopStickyHeight = stopStickyHeight - (_window.height() / 2);

        if ( wScroll > stopStickyHeight ){
          prevBtn.css({'opacity': '0'});
          nextBtn.css({'opacity': '0'});
        } else {
          prevBtn.css({'opacity': '1'});
          nextBtn.css({'opacity': '1'});
        }
      }
    }
  }

  //////////
  // LOAD MORE
  //////////
  _document.on('click', '[js-load-more]', function(){
    var _that = $(this)
    _that.addClass('is-loading');
    var cloned = _document.find('#weekly .row .col-lg-4').clone().css({'display': 'none'});

    setTimeout(function(){
      _that.removeClass('is-loading');
      if ( cloned ){
        $('#weekly .row').append(cloned)
        cloned.each(function(i, el){
          $(el).fadeIn();
        })
      }
    }, 1500)
  })


  // Map
  function initMap() {
	  var cntr = {
	  	lat: 55.753892,
	  	lng: 37.603144
	  }
	  //var myicon = '../img/map-marker.svg';

    if($('#contacts-map').length > 0) {
      var locations = [
        {
          lat: 55.753892,
          lng: 37.603144
        }
      ];

      var contactMap = new google.maps.Map(document.getElementById('contacts-map'), {
	    	center: cntr,
	    	zoom: 17
	    });

      var markers = locations.map(function (location, i) {
        return new google.maps.Marker({
          position: location,
          map: contactMap,
          icon: {
            url: '../img/map-marker.svg'
	        }
        });
      });


    }

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
        triggerBody(1)
        _this.done();
      });
    }
  });

  // team transition
  var TeamTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.startAnimation()])
        .then(this.landAnimation.bind(this));
    },

    startAnimation: function() {
      var deferred = Barba.Utils.deferred();
      deferred.resolve();
      return deferred.promise
    },

    landAnimation: function() {
      var _this = this;

      var $newContainer = $(this.newContainer);
      $newContainer.css({
        'position': 'absolute',
        'top': 0,
        'left': 0,
        'right': 0
      });

      var originalEl = $(this.oldContainer).find(lastClickEl);
      var originalElPostion = {
        left: originalEl.offset().left,
        top: originalEl.offset().top,
        width: originalEl.width()
      }
      var clonedEl = originalEl.clone().removeClass('is-hovered').addClass('is-cloned').css({
        'left': originalElPostion.left + 'px',
        'top': originalElPostion.top + 'px',
        'width': originalElPostion.width + 'px'
      });

      // wait till image is pased to calculate
      var targetImage = $newContainer.find('.one-member__photo').find('[js-lazy]');
      var targetImageLazyInstance = targetImage.Lazy({
        chainable: false,
        afterLoad: function(element) {
          var img = new Image();
          img.onload = function() {
            whenLazyLoaded();
          };
          img.src = element.attr('src');
        }
      })
      targetImageLazyInstance.force(targetImage);

      function whenLazyLoaded(){
        // hide prev elements and append animation obj
        originalEl.removeClass('is-hovered').addClass('is-disabled');
        originalEl.animate({ opacity: 0 }, 400);
        originalEl.parent().siblings('').animate({ opacity: 0 }, 400);
        $(_this.oldContainer).append(clonedEl)

        // get calculation of new container and it's positions
        var targetContainerPhoto = $newContainer.find('.one-member__photo')
        var targetPositions = {
          width: targetContainerPhoto.width(),
          height: targetContainerPhoto.height(),
          top: targetContainerPhoto.offset().top,
          left: targetContainerPhoto.offset().left + parseInt(targetContainerPhoto.css('padding-left')),
          targetImage: {
            height: targetImage.height()
          }
        }

        // animate container with gray BG
        setTimeout(function(){
          clonedEl.animate({
            top: targetPositions.top,
            left: targetPositions.left,
            width: targetPositions.width,
          }, 500)
          // animate image height
          clonedEl.find(".team-members__photo").animate({
            height: targetPositions.height
          }, 500, function(){
            clonedAnimationDone();
          })
        }, 400)
      }

      // when transition is compleate
      function clonedAnimationDone(){
        $(_this.oldContainer).css({
          'position': 'absolute',
          'top': 0,
          'left': 0,
          'right': 0
        }).animate({ opacity: 0 }, 300, function(){
          triggerBody(1);
          _this.done();
        })

        $newContainer.addClass('one-team-anim')
        $newContainer.css({
          visibility : 'visible',
          opacity : 1
        });
      }

    }
  });

  // transition logic
  var lastClickEl;
  Barba.Pjax.getTransition = function() {
    var transitionObj = FadeTransition;

    // console.log(Barba.HistoryManager.currentStatus())
    if ( $(lastClickEl).attr('href') === 'team-member.html' ){
      transitionObj = TeamTransition;
    }
    return transitionObj;
  };

  // initialize
  Barba.Prefetch.init();
  Barba.Pjax.start();

  // event handlers
  Barba.Dispatcher.on('linkClicked', function(el) {
    lastClickEl = el;
  });

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {
    var newBodyClass = $(newPageRawHTML).find('[js-bodyClassToggler]').attr('class')
    _document.find('body').attr('class', '').addClass('pace-done').addClass(newBodyClass);

    // $('body, html').animate({scrollTop: 0}, 200);
    $('.page').addClass('animated_load');
    pageReady();
    initSliders();
    forceAutoplay();
    closeMobileMenu();
    $('.breadcrumbs').css('opacity', 1);
    triggerBody(0);
    // console.log(lazyInstance)
    // lazyInstance.update(true);

  });

  function triggerBody(num){
    // console.log('scrolling to ' + num)
    document.body.scrollTop = 0;
    $(window).scroll();
    $(window).resize();
    // $(window).trigger('scroll, resize, load');
    // $(document).trigger('scroll, resize');
  }

});
