import FuseUtils from '@fuse/utils';
import landingConfig from 'app/landing/LandingConfig';
import appsConfigs from 'app/main/apps/appsConfigs';
import authRoleExamplesConfigs from 'app/main/auth/authRoleExamplesConfigs';
import CallbackConfig from 'app/main/callback/CallbackConfig';
import DocumentationConfig from 'app/main/documentation/DocumentationConfig';
import LoginConfig from 'app/main/login/LoginConfig';
import LogoutConfig from 'app/main/logout/LogoutConfig';
import pagesConfigs from 'app/main/pages/pagesConfigs';
import ProfilePageConfig from 'app/main/pages/profile/ProfilePageConfig';
import RegisterConfig from 'app/main/register/RegisterConfig';
import UserInterfaceConfig from 'app/main/user-interface/UserInterfaceConfig';
import { Redirect } from 'react-router-dom';

const routeConfigs = [
	...appsConfigs,
	...pagesConfigs,
	...authRoleExamplesConfigs,
	UserInterfaceConfig,
	DocumentationConfig,
	// ProfilePageConfig,
	LogoutConfig,
	LoginConfig,
	RegisterConfig,
	// landingConfig,
	// CallbackConfig 
];

const routes = [
	// if you want to make whole app auth protected by default change defaultAuth for example:
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
	// The individual route configs which has auth option won't be overridden.
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin', 'user']),
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin', 'user']),
	{
		path: '/',
		exact: true,
		component: () => <Redirect to="/" />
	},
	{
		component: () => <Redirect to="/login" />
	}
];

export default routes;


