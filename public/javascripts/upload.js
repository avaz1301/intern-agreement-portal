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
  console.log(signedRequest);
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  // xhr.upload.addEventListener('progress', function(evt){
  //   if(evt.lengthComputable){
  //     //calc percentage of completion
  //     var percentComplete = (evt.loaded / evt.total);
  //     percentComplete = parseInt(percentComplete * 100);
  //
  //     //update progress bar
  //     $('.progress-bar').text(percentComplete + '%');
  //     $('.progress-bar').width(percentComplete + '%');
  //
  //     if(percentComplete === 100){
  //       $('.progress-bar').html('Done');
  //     }
  //   }//computable
  // }, false);
  xhr.onreadystatechange =  function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        console.log('UPLOAD FILE Success');
        alert('File was uploaded succesfully! Thank You!');
      }
      else{
        console.log("Error", xhr.statusText);
        alert('Could not upload file.');
      }
    }
  };
  xhr.send(file);
}
