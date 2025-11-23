export type FieldConfig = 
{   name: keyof FormData;
    label: string; 
    type: 'text' | 'email' | 'tel' | 'url' | 'number' | 'select' | 'textarea';
    required?: boolean;
    placeholder?: string; 
    options?: { value: string; label: string }[]; 
    isPremium?: boolean;
     // For future premium features 
     };

    export interface FormData { 
    // Common fields
    resourceTitle: string; resourceUrl: string; organisationName: string; email?: string; country: string; language: string; discipline?: string; description?: string; about?: string; image?: string; type: string;
     // Journal-specific fields
     chiefEditor?: string; issnOnline?: string; issnPrint?: string; publisher?: string; frequency?: string; licenseType?: string; status?: string; domainJournal?: string; coverageStatus?: string; coverageStartYear?: string; coverageEndYear?: string; indexingDatabases?: string; 
     // Premium feature
      impactFactor?: string; 
      // Premium feature 
    peerReviewType?: string; subjects?: string; 
    // Article-specific fields
     articleType?: string; doiPrefix?: string; citationCount?: string; references?: string;
      // Institution-specific fields 
     contactNumber?: string; 
     // Common metadata fields
      keywords?: string; verificationStatus?: string; dataSource?: string; submittedBy?: string; approvedBy?: string; }