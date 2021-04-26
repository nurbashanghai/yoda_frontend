import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector, connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import axios from 'axios';


import _ from '@lodash';
import * as yup from 'yup';

import {
	removeContact,
	updateContact,
	addContact,
	closeNewContactDialog,
	closeEditContactDialog
} from './store/contactsSlice';

const defaultValues = {
	id: '',
	name: '',
	lastName: '',
	avatar: 'assets/images/avatars/profile.jpg',
	nickname: '',
	company: '',
	jobTitle: '',
	email: '',
	phone: '',
	address: '',
	birthday: '',
	notes: ''
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	name: yup.string().required('You must enter a name')
});

function ContactDialog(props) {
	const [modal, setModal] = useState(false);
	const [mentor, setMentor] = useState({});
	console.log(props, ' props in contact dialog')
	const dispatch = useDispatch();
	const contactDialog = useSelector(({ contactsApp }) => contactsApp.contacts.contactDialog);

	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const id = watch('id');
	const name = watch('name');
	const avatar = watch('avatar');

	/**
	 * Initialize Dialog with Data
	 */
	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (contactDialog.type === 'edit' && contactDialog.data) {
			reset({ ...contactDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (contactDialog.type === 'new') {
			reset({
				...defaultValues,
				...contactDialog.data,
				id: FuseUtils.generateGUID()
			});
		}
	}, [contactDialog.data, contactDialog.type, reset]);

	console.log(contactDialog.data, ' data in contact dialog asd')

	async function sendOrder(obj){
		const token = 'Bearer ' + localStorage.getItem('jwt_access_token');
		await axios.post('http://localhost:8080/api/user/createorder',
			obj,
			{
				headers: {'Authorization': token}
			})
		.then(res => console.log(res)).catch((err) => console.log(err));
			setModal(false);
	}

	/**
	 * On Dialog Open
	 */
	useEffect(() => {
		if (contactDialog.props.open) {
			initDialog();
		}
		console.log(contactDialog.data, ' !!!!!!!!!! in useEffect')
	}, [contactDialog.props.open, initDialog]);

	/**
	 * Close Dialog
	 */
	function closeComposeDialog() {
		return contactDialog.type === 'edit' ? dispatch(closeEditContactDialog()) : dispatch(closeNewContactDialog());
	}

	/**
	 * Form Submit
	 */
	function onSubmit(data) {
		if (contactDialog.type === 'new') {
			dispatch(addContact(data));
		} else {
			dispatch(updateContact({ ...contactDialog.data, ...data }));
		}
		closeComposeDialog();
	}

	/**
	 * Remove Event
	 */
	function handleRemove() {
		dispatch(removeContact(id));
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24'
			}}
			{...contactDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={0}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{contactDialog.type === 'new' ? 'New Contact' : 'Details'}
					</Typography>
				</Toolbar>
				<div className="flex flex-col items-center justify-center pb-24">
					<Avatar className="w-96 h-96" alt="contact avatar" src={avatar} />
					{contactDialog.type === 'edit' && (
						<Typography variant="h6" color="inherit" className="pt-8">
							{name}
						</Typography>
					)}
				</div>
			</AppBar>
			<form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<Typography id='name' >
						<div className="min-w-48 pt-20">
							<Icon color="action">email</Icon>
						</div> Mentor: {contactDialog.data?.email ? contactDialog.data.email : ''}
						</Typography>
					</div>
					<div>
						<h6>Main Skills:</h6>
						{contactDialog.data?.skills.map(item => (
							<div>{item}</div>
						))}
					</div>
					
				</DialogContent>

				{contactDialog.type === 'new' ? (
					<DialogActions className="justify-between p-4 pb-16">
						<div className="px-16">
							<Button
								variant="contained"
								color="secondary"
								type="submit"
								disabled={_.isEmpty(dirtyFields) || !isValid}
							>
								Add
							</Button>
						</div>
					</DialogActions>
				) : (
					<DialogActions className="justify-between p-4 pb-16">
						{
							modal ? (
								<div>
									Choose Date: 
									<input type='date' name='date' onChange={(e) => {
										let data = {
											...mentor,
											date: e.target.value
										}
										setMentor(data)
									}}/>
									<button onClick={() => sendOrder(mentor)} >Order</button>
								</div>
							) : (
								<div className="px-16">
									<Button
										variant="contained"
										color="secondary"
										onClick={() => {
											setMentor({mentorId: contactDialog.data.id})
											setModal(true)}
										}
									>
										Book
									</Button>
								</div>
							)
						}
					</DialogActions>
				)}
			</form>

		</Dialog>
	);
}

function mapStateToProps({auth}){
    return { thisUser: auth.user }
}

export default withRouter(connect(mapStateToProps, null)(ContactDialog));

