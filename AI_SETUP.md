# AI Question Generation Setup Guide

This guide explains how to set up AI-powered interview question generation in ReadySetHire.

## Features / 功能特性

- 🤖 **One-click question generation** / 一键问题生成
- 🎯 **Context-aware questions** / 上下文感知问题  
- 📊 **Multiple difficulty levels** / 多种难度级别
- 🔄 **Automatic database integration** / 自动数据库集成
- 🛡️ **Fallback questions** / 备用问题
- ⚙️ **Multiple AI provider support** / 支持多种AI提供商

## Quick Setup / 快速设置

### 1. Create Environment File / 创建环境文件

Create a `.env.local` file in your project root:

```bash
# Required for basic functionality
VITE_JWT_TOKEN=your_jwt_token_from_blackboard
VITE_USERNAME=your_student_id  
VITE_API_BASE_URL=https://comp2140a2.uqcloud.net/api

# Add these for AI question generation
VITE_AI_API_KEY=your_openai_api_key_here
VITE_AI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
VITE_AI_API_MODEL=gpt-3.5-turbo
```

### 2. Get OpenAI API Key / 获取OpenAI API密钥

1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key to your `.env.local` file

### 3. Restart Development Server / 重启开发服务器

```bash
npm run dev
```

## Supported AI Providers / 支持的AI提供商

### OpenAI (Recommended / 推荐)
```bash
VITE_AI_API_KEY=sk-your-openai-key
VITE_AI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
VITE_AI_API_MODEL=gpt-3.5-turbo
```

### Azure OpenAI
```bash
VITE_AI_API_KEY=your-azure-key
VITE_AI_API_ENDPOINT=https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2023-05-15
VITE_AI_API_MODEL=gpt-35-turbo
```

### Ollama (Local)
```bash
VITE_AI_API_KEY=not_required
VITE_AI_API_ENDPOINT=http://localhost:11434/v1/chat/completions  
VITE_AI_API_MODEL=llama3
```

### Other OpenAI-Compatible APIs
Any API that supports the OpenAI chat completions format will work.

## Usage / 使用方法

### In Interviews Page / 在面试页面中

1. Navigate to the Interviews page
2. Click the "✨ Generate Questions" button next to any interview
3. Wait for AI to generate 8 high-quality questions
4. Questions are automatically added to the database

### Question Quality / 问题质量

The AI generates questions with:

- **Mixed difficulty levels**: Easy (2-3), Intermediate (4-5), Advanced (1-2)
- **Different question types**: Technical, behavioral, situational, problem-solving
- **Role-specific content**: Tailored to the job role and company

## Troubleshooting / 故障排除

### Button Shows "AI Setup Required" / 按钮显示"AI Setup Required"

**Problem**: AI configuration is missing

**Solution**: Add the required environment variables to `.env.local`

### API Key Error / API密钥错误

**Problem**: Invalid or expired API key

**Solution**: 
1. Check your API key is correct
2. Verify you have sufficient credits/quota
3. Restart the development server

### Network/CORS Errors / 网络/CORS错误

**Problem**: API requests blocked by CORS

**Solution**: This typically happens in development. The API should work in production.

### Generation Takes Too Long / 生成时间过长

**Problem**: AI API is slow or timing out

**Solution**:
1. Try a different model (gpt-3.5-turbo is faster than gpt-4)
2. Check your internet connection
3. Consider using a local AI model (Ollama)

## Cost Considerations / 成本考虑

- **OpenAI gpt-3.5-turbo**: ~$0.002 per question generation
- **OpenAI gpt-4**: ~$0.01 per question generation  
- **Local models (Ollama)**: Free but requires local setup

## Fallback Behavior / 回退行为

If AI generation fails, the system automatically provides:

- 8 high-quality fallback questions
- Mixed difficulty levels
- Professional interview questions suitable for any role

## Security / 安全性

- API keys are stored in environment variables only
- No sensitive data is sent to AI providers beyond job role/title
- All API calls are made from the client (no server-side storage)

## Advanced Configuration / 高级配置

### Custom Prompts / 自定义提示词

To modify the AI prompt, edit `src/services/aiQuestionService.js`:

```javascript
function createPrompt(interviewData, questionCount) {
  // Customize the prompt here
}
```

### Custom Question Processing / 自定义问题处理

To modify how questions are processed, edit the `parseAIResponse` function:

```javascript
function parseAIResponse(response) {
  // Add custom validation/processing
}
```

## Support / 支持

For issues or questions:

1. Check the browser console for detailed error messages
2. Verify your environment variables are correct
3. Test with a simple OpenAI API call first
