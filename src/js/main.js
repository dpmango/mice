// PRELOADER !
var i = 0;

var loadingInterval = setInterval( 'loading()', 10 );

function loading() {
  if (sessionStorage.getItem('preloaderState') == null){
    document.querySelector('.percentage').innerHTML = i + " %";
    document.querySelector('.preloader .status').setAttribute('style', 'height: '+ i +'%');
    if (i === 100) {
      clearInterval(loadingInterval);
      preloaderDone();
      i = -1;
    }
    i++;

    sessionStorage.setItem('preloaderState', 'true');
  } else {
    preloaderDone();
    clearInterval(loadingInterval);
  }

  i++;
}

function preloaderDone(){
  document.querySelector('.preloader').setAttribute('style', 'opacity: 0');
  document.querySelector('.menu__control').setAttribute('style', 'display: inline-block');
  document.querySelector('.menu__switch-lang').setAttribute('style', 'display: inline-block');
  setTimeout("document.querySelector('#vue').classList.add('animated_load');", 300);
  setTimeout(  "document.querySelector('.preloader').setAttribute('style', 'display: none');", 300);
}

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

  // BREAKPOINT SETTINGS
  var bp = {
    mobileS: 375,
    mobile: 568,
    tablet: 768,
    desktop: 1024,
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
    initSliders();
    runScrollMonitor();
    initMasks();

    revealFooter();
    _window.on('resize', throttle(revealFooter, 100));

    // temp - developer
    _window.on('resize', debounce(setBreakpoint, 200))
  }

  pageReady();


  //////////
  // COMMON
  //////////

  function legacySupport(){
    // svg support for laggy browsers
    svg4everybody();
  }

  function initBuggifill(){
    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: false,
      refreshDebounceWait: 150,
      appendToBody: true
    });
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
  function revealFooter() {
    var footer = $('[js-reveal-footer]');
    if (footer.length > 0) {
      var footerHeight = footer.outerHeight();
      var maxHeight = _window.height() - footerHeight > 100;
      if (maxHeight && !msieversion() ) {
        $('body').css({
          'margin-bottom': footerHeight
        });
        footer.css({
          'position': 'fixed',
          'z-index': -10
        });
      } else {
        $('body').css({
          'margin-bottom': 0
        });
        footer.css({
          'position': 'static',
          'z-index': 10
        });
      }
    }
  }

  // HEADER SCROLL
  // add .header-static for .page or body
  // to disable sticky header
  function initHeaderScroll(){
    if ( $('.header-static').length == 0 ){
      _window.on('scroll', throttle(function() {
        var vScroll = _window.scrollTop();
        var header = $('.header').not('.header--static');
        var headerHeight = header.height();
        var heroHeight = $('.hero').outerHeight() - headerHeight;
        // probably should be found as a first child of page contents

        if ( vScroll > headerHeight ){
          header.addClass('header--transformed');
        } else {
          header.removeClass('header--transformed');
        }

        if ( vScroll > heroHeight ){
          header.addClass('header--fixed');
        } else {
          header.removeClass('header--fixed');
        }
      }, 10));
    }
  }

  // REFACTOR
  window.onscroll = function() {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    // console.log(scrolled);
    if (scrolled > 150) {
      $('.menu').addClass('menu_fixed');
    } else {
      $('.menu').removeClass('menu_fixed');
    }
  }

  // WTF IS THIS ?
  document.querySelector(".header_slider .slide .left video").load();
  setTimeout("$('html').scrollTop(0);", 100);
  $('.header_slider .slide .right h3').css({'font-size':''+ 50*(document.documentElement.clientWidth/1440) +'px'});
  $('.partnership__container .right h4, .partnership__container .left h4, h2').css({'font-size':''+ 70*(document.documentElement.clientWidth/1440) +'px'});


  // HAMBURGER TOGGLER
  _document.on('click', '[js-toggleMenu]', function(){
    $(this).toggleClass('menu_focus');
    $('.menu-box').toggleClass('menu_acive')
    $('body').toggleClass('overflow_mobile')
  });

  function closeMobileMenu(){
    $('[js-toggleMenu]').removeClass('is-active');
    $('.menu-box').removeClass('menu_acive')
    $('body').toggleClass('overflow_mobile')
  }

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
  _document.on('click', '[js-openVideoHeader]', function(){
    $(this).toggleClass('is-active');
    $('body').toggleClass('overflow');
    // $(this).closest('.promo-video').toggleClass('playing');
    // $(this).closest('.promo-video').find('iframe').attr("src", $("iframe").attr("src").replace("autoplay=0", "autoplay=1"));
  });

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
  // SLIDERS
  //////////

  function initSliders(){
    var slickNextArrow = '<div class="slick-prev"><svg class="ico ico-back-arrow"><use xlink:href="img/sprite.svg#ico-back-arrow"></use></svg></div>';
    var slickPrevArrow = '<div class="slick-next"><svg class="ico ico-next-arrow"><use xlink:href="img/sprite.svg#ico-next-arrow"></use></svg></div>'

    // General purpose sliders
    $('[js-slider]').each(function(i, slider){
      var self = $(slider);

      // set data attributes on slick instance to control
      if (self && self !== undefined) {
        self.slick({
          autoplay: self.data('slick-autoplay') !== undefined ? true : false,
          dots: self.data('slick-dots') !== undefined ? true : false,
          arrows: self.data('slick-arrows') !== undefined ? true : false,
          prevArrow: slickNextArrow,
          nextArrow: slickPrevArrow,
          infinite: self.data('slick-infinite') !== undefined ? true : true,
          speed: 300,
          slidesToShow: 1,
          accessibility: false,
          adaptiveHeight: true,
          draggable: self.data('slick-no-controls') !== undefined ? false : true,
          swipe: self.data('slick-no-controls') !== undefined ? false : true,
          swipeToSlide: self.data('slick-no-controls') !== undefined ? false : true,
          touchMove: self.data('slick-no-controls') !== undefined ? false : true
        });
      }

    })

    // other individual sliders goes here

    $('.reviews__slider').slick({
      fade: true,
      prevArrow: '<div class="btn"><div class="item"></div><div class="item"></div><div class="item"></div><div class="item"></div><img src="img/reviews_slider/slider_prev.svg"></div>',
      nextArrow: '<div class="btn"><div class="item"></div><div class="item"></div><div class="item"></div><div class="item"></div><img src="img/reviews_slider/slider_next.svg"></div>',
    });

    $('.awards__slider .carousel').slick({
      centerMode: true,
      adaptiveHeight: true,
      centerPadding: '30%',
      slidesToShow: 1,
      infinite: true
    });

    $('.header_slider').slick({
      vertical: true,
      dots: true,
      slidesToShow: 1,
      draggable: false,
      prevArrow: '',
      nextArrow: '',
      autoplay: true,
      autoplaySpeed: 4000,
      pauseOnHover: false,
      infinite: true,
      fade: true,
      customPaging: function(slick,index) {
            return '<a>0' + (index + 1) + '</a>';
      }
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

  function closeMfp(){
    if ( _window.width() < bp.desktop ){
      $.magnificPopup.close();
    }
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

  // handle outside click
  $(document).click(function (e) {
    var container = new Array();
    container.push($('.ui-select'));

    $.each(container, function(key, value) {
        if (!$(value).is(e.target) && $(value).has(e.target).length === 0) {
            $(value).removeClass('active');
        }
    });
  });

  // numeric input
  // $('.ui-number span').on('click', function(e){
  //   var element = $(this).parent().find('input');
  //   var currentValue = parseInt($(this).parent().find('input').val()) || 0;
  //
  //   if( $(this).data('action') == 'minus' ){
  //     if(currentValue <= 1){
  //       return false;
  //     }else{
  //       element.val( currentValue - 1 );
  //     }
  //   } else if( $(this).data('action') == 'plus' ){
  //     if(currentValue >= 99){
  //       return false;
  //     } else{
  //       element.val( currentValue + 1 );
  //     }
  //   }
  // });

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

  // DISABLE FOR NOW
  // Barba.Prefetch.init();
  // Barba.Pjax.start();

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {

    pageReady();

    // close mobile menu
    if ( _window.width() < bp.mobile ){
      closeMobileMenu();
    }
  });


});
