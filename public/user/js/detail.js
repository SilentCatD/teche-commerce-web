import APIService from "../../utils/api_service.js";
import {getUserInfo} from"./initialize.js";
import {updateUserCart} from "./header.js";

let currentPage = 1;
// T_T
let editMode= false;
let editCommentId = null;
// static clickable element (dynamic clickable element is edit.delete comment )
let reviewBox = null;
let newReview = null;
let openReviewBtn = null;
let closeReviewBtn = null;
let ratingsField = null;
let sendReviewBtn = null;
let addToCartBtn = null;

$(document).ready(async function () {
  setBreadCrumb("Shop",product.name);

  (function(e){let t,o={className:"autosizejs",append:"",callback:!1,resizeDelay:10},i='<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; padding: 0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden; transition:none; -webkit-transition:none; -moz-transition:none;"/>',n=["fontFamily","fontSize","fontWeight","fontStyle","letterSpacing","textTransform","wordSpacing","textIndent"],s=e(i).data("autosize",!0)[0];s.style.lineHeight="99px","99px"===e(s).css("lineHeight")&&n.push("lineHeight"),s.style.lineHeight="",e.fn.autosize=function(i){return this.length?(i=e.extend({},o,i||{}),s.parentNode!==document.body&&e(document.body).append(s),this.each(function(){function o(){let t,o;"getComputedStyle"in window?(t=window.getComputedStyle(u,null),o=u.getBoundingClientRect().width,e.each(["paddingLeft","paddingRight","borderLeftWidth","borderRightWidth"],function(e,i){o-=parseInt(t[i],10)}),s.style.width=o+"px"):s.style.width=Math.max(p.width(),0)+"px"}function a(){let a={};if(t=u,s.className=i.className,d=parseInt(p.css("maxHeight"),10),e.each(n,function(e,t){a[t]=p.css(t)}),e(s).css(a),o(),window.chrome){let r=u.style.width;u.style.width="0px",u.offsetWidth,u.style.width=r}}function r(){let e,n;t!==u?a():o(),s.value=u.value+i.append,s.style.overflowY=u.style.overflowY,n=parseInt(u.style.height,10),s.scrollTop=0,s.scrollTop=9e4,e=s.scrollTop,d&&e>d?(u.style.overflowY="scroll",e=d):(u.style.overflowY="hidden",c>e&&(e=c)),e+=w,n!==e&&(u.style.height=e+"px",f&&i.callback.call(u,u))}function l(){clearTimeout(h),h=setTimeout(function(){let e=p.width();e!==g&&(g=e,r())},parseInt(i.resizeDelay,10))}let d,c,h,u=this,p=e(u),w=0,f=e.isFunction(i.callback),z={height:u.style.height,overflow:u.style.overflow,overflowY:u.style.overflowY,wordWrap:u.style.wordWrap,resize:u.style.resize},g=p.width();p.data("autosize")||(p.data("autosize",!0),("border-box"===p.css("box-sizing")||"border-box"===p.css("-moz-box-sizing")||"border-box"===p.css("-webkit-box-sizing"))&&(w=p.outerHeight()-p.height()),c=Math.max(parseInt(p.css("minHeight"),10)-w||0,p.height()),p.css({overflow:"hidden",overflowY:"hidden",wordWrap:"break-word",resize:"none"===p.css("resize")||"vertical"===p.css("resize")?"none":"horizontal"}),"onpropertychange"in u?"oninput"in u?p.on("input.autosize keyup.autosize",r):p.on("propertychange.autosize",function(){"value"===event.propertyName&&r()}):p.on("input.autosize",r),i.resizeDelay!==!1&&e(window).on("resize.autosize",l),p.on("autosize.resize",r),p.on("autosize.resizeIncludeStyle",function(){t=null,r()}),p.on("autosize.destroy",function(){t=null,clearTimeout(h),e(window).off("resize",l),p.off("autosize").off(".autosize").css(z).removeData("autosize")}),r())})):this}})(window.jQuery||window.$);

let __slice=[].slice;(function(e,t){let n;n=function(){function t(t,n){let r,i,s,o=this;this.options=e.extend({},this.defaults,n);this.$el=t;s=this.defaults;for(r in s){i=s[r];if(this.$el.data(r)!=null){this.options[r]=this.$el.data(r)}}this.createStars();this.syncRating();this.$el.on("mouseover.starrr","span",function(e){return o.syncRating(o.$el.find("span").index(e.currentTarget)+1)});this.$el.on("mouseout.starrr",function(){return o.syncRating()});this.$el.on("click.starrr","span",function(e){return o.setRating(o.$el.find("span").index(e.currentTarget)+1)});this.$el.on("starrr:change",this.options.change)}t.prototype.defaults={rating:void 0,numStars:5,change:function(e,t){}};t.prototype.createStars=function(){let e,t,n;n=[];for(e=1,t=this.options.numStars;1<=t?e<=t:e>=t;1<=t?e++:e--){n.push(this.$el.append("<span class='glyphicon .glyphicon-star-empty'></span>"))}return n};t.prototype.setRating=function(e){if(this.options.rating===e){e=void 0}this.options.rating=e;this.syncRating();return this.$el.trigger("starrr:change",e)};t.prototype.syncRating=function(e){let t,n,r,i;e||(e=this.options.rating);if(e){for(t=n=0,i=e-1;0<=i?n<=i:n>=i;t=0<=i?++n:--n){this.$el.find("span").eq(t).removeClass("glyphicon-star-empty").addClass("glyphicon-star")}}if(e&&e<5){for(t=r=e;e<=4?r<=4:r>=4;t=e<=4?++r:--r){this.$el.find("span").eq(t).removeClass("glyphicon-star").addClass("glyphicon-star-empty")}}if(!e){return this.$el.find("span").removeClass("glyphicon-star").addClass("glyphicon-star-empty")}};return t}();return e.fn.extend({starrr:function(){let t,r;r=arguments[0],t=2<=arguments.length?__slice.call(arguments,1):[];return this.each(function(){let i;i=e(this).data("star-rating");if(!i){e(this).data("star-rating",i=new n(e(this),r))}if(typeof r==="string"){return i[r].apply(i,t)}})}})})(window.jQuery,window);$(function(){return $(".starrr").starrr()})


reviewBox = $('#post-review-box');
newReview = $('#new-review');
openReviewBtn = $('#open-review-box');
closeReviewBtn = $('#close-review-box');
ratingsField = $('#ratings-hidden');
sendReviewBtn = $('#send-review-box');
addToCartBtn = $('#add-to-cart');

$(function(){

// set onClick modal (delete comment)
  $("#deleteCommentCancel").click(function(){
    $('#deleteCommentModal').modal('hide');
  })

  $(".close").click(function(){
    $('#deleteCommentModal').modal('hide');
  })

  $("#deleteCommentConfirm").click(async function() {
    try{
        await APIService.deleteComment($(this).data("comment-id"));
        product = await APIService.fetchProduct(product.id);
        detailController.renderProduct(product);
        await REinit(currentPage);
    }catch(e) {
        console.log(e);
    }
    $('#deleteCommentModal').modal('hide');
  })


  $("#amount").on("input",function(){
    const amount = $("#amount").val();
    if(amount <=0) $("#amount").val(1);
    else if( amount >=product.unit) $("#amount").val(product.unit)
  })

  $(".dec").on("click",function(){
    if($("#amount").val() <= 1) {
        $(".dec").prop('disabled',true);
    } else {
      $(".dec").prop('disabled',false);
    }
  })

  $(".inc").on("click",function(){
    if($("#amount").val() >= product.unit) {
        $(".inc").prop('disabled',true);
    } else {
      $(".inc").prop('disabled',false);
    }
  })

  // add to cart
  addToCartBtn.click(async function() {
    const userInfo = await getUserInfo();
    if(!userInfo) {
      alert("You must login first");
      return;
    }
    const amount = $("#amount").val();
    $('#notificate-add-to-cart').text("");
    $('#notificate-add-to-cart').show();
    try{
      await APIService.addCartItem(product.id,amount);
      await updateUserCart();
      $('#notificate-add-to-cart').addClass('text-success');
      $('#notificate-add-to-cart').text("Add Success");
      setTimeout(function(){
        $('#notificate-add-to-cart').fadeOut();
        $('#notificate-add-to-cart').removeClass('text-success');
      },1000)
    } catch(e) {
      $('#notificate-add-to-cart').addClass('text-danger');
      $('#notificate-add-to-cart').text(e.message);
      setTimeout(function(){
        $('#notificate-add-to-cart').fadeOut();
        $('#notificate-add-to-cart').removeClass('text-danger');
      },1000)
      console.log(e);
    }
  })

  // review section 
  $('#new-review').autosize({append: "\n"});
  openReviewBtn.click(async function(e)
  {
    if(await APIService.haveTokens("user")) {

      if(editMode) {
        sendReviewBtn.text("Edit");
      } else {
        sendReviewBtn.text("Add");
      }

    reviewBox.slideDown(400, function()
      {
        $('#new-review').trigger('autosize.resize');
        newReview.focus();
      });
    openReviewBtn.fadeOut(100);
    closeReviewBtn.show();
    } else {
      alert("You need login first!");
    }
  });

  closeReviewBtn.click(function(e)
  {
    e.preventDefault();
    reviewBox.slideUp(300, function()
      {
        newReview.focus();
        openReviewBtn.fadeIn(200);
      });
    closeReviewBtn.hide();
    
  });

  $('.starrr').on('starrr:change', function(e, value){
    ratingsField.val(value);
    console.log(value);
    if(!value) {
      $("#send-review-box").addClass('disabled');
    } else {
      sendReviewBtn.removeClass('disabled');
    }
  });
});

sendReviewBtn.click(async function (e) {
    e.preventDefault();
    if($(this).hasClass("disabled")) return ;

    const rating = ratingsField.val();
    const description = newReview.val()
    
    try {
    if(editMode) {
      await APIService.editComment(product.id,editCommentId,rating,description);
      editCommentId = null;
      editMode = false;
    }
    else {
      await APIService.createComment(product.id,rating,description);
    }
    closeReviewBtn.trigger("click");
    product = await APIService.fetchProduct(product.id);
    detailController.renderProduct(product);
    await REinit(currentPage);
    } catch (e) {
      console.log(e);
    }
})

// Reference UI and Javascript 
// ref: https://bootsnipp.com/snippets/PjPa#reviews-anchor

  const relatedProduct = await APIService.getRelatedProduct(product.id,4);

  detailController.renderProduct(product);
  detailController.renderRelatedProducts(relatedProduct)  


  await REinit(1);
  });
  
  async function REinit(page) {
    const result  = await detailController.fetchAllComment(2,page);
    currentPage = result["current-page"];
    const totalPage = result["total-pages"];
    const userInfo = await getUserInfo()
    detailController.renderCommentList("reviews-list",result.items,userInfo);
    if(result.items.length > 0) {
      detailController.renderPagination(currentPage,totalPage);
    }

    $(".fa-trash").click( function(e) {
      e.preventDefault();
      $('#deleteCommentModal').modal('show');
      $("#deleteCommentConfirm").data("comment-id", $(this).parent().data("comment-id"));
    })

    $(".fa-edit").click( function(e) {
      e.preventDefault();
      let posTop = $("#view-review").offset().top; 
      $('html, body').scrollTop(posTop); 

      editMode = true;
      editCommentId = $(this).parent().data("comment-id");
      openReviewBtn.trigger("click");
    })

  }

