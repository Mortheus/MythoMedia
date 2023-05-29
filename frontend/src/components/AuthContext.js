// import React, {useContext, useState, useEffect} from 'react'
//
// const AuthContext = React.createContext()
//
// const AuthProvider = ({children}) => {
//     const [userID, setUserID] = useState()
//
//     useEffect(async () => {
//         const getLoggedUser = () => {
//             const token = sessionStorage.getItem('token')
//             console.log(token)
//             return fetch('http://127.0.0.1:8000/api/user/decode', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({token}),
//             })
//                 .then((response) => response.json())
//                 .then((data) => data.user_id)
//                 .catch((error) => {
//                     console.error('Something went wrong', error);
//                     console.error(userID)
//                 });
//
//         };
//         const user = await getLoggedUser()
//         setUserID(user)
//     }, []);
//
//
//     return (
//         <AuthContext.Provider value={userID}>
//             {children}
//         </AuthContext.Provider>
//     )
// }
//
// export {AuthProvider, AuthContext}