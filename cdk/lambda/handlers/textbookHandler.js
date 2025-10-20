const postgres = require("postgres");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

let sqlConnection;
const secretsManager = new SecretsManagerClient();

const initConnection = async () => {
  if (!sqlConnection) {
    try {
      const getSecretValueCommand = new GetSecretValueCommand({
        SecretId: process.env.SM_DB_CREDENTIALS,
      });
      const secretResponse = await secretsManager.send(getSecretValueCommand);
      const credentials = JSON.parse(secretResponse.SecretString);

      const connectionConfig = {
        host: process.env.RDS_PROXY_ENDPOINT,
        port: credentials.port,
        username: credentials.username,
        password: credentials.password,
        database: credentials.dbname,
        ssl: { rejectUnauthorized: false },
      };

      sqlConnection = postgres(connectionConfig);
      await sqlConnection`SELECT 1`;
      console.log("Database connection initialized successfully");
    } catch (error) {
      console.error("Error initializing database connection:", error);
      throw error;
    }
  }
};

const createResponse = () => ({
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Headers":
      "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  },
  body: "",
});

const parseBody = (body) => {
  try {
    return JSON.parse(body || "{}");
  } catch {
    throw new Error("Invalid JSON body");
  }
};

const handleError = (error, response) => {
  response.statusCode = 500;
  console.log(error);
  response.body = JSON.stringify(error.message);
};

const checkAdminRole = async (event) => {
  // Check if user context exists (from authorizer)
  const userContext = event.requestContext?.authorizer;

  console.log(
    "Checking admin role for user context:",
    JSON.stringify(userContext, null, 2)
  );

  if (!userContext || !userContext.userId) {
    console.log("No user context or userId found");
    return { isAdmin: false, error: "User not authenticated" };
  }

  // Ensure database connection is available
  if (!sqlConnection) {
    await initConnection();
  }

  // Query the database to check if user has admin role
  try {
    console.log("Querying database for user role, userId:", userContext.userId);
    const userResult = await sqlConnection`
      SELECT role FROM users WHERE id = ${userContext.userId}
    `;

    if (userResult.length === 0) {
      console.log("User not found in database");
      return { isAdmin: false, error: "User not found" };
    }

    const userRole = userResult[0].role;
    console.log("User role found:", userRole);
    return { isAdmin: userRole === "admin", error: null };
  } catch (error) {
    console.error("Error checking admin role:", error);
    return { isAdmin: false, error: "Error checking user role" };
  }
};

