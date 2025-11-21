<script>
	import { submitToTapeApp } from '../services/tapeappApi.js';

	let formData = {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		notes: ''
	};

	let isSubmitting = false;
	let submitStatus = null; // 'success', 'error', or null
	let submitMessage = '';

	async function handleSubmit() {
		isSubmitting = true;
		submitStatus = null;
		submitMessage = '';

		try {
			await submitToTapeApp(formData);
			submitStatus = 'success';
			submitMessage = 'Contact submitted successfully!';

			// Reset form
			formData = {
				firstName: '',
				lastName: '',
				email: '',
				phone: '',
				notes: ''
			};
		} catch (error) {
			submitStatus = 'error';
			submitMessage = error.message || 'Failed to submit contact. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="form-container">
	<h2>Please fill in this form</h2>
	<p class="form-description">If you click button: "Submit" the system will create new item in Webform App.</p>

	<form on:submit|preventDefault={handleSubmit}>
		<div class="form-row">
			<div class="form-group">
				<label for="firstName">First Name</label>
				<input
					type="text"
					id="firstName"
					bind:value={formData.firstName}
					placeholder="John"
					required
					disabled={isSubmitting}
				/>
			</div>

			<div class="form-group">
				<label for="lastName">Last Name</label>
				<input
					type="text"
					id="lastName"
					bind:value={formData.lastName}
					placeholder="Doe"
					required
					disabled={isSubmitting}
				/>
			</div>
		</div>

		<div class="form-group">
			<label for="email">Email Address</label>
			<input
				type="email"
				id="email"
				bind:value={formData.email}
				placeholder="john@example.com"
				required
				disabled={isSubmitting}
			/>
		</div>

		<div class="form-group">
			<label for="phone">Phone Number</label>
			<input
				type="tel"
				id="phone"
				bind:value={formData.phone}
				placeholder="+1 (555) 123-4567"
				disabled={isSubmitting}
			/>
		</div>

		<div class="form-group">
			<label for="notes">Notes</label>
			<textarea
				id="notes"
				bind:value={formData.notes}
				placeholder="Add any additional notes..."
				rows="4"
				disabled={isSubmitting}
			></textarea>
		</div>

		<button type="submit" disabled={isSubmitting} class="submit-btn">
			<span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
		</button>
	</form>

	{#if submitStatus}
		<div class={`message ${submitStatus}`}>
			<span class="message-icon">{submitStatus === 'success' ? '✓' : '✕'}</span>
			{submitMessage}
		</div>
	{/if}
</div>

<style>
	.form-container {
		max-width: 550px;
		margin: 40px auto;
		padding: 40px;
		border-radius: 16px;
		background: #ffffff;
		box-shadow: 0 10px 40px rgba(59, 130, 246, 0.15);
		border: 1px solid rgba(59, 130, 246, 0.15);
	}

	h2 {
		margin: 0 0 12px 0;
		color: #1a1a2e;
		font-size: 28px;
		font-weight: 700;
		letter-spacing: -0.5px;
	}

	.form-description {
		margin: 0 0 30px 0;
		color: #6b7280;
		font-size: 15px;
		line-height: 1.6;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	form > .form-group {
		display: grid;
		grid-template-columns: 120px 1fr;
		gap: 12px;
		align-items: flex-start;
	}

	.form-row .form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	label {
		font-weight: 600;
		color: #374151;
		font-size: 14px;
		text-transform: capitalize;
		letter-spacing: 0.3px;
		padding-top: 2px;
	}

	input,
	textarea {
		padding: 12px 16px;
		border: 2px solid #e5e7eb;
		border-radius: 10px;
		font-size: 15px;
		font-family: inherit;
		background-color: #f9fafb;
		transition: all 0.2s ease;
		color: #1a1a2e;
	}

	input::placeholder,
	textarea::placeholder {
		color: #9ca3af;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: #3b82f6;
		background-color: #ffffff;
		box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
	}

	input:disabled,
	textarea:disabled {
		background-color: #f3f4f6;
		cursor: not-allowed;
		color: #9ca3af;
	}

	.submit-btn {
		background: #3b82f6;
		color: white;
		padding: 14px 32px;
		border: none;
		border-radius: 10px;
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.3s ease;
		margin-top: 10px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
	}

	.submit-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
		background: #1f63eb;
	}

	.submit-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.submit-btn:disabled {
		background: #d1d5db;
		cursor: not-allowed;
		box-shadow: none;
	}

	.message {
		margin-top: 20px;
		padding: 16px 20px;
		border-radius: 10px;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 12px;
		animation: slideIn 0.3s ease;
	}

	.message-icon {
		font-size: 20px;
		font-weight: 700;
	}

	.message.success {
		background-color: #d1fae5;
		color: #065f46;
		border: 1px solid #a7f3d0;
	}

	.message.error {
		background-color: #fee2e2;
		color: #991b1b;
		border: 1px solid #fca5a5;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 600px) {
		.form-container {
			margin: 20px;
			padding: 24px;
		}

		h2 {
			font-size: 24px;
		}

		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style>
