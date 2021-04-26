import {authRoles} from 'app/auth';
import Landing from './Landing';

const landingConfig = {
    settings: {
		layout: {
			config: {
				navbar: {
					display: true
				},
				toolbar: {
					display: true
				},
				footer: {
					display: true
				},
				leftSidePanel: {
					display: true
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
    auth: authRoles.onlyGuest,
    routes: [
        {
            path: '/landing',
            component: Landing
        }
    ]
}

export default landingConfig;