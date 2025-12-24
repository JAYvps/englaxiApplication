import { Word, Player } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Fetches words from the backend API.
 */
export const getWords = async (difficulty: string, limit: number): Promise<Word[]> => {
    const url = new URL(`${API_BASE_URL}/words`);
    url.searchParams.append('difficulty', difficulty);
    url.searchParams.append('limit', String(limit));

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Word[];
    } catch (error) {
        console.error("Failed to fetch words:", error);
        return [];
    }
};

/**
 * Logs in a user.
 * @param email The user's email.
 * @param password The user's password.
 * @returns A promise that resolves to a Player object if successful.
 * @throws An error if login fails.
 */
export const login = async (email, password): Promise<Player> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    return await response.json() as Player;
}

/**
 * Fetches a user's data from the backend.
 */
export const getUser = async (userId: string): Promise<Player> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Player;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw error; // Re-throw to be handled by the caller
    }
};

/**
 * Updates a user's data on the backend.
 */
export const updateUser = async (user: Player): Promise<Player> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return user; // Assume success and return the object we sent
    } catch (error) {
        console.error("Failed to update user:", error);
        throw error;
    }
};