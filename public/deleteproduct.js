function deleteProduct(id){
    $.ajax({
        url: '/beauty/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};