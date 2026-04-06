import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    TextInput,
    Switch,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from "../context/ThemeContext";

const STORAGE_KEY = 'user_settings';

const CUISINES = ['Any', 'Italian', 'Mexican', 'Chinese', 'Indian', 'American', 'Japanese', 'French'];

export default function SettingsScreen() {
    const [name, setName] = useState('');
    const [vegetarian, setVegetarian] = useState(false);
    const [glutenFree, setGlutenFree] = useState(false);
    const [preferredCuisine, setPreferredCuisine] = useState('Any');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [saved, setSaved] = useState(false);

    const {backgroundColor, toggleTheme, isDarkMode, textColor} = useTheme();


    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const settings = JSON.parse(stored);
                setName(settings.name || '');
                setVegetarian(settings.vegetarian || false);
                setGlutenFree(settings.glutenFree || false);
                setPreferredCuisine(settings.preferredCuisine || 'Any');
            }
        } catch (error) {
            console.error('Failed to load settings', error);
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (name.trim().length > 0 && name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        if (name.trim().length > 50) {
            newErrors.name = 'Name must be 50 characters or fewer';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setSaving(true);
        try {
            const settings = {name: name.trim(), vegetarian, glutenFree, preferredCuisine,isDarkMode};
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            setSaved(true);
            Alert.alert('Saved!', 'Your preferences have been updated.');
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            Alert.alert('Error', 'Could not save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        Alert.alert(
            'Reset Settings',
            'Are you sure you want to reset all preferences?',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem(STORAGE_KEY);
                        setName('');
                        setVegetarian(false);
                        setGlutenFree(false);
                        setPreferredCuisine('Any');
                        setErrors({});
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#f54c4c" accessibilityLabel="Loading settings"/>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, {backgroundColor}]} contentContainerStyle={styles.content}>
            <Text style={styles.header} accessibilityRole="header">⚙️ Settings</Text>
            <Text style={[styles.subheader, {color: textColor}]}>Personalise your experience</Text>

            {/* Profile Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile</Text>

                <Text style={styles.label}>Your Name</Text>
                <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="Enter your name (optional)"
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                        if (errors.name) setErrors({...errors, name: null});
                    }}
                    maxLength={51}
                    accessibilityLabel="Your name input"
                    accessibilityHint="Optional. Enter your name to personalise the app."
                />
                {errors.name && (
                    <Text style={styles.errorText} accessibilityRole="alert">
                        {errors.name}
                    </Text>
                )}
            </View>

            {/* Theme  Preferences */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    Theme Preference
                </Text>


                <View style={styles.toggleRow}>
                    <View>
                        <Text style={styles.toggleLabel}> Dark Mode</Text>
                        <Text style={styles.toggleSubtext}>Switch theme background</Text>
                    </View>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleTheme}
                        trackColor={{false: '#ddd', true: '#f54c4c'}}
                        thumbColor={vegetarian ? '#fff' : '#fff'}
                        accessibilityLabel="Vegetarian preference toggle"
                        accessibilityState={{checked: vegetarian}}
                    />
                </View>
            </View>

            {/* Dietary Preferences */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dietary Preferences</Text>

                <View style={styles.toggleRow}>
                    <View>
                        <Text style={styles.toggleLabel}>Vegetarian</Text>
                        <Text style={styles.toggleSubtext}>Highlight vegetarian recipes</Text>
                    </View>
                    <Switch
                        value={vegetarian}
                        onValueChange={setVegetarian}
                        trackColor={{false: '#ddd', true: '#f54c4c'}}
                        thumbColor={vegetarian ? '#fff' : '#fff'}
                        accessibilityLabel="Vegetarian preference toggle"
                        accessibilityState={{checked: vegetarian}}
                    />
                </View>

                <View style={[styles.toggleRow, styles.borderTop]}>
                    <View>
                        <Text style={styles.toggleLabel}>Gluten-Free</Text>
                        <Text style={styles.toggleSubtext}>Filter for gluten-free options</Text>
                    </View>
                    <Switch
                        value={glutenFree}
                        onValueChange={setGlutenFree}
                        trackColor={{false: '#ddd', true: '#f54c4c'}}
                        thumbColor={glutenFree ? '#fff' : '#fff'}
                        accessibilityLabel="Gluten-free preference toggle"
                        accessibilityState={{checked: glutenFree}}
                    />
                </View>
            </View>

            {/* Preferred Cuisine */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferred Cuisine</Text>
                <View style={styles.cuisineGrid}>
                    {CUISINES.map((cuisine) => (
                        <TouchableOpacity
                            key={cuisine}
                            style={[
                                styles.cuisineChip,
                                preferredCuisine === cuisine && styles.cuisineChipActive,
                            ]}
                            onPress={() => setPreferredCuisine(cuisine)}
                            accessibilityLabel={`Select ${cuisine} cuisine`}
                            accessibilityState={{selected: preferredCuisine === cuisine}}
                        >
                            <Text style={[
                                styles.cuisineChipText,
                                preferredCuisine === cuisine && styles.cuisineChipTextActive,
                            ]}>
                                {cuisine}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Save / Reset */}
            <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
                accessibilityLabel="Save settings"
                accessibilityRole="button"
            >
                {saving
                    ? <ActivityIndicator color="white"/>
                    : <Text style={styles.saveButtonText}>{saved ? '✓ Saved!' : 'Save Preferences'}</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.resetButton, {borderColor: textColor}]}
                onPress={handleReset}
                accessibilityLabel="Reset all settings"
                accessibilityRole="button"
            >
                <Text style={[styles.resetButtonText, {color: textColor}]}>Reset to Defaults</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#f5f5f5'},
    content: {padding: 20, paddingBottom: 40},
    centerContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    header: {
        fontSize: 28, fontWeight: 'bold', textAlign: 'center',
        marginBottom: 4, color: '#f54c4c',
    },
    subheader: {
        fontSize: 15, textAlign: 'center', color: '#666', marginBottom: 24,
    },
    section: {
        backgroundColor: 'white', borderRadius: 12, padding: 16,
        marginBottom: 16, shadowColor: '#000',
        shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.06,
        shadowRadius: 4, elevation: 2,
    },
    sectionTitle: {
        fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 14,
    },
    label: {fontSize: 14, color: '#555', marginBottom: 6},
    input: {
        backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12,
        borderWidth: 1, borderColor: '#ddd', fontSize: 16, color: '#333',
    },
    inputError: {borderColor: '#f54c4c'},
    errorText: {color: '#f54c4c', fontSize: 12, marginTop: 4},
    toggleRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingVertical: 10,
    },
    borderTop: {borderTopWidth: 1, borderTopColor: '#f0f0f0'},
    toggleLabel: {fontSize: 15, color: '#333', fontWeight: '500'},
    toggleSubtext: {fontSize: 12, color: '#999', marginTop: 2},
    cuisineGrid: {
        flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    },
    cuisineChip: {
        backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 14,
        paddingVertical: 8, borderWidth: 1, borderColor: '#e0e0e0',
    },
    cuisineChipActive: {backgroundColor: '#f54c4c', borderColor: '#f54c4c'},
    cuisineChipText: {fontSize: 13, color: '#444'},
    cuisineChipTextActive: {color: 'white', fontWeight: '600'},
    saveButton: {
        backgroundColor: '#f54c4c', padding: 16, borderRadius: 10,
        alignItems: 'center', marginBottom: 12,
    },
    saveButtonDisabled: {backgroundColor: '#ffaa99'},
    saveButtonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
    resetButton: {
        borderWidth: 1, borderColor: '#ccc', padding: 16, borderRadius: 10,
        alignItems: 'center',
    },
    resetButtonText: {color: '#666', fontSize: 15, fontWeight: 'bold'},
});
