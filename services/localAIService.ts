// Local AI Service with pH-Related Disease Knowledge Base
import { AIMessage } from './aiService';

// pH-Related Poultry Diseases Database
export const PH_DISEASE_DATABASE = {
  // ACIDOSIS (pH < 6.5) DISEASES
  acidosis: {
    'Metabolic Acidosis': {
      phRange: { min: 0, max: 6.0 },
      symptoms: ['Rapid breathing', 'Lethargy', 'Decreased feed intake', 'Weight loss', 'Diarrhea'],
      causes: ['Excessive grain feeding', 'Heat stress', 'Kidney dysfunction', 'Dehydration'],
      quickMeasures: [
        '🚰 Provide alkaline water (add baking soda: 1 tsp/gallon)',
        '🌾 Reduce grain intake immediately',
        '💊 Administer sodium bicarbonate orally',
        '🌿 Add crushed limestone to feed',
        '🔄 Improve ventilation to reduce heat stress',
        '📞 Contact veterinarian within 24 hours'
      ],
      treatment: 'Sodium bicarbonate therapy, dietary adjustment, hydration support',
      severity: 'high',
      mortality: '15-30% if untreated'
    },
    'Respiratory Acidosis': {
      phRange: { min: 4.5, max: 6.5 },
      symptoms: ['Gasping', 'Open-mouth breathing', 'Blue comb', 'Weakness'],
      causes: ['Poor ventilation', 'Ammonia buildup', 'Respiratory disease', 'High CO2 levels'],
      quickMeasures: [
        '🌬️ Immediately improve ventilation',
        '🧹 Clean and remove wet litter',
        '🚪 Open all windows and doors',
        '💨 Install fans if available',
        '🏥 Isolate affected birds',
        '⚡ Emergency vet consultation needed'
      ],
      treatment: 'Oxygen therapy, ventilation improvement, respiratory support',
      severity: 'critical',
      mortality: '40-60% in severe cases'
    },
    'Lactic Acidosis': {
      phRange: { min: 5.0, max: 6.5 },
      symptoms: ['Muscle weakness', 'Staggering', 'Decreased egg production', 'Pale combs'],
      causes: ['Grain overload', 'Sudden feed changes', 'Thiamine deficiency'],
      quickMeasures: [
        '🛑 Stop grain feeding immediately',
        '🥬 Provide green vegetables only',
        '💉 Vitamin B1 supplementation',
        '💧 Ensure constant water access',
        '🔬 Monitor pH every 4 hours',
        '📋 Keep detailed symptom log'
      ],
      treatment: 'Thiamine injection, dietary management, probiotics',
      severity: 'medium',
      mortality: '10-20% if caught early'
    },
    'Crop Acidosis': {
      phRange: { min: 4.0, max: 6.0 },
      symptoms: ['Sour crop', 'Regurgitation', 'Bad breath', 'Crop distension'],
      causes: ['Fungal infection', 'Spoiled feed', 'Slow crop emptying'],
      quickMeasures: [
        '🍄 Remove all potentially moldy feed',
        '🥤 Flush crop with clean water',
        '🍎 Add apple cider vinegar to water (1 tbsp/gallon)',
        '💊 Probiotics administration',
        '🚫 Withhold feed for 12 hours',
        '👁️ Check all birds for symptoms'
      ],
      treatment: 'Antifungal medication, crop flush, dietary adjustment',
      severity: 'medium',
      mortality: '5-15% with treatment'
    }
  },

  // ALKALOSIS (pH > 7.5) DISEASES
  alkalosis: {
    'Metabolic Alkalosis': {
      phRange: { min: 7.5, max: 9.0 },
      symptoms: ['Muscle tremors', 'Tetany', 'Decreased appetite', 'Egg shell quality issues'],
      causes: ['Excessive calcium supplementation', 'Loss of stomach acid', 'Over-medication'],
      quickMeasures: [
        '⛔ Stop all calcium supplements immediately',
        '🥤 Provide acidified water (apple cider vinegar)',
        '🌾 Switch to acidic grains temporarily',
        '💊 Administer ammonium chloride if available',
        '📊 Test water pH levels',
        '🔍 Review all supplements given'
      ],
      treatment: 'Acidification therapy, electrolyte balance, dietary adjustment',
      severity: 'medium',
      mortality: '10-25% depending on duration'
    },
    'Respiratory Alkalosis': {
      phRange: { min: 7.5, max: 8.5 },
      symptoms: ['Hyperventilation', 'Panting', 'Dizziness', 'Muscle spasms'],
      causes: ['Heat stress', 'Panic', 'High altitude', 'Pain response'],
      quickMeasures: [
        '❄️ Cool birds immediately (misting/fans)',
        '🌡️ Move to shaded area',
        '💧 Cold water with electrolytes',
        '🧊 Place ice packs near birds',
        '🌬️ Ensure air circulation',
        '😌 Reduce stress factors'
      ],
      treatment: 'Temperature control, stress reduction, breathing regulation',
      severity: 'medium',
      mortality: '5-15% in heat stress'
    },
    'Hypochloremic Alkalosis': {
      phRange: { min: 7.5, max: 8.5 },
      symptoms: ['Dehydration', 'Weakness', 'Decreased egg production', 'Poor growth'],
      causes: ['Vomiting', 'Excessive water consumption', 'Diuretic use', 'Salt deficiency'],
      quickMeasures: [
        '🧂 Add salt to water (0.2% solution)',
        '💊 Provide electrolyte supplements',
        '🥚 Monitor egg production closely',
        '📝 Track water consumption',
        '🔬 Test for underlying infections',
        '🏥 Veterinary consultation recommended'
      ],
      treatment: 'Chloride supplementation, fluid therapy, electrolyte balance',
      severity: 'medium',
      mortality: '15-30% if severe'
    },
    'Renal Alkalosis': {
      phRange: { min: 8.0, max: 10.0 },
      symptoms: ['Excessive urination', 'White droppings', 'Lethargy', 'Kidney swelling'],
      causes: ['Kidney disease', 'Nephritis', 'Toxin exposure', 'Infectious bronchitis'],
      quickMeasures: [
        '🚨 EMERGENCY: Immediate vet required',
        '💧 Maintain hydration carefully',
        '🍖 Reduce protein in diet',
        '🧪 Collect droppings sample',
        '📋 Document all symptoms',
        '🔬 Blood work necessary'
      ],
      treatment: 'Kidney support therapy, fluid management, specialized diet',
      severity: 'critical',
      mortality: '40-70% depending on kidney damage'
    }
  },

  // pH-RELATED NUTRITIONAL DISORDERS
  nutritional: {
    'Calcium Imbalance': {
      phRange: { min: 6.0, max: 8.5 },
      symptoms: ['Soft shells', 'Leg weakness', 'Paralysis', 'Cage layer fatigue'],
      causes: ['Improper Ca:P ratio', 'Vitamin D deficiency', 'pH affecting absorption'],
      quickMeasures: [
        '🥚 Provide crushed oyster shells',
        '☀️ Ensure sunlight exposure',
        '💊 Vitamin D3 supplementation',
        '🥬 Add dark leafy greens',
        '📊 Check feed calcium levels',
        '⚖️ Balance phosphorus intake'
      ],
      treatment: 'Calcium supplementation, vitamin D, dietary balance',
      severity: 'medium',
      mortality: '5-20% if chronic'
    },
    'Phosphorus Deficiency': {
      phRange: { min: 5.5, max: 8.0 },
      symptoms: ['Poor bone development', 'Rickets', 'Reduced growth', 'Feather picking'],
      causes: ['High pH reducing absorption', 'Inadequate dietary phosphorus'],
      quickMeasures: [
        '🦴 Add bone meal to feed',
        '🐟 Include fish meal supplement',
        '📉 Adjust pH to optimal range',
        '🌾 Use phosphorus-rich grains',
        '💊 Mineral supplement needed',
        '📋 Monitor growth rates'
      ],
      treatment: 'Phosphorus supplementation, pH adjustment, dietary modification',
      severity: 'medium',
      mortality: '10-25% in young birds'
    }
  },

  // pH-RELATED INFECTIONS
  infections: {
    'Clostridial Enteritis': {
      phRange: { min: 5.5, max: 7.0 },
      symptoms: ['Bloody diarrhea', 'Depression', 'Ruffled feathers', 'Sudden death'],
      causes: ['pH change allowing Clostridium growth', 'Coccidiosis damage'],
      quickMeasures: [
        '💊 Start antibiotics immediately (penicillin/bacitracin)',
        '🦠 Add probiotics to restore gut flora',
        '📈 Raise pH with baking soda',
        '🔄 Remove and replace all litter',
        '🚫 Isolate affected birds',
        '⚡ Emergency vet needed'
      ],
      treatment: 'Antibiotics, probiotics, pH adjustment, sanitation',
      severity: 'critical',
      mortality: '30-50% outbreak potential'
    },
    'Candidiasis (Thrush)': {
      phRange: { min: 4.0, max: 6.0 },
      symptoms: ['White patches in mouth/crop', 'Decreased appetite', 'Crop stasis'],
      causes: ['Low pH favoring yeast growth', 'Antibiotic overuse', 'Immunosuppression'],
      quickMeasures: [
        '🍄 Antifungal treatment (nystatin)',
        '📈 Raise crop pH with baking soda',
        '🥤 Apple cider vinegar initially',
        '🦠 Probiotics after treatment',
        '🧹 Sanitize feeders/waterers',
        '🔍 Check all birds'
      ],
      treatment: 'Antifungal medication, pH adjustment, immune support',
      severity: 'medium',
      mortality: '10-20% if systemic'
    }
  }
};

