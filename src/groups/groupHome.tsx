import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

function groupHome() {
    const [errors, setErrors] = useState("");
    const [group, setGroup] = useState({id: 0, name: "", users: [{id: 0, username: ""}], paid: [{lender_id: 0, sum: 0}], borrowed: [{user_id: 0, sum: 0}]});
    const params = useParams();
    useEffect(() => {
        init()
    }, [""]);
    let init = () => {
        fetch('http://127.0.0.1:3333/groups/show', {method: 'POST', credentials: 'include', body: JSON.stringify({id: params.id})}
        ).then(res => res.json()
        ).then(data => {
            console.log(data);
            setGroup(data);
        }).catch((error) => {
            console.log(errors);
            setErrors(error.response?.data?.error);
        });
    }

    const invite = () => {
        //fetch('http://127.0.0.1:3333/
    }

    return (
        <>
            <h1>Group {group.name}</h1>
            {group.users.map(user => <article key={user.id}>{user.username} paid  {group.paid.find(item => item.lender_id === user.id)?.sum || 0} borrowed : {group.borrowed.find(item => item.user_id === user.id)?.sum || 0}</article>)}
            <button onClick={invite}>Invite</button>
        </>
    )
}

export default groupHome;