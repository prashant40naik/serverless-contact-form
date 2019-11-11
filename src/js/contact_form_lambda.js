jQuery(document).ready(function(){
document.getElementById('serverless-contact-form').addEventListener('submit', sendDataToLambda);
function sendDataToLambda(e) {
e.preventDefault();
var formName = document.querySelector('.form-name').value;
var formEmail = document.querySelector('.form-email').value;
var formSubject = document.querySelector('.form-subject').value;
var formMessage = document.querySelector('.form-message').value;
var recaptcha = document.querySelector('.g-recaptcha-response').value;
var endpoint = 'https://o2pfiqo880.execute-api.us-west-2.amazonaws.com/prod/serverless-prod-contactform';
var body = {
name: formName,
email: formEmail,
subject: formSubject,
message: formMessage,
grecaptcha: recaptcha
}

var lambdaRequest = new Request(endpoint, {
method: 'POST',
body: JSON.stringify(body)
});


fetch(lambdaRequest)
.then(function(response){
 if (response.status === 200) {  
alert("Mail has been sent!");
           document.getElementById("serverless-contact-form").reset();
       location.reload();
} else {
alert("An error occured and your message could not be sent.'");
}

} )
.catch(err => console.log(err));

}
});

