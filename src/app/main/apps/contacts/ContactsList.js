import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import {Button} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContactsMultiSelectMenu from './ContactsMultiSelectMenu';
import ContactsTable from './ContactsTable';
import { openEditContactDialog, removeContact, toggleStarredContact, selectContacts } from './store/contactsSlice';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

function ContactsList(props) {
	const dispatch = useDispatch();
	// const contacts = useSelector(selectContacts);
	const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);
	const user = useSelector(({ contactsApp }) => contactsApp.user);
	const [contacts, setContacts] = useState([]);
	console.log(user);
	console.log(props);

	useEffect(() => {
		if(props.thisUser.interests && props.thisUser.interests[0]){
			fetchMentors(props.thisUser.interests[0])
		}
	},[])

	function fetchMentors(field){
		console.log(field, ' interests, lol');
		const URL = 'http://localhost:8080/api/user/getmentors'
		axios.get(URL, {
			params: {
					interests: `${field}`
			}
		}).then(res => setContacts(res.data)).catch(err => console.log(err))
	}

	const [filteredData, setFilteredData] = useState(null);

	const columns = useMemo(
		() => [
			{
				Header: ({ selectedFlatRows }) => {
					const selectedRowIds = selectedFlatRows.map(row => row.original.id);

					return (
						selectedFlatRows.length > 0 && <ContactsMultiSelectMenu selectedContactIds={selectedRowIds} />
					);
				},
				accessor: 'avatar',
				Cell: ({ row }) => {
					return <Avatar className="mx-8" alt={row.original.name} src={row.original.avatar} />;
				},
				className: 'justify-center',
				width: 64,
				sortable: false
			},
			{
				Header: 'Mentor',
				accessor: 'email',
				className: 'font-medium',
				sortable: true
			},
			{
				Header: 'Field',
				accessor: 'skills',
				sortable: true
			},
			{
				Header: 'Rating',
				accessor: 'phone',
				sortable: true
			},
			{
				id: 'action',
				width: 128,
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{/* <IconButton
							onClick={ev => {
								ev.stopPropagation();
								dispatch(toggleStarredContact(row.original.id));
							}}
						>
							{user.starred && user.starred.includes(row.original.id) ? (
								<Icon className="text-yellow-700">star</Icon>
							) : (
								<Icon>star_border</Icon>
							)}
						</IconButton>
						<IconButton
							onClick={ev => {
								ev.stopPropagation();
								dispatch(removeContact(row.original.id));
							}}
						>
							<Icon>delete</Icon>
						</IconButton> */}
					</div>
				)
			}
		],
		[dispatch]
	);

	useEffect(() => {
		function getFilteredArray(entities, _searchText) {
			if (_searchText.length === 0) {
				return contacts;
			}
			return FuseUtils.filterArrayByString(contacts, _searchText);
		}

		if (contacts) {
			setFilteredData(getFilteredArray(contacts, searchText));
		}
	}, [contacts, searchText]);

	if (!filteredData) {
		return null;
	}

	if (filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					There are no contacts!
				</Typography>
			</div>
		);
	}

	return (
		<motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>
			<h6>Choose field:</h6>
			{
				props.thisUser.interests ? (
					props.thisUser.interests.map(item => (
						<Button key={item + Date.now()} onClick={() => fetchMentors(item)}>{item}</Button>
					))
				) : null
			}

			<ContactsTable
				columns={columns}
				data={filteredData}
				onRowClick={(ev, row) => {
					if (row) {
						dispatch(openEditContactDialog(row.original));
					}
				}}
			/>
		</motion.div>
	);
}

function mapStateToProps({auth}){
    return { thisUser: auth.user }
}

export default withRouter(connect(mapStateToProps, null)(ContactsList));
