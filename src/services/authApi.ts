import {defaultUser} from "../contexts/auth.tsx";

export async function hasAuthenticated() {
  return fetch(import.meta.env.VITE_API_ENDPOINT + "/auth/me", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  }).then((response) => {
    console.log(response);
    if (response.ok) {
      return response.json();
    } else {
      return defaultUser;
    }
  }).catch(()=> {
    return defaultUser;
  }).then((data) => {
    return data;
  });
}
