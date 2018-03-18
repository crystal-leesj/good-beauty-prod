function updateProduct(id){
    $.ajax({
        url: '/beauty/' + id,
        type: 'PUT',
        data: $('#update-person').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};