import axios from 'axios';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const searchRecipes = async (query) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/search.php?s=${query}`);
        return response.data.meals || [];
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const getRecipeById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/lookup.php?i=${id}`);
        return response.data.meals?.[0] || null;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const getRandomRecipes = async (count = 5) => {
    try {
        const requests = Array(count).fill(null).map(() =>
            axios.get(`${API_BASE_URL}/random.php`)
        );
        const responses = await Promise.all(requests);
        return responses.map(res => res.data.meals[0]);
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};