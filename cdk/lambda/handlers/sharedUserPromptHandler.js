const { initConnection, createResponse, parseBody, handleError, getSqlConnection } = require("./utils/handlerUtils.js");

(async () => {
  await initConnection();
})();

exports.handler = async (event) => {
  const response = createResponse();
  let data;
  
  try {
    const sqlConnection = getSqlConnection();
    const pathData = event.httpMethod + " " + event.resource;
    
    switch (pathData) {
      case "GET /textbooks/{id}/shared_prompts":
        const textbookId = event.pathParameters?.id;
        if (!textbookId) {
          response.statusCode = 400;
          response.body = JSON.stringify({ error: "Textbook ID is required" });
          break;
        }
        
        const limit = Math.min(parseInt(event.queryStringParameters?.limit) || 20, 100);
        const offset = parseInt(event.queryStringParameters?.offset) || 0;
        
        const result = await sqlConnection`
          SELECT 
            id, title, prompt_text, owner_session_id, owner_user_id, textbook_id, visibility, tags, created_at, updated_at, metadata,
            COUNT(*) OVER() as total_count
          FROM shared_user_prompts
          WHERE textbook_id = ${textbookId}
          ORDER BY created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
        
        const total = result.length > 0 ? parseInt(result[0].total_count) : 0;
        const prompts = result.map(({total_count, ...prompt}) => prompt);
        
        data = {
          prompts,
          pagination: {
            limit,
            offset,
            total,
            hasMore: offset + limit < total
          }
        };
        response.body = JSON.stringify(data);
        break;
        
      case "POST /textbooks/{id}/shared_prompts":
        const postTextbookId = event.pathParameters?.id;
        if (!postTextbookId) {
          response.statusCode = 400;
          response.body = JSON.stringify({ error: "Textbook ID is required" });
          break;
        }
        
        const createData = parseBody(event.body);
        const { title, prompt_text, owner_session_id, owner_user_id, visibility, tags, metadata } = createData;
        
        if (!prompt_text) {
          response.statusCode = 400;
          response.body = JSON.stringify({ error: "prompt_text is required" });
          break;
        }
        
        const newPrompt = await sqlConnection`
          INSERT INTO shared_user_prompts (title, prompt_text, owner_session_id, owner_user_id, textbook_id, visibility, tags, metadata)
          VALUES (${title || null}, ${prompt_text}, ${owner_session_id || null}, ${owner_user_id || null}, ${postTextbookId}, ${visibility || 'public'}, ${tags || []}, ${metadata || {}})
          RETURNING id, title, prompt_text, owner_session_id, owner_user_id, textbook_id, visibility, tags, created_at, updated_at, metadata
        `;
        
        response.statusCode = 201;
        data = newPrompt[0];
        response.body = JSON.stringify(data);
        break;
        
      case "GET /shared_prompts/{id}":
        const promptId = event.pathParameters?.id;
        if (!promptId) {
          response.statusCode = 400;
          response.body = JSON.stringify({ error: "Prompt ID is required" });
          break;
        }
        
        const prompt = await sqlConnection`
          SELECT id, title, prompt_text, owner_session_id, owner_user_id, textbook_id, visibility, tags, created_at, updated_at, metadata
          FROM shared_user_prompts
          WHERE id = ${promptId}
        `;
        
        if (prompt.length === 0) {
          response.statusCode = 404;
          response.body = JSON.stringify({ error: "Prompt not found" });
          break;
        }
        
        data = prompt[0];
        response.body = JSON.stringify(data);
        break;
        
      case "PUT /shared_prompts/{id}":
        const updatePromptId = event.pathParameters?.id;
        if (!updatePromptId) {
          response.statusCode = 400;
          response.body = JSON.stringify({ error: "Prompt ID is required" });
          break;
        }
        
        const updateData = parseBody(event.body);
        const { title: updateTitle, prompt_text: updatePromptText, visibility: updateVisibility, tags: updateTags, metadata: updateMetadata } = updateData;
        
        const updated = await sqlConnection`
          UPDATE shared_user_prompts 
          SET title = ${updateTitle}, prompt_text = ${updatePromptText}, visibility = ${updateVisibility}, 
              tags = ${updateTags}, metadata = ${updateMetadata || {}}, updated_at = NOW()
          WHERE id = ${updatePromptId}
          RETURNING id, title, prompt_text, owner_session_id, owner_user_id, textbook_id, visibility, tags, created_at, updated_at, metadata
        `;
        
        if (updated.length === 0) {
          response.statusCode = 404;
          response.body = JSON.stringify({ error: "Prompt not found" });
          break;
        }
        
        data = updated[0];
        response.body = JSON.stringify(data);
        break;
        
      case "DELETE /shared_prompts/{id}":
        const deletePromptId = event.pathParameters?.id;
        if (!deletePromptId) {
          response.statusCode = 400;
          response.body = JSON.stringify({ error: "Prompt ID is required" });
          break;
        }
        
        const deleted = await sqlConnection`
          DELETE FROM shared_user_prompts WHERE id = ${deletePromptId} RETURNING id
        `;
        
        if (deleted.length === 0) {
          response.statusCode = 404;
          response.body = JSON.stringify({ error: "Prompt not found" });
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