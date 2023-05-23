export const getBase = () => {
	let appUrl;
	let apiUrl;
	switch (import.meta.env.VITE_BUILD_TYPE) {
		case 'development':
			appUrl = 'https://dev-app-admin.density.exchange';
			apiUrl = 'https://api-dev-admin.density.exchange';
			break;
		case 'production':
			appUrl = 'https://app-admin.density.exchange';
			apiUrl = 'https://api-admin.density.exchange';
			break;
		case 'local':
			appUrl = 'https://localhost:3000';
			apiUrl = 'https://api-dev-admin.density.exchange';
			break;
		default:
			appUrl = 'https://localhost:3000';
			apiUrl = 'https://api-dev-admin.density.exchange';
			break;
	}
	return {
		appUrl,
		apiUrl,
	};
};
