import { connectDB, GET_ENV_VALUES } from "./config";
import app from "./app";

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server

    const port = GET_ENV_VALUES("PORT") ?? 5001;

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();