import React from 'react';

// Axios
import axios from 'axios';

// Styles
import styles from './chatBar.module.css';

// Hooks
import { useState, useEffect } from 'react';

// User Defined Hooks
import { ChatTab } from '../chatTab/chatTab';

export const ChatBar = ({ selectedUser, userType }) => {
  const [users, setUsers] = useState([]);
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
      await axios ({
        method: 'get',
        url: `http://localhost:5000/${userType}/chat/users`,
        headers: {
            "Content-Type": "application/json",
            'Authorization': accessToken,
        },
      })
      .then((res) => {
        setUsers(res.data.users);
        console.log("users");
        console.log(res.data.users);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={styles['chat__sidebar']}>
      <div>
        <h4 className={styles['chat__header']}>USERS</h4>
        <div className="chat__users">
          {
            users.map((user, id) => {
              return (
                <ChatTab
                  key={id}
                  username={user.username}
                  type={user.type}
                  onClick={selectedUser}
                />
              );
            })
          }
        </div>
      </div>
    </div>
  );
}

export default ChatBar;