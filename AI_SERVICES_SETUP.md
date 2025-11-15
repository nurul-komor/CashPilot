# Gemini AI Services Setup Guide

## Quick Setup Steps

### 1. Add API Key to .env

Add this line to your `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

### 2. Clear Configuration Cache

Run these commands to ensure Laravel picks up the new configuration:

```bash
php artisan config:clear
php artisan route:clear
```

### 3. Test the API Endpoints

All endpoints are protected with `auth:sanctum` middleware. You need to be authenticated to use them.

#### Example: Test Category Suggestion

```bash
curl -X POST http://localhost:8000/api/ai/suggest-category \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Bought groceries at Walmart",
    "amount": "50.00"
  }'
```

#### Example: Test Natural Language Transaction

```bash
curl -X POST http://localhost:8000/api/ai/natural-language \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Spent $50 on groceries at Walmart yesterday"
  }'
```

#### Example: Get Financial Insights

```bash
curl -X GET "http://localhost:8000/api/ai/insights?period=monthly" \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN"
```

## Available Endpoints

### Receipt OCR
- **POST** `/api/ai/receipt-ocr`
- Upload a receipt image to extract transaction data
- Body: `receipt` (file, image)

### Category Suggestion
- **POST** `/api/ai/suggest-category`
- Get category and tag suggestions for a transaction
- Body: `description` (string), `amount` (optional, number)

### Natural Language Transaction
- **POST** `/api/ai/natural-language`
- Parse natural language input into structured transaction data
- Body: `input` (string)

### Financial Insights
- **GET** `/api/ai/insights?period=monthly`
- Get financial insights and recommendations
- Query: `period` (optional: weekly, monthly, yearly)

### Budget Recommendations
- **GET** `/api/ai/insights/budget-recommendations`
- Get personalized budget recommendations

### Financial Summary
- **GET** `/api/ai/insights/summary?period=monthly`
- Get financial summary for a period

### Chat Assistant
- **POST** `/api/ai/chat`
- Chat with AI assistant about your finances
- Body: `message` (string), `conversation_history` (optional, array)

### Description Enhancement
- **POST** `/api/ai/enhance-description`
- Enhance transaction descriptions
- Body: `description` (string), `context` (optional, object)

### Anomaly Detection
- **GET** `/api/ai/anomalies?limit=50`
- Detect anomalies in transactions
- Query: `limit` (optional, number)

### Check Transaction Anomaly
- **POST** `/api/ai/anomalies/check`
- Check if a specific transaction is anomalous
- Body: `transaction_data` (object with type, amount, description)

## Frontend Integration

To use these services in your React frontend, you can create API calls like:

```typescript
// Example: Get category suggestions
const getCategorySuggestions = async (description: string, amount?: string) => {
  const response = await axios.post('/api/ai/suggest-category', {
    description,
    amount,
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

// Example: Parse natural language
const parseNaturalLanguage = async (input: string) => {
  const response = await axios.post('/api/ai/natural-language', {
    input,
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};
```

## Troubleshooting

### Routes not showing up?
- Run: `php artisan route:clear && php artisan route:list --path=api/ai`

### API key not working?
- Verify the key is in `.env` file
- Run: `php artisan config:clear`
- Check the key is valid at https://makersuite.google.com/app/apikey

### Getting 401 Unauthorized?
- Make sure you're sending a valid Sanctum token
- Check your authentication middleware is working

### Getting 500 errors?
- Check Laravel logs: `storage/logs/laravel.log`
- Verify your Gemini API key is valid
- Check that you have transactions/categories in your database for context

## Configuration Options

You can customize Gemini behavior in `config/gemini.php`:

- `GEMINI_MODEL` - Model to use (default: gemini-pro)
- `GEMINI_VISION_MODEL` - Vision model for images (default: gemini-pro-vision)
- `GEMINI_TEMPERATURE` - Response creativity (0.0-1.0, default: 0.7)
- `GEMINI_MAX_TOKENS` - Maximum response length (default: 2048)
- `GEMINI_CACHE_ENABLED` - Enable response caching (default: true)
- `GEMINI_CACHE_TTL` - Cache time in seconds (default: 3600)

