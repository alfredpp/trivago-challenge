$(document).ready(function() {
  var options = {
    beforeSubmit: showRequest, // pre-submit callback
    success: showResponse // post-submit callback
  };
  // bind to the form's submit event
  $('#frmUploader').submit(function () {
    $(this).ajaxSubmit(options); // always return false to prevent standard browser submit and page navigation
    return false;
  });
}); 
// pre-submit callback
function showRequest(formData, jqForm, options) {
  alert('Uploading is starting.');
  return true;
}
// post-submit callback
function showResponse(responseText, statusText, xhr, $form) {
  alert('status: ' + statusText + '\n\nresponseText: \n' + responseText );
}
