

$(document).ready(function () {
    $('#account-active-btn').click(async function (e) { 
        e.preventDefault();
        try{
            // await axios.put(`/api/v1/auth/active/${hash}`);
            $('#account-active-btn span.loading-icon').removeClass('d-none');
            $('#account-active-btn').prop('disabled', true);
            $('#account-active-btn span.text').text('Activating....');
            await axios.put(`/api/v1/auth/active/${hash}`);
            $('#account-active-btn span.text').text('Account activated!');
        }
        catch(e){
            $('#account-active-btn').toggleClass('btn-primary btn-danger');
            $('#account-active-btn span.text').text('Something went wrong');
        }
        finally{
            $('#account-active-btn span.loading-icon').addClass('d-none');

        }
    });
});