import React, {useState} from 'react';
import Scroll from './Scroll';
import SearchList from './SearchList';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function Search({details}) {

    const [searchField, setSearchField] = useState("");
    const [userSelect, setUserSelect] = useState(false)
    const [postSelect, setPostSelect] = useState(false)

    const filteredPersons = details.filter(
        user => {
            return (
                user
                    .username
                    .toLowerCase()
                    .includes(searchField.toLowerCase())
            );
        }
    );
    console.log(details)

    function searchList() {
        return (
            <Scroll>
                <SearchList users={filteredPersons}/>
            </Scroll>
        );

        // if (postSelect) {
        //     return (
        //         <Scroll>
        //             <SearchList users={filteredPersons}/>
        //         </Scroll>
        //     );
        // }
    }

    return (
        <div className="pa2">
            <TextField
                type="search"
                placeholder="Search People"
                onChange={(e) => setSearchField(e.target.value)}/>
            {searchList()}
            {/*<Button onClick={() => setUserSelect(true)}>Users</Button>*/}
            {/*<Button onClick={() => setPostSelect(true)}>Posts</Button>*/}
        </div>

    );
}

export default Search