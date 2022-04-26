import APIService from "../../utils/api_service.js";


let pageConfiguration = {
    currentPage: 1,
    totalPage: -1,
    totalItems: -1,
    item_per_page: 2,
    pagination_size: 6,
    
    items: null,
    //Sort
    orderStateOption:null,
    orderOption: "desc",
    sortOption: "createdAt",
  };

  $(document).ready(async function() {
    setBreadCrumb("Order",null);
    $("#sortSelect").change(async function (e) {
        e.preventDefault();
        console.log( $(this).val());
        pageConfiguration.orderStateOption = $(this).val();
        await REInit();
      });
    
    $("#orderByTime").change(async function(e) {
        e.preventDefault();
        pageConfiguration.orderOption = $(this).val();
        await REInit();
    });

    await REInit();

  });

  async function REInit() {
    const response = await APIService.fetchAllOrderOfAUser({
        page:pageConfiguration.currentPage,
        limit:pageConfiguration.item_per_page,
        order_by: pageConfiguration.orderOption,
        state:pageConfiguration.orderStateOption});

    pageConfiguration.currentPage = response["current-page"];
    pageConfiguration.totalPage = response["total-pages"];
    pageConfiguration.totalItems = response["total-items"];

    // render order list
    $("#total-items-found").text(response['total-items']);
    Render.renderOrderList(response.items);
    // set iteme on click
    if(response.items.length > 0)
        Render.renderPaginationPage();
    else {
        $("#pagination-section").empty();
    }
    pageConfiguration.items = response.items;
    
    $(".show-detail").on("click",function (e) {
        e.preventDefault();
        const index = $(this).data("index");
        const order = pageConfiguration.items[index];

        $(".modal-body").html(Render.renderOrderDetail(order));
        if(order.state =="completed") {
            $(".step4").addClass("active")
        }
        if(order.state =="shipping") {
            $(".step3").addClass("active")
        }
        if(order.state =="processing") {
            $(".step2").addClass("active")
        }
        $("#order-modal").modal("show");

    })

    $(".close").on("click",function (e) {
        e.preventDefault();
        $("#order-modal").modal("hide");
    })

  }


  const Render = {
    renderOrderList: (orders) => {
        let ordersHTML = "";
        for(let i = 0 ; i < orders.length; i++) {
            let order = orders[i];
            const orderPrice = order.items.reduce(
                (previouVal,item)=>
                    previouVal + item.total,0);
            order.totalPrice = orderPrice;
            ordersHTML += Render.renderOrder(order,i);
        }
        $("#order-list").html(ordersHTML);
    },
    renderOrder: (order,i) => {
        return `
        <div class="card b-1 hover-shadow mb-20">
            <div class="media card-body">
                <div class="media-left pr-12">
                    <img class="avatar avatar-xl no-radius" src="https://cdn1.iconfinder.com/data/icons/ios-11-glyphs/30/order-512.png" alt="...">
                </div>
                <div class="media-body">
                    <div class="mb-2">
                        <span class="fs-20 pr-16">${order.id}</span>
                    </div> 
                    ${Render.renderState(order.state)}
                </div>
                <div class="media-right text-right d-none d-md-block">
                    <p class="fs-14 text-fade mb-12">
                        <i class="fa fa-map-marker pr-1"></i>
                        ${order.delivery.townCity}, ${order.delivery.country}
                    </p>
                    <span class="text-fade">
                        <i class="fa fa-money pr-1"></i> 
                        $${order.totalPrice}
                    </span>
                </div>
            </div>
        <footer class="card-footer flexbox align-items-center">
            <div>
                <strong>Applied on:</strong>
                <span>${order.createdAt}</span>
            </div>
            <div class="card-hover-show">
                <a class="btn btn-xs fs-10 btn-bold btn-info show-detail" data-index="${i}" href="#">View Detail</a> 
                <!--- <a class="btn btn-xs fs-10 btn-bold btn-warning" href="#">Cancel</a>--->
            </div> 
        </footer>
    </div>
        `
    },
    renderState: (status) => {
        let html = "<bold class='fs-16 fw-300 ls-1 font-weight-bold'>Status:</bold>";
        if(status == "new") {
            html +=`<small class="fs-16 fw-300 ls-1 text-danger">New</small>`
        }
        if(status == "processing") {
            html +=`<small class="fs-16 fw-300 ls-1 text-warning">Processing</small>`
        } 
        if(status =="shipping") {
            html +=`<small class="fs-16 fw-300 ls-1 text-primary">Shipping</small>`
        }
        if(status =="completed") {
            html +=`<small class="fs-16 fw-300 ls-1 text-success">Completed</small>`
        }
        return html;
    },
    renderOrderDetail: (order) => {
        return `
        <div class="card">
        <div class="title">Order Detail</div>
        <div class="info">
            <div class="row">
                <div class="col-7"> <span id="heading">Date</span><br> <span id="details">${order.createdAt}</span> </div>
                <div class="col-5 pull-right"> <span id="heading">Order No.</span><br> <span id="details">${order.id}</span> </div>
            </div>
        </div>
        <div class="pricing">
            ${Render.renderOrderDetailItem(order.items)}
        </div>
        <div class="total">
            <div class="row">
                <div class="col-9">Total: <big>$${order.totalPrice}</big></div>
            </div>
        </div>

        <div class="title">Delivery Infomation</div>
        <div class="info">
            <div class="row">
                <div class="col-6"> <span>Name: ${order.delivery.firstName} ${order.delivery.lastName}  </span> </div>
                <div class="col-6"> <span>Phone: ${order.delivery.phone} </span> </div>
                <div class="col-6"> <span>Country: ${order.delivery.country}</span></div>
                <div class="col-6 pull-right"> <span>City: ${order.delivery.townCity} </span></div>
                <div class="col-6"> <span>Street: ${order.delivery.address}</span></div>
                <div class="col-6 pull-right"> <span>Postcode: ${order.delivery.postCode} </span></div>
            </div>
        </div>

        <div class="tracking">
            <div class="title">Tracking Order</div>
        </div>
        <div class="progress-track">
            <ul id="progressbar">
                <li class="step1 step2 step3 step4" id="step1">New</li>
                <li class="step2 step3 step4  text-center" id="step2">Processing</li>
                <li class="step3 step4 text-right" id="step3">Shipping</li>
                <li class="step4 text-right" id="step4">Completed</li>
            </ul>
        </div>
        <div class="footer">
            <div class="row">
                <div class="col-10">Want any help? Don't &nbsp;<a> contact us</a></div>
            </div>
        </div>
    </div>
        `
    },
    renderOrderDetailItem:(items) => {
        let html =`
        <div class="row">
            <div class="col-8"> <b>Product name</b> </div>
            <div class="col-2"> <b>Price</b> </div>
            <div class="col-2"> <b>Total</b> </div>
        </div>`;
        for(let i =0 ; i < items.length;i++) {
            let item = items[i];
            console.log(item);
            html+=`
            <div class="row">
                <div class="col-8"> <span>${item.productName}</span> </div>
                <div class="col-2"> <span>$${item.productPrice}</span> </div>
                <div class="col-2"> <span>$${item.total} (${item.amount})</span> </div>
            </div>`
        }
        return html;
    },
    renderPaginationPage: () => {
        const pages = [];
        let  generated= 0;
        let startAt = pageConfiguration.currentPage - Math.floor(5/2);
        let curr = startAt;
        if(pageConfiguration.currentPage!=1) {
          pages.push(`<a data-move-page ="left" class='page-item'>◀</a>`);
        }
        while (generated < pageConfiguration.pagination_size) {
          if (curr > pageConfiguration.totalPage) {
            startAt--;
            if(startAt<1) break;
            pages.splice(1, 0,
              `<a class="page-item"  href="#">${startAt}</a>`
            );
            generated++;
            continue;
          }
          if (curr > 0) {
            if (curr == pageConfiguration.currentPage) {
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
        if(pageConfiguration.currentPage < pageConfiguration.totalPage) {
          pages.push(`<a data-move-page ="right" class='page-item' >▶</a>`);
        }
        $("#pagination-section").html(pages.join("\n"));
        $(".page-item").click(async function (e) {
          e.preventDefault();
          if($(this).data("move-page")=="left") {
            pageConfiguration.currentPage-=1;
          } else if($(this).data("move-page")=="right") {
            pageConfiguration.currentPage+=1;
          } else {
            pageConfiguration.currentPage = $(this).text().trim();
        }
        await REInit();
        });
      },
  }