import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {FavouritesProvider} from "./src/context/FavouritesContext";

export default function App() {
    return (
        <SafeAreaProvider>
            <FavouritesProvider>
                <StatusBar style="auto" />
                <AppNavigator />
            </FavouritesProvider>
        </SafeAreaProvider>
    );
}