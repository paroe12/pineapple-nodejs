var express = require('express');
var cool = require('cool-ascii-faces');
var bodyParser = require('body-parser');
var stripe = require('stripe')('sk_test_xEA0Oy5MU7KbhWdbiqbpr3Ap');


var app = express();

app.set('port', (process.env.PORT || 7770));
//app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get('/', function(request, response) {
  var result = 'yooo, sup bruh  '
  var times = process.env.TIMES || 5
  for (i=0; i < times; i++)
    result += cool();
  response.send(result);
});


app.post('/charge', function(req, res) {
    var stripeToken = req.body.stripeToken;
    var amount = 1000;
    console.log("HEY, IT'S CHARGING FOR TOKEN");
    console.log(stripeToken);

    var charge = stripe.charges.create({
		 amount: 1000, // amount in cents, again
		currency: "usd",
		source: stripeToken,
		description: "Example charge"
    },
    function(err, charge) {
    	if (err && err.type === 'StripeCardError') {
    		console.log("WHAT DECLINED CARD");
    		res.send(507, err);
    	// The card has been declined
  		}
        if (err) {
            res.send(500, err);
        } else {
            res.send(204);
        }
    });	
});


app.use(express.static(__dirname));
app.listen(process.env.PORT || 7770);




// app.listen(app.get('port'), function() {
//   console.log("Node app is running on port:" + app.get('port'))
// })


// var gateway = braintree.connect({
//   environment: braintree.Environment.Sandbox,
//   merchantId: "useYourMerchantId",
//   publicKey: "useYourPublicKey",
//   privateKey: "useYourPrivateKey"
// });


// app.get("/client_token", function (req, res) {
//   gateway.clientToken.generate({
//     customerId: aCustomerId
//   }, function (err, response) {
//     res.send(response.clientToken);
//   });
// });

// app.post("/payment-methods", function (req, res) {
//   var nonce = req.body.payment_method_nonce;
//   // Use payment method nonce here
// });


// gateway.transaction.sale({
//   amount: '10.00',
//   paymentMethodNonce: 'nonce-from-the-client',
// }, function (err, result) {
// });