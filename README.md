# Pizza Delivery Admin Panel

The Pizza Delivery Admin Panel is a dynamic web application built with React.js, Apollo Client, GraphQL, and GraphQL Codegen. It serves as an intuitive interface for managing the menu, orders, and user accounts of a pizza delivery service.

## Features:

- **Menu Management**: Admins can effortlessly add, edit, and remove pizzas, toppings, and other menu items. The changes reflect instantly in the customer-facing app.

- **Order Tracking**: Real-time order status updates allow admins to monitor the progress of each delivery.

- **User Management**: Admins can view and modify user accounts, including their contact information and order history.

- **Dashboard**: A comprehensive dashboard provides key metrics and insights, aiding decision-making and business growth.

- **GraphQL Integration**: The use of GraphQL ensures efficient data fetching, reducing over-fetching and under-fetching of data.

## Tech Stack:

- **Frontend**:
  - React.js: A popular JavaScript library for building user interfaces.
  - Apollo Client: A powerful GraphQL client for React applications.
  - GraphQL: A query language for APIs, enabling efficient data fetching.
  - GraphQL Codegen: Automatically generates TypeScript typings for GraphQL queries and mutations.


## Setup:

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Start the development server with `npm start`.

## Usage:

1. **Menu Management**: Admins can log in and access the "Menu" section. They can perform actions like adding new items, updating prices, and deleting items.

2. **Order Tracking**: The "Orders" section provides real-time updates on order status. Admins can view details and track deliveries.

3. **User Management**: In the "Users" section, admins can view user profiles, edit contact information, and manage accounts.

4. **Dashboard Insights**: The "Dashboard" presents key performance indicators (KPIs), order trends, and user statistics for informed decision-making.

5. **GraphQL Codegen**: Periodically run the GraphQL Codegen script to keep TypeScript typings updated with the server schema.

```bash
npm run generate
```

## Future Improvements:

- Implement role-based access control for admin accounts.
- Add advanced search and filter options for orders and users.

## Conclusion:

The Pizza Delivery Admin Panel is a powerful tool for managing the menu, orders, and user accounts of a pizza delivery service. Built with React, Apollo Client, and GraphQL, it provides a seamless and efficient experience for administrators. With ongoing enhancements, it can drive the success of the pizza delivery business.