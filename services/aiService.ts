// AI Service for Poultry Farming Assistant
export interface AIMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

// Comprehensive Real-World Poultry Disease Database
const POULTRY_DISEASES = {
  // Viral Diseases
  newcastle: {
    name: "Newcastle Disease (NDV)",
    type: "Viral",
    symptoms: ["Respiratory distress", "Nervous signs", "Diarrhea", "Drop in egg production", "Sudden death"],
    transmission: "Airborne, contaminated feed/water, wild birds",
    prevention: "Vaccination (La Sota, B1), biosecurity, quarantine",
    treatment: "No specific treatment, supportive care, antibiotics for secondary infections",
    mortality: "10-100% depending on strain",
    incubation: "2-15 days"
  },
  avianInfluenza: {
    name: "Avian Influenza (Bird Flu)",
    type: "Viral",
    symptoms: ["Sudden death", "Respiratory distress", "Swollen head", "Blue comb", "Decreased egg production"],
    transmission: "Wild birds, contaminated equipment, airborne",
    prevention: "Biosecurity, avoid wild bird contact, vaccination in endemic areas",
    treatment: "No treatment, immediate culling and disinfection",
    mortality: "Up to 100% (HPAI)",
    incubation: "1-7 days"
  },
  infectiousBronchitis: {
    name: "Infectious Bronchitis (IBV)",
    type: "Viral",
    symptoms: ["Coughing", "Sneezing", "Nasal discharge", "Poor egg quality", "Kidney damage"],
    transmission: "Airborne droplets, contaminated equipment",
    prevention: "Vaccination (H120, H52), good ventilation",
    treatment: "Supportive care, antibiotics for secondary infections",
    mortality: "5-25%",
    incubation: "18-36 hours"
  },
  mareksDisease: {
    name: "Marek's Disease",
    type: "Viral (Herpesvirus)",
    symptoms: ["Paralysis of legs/wings", "Tumors", "Iris color changes", "Weight loss"],
    transmission: "Feather dander, airborne",
    prevention: "Vaccination at day-old (HVT, CVI988)",
    treatment: "No treatment available",
    mortality: "10-50%",
    incubation: "2-16 weeks"
  },
  fowlPox: {
    name: "Fowl Pox",
    type: "Viral",
    symptoms: ["Skin lesions on comb/wattles", "Mouth/throat lesions", "Breathing difficulty"],
    transmission: "Mosquitoes, direct contact, contaminated surfaces",
    prevention: "Vaccination, mosquito control",
    treatment: "Supportive care, antiseptic treatment of lesions",
    mortality: "5-50% (wet form)",
    incubation: "4-10 days"
  },
  
  // Bacterial Diseases
  salmonella: {
    name: "Salmonellosis",
    type: "Bacterial",
    symptoms: ["Diarrhea", "Dehydration", "Decreased appetite", "Sudden death in chicks"],
    transmission: "Contaminated feed/water, vertical transmission",
    prevention: "Feed hygiene, water sanitation, vaccination",
    treatment: "Antibiotics (enrofloxacin, trimethoprim-sulfa)",
    mortality: "10-20%",
    incubation: "6-72 hours"
  },
  colibacillosis: {
    name: "Colibacillosis (E. coli)",
    type: "Bacterial",
    symptoms: ["Respiratory distress", "Peritonitis", "Septicemia", "Swollen joints"],
    transmission: "Environmental contamination, stress factors",
    prevention: "Good hygiene, stress reduction, proper ventilation",
    treatment: "Antibiotics based on sensitivity testing",
    mortality: "Variable (5-25%)",
    incubation: "1-3 days"
  },
  fowlCholera: {
    name: "Fowl Cholera (Pasteurellosis)",
    type: "Bacterial",
    symptoms: ["Sudden death", "Fever", "Diarrhea", "Respiratory distress"],
    transmission: "Contaminated water, wild birds, rodents",
    prevention: "Vaccination, biosecurity, rodent control",
    treatment: "Antibiotics (penicillin, tetracycline)",
    mortality: "0-20%",
    incubation: "1-3 days"
  },
  
  // Parasitic Diseases
  coccidiosis: {
    name: "Coccidiosis",
    type: "Parasitic (Protozoan)",
    symptoms: ["Bloody diarrhea", "Weight loss", "Pale comb", "Huddling", "Reduced feed intake"],
    transmission: "Contaminated litter, overcrowding, moisture",
    prevention: "Anticoccidials in feed, dry litter management",
    treatment: "Anticoccidial drugs (amprolium, toltrazuril)",
    mortality: "10-80% if untreated",
    incubation: "4-7 days"
  },
  roundworms: {
    name: "Roundworms (Ascaridia)",
    type: "Parasitic (Helminth)",
    symptoms: ["Weight loss", "Diarrhea", "Intestinal blockage", "Poor growth"],
    transmission: "Contaminated soil, earthworms",
    prevention: "Regular deworming, clean environment",
    treatment: "Anthelmintics (levamisole, fenbendazole)",
    mortality: "Low unless severe infestation",
    incubation: "35-50 days"
  },
  
  // Fungal Diseases
  aspergillosis: {
    name: "Aspergillosis",
    type: "Fungal",
    symptoms: ["Respiratory distress", "Gasping", "Decreased appetite", "Nervous signs"],
    transmission: "Moldy feed, poor ventilation, dusty conditions",
    prevention: "Quality feed storage, good ventilation, low humidity",
    treatment: "Antifungal drugs (limited effectiveness)",
    mortality: "High in acute cases",
    incubation: "3-7 days"
  },
  
  // Nutritional Diseases
  rickets: {
    name: "Rickets",
    type: "Nutritional (Vitamin D deficiency)",
    symptoms: ["Soft bones", "Leg deformities", "Poor growth", "Thin eggshells"],
    transmission: "Not infectious - nutritional deficiency",
    prevention: "Adequate vitamin D3, calcium, phosphorus in diet",
    treatment: "Vitamin D3 supplementation, improved diet",
    mortality: "Low, mainly affects growth",
    incubation: "Weeks to months"
  },
  
  // Additional Important Diseases
  gumboro: {
    name: "Gumboro Disease (IBD)",
    type: "Viral",
    symptoms: ["Depression", "Watery diarrhea", "Dehydration", "Ruffled feathers", "Sudden death"],
    transmission: "Highly contagious, contaminated equipment, personnel",
    prevention: "Vaccination at 10-14 days, strict biosecurity",
    treatment: "No specific treatment, supportive care",
    mortality: "10-30%",
    incubation: "2-3 days"
  },
  
  pullorum: {
    name: "Pullorum Disease",
    type: "Bacterial (Salmonella pullorum)",
    symptoms: ["White diarrhea", "Huddling", "Gasping", "High chick mortality"],
    transmission: "Vertical transmission, contaminated incubators",
    prevention: "Test breeding stock, hatchery sanitation",
    treatment: "Antibiotics (limited effectiveness)",
    mortality: "80-100% in chicks",
    incubation: "4-5 days"
  },
  
  fowlTyphoid: {
    name: "Fowl Typhoid",
    type: "Bacterial (Salmonella gallinarum)",
    symptoms: ["Sudden death", "Yellow diarrhea", "Anemia", "Bronze-colored liver"],
    transmission: "Contaminated feed/water, carrier birds",
    prevention: "Test and cull carriers, sanitation",
    treatment: "Antibiotics (enrofloxacin)",
    mortality: "10-15%",
    incubation: "4-5 days"
  },
  
  mycoplasmosis: {
    name: "Mycoplasmosis (CRD)",
    type: "Bacterial (Mycoplasma)",
    symptoms: ["Coughing", "Nasal discharge", "Swollen sinuses", "Reduced egg production"],
    transmission: "Airborne, vertical transmission",
    prevention: "Mycoplasma-free breeding stock, vaccination",
    treatment: "Antibiotics (tylosin, erythromycin)",
    mortality: "5-10%",
    incubation: "6-21 days"
  },
  
  blackhead: {
    name: "Blackhead Disease",
    type: "Parasitic (Histomonas)",
    symptoms: ["Sulfur-yellow diarrhea", "Darkened head", "Listlessness", "Liver lesions"],
    transmission: "Earthworms, cecal worms",
    prevention: "Worm control, avoid wet litter",
    treatment: "Metronidazole (where legal)",
    mortality: "80-100% in turkeys",
    incubation: "15-20 days"
  },
  
  eggDropSyndrome: {
    name: "Egg Drop Syndrome",
    type: "Viral (Adenovirus)",
    symptoms: ["Sudden drop in egg production", "Soft-shelled eggs", "Pale eggs", "No other symptoms"],
    transmission: "Wild birds, contaminated water",
    prevention: "Vaccination, biosecurity",
    treatment: "No treatment, supportive care",
    mortality: "Very low",
    incubation: "7-10 days"
  },
  
  vitaminADeficiency: {
    name: "Vitamin A Deficiency",
    type: "Nutritional",
    symptoms: ["Night blindness", "Nasal discharge", "Poor growth", "Respiratory infections"],
    transmission: "Not infectious - nutritional deficiency",
    prevention: "Adequate vitamin A in diet, green feeds",
    treatment: "Vitamin A supplementation",
    mortality: "Low, but increases susceptibility",
    incubation: "Weeks to months"
  }
};

