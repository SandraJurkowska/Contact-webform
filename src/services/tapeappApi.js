const WORKSPACE_ID = import.meta.env.VITE_TAPEAPP_WORKSPACE_ID || '13661';
const APP_ID = import.meta.env.VITE_TAPEAPP_APP_ID || '69278';
const API_KEY = import.meta.env.VITE_TAPEAPP_API_KEY;
const API_BASE_URL = 'https://api.tapeapp.com/api/v1';

export async function submitToTapeApp(contactData) {
	if (!API_KEY) {
		throw new Error('TapeApp API key is not configured. Environment variable VITE_TAPEAPP_API_KEY is missing.');
	}

	if (!WORKSPACE_ID || !APP_ID) {
		throw new Error('TapeApp workspace ID or app ID is not configured.');
	}

	const payload = {
		fields: [
			{
				key: 'name',
				value: contactData.firstName
			},
			{
				key: 'last_name',
				value: contactData.lastName
			},
			{
				key: 'email',
				value: contactData.email
			},
			{
				key: 'phone',
				value: contactData.phone
			},
			{
				key: 'notes',
				value: contactData.notes
			}
		]
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
				body: JSON.stringify(payload),
				mode: 'cors'
			}
		);

		if (!response.ok) {
			let errorData;
			try {
				errorData = await response.json();
			} catch {
				errorData = { message: response.statusText };
			}
			throw new Error(
				errorData.message || `TapeApp API error: ${response.status} ${response.statusText}`
			);
		}

		return await response.json();
	} catch (error) {
		if (error instanceof TypeError) {
			throw new Error('Network error: Unable to connect to TapeApp API. This may be a CORS issue or connection problem.');
		}
		throw error;
	}
}
