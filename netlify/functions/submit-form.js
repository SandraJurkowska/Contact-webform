const WEBHOOK_URL = 'https://tapeapp.com/api/catch/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3b3JrZmxvd0RlZklkIjozNzIzNjcsIm9yZ2FuaXphdGlvbklkIjo4NzUsInNjb3BlIjoid2tyX3YxIn0.eqFMUU61kDwXG_FBVYJBAV17LYgBIECx_x9amcGb3w4';

exports.handler = async (event) => {
	// Only allow POST requests
	if (event.httpMethod !== 'POST') {
		return {
			statusCode: 405,
			body: JSON.stringify({ error: 'Method not allowed' })
		};
	}

	try {
		console.log('Received event body:', event.body);
		const contactData = JSON.parse(event.body);
		console.log('Parsed contact data:', JSON.stringify(contactData));

		const payload = {
			name: contactData.firstName || '',
			last_name: contactData.lastName || '',
			email: contactData.email || '',
			phone: contactData.phone || '',
			notes: contactData.notes || ''
		};

		console.log('Sending payload to webhook:', JSON.stringify(payload));

		const response = await fetch(WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		console.log('Webhook response status:', response.status);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('Webhook error response:', errorText);
			return {
				statusCode: response.status,
				body: JSON.stringify({
					error: `Tape API error: ${response.statusText}`,
					details: errorText
				})
			};
		}

		const responseData = await response.json();
		console.log('Webhook success response:', responseData);

		return {
			statusCode: 200,
			body: JSON.stringify({
				success: true,
				message: 'Form submitted successfully',
				data: responseData
			})
		};
	} catch (error) {
		console.error('Error caught:', error.message, error.stack);
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: error.message || 'Internal server error',
				details: error.stack
			})
		};
	}
};
