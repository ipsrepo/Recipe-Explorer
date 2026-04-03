import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

export default function RecipeCard({
                               recipe,
                               onPress,
                               showFavouriteButton = false,
                               isFavourite = false,
                               onFavouritePress,
                           }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image
                source={{uri: recipe.strMealThumb}}
                style={styles.image}
                accessibilityLabel={`Image of ${recipe.strMeal}`}
            />
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {recipe.strMeal}
                </Text>
                {recipe.strCategory && (
                    <Text style={styles.category}>{recipe.strCategory}</Text>
                )}
            </View>
            {showFavouriteButton && onFavouritePress && (
                <TouchableOpacity
                    style={styles.favouriteButton}
                    onPress={onFavouritePress}
                    accessibilityLabel={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                >
                    <Text style={styles.favouriteIcon}>{isFavourite ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    category: {
        fontSize: 12,
        color: '#666',
    },
    favouriteButton: {
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    favouriteIcon: {
        fontSize: 24,
    },
});
