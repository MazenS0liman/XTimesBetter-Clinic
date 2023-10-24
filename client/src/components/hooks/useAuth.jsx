import React, { useContext, useState } from 'react';

const AuthContext = React.createContext();
const AuthUpdateContext = React.createContext();
const UsernameContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function useAuthUpdate() {
    return useContext(AuthUpdateContext);
}
export function useUsername() {
    return useContext(UsernameContext);
}

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState("Bearer  ");
    const [refreshToken, setRefreshToken] = useState("");
    const [username, setUsername] = useState("");

    function updateAccessToken(token) {
        setAccessToken(token);
    }

    function updateRefreshToken(token) {
        setRefreshToken(token);
    }

    return (
        <AuthContext.Provider value={{accessToken: accessToken, refreshToken: refreshToken}}>
            <AuthUpdateContext.Provider value={{updateAccessToken: updateAccessToken, updateRefreshToken: updateRefreshToken}}>
                <UsernameContext.Provider value={{username: username, setUsername: setUsername}}>
                    {children}
                </UsernameContext.Provider>
            </AuthUpdateContext.Provider>
        </AuthContext.Provider>
    )
}