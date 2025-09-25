# AI Question Generation Setup Guide
# CN: AI问题生成设置指南

This guide explains how to set up AI-powered interview question generation in ReadySetHire.
CN: 本指南说明如何在ReadySetHire中设置AI驱动的面试问题生成功能。

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
CN: 在项目根目录创建`.env.local`文件：

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
   CN: 访问 [OpenAI API密钥页面](https://platform.openai.com/api-keys)
2. Create a new API key
   CN: 创建新的API密钥
3. Copy the key to your `.env.local` file
   CN: 将密钥复制到`.env.local`文件

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
CN: 任何支持OpenAI聊天完成格式的API都可以使用。

## Usage / 使用方法

### In Interviews Page / 在面试页面中

1. Navigate to the Interviews page
   CN: 导航到面试页面
2. Click the "✨ Generate Questions" button next to any interview
   CN: 点击任何面试旁边的"✨ Generate Questions"按钮
3. Wait for AI to generate 8 high-quality questions
   CN: 等待AI生成8个高质量问题
4. Questions are automatically added to the database
   CN: 问题自动添加到数据库

### Question Quality / 问题质量

The AI generates questions with:
CN: AI生成的问题具有：

- **Mixed difficulty levels**: Easy (2-3), Intermediate (4-5), Advanced (1-2)
  CN: **混合难度级别**：简单(2-3)、中级(4-5)、高级(1-2)
- **Different question types**: Technical, behavioral, situational, problem-solving
  CN: **不同问题类型**：技术性、行为性、情境性、问题解决型
- **Role-specific content**: Tailored to the job role and company
  CN: **角色特定内容**：针对工作角色和公司量身定制

## Troubleshooting / 故障排除

### Button Shows "AI Setup Required" / 按钮显示"AI Setup Required"

**Problem**: AI configuration is missing
CN: **问题**：缺少AI配置

**Solution**: Add the required environment variables to `.env.local`
CN: **解决方案**：将所需的环境变量添加到`.env.local`

### API Key Error / API密钥错误

**Problem**: Invalid or expired API key
CN: **问题**：无效或过期的API密钥

**Solution**: 
1. Check your API key is correct
   CN: 检查API密钥是否正确
2. Verify you have sufficient credits/quota
   CN: 验证是否有足够的积分/配额
3. Restart the development server
   CN: 重启开发服务器

### Network/CORS Errors / 网络/CORS错误

**Problem**: API requests blocked by CORS
CN: **问题**：API请求被CORS阻止

**Solution**: This typically happens in development. The API should work in production.
CN: **解决方案**：这通常在开发中发生。API在生产环境中应该可以工作。

### Generation Takes Too Long / 生成时间过长

**Problem**: AI API is slow or timing out
CN: **问题**：AI API速度慢或超时

**Solution**:
1. Try a different model (gpt-3.5-turbo is faster than gpt-4)
   CN: 尝试不同的模型（gpt-3.5-turbo比gpt-4快）
2. Check your internet connection
   CN: 检查网络连接
3. Consider using a local AI model (Ollama)
   CN: 考虑使用本地AI模型（Ollama）

## Cost Considerations / 成本考虑

- **OpenAI gpt-3.5-turbo**: ~$0.002 per question generation
  CN: **OpenAI gpt-3.5-turbo**：每次问题生成约$0.002
- **OpenAI gpt-4**: ~$0.01 per question generation  
  CN: **OpenAI gpt-4**：每次问题生成约$0.01
- **Local models (Ollama)**: Free but requires local setup
  CN: **本地模型（Ollama）**：免费但需要本地设置

## Fallback Behavior / 回退行为

If AI generation fails, the system automatically provides:
CN: 如果AI生成失败，系统会自动提供：

- 8 high-quality fallback questions
  CN: 8个高质量的备用问题
- Mixed difficulty levels
  CN: 混合难度级别
- Professional interview questions suitable for any role
  CN: 适用于任何角色的专业面试问题

## Security / 安全性

- API keys are stored in environment variables only
  CN: API密钥仅存储在环境变量中
- No sensitive data is sent to AI providers beyond job role/title
  CN: 除工作角色/标题外，不会向AI提供商发送敏感数据
- All API calls are made from the client (no server-side storage)
  CN: 所有API调用都从客户端发起（无服务器端存储）

## Advanced Configuration / 高级配置

### Custom Prompts / 自定义提示词

To modify the AI prompt, edit `src/services/aiQuestionService.js`:
CN: 要修改AI提示词，编辑`src/services/aiQuestionService.js`：

```javascript
function createPrompt(interviewData, questionCount) {
  // Customize the prompt here
  // CN: 在这里自定义提示词
}
```

### Custom Question Processing / 自定义问题处理

To modify how questions are processed, edit the `parseAIResponse` function:
CN: 要修改问题处理方式，编辑`parseAIResponse`函数：

```javascript
function parseAIResponse(response) {
  // Add custom validation/processing
  // CN: 添加自定义验证/处理
}
```

## Support / 支持

For issues or questions:
CN: 如有问题或疑问：

1. Check the browser console for detailed error messages
   CN: 检查浏览器控制台的详细错误消息
2. Verify your environment variables are correct
   CN: 验证环境变量是否正确
3. Test with a simple OpenAI API call first
   CN: 首先测试简单的OpenAI API调用
