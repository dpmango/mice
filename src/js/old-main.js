// /**********************************/
// /*************SETTINGS*************/
//
// var FORM_URL = "";
// /**********************************/
//
//
//
// var setting = new Vue({
//   el: "#vue",
//   data: {
//     menuStatus: false,
//     videoStatus: false,
//     loader: 100,
//     left: {
//       hidden: false,
//       name: '',
//       company: '',
//       email: '',
//       thanks: true
//     },
//     right: {
//       hidden: false,
//       name: '',
//       company: '',
//       email: '',
//       adress: '',
//       payment: '',
//       dropdown: false,
//       thanks: true
//     }
//
//   },
//   methods: {
//     openVideoHeader: function() {
//       this.videoStatus = !this.videoStatus;
//       $('body').toggleClass('overflow');
//     },
//     toggleMenu: function() {
//       this.menuStatus = !this.menuStatus
//       $('body').toggleClass('overflow_mobile');
//     },
//     sendLeft: function() {
//       if (this.left.email.length < 1) {
//         this.left.email = 'Обязательное поле';
//       }
//       if (this.left.name.length < 1) {
//         this.left.name = 'Обязательное поле';
//       }
//       if (this.left.company.length < 1) {
//         this.left.company = 'Обязательное поле';
//       }
//       if (this.left.company.length*this.left.name.length*this.left.email.length > 7
//         && this.left.email.length > 5
//         && this.left.email != 'Обязательное поле'
//         && this.left.name != 'Обязательное поле'
//         && this.left.company != 'Обязательное поле'
//
//         ) {
//         // $.ajax({
//         //   type: 'POST',
//         //   url: FORM_URL,
//         //   data: {
//         //     company: this.left.company,
//         //     name: this.left.name,
//         //     email: this.left.email,
//         //   }
//         // }).done(function(){
//         //   this.left.thanks = false
//         // });
//         this.left.thanks = false;
//         this.left.hidden = false;
//         this.left.email = '';
//         this.left.name = '';
//         this.left.company = '';
//       }
//     },
//     sendRight: function() {
//       if (this.right.email.length < 1) {
//         this.right.email = 'Обязательное поле';
//       }
//       if (this.right.name.length < 1) {
//         this.right.name = 'Обязательное поле';
//       }
//       if (this.right.company.length < 1) {
//         this.right.company = 'Обязательное поле';
//       }
//       if (this.right.adress.length < 1) {
//         this.right.adress = 'Обязательное поле';
//       }
//       if (this.right.payment == 'Форма оплаты') {
//         this.right.payment = 'Обязательное поле';
//       }
//       if (this.right.company.length*this.right.name.length*this.right.email.length*this.right.adress.length > 10
//         && this.right.email.length > 5
//         && this.right.email != 'Обязательное поле'
//         && this.right.name != 'Обязательное поле'
//         && this.right.company != 'Обязательное поле'
//         && this.right.adress != 'Обязательное поле'
//         && this.right.payment != 'Обязательное поле'
//         && this.right.payment != ''
//         ) {
//
//           this.right.thanks = false;
//           this.right.hidden = false;
//       }
//     }
//   }
// })

// window.onscroll = function() {
//   var scrolled = window.pageYOffset || document.documentElement.scrollTop;
//   // console.log(scrolled);
//   if (scrolled > 150) {
//     $('.menu').addClass('menu_fixed');
//   } else {
//     $('.menu').removeClass('menu_fixed');
//   }
// }



//
// $('.reviews__slider').slick({
//   fade: true,
//   prevArrow: '<div class="btn"><div class="item"></div><div class="item"></div><div class="item"></div><div class="item"></div><img src="img/reviews_slider/slider_prev.svg"></div>',
//   nextArrow: '<div class="btn"><div class="item"></div><div class="item"></div><div class="item"></div><div class="item"></div><img src="img/reviews_slider/slider_next.svg"></div>',
// });
//
// $('.awards__slider .carousel').slick({
//   centerMode: true,
//   adaptiveHeight: true,
//   centerPadding: '30%',
//   slidesToShow: 1,
//   infinite: true
// });


// Preloader
$(document).ready(function() {


  // $('.header_slider').slick({
  //   vertical: true,
  //   dots: true,
  //   slidesToShow: 1,
  //   draggable: false,
  //   prevArrow: '',
  //   nextArrow: '',
  //   autoplay: true,
  //   autoplaySpeed: 4000,
  //   infinite: true,
  //   fade: true,
  //   customPaging: function(slick,index) {
  //         return '<a>0' + (index + 1) + '</a>';
  //   },
  //
  // });


  // document.querySelector(".header_slider .slide .left video").load();
  // setTimeout("$('html').scrollTop(0);", 100);
  // $('.header_slider .slide .right h3').css({'font-size':''+ 50*(document.documentElement.clientWidth/1440) +'px'});
  // $('.partnership__container .right h4, .partnership__container .left h4, h2').css({'font-size':''+ 70*(document.documentElement.clientWidth/1440) +'px'});
});
//
// var i = 0;
//
// var loadingInterval = setInterval( 'loading()', 10 );
//
// function loading() {
//   document.querySelector('.percentage').innerHTML = i + " %";
//   document.querySelector('.preloader .status').setAttribute('style', 'height: '+ i +'%');
//   if (i === 100) {
//     clearInterval(loadingInterval);
//     document.querySelector('.preloader').setAttribute('style', 'opacity: 0');
//     document.querySelector('.menu__control').setAttribute('style', 'display: inline-block');
//     document.querySelector('.menu__switch-lang').setAttribute('style', 'display: inline-block');
//     setTimeout("document.querySelector('#vue').classList.add('animated_load');", 300);
//     setTimeout(  "document.querySelector('.preloader').setAttribute('style', 'display: none');", 300);
//     i = -1;
//   }
//   i++;
// }
