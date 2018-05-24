
$(".save-btn").on("click", function () {
    var articleId = $(this).val();
    console.log(articleId);

    // location.reload();
    $.post('/saved/' + articleId, function (data, status) {
        swal("Your article has been saved!")
       $.get('/saved').then(function(data, status) {
            console.log("ping")
        })
    });

})


$(".unsave-btn").on("click", function () {
    var articleId = $(this).val();
    console.log(articleId);
    location.reload();

    $.post('/unsaved/' + articleId, function (data, status) {
        // $.get('/saved').then(function(data, status) {
        //     console.log("ping")
        // })
    });

})



$(".note-btn").on("click", function () {
    var articleId = $(this).val();
    console.log(articleId);

    $.get('/articles/' + articleId).then(function (data, status) {


        if (data.comment == null) {
            swal("Add a comment:", {
                content: "input",
            })
                .then((value) => {

                    var commentInfo = {
                        body: value
                    }
                    console.log(commentInfo)

                    $.post('/articles/' + articleId, commentInfo, function (data, status) {

                    });
                });
        }
        else {
            $.get('/comment/' + data.comment).then(function (data, status) {
                // console.log("data.body: ", data[0].body)
                swal("Your commnet about this article:\n", data[0].body)
            })
        }



    })



})

