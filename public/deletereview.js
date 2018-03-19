function deleteReview(id){
    $.ajax({
        url: '/beauty/reviews' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};