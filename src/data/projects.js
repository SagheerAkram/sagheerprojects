// Sagheer's project archive — each entry represents one digital artifact
export const PROJECTS = [
    {
        id: 'neural-lattice',
        index: '001',
        title: 'Neural Lattice',
        shortDesc: 'A structured reasoning framework for language model chain orchestration.',
        overview: 'Neural Lattice is an experimental framework that imposes formal graph structure on LLM reasoning chains. Rather than prompting models in linear sequences, it routes inference through a directed acyclic graph of sub-reasoners, allowing parallel hypothesis resolution and structured contradiction detection.',
        tags: ['AI', 'Python', 'Graph Theory'],
        github: 'https://github.com/SagheerAbbas',
        color: '#4af0c4',
        blueprint: {
            nodes: ['Input Query', 'Graph Router', 'Sub-Reasoner A', 'Sub-Reasoner B', 'Contradiction Resolver', 'Output Synthesis'],
            edges: [
                [0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [4, 5]
            ]
        }
    },
    {
        id: 'echo-field',
        index: '002',
        title: 'Echo Field',
        shortDesc: 'Recursive self-evaluation loop for detecting hallucination patterns in AI output.',
        overview: 'Echo Field implements a recursive verification architecture where an AI system evaluates its own outputs against a structured set of semantic anchors. The system identifies confidence degradation zones — regions in generated text where factual grounding weakens — and flags them for human review.',
        tags: ['AI', 'Python', 'Verification'],
        github: 'https://github.com/SagheerAbbas',
        color: '#7af068',
        blueprint: {
            nodes: ['Prompt', 'Primary Model', 'Output Buffer', 'Semantic Anchors', 'Echo Evaluator', 'Confidence Map', 'Flagged Regions'],
            edges: [
                [0, 1], [1, 2], [2, 4], [3, 4], [4, 5], [5, 6]
            ]
        }
    },
    {
        id: 'signal-drift',
        index: '003',
        title: 'Signal Drift',
        shortDesc: 'Temporal analysis tool measuring semantic drift in language model embeddings over context.',
        overview: 'Signal Drift tracks how the semantic meaning of key terms shifts as conversation context expands. By comparing embedding vectors at different context depths, it produces a drift topology — a structural map of how an LLM\'s internal representation of concepts evolves, degrades, or stabilizes across a session.',
        tags: ['NLP', 'Embeddings', 'Analysis'],
        github: 'https://github.com/SagheerAbbas',
        color: '#f0a44a',
        blueprint: {
            nodes: ['Input Session', 'Tokenizer', 'Embedding Engine', 'Temporal Sampler', 'Drift Calculator', 'Topology Renderer'],
            edges: [
                [0, 1], [1, 2], [2, 3], [3, 4], [4, 5]
            ]
        }
    },
    {
        id: 'cage-protocol',
        index: '004',
        title: 'Cage Protocol',
        shortDesc: 'Containment specification language for defining bounded AI agent behavior.',
        overview: 'Cage Protocol is a domain-specific language and runtime for defining hard behavioral constraints on AI agents. Operators specify action boundaries, resource caps, and permissible state transitions in a formal constraint grammar. The runtime monitors agent behavior and enforces containment — terminating or redirecting execution when boundaries are violated.',
        tags: ['AI Safety', 'DSL', 'Agents'],
        github: 'https://github.com/SagheerAbbas',
        color: '#f0504a',
        blueprint: {
            nodes: ['Constraint Grammar', 'Parser', 'Runtime Monitor', 'Agent', 'State Observer', 'Containment Engine', 'Violation Handler'],
            edges: [
                [0, 1], [1, 2], [2, 3], [3, 4], [4, 2], [2, 6], [5, 6]
            ]
        }
    },
    {
        id: 'strata',
        index: '005',
        title: 'Strata',
        shortDesc: 'Layered prompt architecture system for managing complexity in multi-agent pipelines.',
        overview: 'Strata introduces a hierarchical abstraction layer for prompt engineering at scale. It separates system identity, role constraints, task logic, and output format into discrete layers — each independently versioned and composable. This enforces separation of concerns in complex multi-agent orchestration systems.',
        tags: ['Prompt Engineering', 'Architecture', 'Python'],
        github: 'https://github.com/SagheerAbbas',
        color: '#a44af0',
        blueprint: {
            nodes: ['Identity Layer', 'Constraint Layer', 'Task Layer', 'Format Layer', 'Composer', 'Agent Pipeline', 'Output'],
            edges: [
                [0, 4], [1, 4], [2, 4], [3, 4], [4, 5], [5, 6]
            ]
        }
    },
    {
        id: 'null-point',
        index: '006',
        title: 'Null Point',
        shortDesc: 'Experimental study of what happens when AI models are given systematically incomplete information.',
        overview: 'Null Point is an adversarial research instrument. It constructs deliberately incomplete information environments and observes how language models fill gaps — cataloguing patterns of assumption, confabulation, and logical extrapolation. The project produces a taxonomy of AI inference strategies under epistemic deficit.',
        tags: ['Research', 'Adversarial AI', 'Analysis'],
        github: 'https://github.com/SagheerAbbas',
        color: '#4aaff0',
        blueprint: {
            nodes: ['Incomplete Dataset', 'Gap Constructor', 'Model Interface', 'Response Collector', 'Gap Analysis Engine', 'Taxonomy Builder'],
            edges: [
                [0, 1], [1, 2], [2, 3], [3, 4], [4, 5]
            ]
        }
    }
];
