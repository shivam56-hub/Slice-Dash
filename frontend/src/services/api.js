const API_URL = "http://localhost:5000/api";

export const getPizzas = async () => {
    const response = await fetch(`${API_URL}/pizzas`);

    if(!response.ok){
        throw new Error("Failed to fetch pizzas");
    }
    const data = await response.json();
    
    return data.pizzas;
}