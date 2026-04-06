import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {FavouritesProvider} from "./src/context/FavouritesContext";
import {ThemeProvider} from "./src/context/ThemeContext";

export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <FavouritesProvider>
                    <StatusBar style="auto"/>
                    <AppNavigator/>
                </FavouritesProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}