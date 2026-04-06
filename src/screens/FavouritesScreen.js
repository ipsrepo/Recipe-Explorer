import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFavourites } from '../context/FavouritesContext';
import RecipeCard from '../components/RecipeCard';
import {useTheme} from "../context/ThemeContext";

export default function FavouritesScreen() {
    const { favourites, removeFavourite, isLoading } = useFavourites();
    const navigation = useNavigation();
    const { backgroundColor, textColor } = useTheme();

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#f54c4c" />
            </View>
        );
    }

    if (favourites.length === 0) {
        return (
            <View style={[styles.centerContainer, { backgroundColor }]}>
                <Text style={[styles.emptyText, {color: textColor}]}>💔 No favourites yet</Text>
                <Text style={[styles.emptySubtext, {color: textColor}]}>
                    Go to Search and add some delicious recipes to your favourites!
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={styles.header}>❤️ My Favourite Recipes</Text>
            <Text style={[styles.count, {color: textColor}]}>{favourites.length} saved recipes</Text>
            <FlatList
                data={favourites}
                keyExtractor={(item) => item.idMeal}
                renderItem={({ item }) => (
                    <RecipeCard
                        recipe={item}
                        onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.idMeal })}
                        showFavouriteButton={true}
                        isFavourite={true}
                        onFavouritePress={() => removeFavourite(item.idMeal)}
                    />
                )}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 8,
        color: '#f54c4c',
    },
    count: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
        color: '#666',
    },
    list: {
        paddingBottom: 20,
    },
    emptyText: {
        fontSize: 24,
        color: '#999',
        textAlign: 'center',
        marginBottom: 12,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});