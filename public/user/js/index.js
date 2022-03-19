/*  ---------------------------------------------------
    Template Name: Ogani
    Description:  Ogani eCommerce  HTML Template
    Author: Colorlib
    Author URI: https://colorlib.com
    Version: 1.0
    Created: Colorlib
---------------------------------------------------------  */

'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
       const width = $(window).width();
       // boostrap 5 large breakpoint is 992px width
       if (width < 992){
        $('#hero-responsive').addClass('hero-normal');
       }
    });
})(jQuery);