// Comprehensive Poultry Farming Knowledge Base
const POULTRY_KNOWLEDGE = {
  diseases: {
    keywords: ['disease', 'sick', 'illness', 'symptoms', 'infection', 'health', 'Newcastle', 'avian flu', 'coccidiosis', 'salmonella', 'marek', 'bronchitis', 'fowl pox', 'cholera', 'colibacillosis', 'roundworm', 'aspergillosis', 'rickets', 'mortality', 'death', 'treatment', 'prevention', 'vaccine'],
    responses: [
      "🏥 **Major Poultry Diseases:**\n\n**VIRAL:**\n• Newcastle Disease - Respiratory, nervous signs, high mortality\n• Avian Influenza - Sudden death, respiratory distress\n• Infectious Bronchitis - Coughing, poor egg quality\n• Marek's Disease - Paralysis, tumors\n• Fowl Pox - Skin lesions, breathing issues\n\n**BACTERIAL:**\n• Salmonellosis - Diarrhea, sudden death in chicks\n• E. coli - Respiratory, septicemia\n• Fowl Cholera - Sudden death, fever\n\n**PARASITIC:**\n• Coccidiosis - Bloody diarrhea, weight loss\n• Roundworms - Poor growth, intestinal issues",
      "🩺 **Disease Prevention Protocol:**\n\n**Biosecurity:**\n• Restrict farm access\n• Disinfection footbaths\n• Clean equipment between flocks\n• Control wild birds and rodents\n\n**Vaccination Schedule:**\n• Day 1: Marek's disease\n• Day 7-10: Newcastle + Infectious Bronchitis\n• Week 4: Newcastle booster\n• Week 16: Newcastle + IB (layers)\n\n**Management:**\n• Quality feed and water\n• Proper ventilation\n• Regular health monitoring\n• Immediate isolation of sick birds",
      "⚠️ **Emergency Disease Response:**\n\n**High Mortality (>5% daily):**\n1. Immediate isolation of affected birds\n2. Contact veterinarian urgently\n3. Collect samples for laboratory testing\n4. Implement strict biosecurity\n5. Document all symptoms and timeline\n\n**Sample Collection:**\n• Fresh dead birds (within 2 hours)\n• Live sick birds for examination\n• Feed and water samples\n• Environmental swabs\n\n**Quarantine Protocol:**\n• Stop all bird movement\n• Disinfect equipment\n• Change clothes/boots\n• Limit access to essential personnel"
    ]
  },
  nutrition: {
    keywords: ['feed', 'nutrition', 'diet', 'food', 'protein', 'calcium', 'vitamins', 'supplements'],
    responses: [
      "🌾 **Poultry Nutrition Guidelines:**\n\n**Layers (18+ weeks):**\n• Protein: 16-18%\n• Calcium: 3.5-4%\n• Energy: 2750-2850 kcal/kg\n\n**Broilers:**\n• Starter (0-3 weeks): 23% protein\n• Grower (3-6 weeks): 20% protein\n• Finisher (6+ weeks): 18% protein\n\n**Essential:** Clean water, grit for digestion, vitamin supplements",
      "🥬 **Natural Feed Supplements:**\n\n• **Greens:** Spinach, kale, lettuce\n• **Grains:** Corn, wheat, barley\n• **Protein:** Mealworms, fish meal\n• **Calcium:** Oyster shells, limestone\n• **Herbs:** Oregano (natural antibiotic), garlic (immune boost)\n\n**Avoid:** Chocolate, avocado, onions, raw beans"
    ]
  },
  housing: {
    keywords: ['housing', 'coop', 'shelter', 'ventilation', 'space', 'temperature', 'lighting'],
    responses: [
      "🏠 **Optimal Housing Conditions:**\n\n**Space Requirements:**\n• Layers: 4 sq ft per bird in coop, 10 sq ft in run\n• Broilers: 1-2 sq ft per bird\n\n**Environment:**\n• Temperature: 65-75°F (18-24°C)\n• Humidity: 50-70%\n• Ventilation: 1 sq ft per 10 birds\n• Lighting: 14-16 hours for layers\n\n**Features:** Nesting boxes, perches, easy cleaning access",
      "🌡️ **Climate Control Tips:**\n\n**Ventilation:**\n• Prevent drafts but ensure air circulation\n• Use ridge vents and side openings\n• Install fans for hot weather\n\n**Insulation:**\n• Proper insulation for temperature control\n• Reflective roofing for hot climates\n• Windbreaks for cold areas\n\n**Monitoring:** Use thermometers and humidity gauges"
    ]
  },
  production: {
    keywords: ['eggs', 'production', 'laying', 'broiler', 'growth', 'weight', 'performance'],
    responses: [
      "🥚 **Improving Egg Production:**\n\n**Key Factors:**\n• Consistent 14-16 hour lighting\n• Balanced nutrition (16-18% protein)\n• Adequate calcium (3.5-4%)\n• Clean, stress-free environment\n• Regular health monitoring\n\n**Expected Production:**\n• Peak: 90-95% at 25-30 weeks\n• Commercial: 80-85% average\n• Decline: 2-5% per month after peak",
      "📈 **Broiler Growth Optimization:**\n\n**Growth Targets:**\n• Week 1: 150-200g\n• Week 3: 700-900g\n• Week 6: 2.2-2.5kg\n\n**Success Factors:**\n• High-protein starter feed\n• Optimal temperature (32°C week 1, reduce 3°C weekly)\n• 23-24 hours lighting first week\n• Clean water access\n• Proper ventilation"
    ]
  },
  management: {
    keywords: ['management', 'biosecurity', 'cleaning', 'vaccination', 'record', 'monitoring'],
    responses: [
      "📋 **Farm Management Best Practices:**\n\n**Daily Tasks:**\n• Check water and feed levels\n• Observe bird behavior and health\n• Collect and grade eggs\n• Record production data\n• Clean feeders and waterers\n\n**Weekly Tasks:**\n• Deep clean housing\n• Check equipment\n• Review health records\n• Plan feed orders",
      "🛡️ **Biosecurity Protocol:**\n\n**Access Control:**\n• Limit farm visitors\n• Disinfection footbaths\n• Protective clothing\n• Vehicle disinfection\n\n**Disease Prevention:**\n• Quarantine new birds\n• Control rodents and wild birds\n• Proper waste disposal\n• Regular health monitoring\n• Vaccination schedules"
    ]
  },
  emergency: {
    keywords: ['emergency', 'urgent', 'help', 'problem', 'crisis', 'mortality', 'sudden'],
    responses: [
      "🚨 **Emergency Response Guide:**\n\n**High Mortality (>5% daily):**\n1. Isolate affected birds immediately\n2. Contact veterinarian urgently\n3. Collect samples for testing\n4. Implement strict biosecurity\n5. Document all symptoms\n\n**Immediate Actions:**\n• Stop movement of birds\n• Disinfect equipment\n• Review recent changes\n• Check water quality",
      "⚡ **Quick Problem Solutions:**\n\n**Sudden Drop in Egg Production:**\n• Check lighting schedule\n• Review feed quality\n• Monitor for stress factors\n• Examine for parasites\n\n**Respiratory Issues:**\n• Improve ventilation\n• Check for ammonia buildup\n• Reduce overcrowding\n• Consider vaccination status"
    ]
  }
};