// pH Analysis Functions
export class LocalAIService {
  
  // Get diseases related to specific pH value
  static getDiseasesForPH(ph: number): any[] {
    const diseases: any[] = [];
    
    // Check all disease categories
    Object.values(PH_DISEASE_DATABASE).forEach(category => {
      Object.entries(category).forEach(([name, disease]: [string, any]) => {
        if (ph >= disease.phRange.min && ph <= disease.phRange.max) {
          diseases.push({
            name,
            ...disease,
            matchScore: this.calculateMatchScore(ph, disease.phRange)
          });
        }
      });
    });
    
    // Sort by match score (how close pH is to disease range center)
    return diseases.sort((a, b) => b.matchScore - a.matchScore);
  }
  
  // Calculate how well pH matches disease range
  private static calculateMatchScore(ph: number, range: { min: number, max: number }): number {
    const center = (range.min + range.max) / 2;
    const distance = Math.abs(ph - center);
    const rangeSize = range.max - range.min;
    return 100 - (distance / rangeSize * 100);
  }
  
  // Generate pH-based health report
  static generatePHReport(ph: number): string {
    const diseases = this.getDiseasesForPH(ph);
    
    if (diseases.length === 0) {
      return `pH ${ph} is in a safe range with no immediate disease concerns.`;
    }
    
    let report = `🔬 **pH Analysis Report (pH: ${ph})**\n\n`;
    
    // Group by severity
    const critical = diseases.filter(d => d.severity === 'critical');
    const high = diseases.filter(d => d.severity === 'high');
    const medium = diseases.filter(d => d.severity === 'medium');
    
    if (critical.length > 0) {
      report += `⚠️ **CRITICAL RISKS:**\n`;
      critical.forEach(d => {
        report += `• ${d.name} (${d.mortality} mortality risk)\n`;
      });
      report += '\n';
    }
    
    if (high.length > 0) {
      report += `🔴 **HIGH RISKS:**\n`;
      high.forEach(d => {
        report += `• ${d.name} (${d.mortality} mortality risk)\n`;
      });
      report += '\n';
    }
    
    if (medium.length > 0) {
      report += `🟡 **MODERATE RISKS:**\n`;
      medium.forEach(d => {
        report += `• ${d.name} (${d.mortality} mortality risk)\n`;
      });
      report += '\n';
    }
    
    // Add top 3 quick measures
    report += `📋 **IMMEDIATE ACTIONS NEEDED:**\n`;
    const topDisease = diseases[0];
    if (topDisease && topDisease.quickMeasures) {
      topDisease.quickMeasures.slice(0, 3).forEach((measure: string) => {
        report += `${measure}\n`;
      });
    }
    
    return report;
  }
  
