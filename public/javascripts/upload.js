function getSignedRequest(file){
  console.log("IN GET SIGNED");
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/sign-s3?file-name='+file.name+'&file-type='+file.type);
  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
        uploadFile(file, response.signedRequest, response.url);
      }
      else{
        alert('Could not get signed URL.');
      }
    }
  };
  xhr.send();
}

function uploadFile(file, signedRequest, url){
  console.log("IN UPLOAD FILE");
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  xhr.upload.addEventListener('progress', function(evt){
    if(evt.lengthComputable){
      //calc percentage of completion
      var percentComplete = (evt.loaded / evt.total);
      percentComplete = parseInt(percentComplete * 100);

      //update progress bar
      $('.progress-bar').text(percentComplete + '%');
      $('.progress-bar').width(percentComplete + '%');

      if(percentComplete === 100){
        $('.progress-bar').html('Done');
      }
    }//computable
  }, false);
  xhr.onreadystatechange =  function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        console.log('UPLOAD FILE Success');
        alert('File was uploaded succesfully! Thank You!');
      }
      else{
        alert('Could not upload file.');
      }
    }
  };
  xhr.send(file);
}


// $('.upload-btn').on('click', function(){
//   $('#upload-input').click();
//   $('.progress-bar').text('0%');
//   $('.progress-bar').width('0%');
// });
//
// $('#upload-input').on('change', function(){
//   var files = $(this).get(0).files;
//   if(files.length > 0){
//
//     var formData = new FormData();
//
//     //lookup
//     for(var i=0; i<files.length; i++){
//       var file = files[i];
//       formData.append('uploads[]',file, file.name);
//     }
//
//     $.ajax({
//       url: '/upload',
//       type:'POST',
//       data: formData,
//       processData: false,
//       contentType: false,
//       success: function(data){
//         console.log('upload successful');
//       },
//       xhr: function(){
//         var xhr = new XMLHttpRequest();
//         xhr.upload.addEventListener('progress', function(evt){
//           if(evt.lengthComputable){
//             //calc percentage of completion
//             var percentComplete = (evt.loaded / evt.total);
//             percentComplete = parseInt(percentComplete * 100);
//
//             //update progress bar
//             $('.progress-bar').text(percentComplete + '%');
//             $('.progress-bar').width(percentComplete + '%');
//
//             if(percentComplete === 100){
//               $('.progress-bar').html('Done');
//             }
//           }//computable
//         }, false);
//         return xhr;
//       }//xhr
//     });//ajax
//   }//if files > 0
// });