// Symptom-based quick diagnostics
export const SYMPTOM_CHECKER = {
  respiratorySymptoms: {
    keywords: ['cough', 'sneeze', 'breathing', 'respiratory', 'gasping', 'wheeze'],
    possibleDiseases: ['Newcastle Disease', 'Infectious Bronchitis', 'Avian Influenza', 'Mycoplasmosis', 'Aspergillosis'],
    response: "🫁 **Respiratory Symptoms Detected**\n\nPossible causes:\n• Newcastle Disease\n• Infectious Bronchitis\n• Mycoplasmosis (CRD)\n• Aspergillosis\n\n**Immediate Actions:**\n1. Isolate affected birds\n2. Improve ventilation\n3. Check for ammonia buildup\n4. Contact veterinarian\n5. Consider vaccination status"
  },
  
  digestiveSymptoms: {
    keywords: ['diarrhea', 'bloody', 'yellow', 'white', 'loose', 'droppings'],
    possibleDiseases: ['Coccidiosis', 'Salmonellosis', 'Pullorum', 'Fowl Typhoid', 'Blackhead'],
    response: "💩 **Digestive Symptoms Detected**\n\nPossible causes:\n• Coccidiosis (bloody diarrhea)\n• Pullorum (white diarrhea)\n• Fowl Typhoid (yellow diarrhea)\n• Salmonellosis\n• Blackhead Disease\n\n**Immediate Actions:**\n1. Check water quality\n2. Review feed quality\n3. Improve sanitation\n4. Consider anticoccidial treatment\n5. Collect samples for testing"
  },
  
  nervousSymptoms: {
    keywords: ['paralysis', 'twist', 'neck', 'convulsion', 'nervous', 'tremor'],
    possibleDiseases: ['Newcastle Disease', 'Marek\'s Disease', 'Vitamin deficiency'],
    response: "🧠 **Nervous Symptoms Detected**\n\nPossible causes:\n• Newcastle Disease\n• Marek's Disease\n• Vitamin E/B1 deficiency\n• Toxicity\n\n**Immediate Actions:**\n1. Isolate affected birds immediately\n2. Check vaccination records\n3. Review feed for toxins\n4. Contact veterinarian urgently\n5. Document all symptoms"
  },
  
  suddenDeath: {
    keywords: ['sudden death', 'mortality', 'died', 'dead', 'found dead'],
    possibleDiseases: ['Avian Influenza', 'Newcastle Disease', 'Fowl Cholera', 'Heart failure'],
    response: "☠️ **Sudden Death Alert**\n\nPossible causes:\n• Avian Influenza (EMERGENCY)\n• Newcastle Disease\n• Fowl Cholera\n• Heart failure\n• Toxicity\n\n**URGENT ACTIONS:**\n1. STOP all bird movement\n2. Contact veterinarian IMMEDIATELY\n3. Collect fresh samples\n4. Implement strict biosecurity\n5. Document timeline and numbers\n6. Report to authorities if required"
  }
};