  // Generate comprehensive response about pH and diseases
  static async generateResponse(question: string): Promise<string> {
    const lowerQuestion = question.toLowerCase();
    
    // Check if question is about pH
    const phMatch = question.match(/\b(ph|pH|Ph)\s*(\d+\.?\d*)/);
    if (phMatch) {
      const ph = parseFloat(phMatch[2]);
      if (!isNaN(ph) && ph >= 0 && ph <= 14) {
        return this.generatePHDiseaseResponse(ph);
      }
    }
    
    // Check for specific disease keywords
    for (const [category, diseases] of Object.entries(PH_DISEASE_DATABASE)) {
      for (const [diseaseName, diseaseInfo] of Object.entries(diseases)) {
        if (lowerQuestion.includes(diseaseName.toLowerCase()) || 
            this.matchesSymptoms(lowerQuestion, (diseaseInfo as any).symptoms)) {
          return this.generateDiseaseResponse(diseaseName, diseaseInfo as any);
        }
      }
    }
    
    // Check for general pH questions
    if (lowerQuestion.includes('ph') || lowerQuestion.includes('acid') || lowerQuestion.includes('alkalo')) {
      return this.generateGeneralPHResponse();
    }
    
    // Default poultry response
    return this.generateGeneralPoultryResponse(question);
  }
  
