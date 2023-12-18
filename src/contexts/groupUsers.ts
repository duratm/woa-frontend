import React from "react";

export default React.createContext({
  groupUsers: [{
    username: "",
    avatar_url: "",
    id: 0,
  }],
  setGroupUsers: (_user: any) => {
  },
})