
$(".save-btn").on("click", function () {
    var articleId = $(this).val();
    $.post('/saved/' + articleId, function (data, status) {
        swal("Your article has been saved!")
        $.get('/saved').then(function (data, status) {
        })
    });

})


$(".unsave-btn").on("click", function () {
    var articleId = $(this).val();
    location.reload();

    $.post('/unsaved/' + articleId, function (data, status) {
    });

})

$(".note-btn").on("click", function () {
    var articleId = $(this).val();

    $.get('/articles/' + articleId).then(function (data, status) {
        if (data.comment == null) {
            swal("Add a comment:", {
                content: "input",
            })
                .then((value) => {

                    var commentInfo = {
                        body: value
                    }
                    $.post('/articles/' + articleId, commentInfo, function (data, status) {

                    });
                });
        }
        else {
            $.get('/comment/' + data.comment).then(function (data, status) {

                swal("Your comment about this article:", data[0].body)
            })
        }
    })
})

