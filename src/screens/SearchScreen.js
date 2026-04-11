import React, {useState, useEffect, useRef, useCallback} from 'react';
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
    Keyboard,
} from 'react-native';
import RecipeCard from '../components/RecipeCard';
import {searchRecipes, getCategories, filterByCategory} from '../services/api';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [touched, setTouched] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeTab, setActiveTab] = useState('search'); // 'search' | 'filter'
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const navigation = useNavigation();
    const {backgroundColor, textColor} = useTheme();
    const textInputRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        loadCategories();
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
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

    const fetchSuggestions = async (text) => {
        try {
            setShowSuggestions(true);
            setError(null);
            const searchResults = await searchRecipes(text);
            const uniqueMeals = [];
            const mealNames = new Set();
            if (searchResults && Array.isArray(searchResults)) {
                for (const meal of searchResults) {
                    if (meal.strMeal && !mealNames.has(meal.strMeal)) {
                        mealNames.add(meal.strMeal);
                        uniqueMeals.push({
                            idMeal: meal.idMeal,
                            strMeal: meal.strMeal,
                            strMealThumb: meal.strMealThumb,
                        });
                        if (uniqueMeals.length >= 8) break;
                    }
                }
            }
            setSuggestions(uniqueMeals);
        } catch (err) {
            console.error('Autocomplete error:', err);
            setSuggestions([]);
        }
    };

    const handleQueryChange = (text) => {
        setQuery(text);
        setTouched(true);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (text.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        debounceRef.current = setTimeout(() => {
            fetchSuggestions(text);
        }, 500);
    };

    const handleSuggestionSelect = async (meal) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setQuery(meal.strMeal);
        setShowSuggestions(false);
        setSuggestions([]);
        try {
            setLoading(true);
            setError(null);
            const searchResults = await searchRecipes(meal.strMeal);
            setResults(searchResults);
            Keyboard.dismiss();
            if (searchResults.length === 0) {
                Alert.alert('No Results', `No recipes found for "${meal.strMeal}"`);
            }
        } catch (err) {
            setError('Failed to search recipes. Please check your connection.');
            Keyboard.dismiss();
            Alert.alert('Error', 'Failed to search recipes');
        } finally {
            setLoading(false);
        }
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
            setSuggestions([]);
            setShowSuggestions(false);
            Keyboard.dismiss();
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
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setQuery('');
        setResults([]);
        setError(null);
        setTouched(false);
        setSelectedCategory(null);
        setSuggestions([]);
        setShowSuggestions(false);
        Keyboard.dismiss();
    };

    const ListHeader = useCallback(
        () => (
            <View>
                {activeTab === 'filter' && (
                    <View>
                        <Text style={[styles.filterLabel, {color: textColor}]}>
                            Select a category:
                        </Text>
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
                                    accessibilityState={{selected: selectedCategory === cat.strCategory}}
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
                        <ActivityIndicator size="large" color="#f54c4c" accessibilityLabel="Loading results"/>
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

                {/* Result count */}
                {!loading && results.length > 0 && (
                    <Text style={[styles.resultCount, {color: textColor}]}>
                        Found {results.length} recipes
                    </Text>
                )}

                {/* Empty state */}
                {!loading && !error && results.length === 0 && (query || selectedCategory) && !showSuggestions && (
                    <View style={styles.centerContainer}>
                        <Text style={[styles.noResultsText, {color: textColor}]}>No recipes found</Text>
                        <Text style={[styles.noResultsSubtext, {color: textColor}]}>
                            Try a different search term or category
                        </Text>
                    </View>
                )}
            </View>
        ),
        [activeTab, categories, selectedCategory, loading, error, results.length, query, showSuggestions, textColor]
    );

    return (
        <View style={[styles.container, {backgroundColor}]}>

            {/* Page title */}
            <Text style={styles.header} accessibilityRole="header">🔍 Search Recipes</Text>

            <View style={styles.tabRow}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'search' && styles.tabActive]}
                    onPress={() => {
                        setActiveTab('search');
                        handleClear();
                    }}
                    accessibilityRole="tab"
                    accessibilityState={{selected: activeTab === 'search'}}
                >
                    <Text style={[styles.tabText, activeTab === 'search' && styles.tabTextActive]}>
                        By Name
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'filter' && styles.tabActive]}
                    onPress={() => {
                        setActiveTab('filter');
                        handleClear();
                    }}
                    accessibilityRole="tab"
                    accessibilityState={{selected: activeTab === 'filter'}}
                >
                    <Text style={[styles.tabText, activeTab === 'filter' && styles.tabTextActive]}>
                        By Category
                    </Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'search' && (
                <View style={styles.searchWrapper}>
                    <View style={styles.searchContainer}>
                        <TextInput
                            ref={textInputRef}
                            style={styles.input}
                            placeholder="e.g., chicken, pasta, cake..."
                            value={query}
                            onChangeText={handleQueryChange}
                            onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                            blurOnSubmit={false}
                            accessibilityLabel="Search recipes by name"
                            placeholderTextColor="#999"
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
                                <Text style={styles.clearButtonText}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {showSuggestions && suggestions.length > 0 && (
                        <View style={styles.suggestionsContainer}>
                            {suggestions.map((item) => (
                                <TouchableOpacity
                                    key={item.idMeal}
                                    style={styles.suggestionItem}
                                    onPress={() => handleSuggestionSelect(item)}
                                    activeOpacity={0.6}
                                >
                                    <Text style={styles.suggestionText} numberOfLines={1}>
                                        {item.strMeal}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {touched && !query.trim() && !showSuggestions && (
                        <Text style={styles.validationText} accessibilityRole="alert">
                            Please enter a search term
                        </Text>
                    )}
                </View>
            )}

            <FlatList
                style={styles.list}
                data={results}
                keyExtractor={(item) => item.idMeal}
                renderItem={({item}) => (
                    <RecipeCard
                        recipe={item}
                        onPress={() => navigation.navigate('RecipeDetail', {recipeId: item.idMeal})}
                    />
                )}
                ListHeaderComponent={ListHeader}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#f5f5f5'},
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 12,
        color: '#f54c4c',
    },
    tabRow: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: '#eee',
        borderRadius: 8,
        padding: 4,
    },
    tab: {flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: 'center'},
    tabActive: {backgroundColor: '#f54c4c'},
    tabText: {fontSize: 14, color: '#666', fontWeight: '600'},
    tabTextActive: {color: 'white'},
    searchWrapper: {
        paddingHorizontal: 16,
        marginBottom: 8,
        zIndex: 100,
    },
    searchContainer: {flexDirection: 'row'},
    input: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        color: '#333',
    },
    searchButton: {
        backgroundColor: '#f54c4c',
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
        minHeight: 48,
    },
    searchButtonText: {color: 'white', fontWeight: 'bold', fontSize: 16},
    clearButton: {
        backgroundColor: '#999',
        paddingHorizontal: 12,
        borderRadius: 8,
        justifyContent: 'center',
        marginLeft: 8,
        minHeight: 48,
    },
    clearButtonText: {color: 'white', fontWeight: 'bold', fontSize: 18},
    validationText: {color: '#f54c4c', fontSize: 12, marginTop: 8},
    suggestionsContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        marginTop: -1,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    suggestionItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: 'white',
        minHeight: 48,
        justifyContent: 'center',
    },
    suggestionText: {fontSize: 15, color: '#333', fontWeight: '500'},
    filterLabel: {fontSize: 14, color: '#666', marginHorizontal: 16, marginBottom: 8},
    categoryRow: {paddingHorizontal: 16, paddingBottom: 12},
    categoryChip: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    categoryChipActive: {backgroundColor: '#f54c4c', borderColor: '#f54c4c'},
    categoryChipText: {fontSize: 13, color: '#444'},
    categoryChipTextActive: {color: 'white', fontWeight: '600'},
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
        paddingVertical: 40,
    },
    loadingText: {marginTop: 12, color: '#666'},
    errorText: {color: '#f54c4c', fontSize: 16, textAlign: 'center', padding: 20},
    resultCount: {paddingHorizontal: 16, paddingVertical: 8, color: '#666', fontSize: 14},
    list: {flex: 1},
    listContent: {paddingBottom: 20},
    noResultsText: {fontSize: 18, color: '#666', textAlign: 'center'},
    noResultsSubtext: {fontSize: 14, color: '#999', textAlign: 'center', marginTop: 8},
});

export default SearchScreen;