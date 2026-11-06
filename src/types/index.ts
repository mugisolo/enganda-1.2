export type ProgrammeType =
  | 'Community SACCO'
  | 'Savings & Youth Association'
  | 'Cooperative & Trade Group'
  | 'Flagship Programme';

export interface SponsorshipPackage {
  id: string;
  name: string;
  amountLabel: string;
  description: string;
}

export interface SiteMediaSettings {
  heroBannerImage: string;
  aboutMissionImage: string;
  organiseStageImage: string;
  formaliseStageImage: string;
  growStageImage: string;
  humanCapacityImage: string;
  economicStructureImage: string;
  civicAgencyImage: string;
  sizStewardshipImage: string;
  egyaBannerImage: string;
  leoleoBannerImage: string;
  founderMugisaImage: string;
  founderRonnieImage: string;
}

export type SafariEventCategory =
  | 'ENGANDA Safari & Eco-Trip'
  | 'Youth Sports & Gala'
  | 'SACCO & Enterprise Exchange'
  | 'Tree Stewardship & Conservation'
  | 'Community Cultural Expedition';

export interface SafariEventItem {
  id: string;
  code: string;
  title: string;
  category: SafariEventCategory;
  dateLabel: string;
  durationLabel: string;
  location: string;
  feeOrSponsorshipLabel: string;
  organizer: string;
  summary: string;
  highlights: string[];
  imageUrl: string;
  showOnCarousel: boolean;
  showInUpcoming: boolean;
  ctaLabel: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Whitelisted Public Profile returned by /api/directory.
 * Never includes private member lists, phones, emails, or National IDs.
 */
export interface PublicGroupProfile {
  id: string;
  uniqueGroupCode: string;
  slug: string;
  name: string;
  programmeType: ProgrammeType;
  sector: string;
  companyAffiliation?: string;
  isProgrammeOnly: boolean;
  location: string;
  summary: string;
  representativeName: string;
  representativeTitle: string;
  memberCount: number;
  projectName: string;
  projectDescription: string;
  supportFocus: string;
  websiteUrl: string;
  activities: string[];
  sponsorshipPackages: SponsorshipPackage[];
  galleryImages: string[];
  mapCoords?: {
    x: number;
    y: number;
    zone: string;
  };
  updatedAt: string;
}

export interface DirectoryMeta {
  totalPublicProfiles: number;
  memberGroupsCount: number;
  programmeProfilesCount: number;
  totalSuppliedMemberRecords: number;
  locations: string[];
  programmeTypes: string[];
  sectors: string[];
  representatives: string[];
}

export interface PrivateMemberRecord {
  id: string;
  uniqueId: string;
  groupId: string;
  groupName?: string;
  company: string;
  photoUrl: string;
  fullName: string;
  title: string;
  phone: string;
  email: string;
  nationalId: string;
  skills: string[];
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupAdminAssignment {
  id: string;
  email: string;
  groupId: string;
  groupName?: string;
  assignedBy: string;
  assignedAt: string;
}

export interface KnownUserAccount {
  email: string;
  uid: string;
  displayName: string;
  firstSignedInAt: string;
  lastSeenAt: string;
}

export type SupportType = 'Sponsor' | 'Invest' | 'Partner';

export interface SupportEnquiryRecord {
  id: string;
  reference: string;
  groupId: string;
  groupName: string;
  supportType: SupportType;
  contactName: string;
  email: string;
  phone: string;
  organisation: string;
  packageName: string;
  message: string;
  consent: boolean;
  status: 'NEW' | 'IN_REVIEW' | 'RESPONDED';
  createdAt: string;
}

export interface SupportEnquiryPreset {
  groupId: string;
  groupName: string;
  supportType: SupportType;
  packageName?: string;
}

export interface NewsletterSubscriptionRecord {
  id: string;
  reference: string;
  email: string;
  name: string;
  organisation: string;
  consent: boolean;
  frequency: 'QUARTERLY';
  createdAt: string;
}

export interface TransitionMilestone {
  id: string;
  period: string;
  stage: 'Organise' | 'Formalise' | 'Grow';
  groupName: string;
  location: string;
  membersTransitioned: number;
  cumulativeFormalised: number;
  milestoneTitle: string;
  verificationNote: string;
  representative: string;
}
