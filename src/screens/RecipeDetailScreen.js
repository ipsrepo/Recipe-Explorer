import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {getRecipeById} from '../services/api';
import {useFavourites} from '../context/FavouritesContext';
import {useTheme} from "../context/ThemeContext";

const getIngredients = (recipe) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`);
        }
    }
    return ingredients;
};

export default function RecipeDetailScreen() {
    const route = useRoute();
    const {recipeId} = route.params;
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {addFavourite, removeFavourite, isFavourite} = useFavourites();
    const {width} = useWindowDimensions();

    const {backgroundColor, textColor} = useTheme();

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
                <ActivityIndicator size="large" color="#f54c4c" accessibilityLabel="Loading recipe"/>
                <Text style={styles.loadingText}>Loading recipe...</Text>
            </View>
        );
    }

    if (error || !recipe) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText} accessibilityRole="alert">{error || 'Recipe not found'}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadRecipe}
                                  accessibilityLabel="Retry loading recipe">
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const favourite = isFavourite(recipe.idMeal);
    const ingredients = getIngredients(recipe);
    const imageHeight = width >= 768 ? 400 : 260;

    return (
        <ScrollView style={[styles.container, {backgroundColor}]}>
            <Image
                source={{uri: recipe.strMealThumb}}
                style={[styles.image, {height: imageHeight}]}
                accessibilityLabel={`Photo of ${recipe.strMeal}`}
            />

            <View style={styles.content}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, {color: textColor}]} accessibilityRole="header">{recipe.strMeal}</Text>
                    <TouchableOpacity
                        style={styles.favouriteButton}
                        onPress={() => favourite ? removeFavourite(recipe.idMeal) : addFavourite(recipe)}
                        accessibilityLabel={favourite ? 'Remove from favourites' : 'Add to favourites'}
                        accessibilityRole="button"
                        accessibilityState={{selected: favourite}}
                    >
                        <Text style={styles.favouriteIcon}>{favourite ? '❤️' : '🤍'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Meta tags */}
                <View style={styles.metaRow}>
                    {recipe.strCategory && (
                        <View style={styles.metaBadge}>
                            <Text style={styles.metaBadgeText}>🍽️ {recipe.strCategory}</Text>
                        </View>
                    )}
                    {recipe.strArea && (
                        <View style={styles.metaBadge}>
                            <Text style={styles.metaBadgeText}>🌍 {recipe.strArea}</Text>
                        </View>
                    )}
                </View>

                {/* Ingredients */}
                {ingredients.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>🛒 Ingredients</Text>
                        <View style={styles.ingredientsGrid}>
                            {ingredients.map((item, index) => (
                                <View key={index} style={styles.ingredientItem}>
                                    <Text style={styles.ingredientBullet}>•</Text>
                                    <Text style={[styles.ingredientText, {color: textColor}]}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {/* Instructions */}
                {recipe.strInstructions && (
                    <>
                        <Text style={styles.sectionTitle}>📝 Instructions</Text>
                        <Text style={[styles.instructions, {color: textColor}]}>{recipe.strInstructions}</Text>
                    </>
                )}

                {/* YouTube link */}
                {recipe.strYoutube && (
                    <TouchableOpacity
                        style={styles.youtubeButton}
                        onPress={() => Linking.openURL(recipe.strYoutube)}
                        accessibilityLabel="Watch recipe video on YouTube"
                        accessibilityRole="link"
                    >
                        <Text style={styles.youtubeButtonText}>▶️ Watch on YouTube</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    image: {
        width: '100%'
    },
    content: {
        padding: 20
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        color: '#222'
    },
    favouriteButton: {
        padding: 8
    },
    favouriteIcon: {
        fontSize: 32,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20
    },
    metaBadge: {
        backgroundColor: '#FFF0EE',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#FFD0CC',
    },
    metaBadgeText: {
        fontSize: 13,
        color: '#CC4444',
        fontWeight: '500'
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8,
        color: '#f54c4c',
    },
    ingredientsGrid: {
        marginBottom: 20
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6
    },
    ingredientBullet: {
        color: '#f54c4c',
        fontSize: 16,
        marginRight: 8,
        marginTop: 1
    },
    ingredientText: {
        fontSize: 15,
        color: '#333',
        flex: 1,
        lineHeight: 22
    },
    instructions: {
        fontSize: 15,
        lineHeight: 24,
        color: '#333',
        marginBottom: 20
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
        fontWeight: 'bold'
    },
    loadingText: {
        marginTop: 12,
        color: '#666'
    },
    errorText: {
        color: '#f54c4c',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16
    },
    retryButton: {
        backgroundColor: '#f54c4c',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
});
