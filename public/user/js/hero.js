import APIService from "../../utils/api_service.js";

$(document).ready(function () {
    renderCategories();
});

async function renderCategories(){
    const categories = (await APIService.fetchAllCategory()).items;
    categories.map((category)=>{
        $('#categoriesList').append(`
            <li><a>${category.name}</a></li>
        `);
    });
}
