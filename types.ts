export interface DiagnosisResult {
  overview: string;
  tongueBody: {
    color: string;
    shape: string;
    moisture: string;
    analysis: string;
  };
  tongueCoating: {
    color: string;
    thickness: string;
    nature: string; // e.g., greasy, peeling
    analysis: string;
  };
  syndrome: {
    name: string; // TCM syndrome name (e.g., 脾虚湿盛)
    description: string;
    organsInvolved: string[];
  };
  symptoms: string[]; // Physical symptoms associated with the condition
  meridianAnalysis: {
    name: string; // e.g. 足太阴脾经
    status: string; // e.g. 气虚, 湿阻, 郁结
    description: string;
  }[];
  recommendations: {
    diet: string[];
    lifestyle: string[];
    herbsOrFoods: string[]; // specific food therapy items (食疗)
    tcmFormulas: {          // specific herbal medicine (方药)
      name: string;
      description: string;
    }[];
  };
}