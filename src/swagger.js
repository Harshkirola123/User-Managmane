const swaggerAutogen = require("swagger-autogen")();
const path = require("path");

// Define your output file and the paths to your route files
const outputFile = path.join(__dirname, "swagger_output.json");
const endpointsFiles = [
  path.join(__dirname, "./app/routes.ts"),
  path.join(__dirname, "./app/admin/admin.route.ts"),
  path.join(__dirname, "./app/user/user.route.ts"),
//   path.join(__dirname, "./app/user/user.route.ts")
];

// Swagger definition
const doc = {
  info: {
    title: "API Documentation",
    description: "API documentation for my Express app",
    version: "1.0.0",
  },
  host: "localhost:5000", // Define your server host (can be dynamic or use env variables)
  basePath: "/api",
  schemes: ["http"], // or ["https"] if your app runs over HTTPS
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "Enter the Bearer token like `Bearer <your_token>`",
    },
  },
};

// Generate the Swagger output
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger documentation generated!");
});
