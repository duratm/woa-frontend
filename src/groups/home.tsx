import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function home() {
    const [errors, setErrors] = useState("");
    const [groups, setGroups] = useState([{id: 0, name: ""}]);
    useEffect(() => {init()}, []);
    const navigate = useNavigate();
    let init = () => {
        fetch('http://127.0.0.1:3333/groups', {method: 'POST', credentials: 'include'}
        ).then(res => res.json()
        ).then(data => {
            console.log(data);
            setGroups(data);
        }).catch((error) => {
            console.log(error);
            setErrors(error.response?.data?.error);
        });
    }

    let goTo = (id: number) => (e: React.SyntheticEvent) => {
        e.preventDefault();
        navigate("/group/" + id);
    }


    return (
        <>
            <h1>Groups</h1>
            {groups.map(group => <article key={group.id}><button onClick={goTo(group.id)} >{group.name}</button></article>)}
            <p>{errors}</p>
        </>
    )
}

export default home;

