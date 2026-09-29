
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
            "Get all orders belonging to the currently logged-in user. "
            "This tool requires no arguments. "
            "Use it when the user asks about their orders, "
            "recent orders, order history, or order status."
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
        "name": "checkout",
        "description": (
            "Create an order from the logged-in user's cart. "
            "Use this when the user explicitly wants to checkout, "
            "place the order, or complete their purchase. "
            "The user must provide delivery address and payment method."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "delivery_address": {
                    "type": "object",
                    "description": "Delivery address for the order.",
                    "properties": {
                        "fullname": {
                            "type": "string"
                        },
                        "phone": {
                            "type": "string"
                        },
                        "address": {
                            "type": "string"
                        },
                        "city": {
                            "type": "string"
                        },
                        "state": {
                            "type": "string"
                        },
                        "pincode": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "fullname",
                        "phone",
                        "address",
                        "city",
                        "state",
                        "pincode"
                    ]
                },
                "payment_method": {
                    "type": "string",
                    "enum": ["Cash"]
                }
            },
            "required": [
                "delivery_address",
                "payment_method"
            ]
        }
    }
},
{
    "type": "function",
    "function": {
        "name": "cancel_order",
        "description": (
            "Cancel a user's order on SliceDash. "
            "Use this when the user explicitly asks to cancel an order."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "order_id": {
                    "type": "string",
                    "description": "The ID of the order to cancel."
                }
            },
            "required": ["order_id"]
        }
    }
},
{
    "type": "function",
    "function": {
        "name": "delete_order",
        "description": (
            "Delete a user's order from SliceDash. "
            "Use this when the user explicitly asks to delete an order. "
            "Do not use this tool when the user asks to cancel an order."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "order_id": {
                    "type": "string",
                    "description": "The ID of the order to delete."
                }
            },
            "required": ["order_id"]
        }
    }
}
]