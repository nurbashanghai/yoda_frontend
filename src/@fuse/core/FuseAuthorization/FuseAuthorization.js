import FuseUtils from '@fuse/utils';
import AppContext from 'app/AppContext';
import { Component } from 'react';
import { connect } from 'react-redux';
import { matchRoutes } from 'react-router-config';
import { withRouter } from 'react-router-dom';
import { LEFT } from 'react-swipeable';

class FuseAuthorization extends Component {
	constructor(props, context) {
		super(props);
		const { routes } = context;
		this.state = {
			accessGranted: true,
			routes
		};
	}

	componentDidMount() {
		if (!this.state.accessGranted) {
			this.redirectRoute();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.accessGranted !== this.state.accessGranted;
	}

	componentDidUpdate() {
		if (!this.state.accessGranted) {
			this.redirectRoute();
		}
	}

	static getDerivedStateFromProps(props, state) {
		const { location, userRole } = props;
		const { pathname } = location;

		console.log('worked')

		const matched = matchRoutes(state.routes, pathname)[0];

		return {
			accessGranted: matched ? FuseUtils.hasPermission(matched.route.auth, userRole) : true
		};
	}

	redirectRoute() { // ???
		let { location, userRole, history } = this.props;
		const { pathname, state } = location;
		const redirectUrl = state && state.redirectUrl ? state.redirectUrl : '/';
		const redirectLoggedIn = '/profile'

		console.log(location, 'THIS LOCATION')
		console.log(this.props, 'THIS PROPS')

		/*
        User is guest
        Redirect to Login Page
        */
		if (!userRole || userRole.length === 0) {
			history.push({
				pathname: '/landing',
				state: { redirectUrl: pathname }
			});
		} else {
			// userRole = ['user']
			/*
        User is member
        User must be on unAuthorized page or just logged in
        Redirect to dashboard or redirectUrl
        */
			history.push({
				pathname: redirectLoggedIn
			});
		}
	}

	render() {
		// console.info('Fuse Authorization rendered', this.state.accessGranted);
		return this.state.accessGranted ? <>{this.props.children}</> : null;
	}
}

function mapStateToProps({ auth }) {
	return {
		userRole: auth.user.role
	};
}

FuseAuthorization.contextType = AppContext;

export default withRouter(connect(mapStateToProps)(FuseAuthorization));
