$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#result').hide();
    $('#cap').hide();

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#cap').hide();
        $('#result').text('');
        $('#result').hide();
        readURL(this);
    });

    // Predict
    $('#btn-predict').click(function () {
        var form_data = new FormData($('#upload-file')[0]);

        // Show loading animation
        $(this).hide();
        $('.loader').show();

        // Make prediction by calling API /predict
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                // Get and display the result
                $('.loader').hide();
                $('#cap').fadeIn(600);
                $('#result').fadeIn(600);

                var nv = data.nv;
                var n1 = data.n1;
                var n2 = data.n2;
                if(nv===true){
                    var imgEl = new Image();
                    imgEl.src = 'static/police.png'; // Replace with the actual path or URL of the image
                    imgEl.id = "noviolations";
                    // Optional: Add attributes to the image element
                    imgEl.alt = 'Image Description'; // Replace with a description of the image
                    imgEl.width = 380; // Set the width of the image
                    imgEl.height = 380; // Set the height of the image
                    document.body.appendChild(imgEl);

                    var imgE2 = new Image();
                    imgE2.src = 'static/green.jpg'; // Replace with the actual path or URL of the image
                    imgE2.id = "traffic";
                    // Optional: Add attributes to the image element
                    imgE2.alt = 'Image Description'; // Replace with a description of the image
                    imgE2.width = 80; // Set the width of the image
                    imgE2.height = 80; // Set the height of the image
    
                    // Append the image element to the document body or any other container
                    document.body.appendChild(imgE2);
                }
                else{
                    var imgEl = new Image();
                    imgEl.src = 'static/fine.png'; // Replace with the actual path or URL of the image
                    imgEl.id = "noviolations";
                    // Optional: Add attributes to the image element
                    imgEl.alt = 'Image Description'; // Replace with a description of the image
                    imgEl.width = 380; // Set the width of the image
                    imgEl.height = 380; // Set the height of the image
                    document.body.appendChild(imgEl);

                    // var imgE3 = new Image();
                    // imgE3.src = 'static/jail2.png'; // Replace with the actual path or URL of the image
                    // imgE3.id = "imagePreview";
                    // // Optional: Add attributes to the image element
                    // imgE3.alt = 'Image Description'; // Replace with a description of the image
                    // imgE3.width = 380; // Set the width of the image
                    // imgE3.height = 380; // Set the height of the image
                    // document.body.appendChild(imgE3);


                    var imgE2 = new Image();
                    imgE2.src = 'static/red.jpg'; // Replace with the actual path or URL of the image
                    imgE2.id = "traffic";
                    // Optional: Add attributes to the image element
                    imgE2.alt = 'Image Description'; // Replace with a description of the image
                    imgE2.width = 80; // Set the width of the image
                    imgE2.height = 80; // Set the height of the image
    
                    // Append the image element to the document body or any other container
                    document.body.appendChild(imgE2);
                }
               

                console.log('nv:', nv);
                console.log('n1:', n1);
                console.log('n2:', n2);

                var imgElement = new Image();
                imgElement.src = 'static/img.jpg'; // Replace with the actual path or URL of the image
                imgElement.className = "result_img";
                // Optional: Add attributes to the image element
                imgElement.alt = 'Image Description'; // Replace with a description of the image
                imgElement.width = 380; // Set the width of the image
                imgElement.height = 380; // Set the height of the image

                // Append the image element to the document body or any other container
                document.body.appendChild(imgElement);

                console.log('Success!');
            },
        });
    });
});
