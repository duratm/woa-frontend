import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function register() {
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();
    let handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            email: { value: string };
            username: { value: string };
            password: { value: string };
        };
        axios.post(
            'http://127.0.0.1:3333/register',
            target,
            {withCredentials: true}
        ).then(() => {
            navigate("/home");
        }).catch((error) => {
            console.log(error);
            setErrors(error.response?.data?.error);
        });
    };
    return (
        <>
            <h1>Register</h1>
            <form onSubmit={handleSubmit} method="post">
                <label>
                    Email:{' '}
                    <input type="text" name="email" />
                </label>
                <label>
                    Username:{' '}
                    <input type="text" name="username" />
                </label>
                <label>
                    Password:{' '}
                    <input type="password" name="password" />
                </label>
                <input type="submit" value="Submit"  />

            </form>
            <p>{errors}</p>
        </>
    )
}

export default register;