import React from "react";

export default React.createContext({
  group: {
    id: 0,
    name: "",
    expenses: [{id: 0, name: "", lender_id: 0, borrowers: [{amount: 0, id: 0, is_paid: false}]}],
  },
  setGroup: (_user: any) => {
  }
})