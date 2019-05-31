$(function() {

    $(".input input").focus(function() {
 
       $(this).parent(".input").each(function() {
          $("label", this).css({
             "line-height": "18px",
             "font-size": "18px",
             "font-weight": "100",
             "top": "0px"
          })
          $(".spin", this).css({
             "width": "100%"
          })
       });
    }).blur(function() {
       $(".spin").css({
          "width": "0px"
       })
       if ($(this).val() == "") {
          $(this).parent(".input").each(function() {
             $("label", this).css({
                "line-height": "60px",
                "font-size": "24px",
                "font-weight": "300",
                "top": "10px"
             })
          });
       }
    });
    $(".button").click(function(e) {
      var pX = e.pageX,
         pY = e.pageY,
         oX = parseInt($(this).offset().left),
         oY = parseInt($(this).offset().top);

      $(this).append('<span class="click-efect x-' + oX + ' y-' + oY + '" style="margin-left:' + (pX - oX) + 'px;margin-top:' + (pY - oY) + 'px;"></span>')
      $('.x-' + oX + '.y-' + oY + '').animate({
         "width": "500px",
         "height": "500px",
         "top": "-250px",
         "left": "-250px",

      }, 600);
      $("button", this).addClass('active');
   })
 });