import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from config import ALLOWED_ORIGINS, SYSTEM_PROMPT, GROQ_MODEL
from schemas import ChatRequest, ChatResponse
from services import (
    get_pizzas, 
    get_pizza_by_name, 
    add_to_cart, 
    get_cart, 
    get_my_orders,
    checkout,
    cancel_order,
    delete_order
)
from tools import client, tools

app = FastAPI(title="PizzaBot AI Service")

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Pizza AI services is running!"}


@app.get("/api/pizzas")
def pizzas():
    return get_pizzas()


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    print("Token exists:", request.token is not None)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]

    # Append chat history
    for msg in request.history:
        messages.append({
            "role": msg.role,
            "content": msg.content
        })

    # Append new user message
    messages.append({
        "role": "user",
        "content": request.message
    })

    # Keep calling Groq until it gives a final text response
    while True:

        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )

        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls

        # No tool call = final answer
        if not tool_calls:
            final_text = response_message.content or ""
            break

        print("Tool calls received:")

        # Add assistant tool-call message
        messages.append(response_message)

        # Execute every requested tool
        for tool_call in tool_calls:

            function_name = tool_call.function.name

            print("Tool called:", function_name)
            print("Arguments:", tool_call.function.arguments)

            if function_name == "get_pizzas":

                tool_result = get_pizzas()

            elif function_name == "get_pizza_by_name":

                arguments = json.loads(
                    tool_call.function.arguments
                )

                tool_result = get_pizza_by_name(
                    arguments["pizza_name"]
                )

            elif function_name == "add_to_cart":

                arguments = json.loads(
                    tool_call.function.arguments
                )

                pizza_name = arguments["pizza_name"]
                size = arguments["size"]
                quantity = arguments["quantity"]

                tool_result = add_to_cart(
                    request.token,
                    pizza_name,
                    size,
                    quantity
                )

            elif function_name == "get_cart":

                tool_result = get_cart(
                    request.token
                )

            elif function_name == "get_my_orders":

                tool_result = get_my_orders(
                    request.token
                )
            elif function_name == "checkout":
                arguments = json.loads(
                    tool_call.function.arguments
                )

                tool_result = checkout(
                    request.token,
                    arguments["delivery_address"],
                    arguments["payment_method"]
                )

            elif function_name == "cancel_order":

                arguments = json.loads(
                    tool_call.function.arguments
                )

                tool_result = cancel_order(
                    request.token,
                    arguments["order_id"]
                )
            elif function_name == "delete_order":
                arguments = json.loads(
                    tool_call.function.arguments
                )  
                tool_result = delete_order(
                    request.token,
                    arguments["order_id"]
                )  

            else:
               tool_result = {
                    "success": False,
                    "message": "Unknown tool"
                }

            # Send tool result back to Groq
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "name": function_name,
                "content": json.dumps(tool_result)
            })

    return ChatResponse(
        response=final_text
    )
 