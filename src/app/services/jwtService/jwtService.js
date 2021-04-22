import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axios.interceptors.response.use(
			response => {
				return response;
			},
			err => {
				return new Promise((resolve, reject) => {
					if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			this.setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	axiosInstance = axios.create({
		baseURL: 'http://localhost:8080'
		/* other custom settings */
	  });

	setDefault = obj => {
		const newObj = {
			...obj,
			data: {
				displayName: obj.email,
				photoURL: 'assets/images/avatars/Arnold.jpg',
				email: obj.email,
				settings: {
					layout: {
						style: 'layout1',
						config: {
							mode: 'boxed',
							scroll: 'content',
							navbar: {
								display: true
							},
							toolbar: {
								display: true,
								position: 'below'
							},
							footer: {
								display: true,
								style: 'fixed'
							}
						}
					},
					customScrollbars: true,
					theme: {
						main: 'greeny',
						navbar: 'mainThemeDark',
						toolbar: 'mainThemeDark',
						footer: 'mainThemeDark'
					}
				}
			}
		}
		return newObj;
	}

	createUser = data => {
		return new Promise((resolve, reject) => {
			this.axiosInstance.post('/api/user/registration', data).then(response => {
				console.log(response);
				if (response.data.user) {
					console.log('resolved');
					this.setSession(response.data.access_token);
					resolve(this.setDefault(response.data.user));
				} else {
					console.log('rejected');
					reject(response.data);
				}
			});
		});
	};

	signInWithEmailAndPassword = (email, password) => {
		console.log(email, password)
		return new Promise((resolve, reject) => {
			this.axiosInstance
				.post('/api/user/login', {
					data: {
						"email": email,
						"password": password
					}
				})
				.then(response => {
					if (response.data.user) {
						this.setSession(response.data.access_token);
						resolve(this.setDefault(response.data.user));
					}
				}).catch(errors => {
					console.log(errors.response.data, ' jwt service')
					reject(errors.response.data)
				})
		});
	};

	signInWithToken = () => { // починить гавно
		return new Promise((resolve, reject) => {
			this.axiosInstance
				.get('/api/user/verify', {
					headers: {
						access_token: this.getAccessToken()
					}
				})
				.then(response => {
					console.log(response, ' pidarskii response');
					if (response.data.user) {
						let res = response.data.user;
						res.role = res.role.toLowerCase(); // 
						this.setSession(response.data.access_token);
						resolve(this.setDefault(res));
					} else {
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(error => {
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});
	};

	updateUserData = user => {
		return axios.post('/api/auth/user/update', {
			user
		});
	};

	setSession = access_token => {
		if (access_token) {
			localStorage.setItem('jwt_access_token', access_token);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			console.log('pidar')
			localStorage.removeItem('jwt_access_token');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_access_token');
	};
}

const instance = new JwtService();

export default instance;
