import { Career } from '../types/paes';
import { CAREERS_GROUP_1 } from './careersGroup1';
import { CAREERS_GROUP_2 } from './careersGroup2';
import { CAREERS_GROUP_3 } from './careersGroup3';
import { buildComprehensiveAcademicOffer } from './careerBuilder';

function getMergedAcademicOffer(): Career[] {
  const curatedCareers: Career[] = [
    ...CAREERS_GROUP_1,
    ...CAREERS_GROUP_2,
    ...CAREERS_GROUP_3,
  ];

  const generatedCareers: Career[] = buildComprehensiveAcademicOffer();

  // Index existing by university + discipline or code or id
  const existingIds = new Set<string>();
  const existingCodes = new Set<string>();
  const merged: Career[] = [];

  // 1. Add specific curated real careers first (highest fidelity data)
  for (const c of curatedCareers) {
    if (!existingIds.has(c.id)) {
      existingIds.add(c.id);
      if (c.code) existingCodes.add(c.code);
      merged.push(c);
    }
  }

  // 2. Add supplementary generated careers if not already present
  for (const g of generatedCareers) {
    if (!existingIds.has(g.id) && !existingCodes.has(g.code)) {
      existingIds.add(g.id);
      if (g.code) existingCodes.add(g.code);
      merged.push(g);
    }
  }

  return merged;
}

export const ACADEMIC_OFFER: Career[] = getMergedAcademicOffer();
