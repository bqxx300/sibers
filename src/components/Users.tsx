import axios from 'axios'
import React from 'react'
import '../css/user.css'
import { IUser } from '../types'

export function Users(){

	//users.
	const [users, setUsers] = React.useState <null | IUser[]> (null)

	//user search.
	const [search, setSearch] = React.useState <string> ('')

	//if the localStorage is empty, then we send a request to the server, otherwise we take from localStorage.
	React.useEffect(() => {
		if(localStorage.length !== 0){
			setUsers(JSON.parse(localStorage.getItem('users') || ''))
		} else{
			axios.get('https://demo.sibers.com/users')
			.then(r => {
				setUsers(r.data)
				localStorage.setItem('users', JSON.stringify(r.data))
			})
			.catch(e => console.log(e))
		}
	}, [])

	//sort array of users.
	function sort(array: IUser[]): IUser[] {
		if(array.length < 2) return array
		const value = array[0]
		const less = array.slice(1).filter(i => i.name <= value.name)
		const more = array.slice(1).filter(i => i.name > value.name)
		return [...sort(less), value, ...sort(more)]
	}

	return <div className="container">

		<div className="filters">
			<button className="sort" onClick={() => {
				if(users !== null){
					setUsers(sort(users))
				}
			}}>Sort</button>
			<input className="search" type="text" value={search} onChange={e => setSearch(e.target.value)} />
		</div>

		<div className="users">
			{
				users === null ?
				null :
				users.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map(i => {
					return <div className="user" key={i.id}>
						<p className="name">{i.name}</p>
						<p className="phone">{i.phone}</p>
						<ul className="settings">
							<li>
								<input type="text" value={i.name} onChange={e => {
									const newUsers = users.map(j => j.id !== i.id ? j : {...j, name: e.target.value})
									setUsers(newUsers)
									localStorage.setItem('users', JSON.stringify(newUsers))
								}} />
								<input type="text" value={i.phone} onChange={e => {
									const newUsers = users.map(j => j.id !== i.id ? j : {...j, phone: e.target.value})
									setUsers(newUsers)
									localStorage.setItem('users', JSON.stringify(newUsers))
								}} />
							</li>
						</ul>
					</div>
				})
			}
		</div>

	</div>
}
