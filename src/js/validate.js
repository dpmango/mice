$(document).ready(function(){
  ////////////////
  // FORM VALIDATIONS
  ////////////////

  // jQuery validate plugin
  // https://jqueryvalidation.org


  // GENERIC FUNCTIONS
  ////////////////////

  var validateErrorPlacement = function(error, element) {
    // console.log(error.text())
    error.addClass('input-field__validation');
    error.appendTo(element.parent("div"));
    // element().val(error.text())
  }
  var validateHighlight = function(element) {
    $(element).addClass("require");
  }
  var validateUnhighlight = function(element) {
    $(element).removeClass("require");
  }


  // var validatePhone = {
  //   required: true,
  //   normalizer: function(value) {
  //       var PHONE_MASK = '+X (XXX) XXX-XXXX';
  //       if (!value || value === PHONE_MASK) {
  //           return value;
  //       } else {
  //           return value.replace(/[^\d]/g, '');
  //       }
  //   },
  //   minlength: 11,
  //   digits: true
  // }

  ////////
  // FORMS


  /////////////////////
  // COOPERATION FORM
  ////////////////////
  $("[js-validateCoopForm]").validate({
    errorPlacement: validateErrorPlacement,
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: function(form){
      $(form).addClass('loading');
      $.ajax({
        type: "POST",
        url: $(form).attr('action'),
        data: $(form).serialize(),
        success: function(response) {
          $(form).removeClass('loading');
          var data = $.parseJSON(response);
          if (data.status == 'success') {
            // sucess state
            $('.left .form').addClass('hidden');
            $('.left .content').addClass('hidden')
            $('.left .thanks').removeClass('hidden');
          } else {
              $(form).find('[data-error]').html(data.message).show();
          }
        },
        error: function(res){
          // REMOVE FOR PRODUCTION !
          // ! STATIC PURPOSES ONLY
          $('.left .form').addClass('hidden');
          $('.left .content').addClass('hidden')
          $('.left .thanks').removeClass('hidden');
        }
      });
      // e.preventDefault();
    },
    rules: {
      name: {
        required: true,
        minlength: 5
      },
      company: {
        required: true,
        minlength: 5
      },
      email: {
        required: true,
        email: true
      }
    },
    messages: {
      name: "Обязательное поле",
      company: "Обязательное поле",
      email: {
          required: "Обязательное поле",
          email: "Неправильный Email"
      },
    }
  });


  /////////////////////
  // SUBSCRIPTION FORM
  ////////////////////
  $("[js-validateSubsForm]").validate({
    errorPlacement: validateErrorPlacement,
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: function(form){
      $(form).addClass('loading');
      $.ajax({
        type: "POST",
        url: $(form).attr('action'),
        data: $(form).serialize(),
        success: function(response) {
          $(form).removeClass('loading');
          var data = $.parseJSON(response);
          if (data.status == 'success') {
            // sucess state
            $('.right .form').addClass('hidden');
            $('.right .content').addClass('hidden')
            $('.right .thanks').removeClass('hidden');
          } else {
              $(form).find('[data-error]').html(data.message).show();
          }
        },
        error: function(res){
          // REMOVE FOR PRODUCTION !
          // ! STATIC PURPOSES ONLY
          $('.right .form').addClass('hidden');
          $('.right .content').addClass('hidden')
          $('.right .thanks').removeClass('hidden');
        }
      });
      // e.preventDefault();
    },
    rules: {
      name: {
        required: true,
        minlength: 5
      },
      company: {
        required: true,
        minlength: 5
      },
      email: {
        required: true,
        email: true
      },
      payment: "required"
    },
    messages: {
      name: "Обязательное поле",
      company: "Обязательное поле",
      email: {
          required: "Обязательное поле",
          email: "Неправильный Email"
      },
      payment: "Обязательное поле"
    }
  });


});
