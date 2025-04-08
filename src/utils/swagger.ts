const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Hono CRUD API",
    version: "1.0.0",
    description: "A simple CRUD API with authentication",
  },
  servers: [{ url: "http://localhost:3000" }],
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "User registered" },
          "400": { description: "User already exists" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login a user",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Login successful" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/api/todos": {
      get: {
        summary: "Get all todos",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "List of todos" },
        },
      },
      post: {
        summary: "Create a new todo",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  completed: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Todo created" },
        },
      },
    },
    "/api/todos/{id}": {
      get: {
        summary: "Get a todo by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Todo details" },
          "404": { description: "Todo not found" },
        },
      },
      put: {
        summary: "Update a todo",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  completed: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Todo updated" },
          "404": { description: "Todo not found" },
        },
      },
      delete: {
        summary: "Delete a todo",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Todo deleted" },
          "404": { description: "Todo not found" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

/**
 * Serves the Swagger UI page for API documentation.
 *
 * This function generates an HTML page containing the Swagger UI,
 * which provides interactive API documentation based on the OpenAPI
 * specification defined in `swaggerDefinition`. It includes the
 * necessary CSS and JavaScript to render the UI and display the API
 * documentation.
 *
 * @author Muhammad Farras Jibran
 * @param {any} c - The request context used to return the HTML response.
 * @returns {any} The HTML response containing the Swagger UI.
 */
export const swaggerUI = (c: any) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Docs</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              spec: ${JSON.stringify(swaggerDefinition)},
              dom_id: '#swagger-ui',
            })
          }
        </script>
      </body>
    </html>
  `;
  return c.html(html);
};