// Quick response suggestions
export const QUICK_SUGGESTIONS = [
  { text: "My chickens are coughing and sneezing", icon: "medical-outline" },
  { text: "Birds have bloody diarrhea", icon: "warning-outline" },
  { text: "Sudden death in my flock", icon: "skull-outline" },
  { text: "Egg production has dropped", icon: "trending-down-outline" },
  { text: "Best vaccination schedule?", icon: "shield-outline" },
  { text: "How to prevent diseases?", icon: "checkmark-circle-outline" }
];

export class AIService {
  private static getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Advanced disease diagnosis based on symptoms
  private static diagnoseDiseaseBySymptoms(question: string): string | null {
    const lowerQuestion = question.toLowerCase();
    const matchedDiseases: Array<{disease: any, score: number}> = [];
    
    // Check each disease for symptom matches
    for (const [key, disease] of Object.entries(POULTRY_DISEASES)) {
      let score = 0;
      
      // Check if disease name is mentioned
      if (lowerQuestion.includes(disease.name.toLowerCase()) || 
          lowerQuestion.includes(key.toLowerCase())) {
        score += 10;
      }
      
      // Check symptoms
      for (const symptom of disease.symptoms) {
        const symptomWords = symptom.toLowerCase().split(' ');
        for (const word of symptomWords) {
          if (word.length > 3 && lowerQuestion.includes(word)) {
            score += 2;
          }
        }
      }
      
      // Check transmission method
      if (disease.transmission && lowerQuestion.includes('spread') || lowerQuestion.includes('transmit')) {
        score += 1;
      }
      
      if (score > 0) {
        matchedDiseases.push({ disease, score });
      }
    }
    
    // Sort by score and return best match
    if (matchedDiseases.length > 0) {
      matchedDiseases.sort((a, b) => b.score - a.score);
      const topMatch = matchedDiseases[0].disease;
      
      return this.formatDiseaseInfo(topMatch);
    }
    
    return null;
  }
  