  // Generate detailed pH disease response
  private static generatePHDiseaseResponse(ph: number): string {
    const diseases = this.getDiseasesForPH(ph);
    
    let response = `🔬 **pH Level Analysis: ${ph}**\n\n`;
    
    // pH Status
    if (ph < 6.5) {
      response += `⚠️ **Status: ACIDOSIS DETECTED**\n`;
      response += `Your poultry's pH is below normal range (6.5-7.5), indicating acidic conditions.\n\n`;
    } else if (ph > 7.5) {
      response += `⚠️ **Status: ALKALOSIS DETECTED**\n`;
      response += `Your poultry's pH is above normal range (6.5-7.5), indicating alkaline conditions.\n\n`;
    } else {
      response += `✅ **Status: HEALTHY pH RANGE**\n`;
      response += `Your poultry's pH is within the optimal range (6.5-7.5).\n\n`;
    }
    
    // List potential diseases
    if (diseases.length > 0) {
      response += `📋 **Potential Health Risks:**\n\n`;
      
      diseases.slice(0, 3).forEach(disease => {
        response += `**${disease.name}** (${disease.severity} severity)\n`;
        response += `• Symptoms: ${disease.symptoms.slice(0, 3).join(', ')}\n`;
        response += `• Mortality Risk: ${disease.mortality}\n\n`;
      });
      
      // Quick measures from most relevant disease
      const topDisease = diseases[0];
      response += `🚨 **IMMEDIATE ACTIONS REQUIRED:**\n\n`;
      topDisease.quickMeasures.forEach((measure: string) => {
        response += `${measure}\n`;
      });
      response += `\n`;
      
      // Treatment summary
      response += `💊 **Treatment Protocol:**\n`;
      response += `${topDisease.treatment}\n\n`;
      
      // Monitoring advice
      response += `📊 **Monitoring Guidelines:**\n`;
      response += `• Test pH every 4-6 hours until normalized\n`;
      response += `• Document all symptoms and changes\n`;
      response += `• Keep affected birds under observation\n`;
      response += `• Contact veterinarian if symptoms worsen\n`;
    } else {
      response += `✅ **No immediate disease risks at this pH level.**\n\n`;
      response += `**Maintenance Tips:**\n`;
      response += `• Continue regular pH monitoring\n`;
      response += `• Maintain balanced diet and hydration\n`;
      response += `• Ensure proper ventilation\n`;
      response += `• Keep environment clean and dry\n`;
    }
    
    return response;
  }
  
