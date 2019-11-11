// AWS lambda function to catpure form elements, validate re-captcha and send email using SES.

'use strict';
console.log('Loading function');
const AWS = require('aws-sdk');
const sesClient = new AWS.SES();
const config  = require('./config.json');
var querystring = require('querystring');  
var http = require('https');

/**
 * Lambda to process HTTP POST for contact form with the following body
 * {
      "email": <contact-email>,
      "subject": <contact-subject>,
      "message": <contact-message>
    }
 *
 */
exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    var emailObj = JSON.parse(event.body);
    var params = getEmailMessage(emailObj);

    
    if (!emailObj['grecaptcha']) {
    console.error("Recaptcha response not provided");
    return callback(null, prepareErrorResponse("You seem to be a bot!"));
  }
  var postData = querystring.stringify({
    secret : config.captchaSiteSecret,
    response : emailObj['grecaptcha']
    
  });
  
  var post_options = {
      host: 'www.google.com',
      port: '443',
      path: '/recaptcha/api/siteverify',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      }
  };
  
    // Post the acquired recaptcha response to Google to verify
 var req = http.request(post_options,
    function(error, httpResponse, body) {   
  
    var sendEmailPromise = sesClient.sendEmail(params).promise();
    sendEmailPromise.then(function(result) {
        console.log(result);
        return callback(null, prepareResponse("Thank You! Your message has been sent."));
    }).catch(function(err) {
        console.log(err);
        return callback(null, prepareErrorResponse("An error occurred while sending your message.", err));
    });
});

  req.end();
  
    };

function getEmailMessage (emailObj) {
    var emailRequestParams = {
        Destination: {
          ToAddresses: [ config.sesConfirmedAddress ]  
        },
        Message: {
            Body: {
                Text: {
                    Data: 'Name: ' + emailObj.name + '\nEmail: ' + emailObj.email + '\nMessage: ' + emailObj.message
                }
            },
            Subject: {
                Data: emailObj.subject
            }
        },
        Source: config.sesConfirmedAddress,
        ReplyToAddresses: [ emailObj.email ]
    };
    
    return emailRequestParams;
}

var prepareErrorResponse = (message, error) => {
  return {
    "statusCode": 500,
    "headers": {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true  // Required for cookies, authorization headers with HTTPS
      },
    "body": JSON.stringify({ "message": message, "error": error })
  };
};

// Function to prepare a standard response structure
var prepareResponse = (message) => {
  return {
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      },
    "body": JSON.stringify({ "message": message })
  };
};