  private static formatDiseaseInfo(disease: any): string {
    return `🦠 **${disease.name}**\n\n` +
           `**Type:** ${disease.type}\n\n` +
           `**Symptoms:**\n${disease.symptoms.map((s: string) => `• ${s}`).join('\n')}\n\n` +
           `**Transmission:** ${disease.transmission}\n\n` +
           `**Prevention:** ${disease.prevention}\n\n` +
           `**Treatment:** ${disease.treatment}\n\n` +
           `**Mortality Rate:** ${disease.mortality}\n\n` +
           `**Incubation Period:** ${disease.incubation}\n\n` +
           `⚠️ **Immediate Action:** Isolate affected birds and contact a veterinarian for proper diagnosis and treatment.`;
  }

  private static findBestMatch(question: string): string | null {
    const lowerQuestion = question.toLowerCase();
    
    // First check symptom-based diagnosis
    for (const [category, data] of Object.entries(SYMPTOM_CHECKER)) {
      for (const keyword of data.keywords) {
        if (lowerQuestion.includes(keyword)) {
          return data.response;
        }
      }
    }
    
    // Then try specific disease diagnosis
    const diseaseMatch = this.diagnoseDiseaseBySymptoms(question);
    if (diseaseMatch) {
      return diseaseMatch;
    }
    
    // Finally check general knowledge categories
    for (const [category, data] of Object.entries(POULTRY_KNOWLEDGE)) {
      for (const keyword of data.keywords) {
        if (lowerQuestion.includes(keyword)) {
          return this.getRandomResponse(data.responses);
        }
      }
    }
    
    return null;
  }