  // Generate response for specific disease
  private static generateDiseaseResponse(name: string, disease: any): string {
    let response = `🏥 **${name}**\n\n`;
    
    response += `**pH Range:** ${disease.phRange.min} - ${disease.phRange.max}\n`;
    response += `**Severity:** ${disease.severity.toUpperCase()}\n`;
    response += `**Mortality Risk:** ${disease.mortality}\n\n`;
    
    response += `**Symptoms to Watch:**\n`;
    disease.symptoms.forEach((symptom: string) => {
      response += `• ${symptom}\n`;
    });
    response += `\n`;
    
    response += `**Common Causes:**\n`;
    disease.causes.forEach((cause: string) => {
      response += `• ${cause}\n`;
    });
    response += `\n`;
    
    response += `**🚨 QUICK MEASURES TO TAKE:**\n`;
    disease.quickMeasures.forEach((measure: string) => {
      response += `${measure}\n`;
    });
    response += `\n`;
    
    response += `**Treatment Protocol:**\n${disease.treatment}\n\n`;
    
    response += `⚠️ **Important:** pH imbalances can be serious. Monitor your flock closely and contact a veterinarian if symptoms persist or worsen.`;
    
    return response;
  }
  
  // Generate general pH information
  private static generateGeneralPHResponse(): string {
    return `📊 **Understanding pH in Poultry Health**\n\n` +
      `**Optimal pH Range:** 6.5 - 7.5\n\n` +
      `**pH Zones & Risks:**\n` +
      `• **< 4.5:** Critical acidosis - immediate emergency\n` +
      `• **4.5-6.5:** Acidosis - high disease risk\n` +
      `• **6.5-7.5:** ✅ Healthy range\n` +
      `• **7.5-8.5:** Alkalosis - moderate disease risk\n` +
      `• **> 8.5:** Critical alkalosis - emergency care needed\n\n` +
      `**Quick pH Adjustment:**\n` +
      `📉 **To Lower pH (if too alkaline):**\n` +
      `• Add apple cider vinegar to water (1-2 tbsp/gallon)\n` +
      `• Use acidified feed\n` +
      `• Administer vitamin C\n\n` +
      `📈 **To Raise pH (if too acidic):**\n` +
      `• Add baking soda to water (1 tsp/gallon)\n` +
      `• Provide crushed limestone or oyster shells\n` +
      `• Increase calcium supplementation\n\n` +
      `**Prevention Tips:**\n` +
      `• Test pH regularly (weekly minimum)\n` +
      `• Maintain balanced nutrition\n` +
      `• Ensure proper hydration\n` +
      `• Control stress factors\n` +
      `• Keep environment clean\n\n` +
      `🔬 Regular pH monitoring is essential for early disease detection and prevention!`;
  }
  
  // Generate general poultry response
  private static generateGeneralPoultryResponse(question: string): string {
    const lowerQuestion = question.toLowerCase();
    
    // Check for emergency keywords
    if (lowerQuestion.includes('emergency') || lowerQuestion.includes('dying') || 
        lowerQuestion.includes('critical')) {
      return this.generateEmergencyResponse();
    }
    
    // Check for symptom keywords
    if (lowerQuestion.includes('symptom') || lowerQuestion.includes('sick')) {
      return this.generateSymptomChecklist();
    }
    
    // Default comprehensive response
    return `🐔 **Poultry Health Assistant Response**\n\n` +
      `I understand you're asking about: "${question}"\n\n` +
      `**Key Health Monitoring Points:**\n\n` +
      `📊 **pH Monitoring:**\n` +
      `• Test pH weekly for healthy flocks\n` +
      `• Test daily if illness suspected\n` +
      `• Optimal range: 6.5-7.5\n\n` +
      `🔍 **Daily Health Checks:**\n` +
      `• Observe behavior and activity levels\n` +
      `• Check feed and water consumption\n` +
      `• Monitor droppings consistency\n` +
      `• Look for respiratory symptoms\n` +
      `• Inspect combs and wattles color\n\n` +
      `💊 **Prevention Protocol:**\n` +
      `• Maintain clean environment\n` +
      `• Provide balanced nutrition\n` +
      `• Ensure proper ventilation\n` +
      `• Follow vaccination schedule\n` +
      `• Quarantine new birds\n\n` +
      `📞 **When to Call a Vet:**\n` +
      `• pH outside 6.0-8.0 range\n` +
      `• Multiple birds showing symptoms\n` +
      `• Sudden deaths in flock\n` +
      `• Symptoms lasting >24 hours\n` +
      `• Any neurological signs\n\n` +
      `For specific pH-related issues, test your birds' pH and I can provide targeted disease information and quick measures!`;
  }
  
