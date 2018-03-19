function updateProduct(id){
    $.ajax({
        url: '/beauty/' + id,
        type: 'PUT',
        data: $('#update-product').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};