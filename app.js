const express = require('express')
const app = express()
const port = 3000

const csv = require('csv-parser')
const fs = require('fs')

const amenitys = [];
const amenitysIds = [];
const reservations = [];

fs.createReadStream('Reservations.csv')
	.pipe(csv({
		separator: ';'
	}))
	.on('data', (data) => reservations.push(data));

fs.createReadStream('Amenity.csv')
	.pipe(csv({
		separator: ';'
	}))
	.on('data', (data) => amenitys.push(data))
	.on('data', (data) => amenitysIds.push(data.id));

app.get('/reservations/:amenityId/:date', (req, res) => {
	if (amenitysIds.includes(req.params.amenityId)) {
		const reservationsDates = reservations.filter(element => element.amenity_id == req.params.amenityId && element.date == req.params.date);
		if (reservationsDates.length > 0) {
			results = [];
			const amenity = amenitys.filter(element => element.id == req.params.amenityId);
			reservationsDates.forEach(element => results.push({
				'id': element.id,
				'user_id': element.user_id,
				'start_time': new Date(
						element.date * 1000 + element.start_time * 60 * 1000)
					.toLocaleTimeString([], {
						timeStyle: 'short'
					}),
				'duration': element.end_time - element.start_time,
				'amenity_name': amenity[0].name
			}));
			res.send(results);
		} else {
			res.send('Dates not found');
		}
	} else {
		res.send("Not found amenity");
	}
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
