import React, {useState} from 'react';
import Scroll from './Scroll';
import SearchList from './SearchList';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import useFetchUsers from "./useFetchUsers";
import PerfectScrollbar from "react-perfect-scrollbar";
import {Dropdown} from 'react-bootstrap'
import SearchIcon from '@mui/icons-material/Search';
import {InputAdornment} from "@mui/material";

function Search() {

    const [searchField, setSearchField] = useState("");
    const {users, isLoading} = useFetchUsers()
    console.log(users)

    function searchList() {
        if (isLoading) {
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        } else {
            const filteredPersons = users.filter((user) =>
                user.username.toLowerCase().includes(searchField.toLowerCase())
            );
            if (searchField.trim() === '') {
                return null;
            } else if (filteredPersons.length === 0) {
                return <div>No results found.</div>;
            } else {
                return (
                    <Dropdown.Menu>
                        <PerfectScrollbar style={{height: '200px'}}>
                            <SearchList users={filteredPersons} onClickCallback={setSearchField}/>
                        </PerfectScrollbar>
                    </Dropdown.Menu>
                );
            }
        }
    }

    return (
        <Dropdown>
            <Dropdown.Toggle variant="dark" id="search-dropdown">
                Search People
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-right">
                <div className="pa2">
                    <TextField
                        type="search"
                        placeholder="Search People"
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        InputProps={{
                            endAdornment: (<InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>)
                        }}
                        style={{width: '200px'}}
                    />
                    {searchList()}
                </div>
            </Dropdown.Menu>
        </Dropdown>

    );

}

export default Search