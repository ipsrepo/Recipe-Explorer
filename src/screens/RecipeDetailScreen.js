import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getRecipeById } from '../services/api';
import { useFavourites } from '../context/FavouritesContext';

export default function RecipeDetailScreen() {
    const route = useRoute();
    const { recipeId } = route.params;
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addFavourite, removeFavourite, isFavourite } = useFavourites();

    useEffect(() => {
        loadRecipe();
    }, [recipeId]);

    const loadRecipe = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getRecipeById(recipeId);
            setRecipe(data);
        } catch (err) {
            setError('Failed to load recipe details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text style={styles.loadingText}>Loading recipe...</Text>
            </View>
        );
    }

    if (error || !recipe) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error || 'Recipe not found'}</Text>
            </View>
        );
    }

    const favourite = isFavourite(recipe.idMeal);

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />

            <View style={styles.content}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{recipe.strMeal}</Text>
                    <TouchableOpacity
                        style={styles.favouriteButton}
                        onPress={() => {
                            if (favourite) {
                                removeFavourite(recipe.idMeal);
                            } else {
                                addFavourite(recipe);
                            }
                        }}
                    >
                        <Text style={styles.favouriteIcon}>{favourite ? '❤️' : '🤍'}</Text>
                    </TouchableOpacity>
                </View>

                {recipe.strInstructions && (
                    <>
                        <Text style={styles.sectionTitle}>📝 Instructions</Text>
                        <Text style={styles.instructions}>{recipe.strInstructions}</Text>
                    </>
                )}

                {recipe.strYoutube && (
                    <TouchableOpacity style={styles.youtubeButton} onPress={() => Linking.openURL(recipe.strYoutube)}>
                        <Text style={styles.youtubeButtonText}>▶️ Watch on YouTube</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
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
    },
    image: {
        width: '100%',
        height: 300,
    },
    content: {
        padding: 20,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
    },
    favouriteButton: {
        padding: 8,
    },
    favouriteIcon: {
        fontSize: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#FF6B6B',
    },
    instructions: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        marginBottom: 20,
    },
    youtubeButton: {
        backgroundColor: '#FF0000',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 30,
    },
    youtubeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
    },
});