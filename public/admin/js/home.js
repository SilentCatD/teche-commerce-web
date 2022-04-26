import APIService from "../../utils/api_service.js";

let userInfo = null;

$(document).ready(async function() {
    console.log(userInfo);

    try {
        userInfo = await APIService.userInfo();
        const response = await APIService.fetchAllOrder({limit:5});
        const orders = response.items;
        console.log(orders);
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
    } catch (e) {
        console.log(e);
    }
});