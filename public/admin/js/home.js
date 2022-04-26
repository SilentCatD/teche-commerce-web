import APIService from "../../utils/api_service.js";

let userInfo = null;

$(document).ready(async function() {
    try {
        userInfo = await APIService.userInfo();
        const response = await APIService.fetchAllOrder({limit:5});
        const orders = response.items;
        for(let i = 0 ; i < orders.length ; i++) {
            let order = orders[i];
            $("#today-sales").append(
            `<tr>
                <td>${order.createdAt}</td>
                <td>${order.id}</td>
                <td>${order.user.email}</td>
                <td>$${order.totalPrice}</td>
                <td>${order.state}</td>
                <td><a class="btn btn-sm btn-primary" href="">Detail</a></td>
            </tr>`
            )
        }

        const today = new Date();
        const olestDay = new Date("01/01/2000");
        
        const lastedMonth = new Date(today);
        lastedMonth.setDate(today.getDate() - 28);

        const lastedWeek = new Date(today);
        lastedWeek.setDate(today.getDate() - 7);

        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + 1);


        const todaySale = await  APIService.getRevenue(today.yyyymmdd(),nextDay.yyyymmdd());
        const weekSale = await  APIService.getRevenue(lastedWeek.yyyymmdd(),nextDay.yyyymmdd());
        const monthSale = await  APIService.getRevenue(lastedWeek.yyyymmdd(),nextDay.yyyymmdd());
        const totalSale = await APIService.getRevenue(olestDay.yyyymmdd(),nextDay.yyyymmdd());

        $("#today-sale").text(`$${todaySale.data}`);
        $("#week-sale").text(`$${weekSale.data}`);
        $("#month-sale").text(`$${monthSale.data}`);
        $("#total-sale").text(`$${totalSale.data}`);




    } catch (e) {
        console.log(e);
    }
});

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
  
    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('/');
  };