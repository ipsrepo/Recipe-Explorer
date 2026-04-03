import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { searchRecipes } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [touched, setTouched] = useState(false);
    const navigation = useNavigation();

    const validateQuery = (text) => {
        if (!text.trim()) return 'Please enter a recipe name or ingredient';
        if (text.trim().length < 2) return 'Search must be at least 2 characters';
        return null;
    };

    const handleSearch = async () => {
        const validationError = validateQuery(query);
        if (validationError) {
            Alert.alert('Validation Error', validationError);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const searchResults = await searchRecipes(query);
            setResults(searchResults);
            if (searchResults.length === 0) {
                Alert.alert('No Results', 'Try searching for something else');
            }
        } catch (err) {
            setError('Failed to search recipes. Please check your connection.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setError(null);
        setTouched(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>🔍 Search Recipes</Text>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., chicken, pasta, cake..."
                    value={query}
                    onChangeText={setQuery}
                    onBlur={() => setTouched(true)}
                    accessibilityLabel="Search recipes input"
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
                {query.length > 0 && (
                    <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                        <Text style={styles.clearButtonText}>Clear</Text>
                    </TouchableOpacity>
                )}
            </View>

            {touched && !query.trim() && (
                <Text style={styles.validationText}>Please enter a search term</Text>
            )}

            {loading && (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#FF6B6B" />
                    <Text style={styles.loadingText}>Searching recipes...</Text>
                </View>
            )}

            {error && !loading && (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {!loading && results.length > 0 && (
                <>
                    <Text style={styles.resultCount}>Found {results.length} recipes</Text>
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.idMeal}
                        renderItem={({ item }) => (
                            <RecipeCard
                                recipe={item}
                                onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.idMeal })}
                            />
                        )}
                        contentContainerStyle={styles.list}
                    />
                </>
            )}

            {!loading && !error && results.length === 0 && query && (
                <View style={styles.centerContainer}>
                    <Text style={styles.noResultsText}>No recipes found</Text>
                    <Text style={styles.noResultsSubtext}>Try a different search term</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
        color: '#FF6B6B',
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    searchButton: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    clearButton: {
        backgroundColor: '#999',
        paddingHorizontal: 16,
        borderRadius: 8,
        justifyContent: 'center',
        marginLeft: 8,
    },
    clearButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    validationText: {
        color: '#FF6B6B',
        fontSize: 12,
        marginHorizontal: 16,
        marginBottom: 8,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    resultCount: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        color: '#666',
        fontSize: 14,
    },
    list: {
        paddingBottom: 20,
    },
    noResultsText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
    noResultsSubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default SearchScreen;