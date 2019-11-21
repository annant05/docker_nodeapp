function sendLoginObjectUseAJAX(loginJsonObject) {

  console.log("Sending data to server");
  let currLoc = ($(location).attr('href')).slice(0,-1); 
  console.log(currLoc);
  $.ajax({
    url: `${currLoc}:8888/login`,
    method: 'POST',
    contentType: 'application/json',
    // headers: headers,
    data: JSON.stringify({ loginJsonObject: loginJsonObject }),
    success: function (response) {
      console.log(response.userExists);
      if (response.userExists) {
        console.log("Information recieved by the server. login success");
      } else {
        console.log("There was some error: login failed")
      }
    }
  });
  
}

function sendSignupObjectUseAJAX(loginJsonObject) {
 
  console.log("Sending data to server");
  let currLoc = ($(location).attr('href')).slice(0,-1); 
  console.log(currLoc);
  $.ajax({
    url: `${currLoc}:8888/signup`,
    method: 'POST',
    contentType: 'application/json',
    // headers: headers,
    data: JSON.stringify({ loginJsonObject: loginJsonObject }),
    success: function (response) {
      console.log(response.userExists);
      if (response.userExists) {
        console.log("Information recieved by the server. Signup success");
      } else {
        console.log("There was some error in saving the information. Signup error ")
      }
    }
  });
  
}


//Fade in dashboard box
$(document).ready(function () {
  $('.box').hide().fadeIn(1000);

  input_email = $("#email")
  input_password = $("#password")

  $('#btn_sign_in').click(() => {
    console.log("clicked on sign in");
    credjson = { 
      email: (input_email.val()).trim(),
      password: input_password.val()
    }
    console.log(credjson);
    sendLoginObjectUseAJAX(credjson);
  });

  $('#btn_sign_up').click(() => {
    console.log("clicked on sign up");
    credjson = { 
      email: (input_email.val()).trim(),
      password: input_password.val()
    }
    console.log(credjson);
    sendSignupObjectUseAJAX(credjson);
  });


});









function field_focus(field, email) {
  if (field.value == email) {
    field.value = '';
  }
}

function field_blur(field, email) {
  if (field.value == '') {
    field.value = email;
  }
}


//Stop click event
$('a').click(function (event) {
  event.preventDefault();
});
