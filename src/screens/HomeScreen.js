import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { getRandomRecipes } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        loadRandomRecipes();
    }, []);

    const loadRandomRecipes = async () => {
        try {
            setLoading(true);
            setError(null);
            const randomRecipes = await getRandomRecipes(6);
            setRecipes(randomRecipes);
        } catch (err) {
            setError('Failed to load recipes. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text style={styles.loadingText}>Loading delicious recipes...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>🍳 Recipe Explorer</Text>
            <Text style={styles.subheader}>Discover amazing recipes!</Text>
            <FlatList
                data={recipes}
                keyExtractor={(item) => item.idMeal}
                renderItem={({ item }) => (
                    <RecipeCard
                        recipe={item}
                        onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.idMeal })}
                    />
                )}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

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
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 8,
        color: '#FF6B6B',
    },
    subheader: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        color: '#666',
    },
    list: {
        paddingBottom: 20,
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

export default HomeScreen;