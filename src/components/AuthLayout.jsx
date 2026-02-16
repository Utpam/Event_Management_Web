import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router'
import {useAuth} from '../../AuthContext/UserAuthContext';

function AuthLayout({authentication = true, children}) {
    const {authStatus, isLoading} = useAuth();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) {
            return; // Wait for session check to complete
        }
        
        if(authentication && authStatus !== authentication ){
            navigate("/login");
        }   
        else if (!authentication && authStatus !== authentication){
            navigate("/");
        }
        setLoading(false)
    }, [authStatus, navigate, authentication, isLoading]);

    return (
        <>
        {
            loading || isLoading ? <h1>Loading...</h1> : <>{children}</>
        }
    </>
    );
}

export default AuthLayout