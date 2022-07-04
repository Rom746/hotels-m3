export const getRepositories = async (value, amount) => {
    const URL = 'https://api.github.com/search/repositories'
    try {
        const response = await fetch(`${URL}?q=${value}&per_page=${amount}`, {
            method: 'GET'
        });
        
        const res = await response.json();
        return res;
    } catch (error) { 
        return error;
    }
}
