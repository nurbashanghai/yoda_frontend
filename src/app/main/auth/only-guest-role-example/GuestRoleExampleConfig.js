import { authRoles } from 'app/auth';
import Landing from 'app/landing/Landing';
import GuestRoleExample from './GuestRoleExample';

const GuestRoleExampleConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.onlyGuest, // ['guest']
	routes: [
		{
			path: '/auth/landing',
			component: Landing
		}
	]
};

export default GuestRoleExampleConfig;
