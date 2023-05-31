import React, {useEffect, useState} from 'react'
import styles from "../../static/css/component.module.css";


const SearchList = ({users}) => {
    const filtered = users.map((user) => <p>{user.username}</p>)
    return (
        <>
            {filtered}
        </>
    )
}

export default SearchList