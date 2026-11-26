/**
 * Ontology-Driven Technical Skill Extraction Engine
 * Maps resume text and job descriptions to standardized European ESCO and US O*NET skill taxonomies.
 */

export const SKILL_ONTOLOGY = [
  // Programming & Core Engineering
  { id: 'SKILL-001', name: 'Python', category: 'Programming Languages', escoUri: 'http://data.europa.eu/esco/skill/4b4e94b2', onetCode: '15-1252.00', aliases: ['python', 'python3', 'py'] },
  { id: 'SKILL-002', name: 'JavaScript', category: 'Programming Languages', escoUri: 'http://data.europa.eu/esco/skill/9c67ad3a', onetCode: '15-1254.00', aliases: ['javascript', 'js', 'es6'] },
  { id: 'SKILL-003', name: 'TypeScript', category: 'Programming Languages', escoUri: 'http://data.europa.eu/esco/skill/e3e01a88', onetCode: '15-1254.00', aliases: ['typescript', 'ts'] },
  { id: 'SKILL-004', name: 'Java', category: 'Programming Languages', escoUri: 'http://data.europa.eu/esco/skill/3f8205f2', onetCode: '15-1252.00', aliases: ['java', 'jdk', 'jvm'] },
  { id: 'SKILL-005', name: 'Go', category: 'Programming Languages', escoUri: 'http://data.europa.eu/esco/skill/b76701bb', onetCode: '15-1252.00', aliases: ['golang', 'go lang'] },

  // Cloud & DevOps
  { id: 'SKILL-010', name: 'Amazon Web Services', category: 'Cloud & Infrastructure', escoUri: 'http://data.europa.eu/esco/skill/f14d9b23', onetCode: '15-1244.00', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'] },
  { id: 'SKILL-011', name: 'Docker', category: 'Cloud & Infrastructure', escoUri: 'http://data.europa.eu/esco/skill/814c1d2e', onetCode: '15-1244.00', aliases: ['docker', 'containerization', 'dockerfile'] },
  { id: 'SKILL-012', name: 'Kubernetes', category: 'Cloud & Infrastructure', escoUri: 'http://data.europa.eu/esco/skill/a73d8f10', onetCode: '15-1244.00', aliases: ['kubernetes', 'k8s'] },
  { id: 'SKILL-013', name: 'Terraform', category: 'Cloud & Infrastructure', escoUri: 'http://data.europa.eu/esco/skill/c4e09f12', onetCode: '15-1244.00', aliases: ['terraform', 'iac', 'infrastructure as code'] },

  // Data & Databases
  { id: 'SKILL-020', name: 'PostgreSQL', category: 'Databases', escoUri: 'http://data.europa.eu/esco/skill/1f822cd0', onetCode: '15-1242.00', aliases: ['postgresql', 'postgres', 'psql'] },
  { id: 'SKILL-021', name: 'Apache Kafka', category: 'Data & Streaming', escoUri: 'http://data.europa.eu/esco/skill/d2a30b44', onetCode: '15-1243.00', aliases: ['kafka', 'apache kafka', 'event-driven'] },
  { id: 'SKILL-022', name: 'Apache Spark', category: 'Data & Streaming', escoUri: 'http://data.europa.eu/esco/skill/4a2b9e11', onetCode: '15-1243.00', aliases: ['spark', 'apache spark', 'pyspark'] },
  { id: 'SKILL-023', name: 'ClickHouse', category: 'Databases', escoUri: 'http://data.europa.eu/esco/skill/8b91a0c1', onetCode: '15-1242.00', aliases: ['clickhouse', 'olap database'] },

  // Machine Learning & AI
  { id: 'SKILL-030', name: 'Machine Learning', category: 'AI & Machine Learning', escoUri: 'http://data.europa.eu/esco/skill/6f3b0e22', onetCode: '15-1251.00', aliases: ['machine learning', 'ml', 'scikit-learn'] },
  { id: 'SKILL-031', name: 'PyTorch', category: 'AI & Machine Learning', escoUri: 'http://data.europa.eu/esco/skill/7e4a1c99', onetCode: '15-1251.00', aliases: ['pytorch', 'torch'] },
  { id: 'SKILL-032', name: 'Retrieval-Augmented Generation (RAG)', category: 'AI & Machine Learning', escoUri: 'http://data.europa.eu/esco/skill/9a11ef44', onetCode: '15-1251.00', aliases: ['rag', 'retrieval-augmented generation', 'vector database', 'pgvector'] }
];

export class SkillExtractionEngine {
  constructor(customOntology = []) {
    this.ontology = [...SKILL_ONTOLOGY, ...customOntology];
  }

  /**
   * Extract skills and map to canonical taxonomy entries
   * @param {string} text - Raw resume or job description text
   * @returns {Object} Extracted skills, counts, and category coverage
   */
  extractSkills(text) {
    if (!text || typeof text !== 'string') {
      return { totalUniqueSkillsFound: 0, extractedSkills: [], categoryCoverage: {} };
    }

    const normalizedText = ` ${text.toLowerCase()} `;
    const foundSkills = [];
    const categoryMap = {};

    for (const skill of this.ontology) {
      let matchCount = 0;

      for (const alias of skill.aliases) {
        // Regex word boundary matching to avoid substring false positives (e.g. 'go' inside 'good')
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?<=[^a-zA-Z0-9_]|^)${escaped}(?=[^a-zA-Z0-9_]|$)`, 'gi');
        const matches = normalizedText.match(regex);
        if (matches) {
          matchCount += matches.length;
        }
      }

      if (matchCount > 0) {
        foundSkills.push({
          skillId: skill.id,
          name: skill.name,
          category: skill.category,
          mentionsCount: matchCount,
          escoUri: skill.escoUri,
          onetCode: skill.onetCode,
          confidenceScore: Math.min(1.0, 0.70 + (matchCount * 0.10))
        });

        categoryMap[skill.category] = (categoryMap[skill.category] || 0) + 1;
      }
    }

    // Sort by mentions count descending
    foundSkills.sort((a, b) => b.mentionsCount - a.mentionsCount);

    return {
      totalUniqueSkillsFound: foundSkills.length,
      categoryCoverage: categoryMap,
      extractedSkills: foundSkills
    };
  }
}

export default SkillExtractionEngine;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SkillExtractionEngine;
  module.exports.SkillExtractionEngine = SkillExtractionEngine;
  module.exports.SKILL_ONTOLOGY = SKILL_ONTOLOGY;
}
