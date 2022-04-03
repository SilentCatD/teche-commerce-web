import APIService from '../../utils/api_service.js';
import {cacheKey} from '../../utils/common.js';
import TokenService from '../../utils/token_service.js';

$(document).ready(function () {
    $('#logoutBtn').click( async function (e) { 
        e.preventDefault();
        await APIService.logout('admin');
        localStorage.removeItem(cacheKey.adminAutoLogin);
        window.location.replace('/admin');
    });
});