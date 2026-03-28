import axios from "axios";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const API_KEY = import.meta.env.VITE_GROQ_API_KEY?.trim();
const MODEL = import.meta.env.VITE_GROQ_MODEL || "llama-3.3-70b-versatile";

export const getGroqChatCompletion = async (messages, language = 'en') => {
  const langName = language === 'hi' ? 'Hindi' : 'English';
  let retries = 3;
  
  while (retries > 0) {
    try {
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: MODEL,
          messages: [
            {
              role: "system",
              content: `You are SUDARSHAN GRID, a helpful AI assistant specialized in Indian government schemes, laws, and digital safety. 
              IMPORTANT: Please provide all your responses in ${langName}. 
              If asked about schemes, focus on eligibility and benefits. If asked about links, warn about phishing.`
            },
            ...messages
          ],
        },
        {
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 30000 // 30s timeout
        }
      );

      return response.data.choices[0]?.message?.content || "No response from AI.";
    } catch (error) {
      retries--;
      console.error(`Groq API Error (Retries left: ${retries}):`, error.response?.data || error.message);
      
      if (retries === 0) {
        if (error.code === 'ECONNABORTED') return "The request timed out. Please try again.";
        return "Sorry, I'm having trouble connecting to the AI service. Please check your internet connection and try again.";
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

export const searchWikipedia = async (query) => {
  try {
    const res = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`, { timeout: 10000 });
    const snippets = res.data.query.search.map(s => s.snippet).join(" ");
    return snippets.replace(/<[^>]+>/g, "").substring(0, 1500);
  } catch (e) {
    return "Failed to search Wikipedia.";
  }
};

export const getRecommendedSchemes = async (user, language = 'en') => {
  const langName = language === 'hi' ? 'Hindi' : 'English';
  const tools = [
    {
      type: "function",
      function: {
        name: "search_wikipedia",
        description: "Search Wikipedia for Indian government schemes matching user profile.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" }
          },
          required: ["query"]
        }
      }
    }
  ];

  const systemMessage = {
    role: "system",
    content: `You are SUDARSHAN GRID, an expert AI specialized in Indian government schemes. 
    IMPORTANT: Provide your final response in ${langName}.
    Use the search_wikipedia tool to find real schemes based on user details.
    Return your final answer ONLY as a JSON object containing a "schemes" array.
    Each scheme MUST have: "name", "description", "category" (one of: cat_housing, cat_healthcare, cat_agriculture, cat_financial, cat_women), "eligibility", "state" (e.g. cat_national or State Name), "reason" (a short 1-sentence explanation of why this matches the user profile), and "official_url" (the direct link to the government's official application or information portal).`
  };

  const userProfile = `Age: ${user.age || 'N/A'}, Gender: ${user.gender || 'N/A'}, Occupation: ${user.occupation || 'N/A'}, Income: ${user.income || user.salary || 'N/A'}`;
  let messages = [
    systemMessage,
    { role: "user", content: `User Profile: ${userProfile}. Find me 3 best schemes and output in ${langName} as JSON.` }
  ];

  let retries = 2;
  while (retries >= 0) {
    try {
      let response = await axios.post(GROQ_API_URL, {
        model: "llama-3.1-8b-instant", // More stable for extraction on free tier
        messages: messages,
        tools: tools
      }, { 
        headers: { 
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 40000
      });

      let message = response.data.choices[0]?.message;

      if (message?.tool_calls) {
        messages.push(message);
        for (const toolCall of message.tool_calls) {
          if (toolCall.function.name === "search_wikipedia") {
            const args = JSON.parse(toolCall.function.arguments);
            const searchResult = await searchWikipedia(args.query);
            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: searchResult
            });
          }
        }

        messages.push({
          role: "system",
          content: `Now summarize the found schemes into the requested JSON format in ${langName}. Response must be valid JSON.`
        });

        response = await axios.post(GROQ_API_URL, {
          model: "llama-3.1-8b-instant",
          messages: messages,
          response_format: { type: "json_object" }
        }, { 
          headers: { 
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          },
          timeout: 40000
        });

        message = response.data.choices[0]?.message;
      }

      const content = message?.content || "{}";
      const parsed = JSON.parse(content);
      return parsed.schemes || [];
    } catch (error) {
      console.error("Groq scheme error:", error.response?.data || error);
      retries--;
      if (retries < 0) return [];
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
};