  private static getDefaultResponse(): string {
    const defaultResponses = [
      "🤔 I'd be happy to help with your poultry farming question! Could you be more specific about what you'd like to know? I can assist with:\n\n• Disease prevention and treatment\n• Nutrition and feeding\n• Housing and management\n• Egg production optimization\n• Broiler growth\n• Emergency situations",
      "🐔 I'm here to help with all your poultry farming needs! Try asking about:\n\n• Common diseases and symptoms\n• Feed requirements and nutrition\n• Housing setup and ventilation\n• Production optimization\n• Biosecurity measures\n• Daily management tasks",
      "👨‍🌾 As your AI farming assistant, I can provide expert advice on poultry management. What specific area would you like help with?\n\n• Health and disease management\n• Feeding and nutrition\n• Housing and environment\n• Production and performance\n• Farm management practices"
    ];
    
    return this.getRandomResponse(defaultResponses);
  }

  public static async generateResponse(question: string): Promise<string> {
    // Check if question is pH-related and use local AI service
    const phMatch = question.match(/\b(ph|pH|Ph)\s*(\d+\.?\d*)/);
    if (phMatch || 
        question.toLowerCase().includes('acid') || 
        question.toLowerCase().includes('alkalo')) {
      // Use local AI service for pH and disease-related questions
      const { LocalAIService } = await import('./localAIService');
      return await LocalAIService.generateResponse(question);
    }
    
    // Simulate AI thinking time for other questions
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Try to find a specific response
    const specificResponse = this.findBestMatch(question);
    
    if (specificResponse) {
      return specificResponse;
    }
    
    // Return default response if no match found
    return this.getDefaultResponse();
  }

  public static createMessage(text: string, isUser: boolean, isTyping = false): AIMessage {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      isUser,
      timestamp: new Date(),
      isTyping
    };
  }

  public static getWelcomeMessage(): AIMessage {
    return this.createMessage(
      "🤖 Hello! I'm your advanced AI poultry veterinary assistant. I have comprehensive knowledge of:\n\n🏥 **Disease Diagnosis:**\n• 15+ major poultry diseases\n• Symptom-based diagnosis\n• Treatment protocols\n• Emergency response\n\n📋 **Expert Guidance:**\n• Vaccination schedules\n• Biosecurity protocols\n• Nutrition optimization\n• Housing management\n\n💡 **Try asking:**\n• \"My chickens are coughing\"\n• \"Birds have bloody diarrhea\"\n• \"What is Newcastle disease?\"\n• \"Best vaccination schedule?\"\n\nHow can I help with your flock today? 🐔",
      false
    );
  }
}
