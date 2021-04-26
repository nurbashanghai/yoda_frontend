import FuseUtils from '@fuse/utils';
import _ from '@lodash';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { selectTodos } from './store/todosSlice';
import TodoListItem from './TodoListItem';
import {withRouter, useHistory} from 'react-router-dom';
import axios from 'axios';

function TodoList(props) {
	const history = useHistory()
	const todos = useSelector(selectTodos);
	const searchText = useSelector(({ todoApp }) => todoApp.todos.searchText);
	const orderBy = useSelector(({ todoApp }) => todoApp.todos.orderBy);
	const orderDescending = useSelector(({ todoApp }) => todoApp.todos.orderDescending);
	const [filteredData, setFilteredData] = useState(null);
	const [orders, setOrders] = useState([]);

	async function getOrders(){
		const token = 'Bearer ' + localStorage.getItem('jwt_access_token');
		await axios.get('http://localhost:8080/api/user/orders',
			{
				headers: {'Authorization': token}
			})
		.then(res => {
			console.log(res.data, ' res admin')
			setOrders(res.data)
		}).catch((err) => console.log(err));
	}

	useEffect(() => {
		function getFilteredArray(entities, _searchText) {
			if (_searchText.length === 0) {
				return todos;
			}
			return FuseUtils.filterArrayByString(todos, _searchText);
		}

		if (todos) {
			setFilteredData(
				_.orderBy(getFilteredArray(todos, searchText), [orderBy], [orderDescending ? 'desc' : 'asc'])
			);
		}

		if(props.thisUser.email !== 'admin@gmail.com'){ // change to .env
			history.push('/profile')
		} else {
			getOrders()
		}

	}, [todos, searchText, orderBy, orderDescending]);

	if (!filteredData) {
		return null;
	}

	if (filteredData.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					There are no todos!
				</Typography>
			</motion.div>
		);
	}

	const container = {
		show: {
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	return (
		<div>
			<h6 style={{padding: '20px'}} >ADMIN PANEL</h6>
			<ul>
				{
					orders.map((item, index ) => (
						<div style={{padding: '20px'}} key={Date.now() + index} >
							<h6>Customer: {item.user.email}</h6>
							<h6>Mentor: {item.mentor.email}</h6>
							<div>Customer ordered this mentor to {item.date}</div>
							<div>Pls verify orders with customer</div>
						</div>
					))
				}
			</ul>
		{/* // <List className="p-0">
		// 	<motion.div variants={container} initial="hidden" animate="show">
		// 		{filteredData.map(todo => (
		// 			<motion.div variants={item} key={todo.id}>
		// 				<TodoListItem todo={todo} />
		// 			</motion.div>
		// 		))}
		// 	</motion.div>
		// </List> */}
		</div>
	);
}

function mapStateToProps({auth}){
    return { thisUser: auth.user }
}

export default withRouter(connect(mapStateToProps, null)(TodoList));
