import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ReportData } from "../types";

export const generateResearchReport = async (target: string, indication: string): Promise<ReportData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      biologicalOverview: {
        type: Type.OBJECT,
        properties: {
          structuralDomains: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
              },
            },
          },
          mechanisticInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
          humanValidation: { type: Type.STRING },
          speciesConservation: { type: Type.STRING },
        },
      },
      therapeuticRationale: {
        type: Type.OBJECT,
        properties: {
          pathwayPositioning: { type: Type.STRING },
          specificityVsBreadth: { type: Type.STRING },
          modalityComparison: { type: Type.STRING },
        },
      },
      preClinicalEvidence: {
        type: Type.OBJECT,
        properties: {
          humanGenetics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                variant: { type: Type.STRING },
                significance: { type: Type.STRING },
              }
            }
          },
          animalModels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                model: { type: Type.STRING },
                outcome: { type: Type.STRING },
              }
            }
          },
        },
      },
      drugTrialLandscape: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          competitors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                moleculeName: { type: Type.STRING },
                phase: { type: Type.STRING },
                mechanism: { type: Type.STRING },
              },
            },
          },
          phaseCount: {
            type: Type.OBJECT,
            properties: {
              preclinical: { type: Type.INTEGER },
              phase1: { type: Type.INTEGER },
              phase2: { type: Type.INTEGER },
              phase3: { type: Type.INTEGER },
              approved: { type: Type.INTEGER },
            },
          },
        },
      },
      patentIP: {
        type: Type.OBJECT,
        properties: {
          recentFilings: {
            type: Type.ARRAY,
            items: {
               type: Type.OBJECT,
               properties: {
                 assignee: { type: Type.STRING },
                 year: { type: Type.STRING },
                 focus: { type: Type.STRING },
               }
            }
          },
          strategy: { type: Type.STRING },
        },
      },
      indicationPotential: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.INTEGER, description: "Calculated Score from 0 to 10" },
          reasoning: { type: Type.STRING },
        }
      },
      differentiation: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          advantages: { type: Type.ARRAY, items: { type: Type.STRING } },
          disadvantages: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
      unmetNeeds: {
        type: Type.OBJECT,
        properties: {
          responseRates: { type: Type.STRING },
          resistance: { type: Type.STRING },
          safetyLimitations: { type: Type.STRING },
        },
      },
      indicationSpecificAnalysis: { type: Type.STRING },
      risks: {
        type: Type.OBJECT,
        properties: {
          clinical: { type: Type.INTEGER, description: "Risk score 0-100 (100 is high risk)" },
          safety: { type: Type.INTEGER, description: "Risk score 0-100" },
          competitive: { type: Type.INTEGER, description: "Risk score 0-100" },
          technical: { type: Type.INTEGER, description: "Risk score 0-100" },
          riskAnalysis: { type: Type.STRING },
        },
      },
      biomarkerStrategy: { type: Type.STRING },
      bdPotentials: {
        type: Type.OBJECT,
        properties: {
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                description: { type: Type.STRING },
              },
            },
          },
          interestedParties: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
  };

  const prompt = `
    Conduct a deep comprehensive research analysis for the drug target "${target}" specifically for the indication "${indication}".
    You must use the 'googleSearch' tool to find the most recent clinical trials, patent filings, and business development news.
    
    Fill out the response following the JSON schema provided. 
    Focus on structured data (arrays, lists) suitable for visualization rather than long paragraphs.
    Keep text descriptions concise and high-density.
    
    Specific Instructions:
    - 'structuralDomains': List key domains (e.g., Kinase domain, CARD domain) and a brief 1-sentence description of their function.
    - 'mechanisticInsights': Provide a step-by-step breakdown of the mechanism as an ordered list of strings.
    - 'preClinicalEvidence': Break down into specific models and outcomes.
    - 'patentIP.recentFilings': List top 3-5 relevant recent patent assignees/years.
    
    **Indication Potential Scoring Criteria (STABILITY REQUIRED):**
    To determine the 'indicationPotential.score' (0-10), strictly evaluate the following 5 dimensions. Assign 0-2 points for each, then sum them up:
    1. **Unmet Need**: (0=Low, 2=High/Critical)
    2. **Scientific Rationale**: (0=Weak link, 2=Strong genetic/mechanistic validation)
    3. **Competition**: (0=Crowded/Commoditized, 2=First-in-class/Best-in-class opportunity)
    4. **Clinical Feasibility**: (0=Hard endpoints/High failure rate, 2=Clear path)
    5. **Commercial Size**: (0=Niche, 2=Blockbuster potential)
    Sum these values to get the final score. Explain this calculation in the 'reasoning' field.

    - 'risks': Provide numerical scores 0-100.
    
    Ensure all data is scientific and actionable.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        tools: [{ googleSearch: {} }],
        // Use thinkingConfig to stabilize the reasoning process, especially for the score.
        thinkingConfig: { thinkingBudget: 2048 }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");
    
    const data = JSON.parse(text);

    // --- Generate Mechanism Diagram Image with Fallback ---
    let mechanismImage: string | undefined = undefined;
    const mechanismText = data.biologicalOverview.mechanisticInsights.join(". ");
    const imagePrompt = `Scientific schematic diagram illustrating the biological mechanism of action for ${target}. Steps to illustrate: ${mechanismText}. Style: Clean, professional, textbook medical illustration, white background, high resolution, schematic. Labels should be legible and standard scientific font.`;

    try {
        // Attempt 1: High quality model
        const imageResponse = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: imagePrompt }] },
            config: {
                imageConfig: {
                    aspectRatio: "4:3",
                    imageSize: "1K"
                }
            }
        });
        
        for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                mechanismImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                break;
            }
        }
    } catch (proError) {
        console.warn("Pro image generation failed, falling back to Flash", proError);
        try {
             // Attempt 2: Faster/Cheaper model fallback
             const fallbackResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: imagePrompt }] },
                config: {
                    // Flash image does not support imageSize/aspectRatio in the same way via config object in some versions,
                    // but the SDK handles it. We keep it simple.
                }
             });
             
             for (const part of fallbackResponse.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    mechanismImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                    break;
                }
            }
        } catch (flashError) {
            console.error("All image generation failed", flashError);
        }
    }

    return { 
        ...data, 
        target, 
        indication,
        biologicalOverview: {
            ...data.biologicalOverview,
            mechanismImage
        }
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
