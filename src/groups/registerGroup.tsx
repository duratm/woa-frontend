import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function registerGroup() {
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();
    let handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            name: { value: string };
        };
        fetch('http://127.0.0.1:3333/groups/create',
            {method: 'POST',
                credentials: 'include',
                body: JSON.stringify({name: target.name.value})}
        ).then(res => res.json()
        ).then(data => {
            console.log(data);
            navigate("/home");
        }).catch((error) => {
            console.log(error);
            setErrors(error.response?.data?.error);
        });
    }


    return (
        <>
            <h1>Create Group</h1>
            <form onSubmit={handleSubmit} method="post">
                <label>
                    Name:{' '}
                    <input type="text" name="name" />
                </label>
                <input type="submit" value="Submit"  />
            </form>
            <p>{errors}</p>
        </>
    )
}

export default registerGroup;