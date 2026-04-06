import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { searchRecipes, getCategories, filterByCategory } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import {useTheme} from "../context/ThemeContext";

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [touched, setTouched] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeTab, setActiveTab] = useState('search'); // 'search' | 'filter'
    const navigation = useNavigation();

    const { backgroundColor, textColor } = useTheme();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const cats = await getCategories();
            setCategories(cats);
        } catch (err) {
            console.error('Failed to load categories', err);
        }
    };

    const validateQuery = (text) => {
        if (!text.trim()) return 'Please enter a recipe name or ingredient';
        if (text.trim().length < 2) return 'Search must be at least 2 characters';
        return null;
    };

    const handleSearch = async () => {
        setTouched(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = async (category) => {
        if (selectedCategory === category.strCategory) {
            setSelectedCategory(null);
            setResults([]);
            return;
        }
        setSelectedCategory(category.strCategory);
        try {
            setLoading(true);
            setError(null);
            const filtered = await filterByCategory(category.strCategory);
            setResults(filtered);
        } catch (err) {
            setError('Failed to filter by category.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setError(null);
        setTouched(false);
        setSelectedCategory(null);
    };

    return (
        <View style={[styles.container, { backgroundColor }]}care>
            <Text style={styles.header} accessibilityRole="header">🔍 Search Recipes</Text>

            {/* Tab toggle */}
            <View style={styles.tabRow}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'search' && styles.tabActive]}
                    onPress={() => { setActiveTab('search'); handleClear(); }}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: activeTab === 'search' }}
                >
                    <Text style={[styles.tabText, activeTab === 'search' && styles.tabTextActive]}>
                        By Name
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'filter' && styles.tabActive]}
                    onPress={() => { setActiveTab('filter'); handleClear(); }}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: activeTab === 'filter' }}
                >
                    <Text style={[styles.tabText, activeTab === 'filter' && styles.tabTextActive]}>
                        By Category
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Search by name */}
            {activeTab === 'search' && (
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., chicken, pasta, cake..."
                        value={query}
                        onChangeText={setQuery}
                        onBlur={() => setTouched(true)}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                        accessibilityLabel="Search recipes by name"
                    />
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={handleSearch}
                        accessibilityLabel="Submit search"
                    >
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>
                    {query.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={handleClear}
                            accessibilityLabel="Clear search"
                        >
                            <Text style={styles.clearButtonText}>Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {touched && activeTab === 'search' && !query.trim() && (
                <Text style={styles.validationText} accessibilityRole="alert">
                    Please enter a search term
                </Text>
            )}

            {/* Filter by category */}
            {activeTab === 'filter' && (
                <View>
                    <Text style={[styles.filterLabel, {color: textColor}]}>Select a category:</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryRow}
                        accessibilityLabel="Category filter list"
                    >
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.idCategory}
                                style={[
                                    styles.categoryChip,
                                    selectedCategory === cat.strCategory && styles.categoryChipActive,
                                ]}
                                onPress={() => handleCategorySelect(cat)}
                                accessibilityLabel={`Filter by ${cat.strCategory}`}
                                accessibilityState={{ selected: selectedCategory === cat.strCategory }}
                            >
                                <Text style={[
                                    styles.categoryChipText,
                                    selectedCategory === cat.strCategory && styles.categoryChipTextActive,
                                ]}>
                                    {cat.strCategory}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Loading */}
            {loading && (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#f54c4c" accessibilityLabel="Loading results" />
                    <Text style={styles.loadingText}>
                        {activeTab === 'filter' ? 'Filtering recipes...' : 'Searching recipes...'}
                    </Text>
                </View>
            )}

            {/* Error */}
            {error && !loading && (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText} accessibilityRole="alert">{error}</Text>
                </View>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
                <>
                    <Text style={[styles.resultCount, {color: textColor}]}>Found {results.length} recipes</Text>
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

            {!loading && !error && results.length === 0 && (query || selectedCategory) && (
                <View style={styles.centerContainer}>
                    <Text style={[styles.noResultsText, {color: textColor}]}>No recipes found</Text>
                    <Text style={[styles.noResultsSubtext, {color: textColor}]}>Try a different search term or category</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        fontSize: 28, fontWeight: 'bold', textAlign: 'center',
        marginTop: 20, marginBottom: 12, color: '#f54c4c',
    },
    tabRow: {
        flexDirection: 'row', marginHorizontal: 16, marginBottom: 12,
        backgroundColor: '#eee', borderRadius: 8, padding: 4,
    },
    tab: {
        flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: 'center',
    },
    tabActive: { backgroundColor: '#f54c4c' },
    tabText: { fontSize: 14, color: '#666', fontWeight: '600' },
    tabTextActive: { color: 'white' },
    searchContainer: {
        flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8,
    },
    input: {
        flex: 1, backgroundColor: 'white', borderRadius: 8, padding: 12,
        marginRight: 8, borderWidth: 1, borderColor: '#ddd', fontSize: 16,
    },
    searchButton: {
        backgroundColor: '#f54c4c', paddingHorizontal: 20,
        borderRadius: 8, justifyContent: 'center',
    },
    searchButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    clearButton: {
        backgroundColor: '#999', paddingHorizontal: 16,
        borderRadius: 8, justifyContent: 'center', marginLeft: 8,
    },
    clearButtonText: { color: 'white', fontWeight: 'bold' },
    validationText: { color: '#f54c4c', fontSize: 12, marginHorizontal: 16, marginBottom: 8 },
    filterLabel: { fontSize: 14, color: '#666', marginHorizontal: 16, marginBottom: 8 },
    categoryRow: { paddingHorizontal: 16, paddingBottom: 12 },
    categoryChip: {
        backgroundColor: 'white', borderRadius: 20, paddingHorizontal: 16,
        paddingVertical: 8, marginRight: 8, borderWidth: 1, borderColor: '#ddd',
    },
    categoryChipActive: { backgroundColor: '#f54c4c', borderColor: '#f54c4c' },
    categoryChipText: { fontSize: 13, color: '#444' },
    categoryChipTextActive: { color: 'white', fontWeight: '600' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: '#666' },
    errorText: { color: '#f54c4c', fontSize: 16, textAlign: 'center', padding: 20 },
    resultCount: { paddingHorizontal: 16, paddingVertical: 8, color: '#666', fontSize: 14 },
    list: { paddingBottom: 20 },
    noResultsText: { fontSize: 18, color: '#666', textAlign: 'center' },
    noResultsSubtext: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 8 },
});

export default SearchScreen;
