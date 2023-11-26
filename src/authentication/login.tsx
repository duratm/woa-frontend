import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function login() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    let handleLogin = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            email: { value: string };
            password: { value: string };
        };
        axios.post(
            'http://127.0.0.1:3333/login',
            target,
            {withCredentials: true}
        ).then(() => {
            navigate("/home");
        }).catch((error) => {
            setMessage(error.response?.data?.error);
        });
    };

    let logout = () => {
            axios.post(
            'http://127.0.0.1:3333/logout',
            {},
            {withCredentials: true}
        ).then((response) => {
            setMessage(response.data.message);
            localStorage.removeItem('token');
        }).catch((error) => {
            console.log(error);
            setMessage(error.response?.data?.error || "Vous n'êtes pas connecté");
        });
    }

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handleLogin} method="post">
                <label>
                    Email:{' '}
                    <input type="text" name="email" />
                </label>
                <label>
                    Password:{' '}
                    <input type="password" name="password" />
                </label>
                <input type="submit" value="Submit"  />

            </form>
            <button onClick={logout}>Logout</button>

            <p>{message}</p>

        </>
    )
}

export default login;