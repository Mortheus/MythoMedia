import React, {useState} from 'react'
import Friend from "./Friend";

const FriendList = ({friends}) => {
    {friends.map((friend, index) => (
       <Friend
          username={friend.username}
          profile_picture={friend.profile_picture}
          mutual_friends={friend.mutual_friends}/>
      ))}

}