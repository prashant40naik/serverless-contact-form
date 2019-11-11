# serverless contact form

This repository contains nodejs functions to capture contact form elements and send email using AWS Lambda. It accepts form data, validates recaptcha and then sends the form data to the configured email address through AWS SES. 

# Demo

[Contact Naikonpixels](https://www.naikonpixels.com/contact/index.html)

# Pre-requisite

AWS stack needs to be created prior to using serverless modules. Cloudformation stack included in this repository, creates lamdba functions only. Setup API Gateway for these functions and use it as a trigger to submit form elements. AWS SES needs to be configured to be able to send e-mail. 



