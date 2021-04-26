import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AxiosInstance from 'API/Api';

function AboutTab({user}) {

	const [data, setData] = useState(null);
	const [modal, setModal] = useState(false);
	const [arr, setArr] = useState([]);

	const [trigger, setTrigger] = useState(false);
	const [trigger2, setTrigger2] = useState(false);

	function handleIntInp(e){
			let interests = [...data.interests]
			interests.push(e.target.value)
			let obj = {
				...data,
				interests: [...interests]
			}
			setArr(obj)
	}

	//mentor skills input handle
	function handleSklInp(e){
		let skills = [...data.skills]
		skills.push(e.target.value)
		let obj = {
			...data,
			skills: [...skills]
		}
		setArr(obj)
	}

	function handleNameLastInp(e){
		let obj = {
			...data,
			[e.target.name]: e.target.value
		}
		setArr(obj);
	}

	function handleSaveLastName(){
		setData(arr)
		setTrigger(!trigger)
		setTrigger2(!trigger)
	}

	function handleSave(){
		setData(arr)
		setModal(false);
		setTrigger(!trigger)
	}

	useEffect(() => {
		updateUser()
	}, [trigger])

	useEffect(() => {
		console.log('use effect happened')
		setData(user)
	}, []);

	if (!data) {
		return null;
	}

	let { name, lastName, email, birthday, interests, skills, mentor } = data;

	function updateUser(){
		if(user.skills){
			if(trigger === true){
				axios.put('http://localhost:8080/api/user/put/skills', data)
		   }
		} else {
			if(trigger === true){
			 	axios.put('http://localhost:8080/api/user/put', data)
			}
			if(trigger2 === true){
			 	axios.put('http://localhost:8080/api/user/update', data)
			}
		}
	}

	const container = {
		show: {
			transition: {
				staggerChildren: 0.05
			}
		}
	};

	const item = { 
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	return (
		<motion.div variants={container} initial="hidden" animate="show">
			<div className="md:flex max-w-2xl">
				<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
					{/* <Card component={motion.div} variants={item} className="w-full mb-32 rounded-16 shadow">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12 font-medium">
									General Information
								</Typography>
							</Toolbar>
						</AppBar>

						<CardContent>

							<div className="mb-24">
								<Typography className="font-semibold mb-4 text-15">Name</Typography>
								<Typography>{name}</Typography>
							</div>

							<div className="mb-24">
								<Typography className="font-semibold mb-4 text-15">Last Name</Typography>
								<Typography>{lastName}</Typography>
							</div>

							<div className="mb-24">
								<Typography className="font-semibold mb-4 text-15">Birthday</Typography>
								<Typography>{birthday}</Typography>
							</div>

						</CardContent>
					</Card> */}

					<Card component={motion.div} variants={item} className="w-full mb-32 rounded-16 shadow">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12 font-medium">
									Fields:
								</Typography>
							</Toolbar>
						</AppBar>

						<Button onClick={() => setModal(true)} >Add Field:</Button>

						{
							modal ? (
								<div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(40,40,40,0.5)'}} >
									<div style={{backgroundColor: 'white', margin: 'auto', marginTop: '40vh' ,height: '30vh', width: '30vw'}} >
										
										{
											skills ? (
												<>
													Add skills here:
													Input:<input onChange={handleSklInp} />
													<Button onClick={handleSave} >Save</Button>
												</>
											) : (
												<>
													Add interests here:
													Input:<input onChange={handleIntInp} />
													<Button onClick={handleSave} >Save</Button>
												</>
											)
										}
									</div>
								</div>
							) : null
						}

						<CardContent>
							<div className="mb-24">
								<table className="">
									<tbody>
										{
											interests ? (
												interests.map(inter => (
													<tr key={inter}>
														<td>
															<Typography>{inter}</Typography>
														</td>
													</tr> 
												))
											) : (
												skills.map(inter => (
													<tr key={inter}>
														<td>
															<Typography>{inter}</Typography>
														</td>
													</tr> 
												))
											)
										}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>

					<Card component={motion.div} variants={item} className="w-full mb-32 rounded-16 shadow">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12 font-medium">
									Contact
								</Typography>
							</Toolbar>
						</AppBar>

						<CardContent>

							<div className="mb-24">
								<Typography className="font-semibold mb-4 text-15">Email</Typography>
								<Typography>{email}</Typography>
							</div>

						</CardContent>
					</Card>
				</div>

			</div>
		</motion.div>
	);
}

export default AboutTab;
