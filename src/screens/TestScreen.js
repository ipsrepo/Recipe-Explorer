import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useFavourites } from '../context/FavouritesContext';

export default function TestScreen() {
    const { favourites, addFavourite, removeFavourite, isFavourite } = useFavourites();

    const testRecipe = {
        idMeal: 'test1',
        strMeal: 'Test Recipe',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/wyrqqq1468233628.jpg',
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Context Test</Text>
            <Text>Favourites count: {favourites.length}</Text>
            <Button
                title="Add Test Recipe"
                onPress={() => addFavourite(testRecipe)}
            />
            <Button
                title="Remove Test Recipe"
                onPress={() => removeFavourite('test1')}
            />
            <Text style={styles.status}>
                Is test recipe favourite? {isFavourite('test1') ? 'Yes' : 'No'}
            </Text>
            {favourites.map((item) => (
                <Text key={item.idMeal}>📌 {item.strMeal}</Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    status: {
        marginTop: 20,
        fontSize: 16,
    },
});