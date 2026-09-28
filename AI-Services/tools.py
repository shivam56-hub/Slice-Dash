
from groq import Groq
from config import GROQ_API_KEY

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set in environment variables.")

client = Groq(api_key=GROQ_API_KEY)


tools = [
    {
        "type": "function",
        "function": {
            "name": "get_pizzas",
            "description": (
                "Fetch the current pizza menu from the SliceDash application. "
                "Use this tool when the user asks about available pizzas, "
                "pizza prices, sizes, descriptions, categories, or availability."
            ),
            "parameters": {
                "type": "object",
                "properties": {},
                "required": [],
            },
        },
    },
  {
    "type": "function",
    "function": {
        "name": "get_pizza_by_name",
        "description": "Find a specific pizza from the current SliceDash menu by its name.",
        "parameters": {
            "type": "object",
            "properties": {
                "pizza_name": {
                    "type": "string",
                    "description": "The name of the pizza to search for."
                }
            },
            "required": ["pizza_name"]
        }
    }
},
{
    "type": "function",
    "function": {
        "name": "add_to_cart",
        "description": (
           "Add a pizza to the logged-in user's SliceDash cart. "
           "IMPORTANT: Use this tool whenever the user explicitly asks "
           "to add, put, or order a pizza in their cart. "
           "The user must provide or imply the pizza name, size, and quantity."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "pizza_name": {
                    "type": "string"
                },
                "size": {
                    "type": "string"
                },
                "quantity": {
                    "type": "integer",
                    "minimum": 1
                }
            },
            "required": ["pizza_name", "size", "quantity"]
        }
    }
},
{
    "type": "function",
    "function": {
        "name": "get_cart",
        "description": (
            "Get the current logged-in user's cart. "
            "Use this when the user asks what is in their cart, "
            "cart items, cart quantity, or cart total."
        ),
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    }
},
{
    "type": "function",
    "function": {
        "name": "get_my_orders",
        "description": (
            "Get the logged-in user's orders from SliceDash. "
            "Use this when the user asks about their orders, "
            "recent orders, order history, order status, "
            "or wants to know what they ordered."
        ),
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    }
}
]