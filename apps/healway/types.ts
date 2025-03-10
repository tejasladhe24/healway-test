export type Summary = {
  deep_summary: string;
  quick_summary: string;
  key_points: string[];
  patient_condition: string[];
  suggested_response: string;
};

export type Transcription = {
  id: string;
  language_code: string;
  language_probability: number;
  text: string;
  userId: string;
  recordingId: string;
  summary?: Summary;
};

export type Recording = {
  userId: string;
  id: string;
  url: string;
  title: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  transcriptionId?: string;
};

export type Settings = {
  userId?: string;
  enableLiveTranscription: boolean;
};
