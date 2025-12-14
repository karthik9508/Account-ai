export interface TransactionAnalysis {
    category: 'sales' | 'purchase' | 'expense' | 'income'
    description: string
    amount: number
    party_name: string | null
}

const SYSTEM_PROMPT = `You are an accounting assistant. Analyze the user's transaction description and extract the following information in JSON format:

1. category: Must be one of: "sales", "purchase", "expense", "income"
   - "sales": Selling goods or services to customers
   - "purchase": Buying inventory, raw materials, or goods for resale
   - "expense": Business expenses like rent, utilities, office supplies, salaries
   - "income": Money received (interest, dividends, rent received, consulting fees, payments)

2. description: A brief, clear description of the transaction (max 100 characters)

3. amount: The numerical amount in INR (just the number, no currency symbol). If not specified, use 0.

4. party_name: Name of the customer, vendor, or other party involved (null if not mentioned)

IMPORTANT: 
- Respond ONLY with valid JSON, no markdown or extra text
- If the input is unclear or not a valid transaction, still provide your best interpretation
- Always extract an amount if mentioned in any format (e.g., "5000", "₹5,000", "5k", "5 thousand")

Example input: "Sold 10 laptops to ABC Corp for 5 lakh rupees"
Example output: {"category":"sales","description":"Sold 10 laptops to ABC Corp","amount":500000,"party_name":"ABC Corp"}`

// Models available to this API key (discovered from ListModels)
const MODELS_CONFIG = [
    { apiVersion: 'v1beta', model: 'gemini-2.5-flash' },
    { apiVersion: 'v1beta', model: 'gemini-2.0-flash' },
    { apiVersion: 'v1beta', model: 'gemini-2.5-pro' },
    { apiVersion: 'v1beta', model: 'gemini-2.0-flash-exp' },
]

async function callGeminiAPI(apiKey: string, apiVersion: string, model: string, prompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`

    console.log(`Trying: ${apiVersion}/models/${model}`)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `${SYSTEM_PROMPT}\n\nAnalyze this transaction: ${prompt}`
                }]
            }],
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 500,
            }
        })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || `API returned ${response.status}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// First, let's list available models to help debug
async function listModels(apiKey: string): Promise<string[]> {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        const response = await fetch(url)
        if (!response.ok) return []
        const data = await response.json()
        return data.models?.map((m: { name: string }) => m.name) || []
    } catch {
        return []
    }
}

export async function analyzeTransaction(prompt: string): Promise<TransactionAnalysis> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY

    if (!apiKey) {
        throw new Error('Gemini API key not configured. Please add GOOGLE_GEMINI_API_KEY to your .env.local file.')
    }

    // List available models for debugging
    const availableModels = await listModels(apiKey)
    if (availableModels.length > 0) {
        console.log('Available models:', availableModels.slice(0, 10))
    }

    let lastError: Error | null = null

    // Try each model configuration until one works
    for (const config of MODELS_CONFIG) {
        try {
            const responseText = await callGeminiAPI(apiKey, config.apiVersion, config.model, prompt)

            // Clean up the response - remove markdown code blocks if present
            let cleanedResponse = responseText.trim()
            if (cleanedResponse.startsWith('```json')) {
                cleanedResponse = cleanedResponse.slice(7)
            }
            if (cleanedResponse.startsWith('```')) {
                cleanedResponse = cleanedResponse.slice(3)
            }
            if (cleanedResponse.endsWith('```')) {
                cleanedResponse = cleanedResponse.slice(0, -3)
            }
            cleanedResponse = cleanedResponse.trim()

            const parsed = JSON.parse(cleanedResponse) as TransactionAnalysis

            // Validate category
            const validCategories = ['sales', 'purchase', 'expense', 'income']
            if (!validCategories.includes(parsed.category)) {
                parsed.category = 'expense'
            }

            // Ensure amount is a number
            parsed.amount = Number(parsed.amount) || 0

            console.log(`Successfully used: ${config.apiVersion}/models/${config.model}`)
            return parsed
        } catch (error) {
            console.log(`Failed ${config.apiVersion}/${config.model}:`, (error as Error).message)
            lastError = error as Error
        }
    }

    // All models failed - provide helpful error with available models
    let errorMsg = 'All AI models failed. '
    if (availableModels.length > 0) {
        errorMsg += `Available models: ${availableModels.slice(0, 5).join(', ')}`
    } else {
        errorMsg += 'Could not list available models. Your API key may be invalid or restricted.'
    }

    throw new Error(errorMsg)
}
