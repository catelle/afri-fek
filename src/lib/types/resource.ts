export interface BaseResource {
  id: string;
  name: string;
  abbreviation?: string;
  type: 'journal' | 'article' | 'institution'| 'university' | 'ouvrage';
  description: string;
  about?: string;
  link: string;
  country: string;
  language: string;
  image?: string;
  date: string;
  status: 'active' | 'inactive' | 'pending' | 'approved';
  createdAt: Date;
  filiere?: string;

}

export interface Journal extends BaseResource {
  type: 'journal';
  organisationName: string;
  chiefEditor: string;
  email: string;
  publisher: string;
  frequency: 'monthly' | 'quarterly' | 'biannual' | 'annual';
  licenseType: 'open-access' | 'subscription' | 'hybrid';
  issnOnline?: string;
  issnPrint?: string;
  domainJournal: string;
  discipline: string;
  coverageStartYear?: string;
  coverageEndYear?: string;
  coverageStatus: 'ongoing' | 'completed' | 'discontinued';
  peerReviewType?: string;
  indexingDatabases?: string;
  impactFactor?: string;
  source?: string;
  statut?: string;
  // createAt:Date;
  // createdAt:Date;

}

export interface Article extends BaseResource {
  type: 'article';
  articleType: 'pdf' | 'html' | 'epub';
  doiPrefix?: string;
  citationCount?: string;
  references?: string;
  keywords?: string;
  subjects?: string;
  authors?: string[];
  publishedDate?: string;
  journalName?: string;
  domainJournal: string;
  source?: string;
  abbreviation?: string;


}

export interface Institution extends BaseResource {
  type: 'institution';
  organisationName: string;
  contact: string;
  email: string;
  address?: string;
  establishedYear?: string;
  institutionType?: 'university' | 'research-center' | 'hospital' | 'government' | 'ngo';
  specializations?: string[];
  domainJournal: string;
  source?: string;
  abbreviation?: string;

}
export interface School extends BaseResource {
  type: 'university';
  organisationName: string;
  contact: string;
  email: string;
  address?: string;
  discipline?: string;
  domainJournal: string;
  source?: string;
  abbreviation?: string;

}

export interface Ouvrage extends BaseResource {
  type: 'ouvrage';
  organisationName: string;
  authors?: string[];
  isbn?: string;
  publisher: string;
  publishedYear?: string;
  pages?: string;
  edition?: string;
  domainJournal: string;
  contact?: string;
  email?: string;
  source?: string;
  abbreviation?: string;
}


export type Resource = Journal | Article | Institution | School | Ouvrage;

export interface ResourceFilters {
  type?: string;
  country?: string;
  language?: string;
  domain?: string;
  search?: string;
}

export interface ResourceStats {
  total: number;
  journals: number;
  articles: number;
  institutions: number;
  universities: number;
  ouvrages: number;
  countries: number;
}