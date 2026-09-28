import requests
from config import PIZZA_API_URL

def get_pizzas() -> dict:
    """Fetch pizza menu from the backend API."""
    try:
        response = requests.get(PIZZA_API_URL, timeout=5)
        if response.status_code != 200:
            return {
                "success": False,
                "message": "Unable to fetch pizza menu."
            }
        return response.json()
    except requests.RequestException as e:
        return {
            "success": False,
            "message": f"Error connecting to menu service: {str(e)}"
        }



def get_pizza_by_name(pizza_name: str) -> dict:
    """Find a pizza by exact or partial name."""

    pizzas_data = get_pizzas()

    if not pizzas_data.get("success"):
        return pizzas_data

    pizzas = pizzas_data.get("pizzas", [])

    search_name = pizza_name.strip().lower()

    # First try exact match
    for pizza in pizzas:
        if pizza["name"].strip().lower() == search_name:
            return {
                "success": True,
                "pizza": pizza
            }

    # Then try partial match
    for pizza in pizzas:
        if search_name in pizza["name"].strip().lower():
            return {
                "success": True,
                "pizza": pizza
            }

    return {
        "success": False,
        "message": f"{pizza_name} is not available on the menu."
    }

def add_to_cart(token: str, pizza_name: str, size: str, quantity: int) -> dict:
    """Add a pizza to the logged-in user's cart."""

    pizzas_data = get_pizzas()

    if not pizzas_data.get("success"):
        return pizzas_data

    pizzas = pizzas_data.get("pizzas", [])

    selected_pizza = None

    for pizza in pizzas:
        if pizza["name"].strip().lower() == pizza_name.strip().lower():
            selected_pizza = pizza
            break

    if not selected_pizza:
        for pizza in pizzas:
            if pizza_name.strip().lower() in pizza["name"].strip().lower():
                selected_pizza = pizza
                break

    if not selected_pizza:
        return {
            "success": False,
            "message": f"{pizza_name} is not available."
        }

    selected_size = None

    for pizza_size in selected_pizza["size"]:
        if pizza_size["name"].lower() == size.strip().lower():
            selected_size = pizza_size
            break

    if not selected_size:
        return {
            "success": False,
            "message": f"{size} size is not available for {selected_pizza['name']}."
        }

    try:
        response = requests.post(
            "http://localhost:5000/api/cart",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            },
            json={
                "pizzaId": selected_pizza["_id"],
                "size": selected_size["name"],
                "quantity": quantity
            },
            timeout=5
        )

        return response.json()

    except requests.RequestException as e:
        return {
            "success": False,
            "message": f"Error connecting to cart service: {str(e)}"
        }


def get_cart(token: str) -> dict:
    """Fetch the logged-in user's cart.""" 
    try:
        response = requests.get(
            "http://localhost:5000/api/cart",
            headers={
                "Authorization": f"Bearer {token}"
            },
            timeout=5
        )

        return response.json() 
    except requests.RequestException as e:
        return{
            "success": False,
            "message": f"Error connecting to cart service: {str(e)}"
        }