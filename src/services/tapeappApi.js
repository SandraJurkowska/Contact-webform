const WORKSPACE_ID = import.meta.env.VITE_TAPEAPP_WORKSPACE_ID;
const APP_ID = import.meta.env.VITE_TAPEAPP_APP_ID;
const API_KEY = import.meta.env.VITE_TAPEAPP_API_KEY;
const API_BASE_URL = 'https://api.tapeapp.com/api/v1';

export async function submitToTapeApp(contactData) {
	if (!API_KEY) {
		throw new Error('TapeApp API key is not configured. Please add VITE_TAPEAPP_API_KEY to your .env file.');
	}

	if (!WORKSPACE_ID || !APP_ID) {
		throw new Error('TapeApp workspace ID or app ID is not configured.');
	}

	const payload = {
		firstName: contactData.firstName,
		lastName: contactData.lastName,
		email: contactData.email,
		phone: contactData.phone,
		notes: contactData.notes
	};

	try {
		const response = await fetch(
			`${API_BASE_URL}/workspaces/${WORKSPACE_ID}/apps/${APP_ID}/records`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${API_KEY}`
				},
				body: JSON.stringify(payload)
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData.message || `TapeApp API error: ${response.statusText}`
			);
		}

		return await response.json();
	} catch (error) {
		if (error instanceof TypeError) {
			throw new Error('Network error: Unable to connect to TapeApp. Please check your connection.');
		}
		throw error;
	}
}