exports.handler = async (event) => {
  const response = createResponse();
  let data;

  try {
    // Ensure connection is initialized before proceeding
    await initConnection();
    const pathData = event.httpMethod + " " + event.resource;

    switch (pathData) {
      case "GET /textbooks":
        const limit = Math.min(
          parseInt(event.queryStringParameters?.limit) || 20,
          100
        );
        const offset = parseInt(event.queryStringParameters?.offset) || 0;

        const result = await sqlConnection`
          SELECT 
            id, title, authors, publisher, year, summary, language, level, created_at,
            COUNT(*) OVER() as total_count
          FROM textbooks
          ORDER BY created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;

        const total = result.length > 0 ? parseInt(result[0].total_count) : 0;
        const textbooks = result.map(({ total_count, ...book }) => book);

        data = {
          textbooks,
          pagination: {
            limit,
            offset,
            total,
            hasMore: offset + limit < total,
          },
        };
        response.body = JSON.stringify(data);
        break;

      case "GET /textbooks/{id}":
        const textbookId = event.pathParameters?.id;
        if (!textbookId) {
          response.statusCode = 400;
          response.body = JSON.stringify({ error: "Textbook ID is required" });
          break;
        }

        const textbook = await sqlConnection`
          SELECT id, title, authors, license, source_url, publisher, year, summary, language, level, created_at, updated_at, metadata
          FROM textbooks
          WHERE id = ${textbookId}
        `;

        if (textbook.length === 0) {
          response.statusCode = 404;
          response.body = JSON.stringify({ error: "Textbook not found" });
          break;
        }

        data = textbook[0];
        response.body = JSON.stringify(data);
        break;

      case "POST /textbooks":
        // Check if user is admin
        const adminCheck = await checkAdminRole(event);
        if (!adminCheck.isAdmin) {
          response.statusCode = 403;
          response.body = JSON.stringify({
            error: "Admin access required to create textbooks",
          });
          break;
        }

        const createData = parseBody(event.body);
        const {
          title: createTitle,
          authors: createAuthors,
          license: createLicense,
          source_url: createSourceUrl,
          publisher: createPublisher,
          year: createYear,
          summary: createSummary,
          language: createLanguage,
          level: createLevel,
          created_by: createCreatedBy,
          metadata: createMetadata,
        } = createData;

        if (!createTitle) {
          response.statusCode = 400;
          response.body = JSON.stringify({ error: "Title is required" });
          break;
        }

        const newTextbook = await sqlConnection`
          INSERT INTO textbooks (title, authors, license, source_url, publisher, year, summary, language, level, created_by, metadata)
          VALUES (${createTitle}, ${createAuthors || []}, ${
          createLicense || null
        }, ${createSourceUrl || null}, ${createPublisher || null}, ${
          createYear || null
        }, ${createSummary || null}, ${createLanguage || null}, ${
          createLevel || null
        }, ${createCreatedBy || null}, ${createMetadata || {}})
          RETURNING id, title, authors, license, source_url, publisher, year, summary, language, level, created_at, updated_at, metadata
        `;

        response.statusCode = 201;
        data = newTextbook[0];
        response.body = JSON.stringify(data);
        break;

      case "PUT /textbooks/{id}":
        // Check if user is admin
        const updateAdminCheck = await checkAdminRole(event);
        if (!updateAdminCheck.isAdmin) {
          response.statusCode = 403;
          response.body = JSON.stringify({
            error: "Admin access required to modify textbooks",
          });
          break;
        }

        const updateId = event.pathParameters?.id;
        if (!updateId) {
          response.statusCode = 400;
          response.body = JSON.stringify({ error: "Textbook ID is required" });
          break;
        }

        const updateData = parseBody(event.body);
        const {
          title,
          authors,
          license,
          source_url,
          publisher,
          year,
          summary,
          language,
          level,
          metadata,
        } = updateData;

        const updated = await sqlConnection`
          UPDATE textbooks 
          SET title = ${title}, authors = ${authors}, license = ${license}, source_url = ${source_url}, 
              publisher = ${publisher}, year = ${year}, summary = ${summary}, language = ${language}, 
              level = ${level}, metadata = ${metadata || {}}, updated_at = NOW()
          WHERE id = ${updateId}
          RETURNING id, title, authors, license, source_url, publisher, year, summary, language, level, created_at, updated_at, metadata
        `;

        if (updated.length === 0) {
          response.statusCode = 404;
          response.body = JSON.stringify({ error: "Textbook not found" });
          break;
        }

        data = updated[0];
        response.body = JSON.stringify(data);
        break;

      case "DELETE /textbooks/{id}":
        // Check if user is admin
        const deleteAdminCheck = await checkAdminRole(event);
        if (!deleteAdminCheck.isAdmin) {
          response.statusCode = 403;
          response.body = JSON.stringify({
            error: "Admin access required to delete textbooks",
          });
          break;
        }

        const deleteId = event.pathParameters?.id;
        if (!deleteId) {
          response.statusCode = 400;
          response.body = JSON.stringify({ error: "Textbook ID is required" });
          break;
        }

        const deleted = await sqlConnection`
          DELETE FROM textbooks WHERE id = ${deleteId} RETURNING id
        `;

        if (deleted.length === 0) {
          response.statusCode = 404;
          response.body = JSON.stringify({ error: "Textbook not found" });
          break;
        }

        response.statusCode = 204;
        response.body = "";
        break;

      default:
        throw new Error(`Unsupported route: "${pathData}"`);
    }
  } catch (error) {
    handleError(error, response);
  }

  console.log(response);
  return response;
};