const detailController = {
    renderProduct: (product) => {
      $('.product__details__name').text(product.name);
      $('.number-of-review').text(`(${product.rateCount} reviews)`);
      $('.product__details__price').text(`$${product.price}`);
      $('.product__details__desc').text(product.details);
      
      $("#product__details__avail").text(product.status);
      if(product.status ==="sold-out") {
        $("#product__details__avail").addClass("text-danger");
        $("#add-to-cart").addClass("btn-danger");
        $("#add-to-cart").prop("disabled",true);
      } else {
        $("#product__details__avail").addClass("text-success");
      }

      if(product.brand) {
        $('#product__details__brand').text(product.brand.name);
      } else {
        $('#product__details__brand').text("Unknown");
      }
  
      if(product.category) {
        $('#product__details__category').text(product.category.name);
      } else {
        $('#product__details__brand').text("Unknown");
      }
  
  
      let ratingValue = product.rateAverage, rounded = (product.rateAverage | 0);
    
      $(".product__details__rating__star").empty();
      for (let j = 0; j < 5 ; j++) {
        $(".product__details__rating__star").append('<i class="fa '+ ((j < rounded) ? "fa-star" : ((((ratingValue - j) > 0) && ((ratingValue - j) < 1)) ? "fa-star-half-o" : "fa-star-o")) +'" aria-hidden="true"></i>');
        $(`#num-star-${j+1}`).text(`(${product.rates[j]})`)
        $(`#progress-fill-${j+1}`).css("width",`${product.rates[j]*100/product.rateCount}%`)
      }
    },
    renderRelatedProducts: (relatedProduct) => {
      let relatedProductsHTML = "";
      for(let i = 0 ; i < relatedProduct.items.length;i++) {
        relatedProductsHTML+=detailController.renderRelatedProduct(relatedProduct.items[i]);
      }
      $("#related-product-list").html(relatedProductsHTML);
    },
    renderRelatedProduct:(product) => {
      let imgURL;
      if (product.images.length > 0) {
        imgURL = product.images[0];
      }
      return  `<div class="col-lg-3 col-md-4 col-sm-6">
      <div class="product__item">
      <div class="product__item__pic set-bg" data-setbg=${imgURL}
      style="background: ${imgURL ? `url(${imgURL});` : "gray;"}"
          >
          <ul class="product__item__pic__hover">
              <li><a href="#"><i class="fa fa-heart"></i></a></li>
              <li><a href="#"><i class="fa fa-retweet"></i></a></li>
              <li><a href="#"><i class="fa fa-shopping-cart"></i></a></li>
          </ul>
      </div>
      <div class="product__item__text">
          <h6><a href="/details/${product.id}">${product.name}</a></h6>
          <h5>$${product.price}</h5>
      </div>
  </div>
</div>`
    },
    renderCommentList: (listId,comments,userInfo) => {
      $(`#${listId}`).empty();
      let commentsHTML = "";
      for(let i = 0 ; i < comments.length;i++) {
        commentsHTML+=detailController.renderComment(userInfo,comments[i]);
      }
      $(`#${listId}`).html(commentsHTML);
    },
    renderComment: (userInfo,comment) => { return`<li>
        <div class="d-flex">
            <div class="left">
                <span>
                    <img src="${(comment.avatar) ? (comment.avatar) : "https://iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png"}" class="profile-pict-img img-fluid" alt="" />
                </span>
            </div>
            <div class="right">
                <h4>
                    ${comment.userName}
                    <span class="gig-rating text-body-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" width="15" height="15">
                            <path
                                fill="currentColor"
                                d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z"
                            ></path>
                        </svg>
                        ${comment.rating}
                    </span>
                    ${detailController.renderEditDeleteComment(userInfo,comment)}
                </h4>
                <div class="country d-flex align-items-center">
                    <span class="mr-1">
                    <i class="fa fa-envelope" aria-hidden="true"></i> 
                    </span>
                    <div class="country-name font-accent"> ${comment.userEmail}</div>
                </div>
                <div class="review-description">
                    <h5>
                    ${comment.description}
                    </h5>
                </div>
                <span class="publish py-3 d-inline-block w-100">Published at ${comment.updatedAt}</span>
                <div class="helpful-thumbs">
                    <div class="helpful-thumb text-body-2">
                        <span class="fit-icon thumbs-icon mr-1">
                            <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.5804 7.81165C13.8519 7.45962 14 7 14 6.43858C14 5.40843 13.123 4.45422 12.0114 4.45422H10.0932C10.3316 3.97931 10.6591 3.39024 10.6591 2.54516C10.6591 0.948063 10.022 0 8.39207 0C7.57189 0 7.26753 1.03682 7.11159 1.83827C7.01843 2.31708 6.93041 2.76938 6.65973 3.04005C6.01524 3.68457 5.03125 5.25 4.44013 5.56787C4.38028 5.59308 4.3038 5.61293 4.22051 5.62866C4.06265 5.39995 3.79889 5.25 3.5 5.25H0.875C0.391754 5.25 0 5.64175 0 6.125V13.125C0 13.6082 0.391754 14 0.875 14H3.5C3.98325 14 4.375 13.6082 4.375 13.125V12.886C5.26354 12.886 7.12816 14.0002 9.22728 13.9996C9.37781 13.9997 10.2568 14.0004 10.3487 13.9996C11.9697 14 12.8713 13.0183 12.8188 11.5443C13.2325 11.0596 13.4351 10.3593 13.3172 9.70944C13.6578 9.17552 13.7308 8.42237 13.5804 7.81165ZM0.875 13.125V6.125H3.5V13.125H0.875ZM12.4692 7.5565C12.9062 7.875 12.9062 9.1875 12.3159 9.48875C12.6856 10.1111 12.3529 10.9439 11.9053 11.1839C12.1321 12.6206 11.3869 13.1146 10.3409 13.1246C10.2504 13.1255 9.32247 13.1246 9.22731 13.1246C7.23316 13.1246 5.54296 12.011 4.37503 12.011V6.44287C5.40611 6.44287 6.35212 4.58516 7.27847 3.65879C8.11368 2.82357 7.83527 1.43153 8.3921 0.874727C9.78414 0.874727 9.78414 1.84589 9.78414 2.54518C9.78414 3.69879 8.94893 4.21561 8.94893 5.32924H12.0114C12.6329 5.32924 13.1223 5.88607 13.125 6.44287C13.1277 6.99967 12.9062 7.4375 12.4692 7.5565ZM2.84375 11.8125C2.84375 12.1749 2.54994 12.4688 2.1875 12.4688C1.82506 12.4688 1.53125 12.1749 1.53125 11.8125C1.53125 11.4501 1.82506 11.1562 2.1875 11.1562C2.54994 11.1562 2.84375 11.4501 2.84375 11.8125Z"
                                ></path>
                            </svg>
                        </span>
                        <span class="thumb-title">Not Implement</span>
                    </div>
                    <div class="helpful-thumb text-body-2 ml-3">
                        <span class="fit-icon thumbs-icon mr-1">
                            <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.419563 6.18835C0.148122 6.54038 6.11959e-07 7 5.62878e-07 7.56142C2.81294e-05 8.59157 0.876996 9.54578 1.98863 9.54578L3.90679 9.54578C3.66836 10.0207 3.34091 10.6098 3.34091 11.4548C3.34089 13.0519 3.97802 14 5.60793 14C6.42811 14 6.73247 12.9632 6.88841 12.1617C6.98157 11.6829 7.06959 11.2306 7.34027 10.9599C7.98476 10.3154 8.96875 8.75 9.55987 8.43213C9.61972 8.40692 9.6962 8.38707 9.77949 8.37134C9.93735 8.60005 10.2011 8.75 10.5 8.75L13.125 8.75C13.6082 8.75 14 8.35825 14 7.875L14 0.875C14 0.391754 13.6082 -3.42482e-08 13.125 -7.64949e-08L10.5 -3.0598e-07C10.0168 -3.48226e-07 9.625 0.391754 9.625 0.875L9.625 1.11398C8.73647 1.11398 6.87184 -0.000191358 4.77272 0.00038257C4.62219 0.000300541 3.74322 -0.000438633 3.65127 0.000382472C2.03027 -1.04643e-06 1.12867 0.981667 1.18117 2.45566C0.76754 2.94038 0.564868 3.64065 0.682829 4.29056C0.342234 4.82448 0.269227 5.57763 0.419563 6.18835ZM13.125 0.875L13.125 7.875L10.5 7.875L10.5 0.875L13.125 0.875ZM1.53079 6.4435C1.09375 6.125 1.09375 4.8125 1.6841 4.51125C1.31436 3.88891 1.64713 3.05613 2.09467 2.81605C1.86791 1.37941 2.61313 0.885417 3.65906 0.875355C3.74962 0.874535 4.67753 0.875355 4.77269 0.875355C6.76684 0.875355 8.45704 1.98898 9.62497 1.98898L9.62497 7.55713C8.5939 7.55713 7.64788 9.41484 6.72153 10.3412C5.88632 11.1764 6.16473 12.5685 5.6079 13.1253C4.21586 13.1253 4.21586 12.1541 4.21586 11.4548C4.21586 10.3012 5.05107 9.78439 5.05107 8.67076L1.9886 8.67076C1.36708 8.67076 0.877707 8.11393 0.874973 7.55713C0.872266 7.00033 1.09375 6.5625 1.53079 6.4435ZM11.1563 2.1875C11.1563 1.82506 11.4501 1.53125 11.8125 1.53125C12.1749 1.53125 12.4688 1.82506 12.4688 2.1875C12.4688 2.54994 12.1749 2.84375 11.8125 2.84375C11.4501 2.84375 11.1563 2.54994 11.1563 2.1875Z"
                                ></path>
                            </svg>
                        </span>
                        <span class="thumb-title">Not Implement</span>
                    </div>
                </div>
            </div>
        </div>
    </li>`
    },
    renderEditDeleteComment: (userInfo,comment) => {
      if(!userInfo) return "";
      if(userInfo.id == comment.userId){
        return `
        <div data-comment-id="${comment.id}" class="ml-auto">
          <i class="fa fa-edit"></i>
          <i class="fa fa-trash"></i>
        </div>`
      }
      if(userInfo.role == "admin") {
        return `
        <div data-comment-id="${comment.id}" class="ml-auto">
          <i class="fa fa-trash"></i>
        </div>`
      }
      return "";
    },
    renderPagination: (page, totalPage) => {
      const pages = [];
      const display_page = 5;
      let  generated= 0;
      let startAt = page - Math.floor(5/2);
      let curr = startAt;
      if(page!=1) {
        pages.push(`<a data-move-page ="left" class='page-item'>◀</a>`);
      }
      while (generated < display_page) {
        if (curr > totalPage) {
          startAt--;
          if(startAt<1) break;
          pages.splice(1, 0,
            `<a class="page-item"  href="#">${startAt}</a>`
          );
          generated++;
          continue;
        }
        if (curr > 0) {
          if (curr == page) {
            pages.push(
              `<a class="page-item bg-info" href="#">${curr}</a>`
            );
          } else {
            pages.push(
              `<a  class="page-item" href="#">${curr}</a>`
            );
          }
          generated++;
        }
        curr++;
      }
      if(page < totalPage) {
        pages.push(`<a data-move-page ="right" class='page-item' >▶</a>`);
      }
      $("#pagination-section").html(pages.join("\n"));
      $(".page-item").click(async function (e) {
        e.preventDefault();
        if($(this).data("move-page")=="left") {
          await REinit(page-1);
        } else if($(this).data("move-page")=="right") {
          await REinit(page+1);
        } else {
        const nextPage = $(this).text().trim();
        await REinit(nextPage);
        }
      });
    },
    fetchAllComment : async (limit, page) => {
      return await APIService.fetchAllComment(product.id,{ limit, page });
    },
}
