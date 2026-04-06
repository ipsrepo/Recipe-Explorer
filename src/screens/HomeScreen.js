import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import RecipeCard from '../components/RecipeCard';
import {getRandomRecipes} from '../services/api';
import {useNavigation} from '@react-navigation/native';
import ChefLogo from "../icons/logo";
import {useTheme} from "../context/ThemeContext";

const HomeScreen = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const {width} = useWindowDimensions();

    const {backgroundColor, textColor} = useTheme();

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
                <ActivityIndicator size="large" color="#f54c4c" accessibilityLabel="Loading recipes"/>
                <Text style={styles.loadingText}>Loading delicious recipes...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText} accessibilityRole="alert">{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={loadRandomRecipes}
                    accessibilityLabel="Retry loading recipes"
                >
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const numColumns = width >= 768 ? 2 : 1;

    return (
        <View style={[styles.container, {backgroundColor}]}>
            <Text style={styles.header} accessibilityRole="header"><ChefLogo width={100}/> Recipe Explorer</Text>
            <Text style={[styles.subheader, { color: textColor }]}>Discover amazing recipes!</Text>
            <FlatList
                key={numColumns}
                data={recipes}
                keyExtractor={(item) => item.idMeal}
                numColumns={numColumns}
                renderItem={({item}) => (
                    <RecipeCard
                        recipe={item}
                        onPress={() => navigation.navigate('RecipeDetail', {recipeId: item.idMeal})}
                        style={numColumns === 2 ? styles.gridCard : null}
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
    subheader: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        color: '#666',
    },
    list: {
        paddingBottom: 20,
    },
    gridCard: {
        flex: 1,
        margin: 8,
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
        fontSize: 16,
    },
    errorText: {
        color: '#f54c4c',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
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
        fontSize: 16,
    },
});

export default HomeScreen;
