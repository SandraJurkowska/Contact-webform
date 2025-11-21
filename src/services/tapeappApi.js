const WEBHOOK_URL = 'https://tapeapp.com/api/catch/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3b3JrZmxvd0RlZklkIjozNzIzNjcsIm9yZ2FuaXphdGlvbklkIjo4NzUsInNjb3BlIjoid2tyX3YxIn0.eqFMUU61kDwXG_FBVYJBAV17LYgBIECx_x9amcGb3w4';

export async function submitToTapeApp(contactData) {
	const payload = {
		name: contactData.firstName,
		last_name: contactData.lastName,
		email: contactData.email,
		phone: contactData.phone,
		notes: contactData.notes
	};

	try {
		const response = await fetch(WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			let errorData;
			try {
				errorData = await response.json();
			} catch {
				errorData = { message: response.statusText };
			}
			throw new Error(
				errorData.message || `Submission failed: ${response.status} ${response.statusText}`
			);
		}

		return await response.json();
	} catch (error) {
		if (error instanceof TypeError) {
			throw new Error('Network error: Unable to connect to Tape. Please check your connection.');
		}
		throw error;
	}
}
