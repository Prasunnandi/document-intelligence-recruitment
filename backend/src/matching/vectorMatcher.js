/**
 * Candidate-Job Description Vector Similarity Matching Engine
 * Computes multi-aspect cosine similarity, L2 normalized dot products, and ranked candidate fit tiers.
 */

export class VectorMatchingEngine {
  /**
   * @param {Object} [options]
   * @param {Object} [options.aspectWeights] - Weights for multi-aspect similarity scoring
   * @param {number} [options.aspectWeights.semantic=0.50] - Overall embedding similarity weight
   * @param {number} [options.aspectWeights.skills=0.30] - Hard skills vector weight
   * @param {number} [options.aspectWeights.seniority=0.20] - Experience/domain alignment weight
   * @param {number} [options.minimumScore=0.40] - Cutoff threshold for qualified candidates
   */
  constructor(options = {}) {
    const weights = options.aspectWeights || {};
    this.semanticWeight = weights.semantic ?? 0.50;
    this.skillsWeight = weights.skills ?? 0.30;
    this.seniorityWeight = weights.seniority ?? 0.20;
    this.minimumScore = options.minimumScore ?? 0.40;
  }

  /**
   * Compute cosine similarity between two numerical vectors
   * @param {Array<number>} vecA - First vector
   * @param {Array<number>} vecB - Second vector
   * @returns {number} Cosine similarity (-1.0 to 1.0, typically 0.0 to 1.0 for embeddings)
   */
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
      throw new Error(`Vector dimensions must match (vecA: ${vecA?.length}, vecB: ${vecB?.length})`);
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      const a = vecA[i];
      const b = vecB[i];
      dotProduct += a * b;
      normA += a * a;
      normB += b * b;
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Rank a pool of candidate resumes against a target job description
   * @param {Object} targetJob - Target job profile with embedding vectors
   * @param {string} targetJob.id - Job ID
   * @param {string} targetJob.title - Job Title
   * @param {Array<number>} targetJob.embedding - Semantic vector representation
   * @param {Array<number>} [targetJob.skillsVector] - Optional explicit skills embedding
   * @param {Array<number>} [targetJob.seniorityVector] - Optional experience embedding
   * @param {Array<Object>} candidates - List of candidate profiles
   * @returns {Object} Ranked candidate list with fit tiers, match percentages, and breakdowns
   */
  rankCandidates(targetJob, candidates) {
    if (!targetJob || !candidates) {
      throw new Error('Both targetJob and candidates array are required');
    }

    const scored = candidates.map(cand => {
      // 1. Semantic match
      const semanticSim = this.cosineSimilarity(targetJob.embedding, cand.embedding);

      // 2. Skills match (fallback to semantic if not separately provided)
      const skillsSim = (targetJob.skillsVector && cand.skillsVector)
        ? this.cosineSimilarity(targetJob.skillsVector, cand.skillsVector)
        : semanticSim;

      // 3. Seniority match
      const senioritySim = (targetJob.seniorityVector && cand.seniorityVector)
        ? this.cosineSimilarity(targetJob.seniorityVector, cand.seniorityVector)
        : semanticSim;

      // Composite weighted score
      const compositeScore = (semanticSim * this.semanticWeight) +
                             (skillsSim * this.skillsWeight) +
                             (senioritySim * this.seniorityWeight);

      const clampedScore = Math.max(0, Math.min(1, compositeScore));
      const matchPct = Number((clampedScore * 100).toFixed(1));

      let fitTier = 'MISMATCH';
      if (clampedScore >= 0.85) fitTier = 'EXCELLENT_MATCH';
      else if (clampedScore >= 0.70) fitTier = 'STRONG_FIT';
      else if (clampedScore >= 0.55) fitTier = 'MODERATE_FIT';
      else if (clampedScore >= this.minimumScore) fitTier = 'BORDERLINE';

      return {
        candidateId: cand.id,
        candidateName: cand.name,
        currentTitle: cand.currentTitle,
        yearsOfExperience: cand.yearsOfExperience,
        overallScore: Number(clampedScore.toFixed(4)),
        matchPercentage: matchPct,
        fitTier,
        breakdown: {
          semanticSimilarity: Number(semanticSim.toFixed(4)),
          skillsSimilarity: Number(skillsSim.toFixed(4)),
          senioritySimilarity: Number(senioritySim.toFixed(4))
        }
      };
    });

    // Sort descending by overall match score
    scored.sort((a, b) => b.overallScore - a.overallScore);

    const qualified = scored.filter(c => c.overallScore >= this.minimumScore);

    return {
      jobId: targetJob.id,
      jobTitle: targetJob.title,
      totalCandidatesEvaluated: candidates.length,
      qualifiedCandidatesCount: qualified.length,
      topCandidate: scored[0] || null,
      rankedCandidates: scored
    };
  }
}

export default VectorMatchingEngine;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VectorMatchingEngine;
  module.exports.VectorMatchingEngine = VectorMatchingEngine;
}