  // Emergency response template
  private static generateEmergencyResponse(): string {
    return `🚨 **EMERGENCY PROTOCOL ACTIVATED**\n\n` +
      `**IMMEDIATE ACTIONS:**\n\n` +
      `1️⃣ **Isolate affected birds immediately**\n` +
      `2️⃣ **Check and record pH levels**\n` +
      `3️⃣ **Ensure water and ventilation**\n` +
      `4️⃣ **Contact veterinarian NOW**\n\n` +
      `**Critical Signs Checklist:**\n` +
      `☐ Difficulty breathing / gasping\n` +
      `☐ Unable to stand / paralysis\n` +
      `☐ Bloody discharge\n` +
      `☐ Convulsions / tremors\n` +
      `☐ Blue/purple comb\n` +
      `☐ Multiple sudden deaths\n\n` +
      `**While Waiting for Vet:**\n` +
      `• Keep birds calm and quiet\n` +
      `• Provide electrolytes in water\n` +
      `• Document all symptoms\n` +
      `• Collect samples if possible\n` +
      `• Prepare transport carrier\n\n` +
      `**Emergency Contacts:**\n` +
      `🏥 Find nearest poultry vet\n` +
      `📞 24/7 Poultry Hotline: Check local listings\n` +
      `💊 Emergency pharmacy locations\n\n` +
      `⚠️ Time is critical - act fast but stay calm!`;
  }
  
  // Symptom checklist generator
  private static generateSymptomChecklist(): string {
    return `🔍 **Poultry Symptom Analysis Guide**\n\n` +
      `**Check pH if you observe:**\n\n` +
      `📉 **LOW pH (Acidosis) Signs:**\n` +
      `• Rapid/labored breathing\n` +
      `• Lethargy and weakness\n` +
      `• Decreased appetite\n` +
      `• Watery diarrhea\n` +
      `• Sour crop smell\n\n` +
      `📈 **HIGH pH (Alkalosis) Signs:**\n` +
      `• Muscle tremors/spasms\n` +
      `• Egg shell problems\n` +
      `• Excessive panting\n` +
      `• Poor coordination\n` +
      `• Reduced growth\n\n` +
      `**General Disease Indicators:**\n` +
      `🔴 Respiratory: Coughing, sneezing, nasal discharge\n` +
      `🔴 Digestive: Diarrhea, blood in droppings\n` +
      `🔴 Nervous: Head shaking, paralysis, circling\n` +
      `🔴 Skin: Lesions, swelling, discoloration\n` +
      `🔴 Production: Sudden egg drop, soft shells\n\n` +
      `**Action Steps:**\n` +
      `1. Test pH immediately\n` +
      `2. Isolate symptomatic birds\n` +
      `3. Record all observations\n` +
      `4. Check feed and water quality\n` +
      `5. Contact veterinarian with details\n\n` +
      `💡 Early detection saves lives - test pH at first sign of illness!`;
  }
  
  // Check if question matches symptoms
  private static matchesSymptoms(question: string, symptoms: string[]): boolean {
    const lowerQuestion = question.toLowerCase();
    return symptoms.some(symptom => 
      lowerQuestion.includes(symptom.toLowerCase()) ||
      symptom.toLowerCase().split(' ').some(word => lowerQuestion.includes(word))
    );
  }
  
  // Create AI message
  static createMessage(text: string, isUser: boolean, isTyping = false): AIMessage {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      isUser,
      timestamp: new Date(),
      isTyping
    };
  }
  
  // Get welcome message
  static getWelcomeMessage(): AIMessage {
    return this.createMessage(
      `🐔 **Welcome to Poultix pH & Disease Expert!**\n\n` +
      `I specialize in:\n` +
      `• pH-related poultry diseases\n` +
      `• Quick emergency measures\n` +
      `• Disease prevention protocols\n` +
      `• pH adjustment techniques\n\n` +
      `Test your birds' pH levels and I'll identify potential diseases and provide immediate action steps!\n\n` +
      `Try asking: "pH 5.5" or "My chickens have bloody diarrhea"`,
      false
    );
  }
}

// Export for compatibility
export default LocalAIService;
