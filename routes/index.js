var express = require('express');
var router = express.Router();
var Skyscanner = require('skyscanner');
var bodyParser = require('body-parser');
var unirest = require('unirest');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sky', function(req, res) {
	unirest.post('http://partners.api.skyscanner.net/apiservices/pricing/v1.0?apikey=ry909076184123727230483951889231')
		.headers({
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json'
		}).send({
			country: 'UK',
			currency: 'GBP',
			locale: 'en-GB',
			OriginPlace: 'EDI',
			DestinationPlace: 'LHR',
			outbounddate: '2016-10-15',
			inbounddate: '2016-10-24',
			locationschema: 'iata'
		}).end(function (response) {
			console.log(response.headers.location);
			var other = '?includeQuery=false&skipCarrierLookup=885;881;1252;1033;1710;1057;1653;1324;1889;838;821;1218;1202;7&skipPlaceLookup=11235;13880;13554;9889;10141;11154;9451;10413;13870;9772;14585;11316;2343;4872;4698;876;1178;2277;509;6073;4854;782;5577;5688;247;240;234;235;244;200&includeCurrencyLookup=false&includeBookingDetailsLink=false'
			var getURL = response.headers.location+'?apikey=ry909076184123727230483951889231';
			console.log(getURL);
			setTimeout(function () {
				console.log('hello')
				unirest.get(getURL).end(function (response) {
					var display = [];
					// console.log(response.body);
					console.log('-------------------------------------------------')
					// console.log(response.body[1]);
					// res.json(response.body);
					var status = response.body.Status;
					var itineraries = response.body.Itineraries;
					var legs = response.body.Legs;
					var carriers = response.body.Carriers;
					var agents = response.body.Agents;
					var places = response.body.Places;
					var stuffs = [status, itineraries, legs, carriers, agents, places];

					var it0 = itineraries[0];

					//outbound
					var outboundInfo = {};

					var outboundId = it0.OutboundLegId;
					var originStation = '';

					for (leg of legs) {
						if (leg.Id === outboundId) {
							console.log(outboundId, leg.Id);
							console.log(leg);

							var originStationId = leg.OriginStation;
							var originStationName = '';
							places.forEach(function (place, i) {
								if (place.Id === originStationId) {
									originStationName = place.Name; 
								}
							});

							var destinationStationId = leg.DestinationStation;
							var desitinationStationName = '';
							places.forEach(function (place, i) {
								if (place.Id === destinationStationId) {
									destinationStationName = place.Name; 
								}
							});

							var departure = leg.Departure;
							var arrival = leg.Arrival;
							var stopsQty = leg.Stops.length;
							var duration = leg.Duration;
							var journeyMode = leg.JourneyMode;

							var carrierIds = leg.Carriers;
							var carrierNames = [];
							carrierIds.forEach(function(carrierId, i) {
								carriers.forEach(function(carrier, i) {
									if (carrier.Id === carrierId) {
										var carrierStuff = {
											name: carrier.Name,
											url: carrier.ImageUrl
										}
										carrierNames.push(carrierStuff);
									}
								});
							});
						}
					}

					outboundInfo = {
						originStation: originStationName,
						destinationStation: destinationStationName,
						departure: departure,
						arrival: arrival,
						stopsQty: stopsQty,
						duration: duration,
						journeyMode: journeyMode,
						carrierNames: carrierNames
					}




					//inbound
					var inboundInfo = {};

					var inboundId = it0.InboundLegId;



					//pricing
					
					var options = it0.PricingOptions;
					var option0 = 




					// res.json(outboundInfo);
					res.json({stuff: stuffs});
				})
			}, 2000)
		});
});

module.exports = router;
