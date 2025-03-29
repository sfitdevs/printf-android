import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AppwriteContext } from '../appwrite/AppWriteContext';
import Loading from '../components/loading';
import  AppStack  from './AppStack';
import  AuthStack  from './AuthStack';

export const Router = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { appwrite, isLoggedIn, setIsLoggedIn } = useContext(AppwriteContext)

    useEffect(() => {
        // Check if user is already logged in on app start
        const checkUserStatus = async () => {
            try {
                const user = await appwrite.getCurrentUser();
                if (user) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.log('User status check error:', error);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkUserStatus();
    }, [appwrite, setIsLoggedIn])

    if (isLoading) {
        return <Loading />
    }

    return (
        <NavigationContainer>
            {isLoggedIn ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    )
}