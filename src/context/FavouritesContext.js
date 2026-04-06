import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavouritesContext = createContext(null);

export const FavouritesProvider = ({ children }) => {
    const [favourites, setFavourites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadFavourites();
    }, []);

    useEffect(() => {
        if (!isLoading) saveFavourites();
    }, [favourites]);

    const loadFavourites = async () => {
        try {
            const stored = await AsyncStorage.getItem('favourites');
            if (stored) setFavourites(JSON.parse(stored));
        } catch (error) {
            console.error('Load error', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveFavourites = async () => {
        try {
            await AsyncStorage.setItem('favourites', JSON.stringify(favourites));
        } catch (error) {
            console.error('Save error', error);
        }
    };

    const addFavourite = (recipe) => {
        setFavourites(prev => [...prev, recipe]);
    };

    const removeFavourite = (recipeId) => {
        setFavourites(prev => prev.filter(r => r.idMeal !== recipeId));
    };

    const isFavourite = (recipeId) => {
        return favourites.some(r => r.idMeal === recipeId);
    };

    return (
        <FavouritesContext.Provider
            value={{ favourites, addFavourite, removeFavourite, isFavourite, isLoading }}
        >
            {children}
        </FavouritesContext.Provider>
    );
};

export const useFavourites = () => {
    const context = useContext(FavouritesContext);
    if (!context) {
        throw new Error('useFavourites must be used inside FavouritesProvider');
    }
    return context;
};