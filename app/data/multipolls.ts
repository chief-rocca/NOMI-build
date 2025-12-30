export interface MultiPollData {
    category: string;
    question: string;
    options: string[];
    type: 'multi';
    insight?: string;
    insightColor?: string;
    variant?: 'default' | 'sponsored';
}

export const multiPollsData: MultiPollData[] = [
    // Global (The Macro View)
    {
        category: 'Global',
        question: "What should be the primary focus of international space agencies over the next decade?",
        options: [
            "Establishing a permanent Moon base",
            "Sending a crewed mission to Mars",
            "Enhancing Earth-monitoring climate satellites",
            "Developing asteroid defense systems"
        ],
        type: 'multi'
    },
    {
        category: 'Global',
        question: "Which emerging technology poses the greatest potential risk to global stability?",
        options: [
            "Generative Artificial Intelligence (AGI)",
            "CRISPR and Gene Editing",
            "Quantum Computing (Encryption breaking)",
            "Autonomous Drone Swarms"
        ],
        type: 'multi'
    },
    {
        category: 'Global',
        question: "What is the most effective way for the world to address the global plastic crisis?",
        options: [
            "Global tax on virgin plastic production",
            "Mandatory 100% recyclable packaging laws",
            "Investment in large-scale ocean cleanup tech",
            "Shifting to a full \"Circular Economy\" model"
        ],
        type: 'multi'
    },
    {
        category: 'Global',
        question: "Which region do you believe will be the primary driver of the global economy by 2050?",
        options: [
            "North America",
            "European Union",
            "Southeast Asia & India",
            "African Continental Free Trade Area"
        ],
        type: 'multi'
    },
    {
        category: 'Global',
        question: "How should the \"Global South\" be supported in the green energy transition?",
        options: [
            "Direct debt cancellation for green projects",
            "Mandatory technology and patent sharing",
            "Guaranteed low-interest infrastructure loans",
            "Climate reparations paid by high-emitting nations"
        ],
        type: 'multi'
    },

    // National (The Meso View)
    {
        category: 'National',
        question: "What is the most critical priority for fixing the national energy crisis?",
        options: [
            "Privatizing parts of the national grid (Eskom)",
            "Aggressive investment in solar and wind farms",
            "Expanding nuclear energy capacity",
            "Implementing a decentralized \"Small-Scale Embedded\" model"
        ],
        type: 'multi'
    },
    {
        category: 'National',
        question: "Which sector of the South African economy should receive the most government support?",
        options: [
            "Technology & Digital Innovation",
            "Agriculture & Food Security",
            "Manufacturing & Industrialization",
            "Tourism & Creative Industries"
        ],
        type: 'multi'
    },
    {
        category: 'National',
        question: "What is the best approach to lowering the national youth unemployment rate?",
        options: [
            "Direct government wage subsidies for first-time workers",
            "Nationwide vocational and coding bootcamps",
            "Loosening restrictive labor laws for SMEs",
            "Expanding the Public Works Program (EPWP)"
        ],
        type: 'multi'
    },
    {
        category: 'National',
        question: "How should the national education curriculum be modernized?",
        options: [
            "Focus on AI, Data Science, and Robotics",
            "Emphasis on Entrepreneurship and Financial Literacy",
            "Prioritizing Indigenous languages and African History",
            "Shifting to a fully digital, remote-capable hybrid model"
        ],
        type: 'multi'
    },
    {
        category: 'National',
        question: "Which transport infrastructure project should be the national priority?",
        options: [
            "Expanding the Gautrain to other provinces",
            "Restoring and securing the national rail freight network",
            "Subsidizing a nationwide electric vehicle charging grid",
            "Formalizing and subsidizing the taxi industry infrastructure"
        ],
        type: 'multi'
    },

    // Local (The Micro View)
    {
        category: 'Local',
        question: "How should your local municipality improve neighborhood safety?",
        options: [
            "Increased visible police/patrol presence",
            "Installation of AI-powered CCTV networks",
            "Better street lighting and urban maintenance",
            "Support for community-led neighborhood watches"
        ],
        type: 'multi'
    },
    {
        category: 'Local',
        question: "What is the best use for a vacant plot of municipal land in your area?",
        options: [
            "A community vegetable garden and market",
            "Affordable social housing units",
            "A public park with sports facilities",
            "A small business incubator/co-working hub"
        ],
        type: 'multi'
    },
    {
        category: 'Local',
        question: "Which public service in your local area needs the most urgent improvement?",
        options: [
            "Water supply consistency and plumbing repairs",
            "Pothole repair and road maintenance",
            "Refuse collection and waste management",
            "Local clinic waiting times and staffing"
        ],
        type: 'multi'
    },
    {
        category: 'Local',
        question: "How would you prefer to receive news and alerts from your local council?",
        options: [
            "Dedicated mobile app notifications (like NOMI)",
            "WhatsApp community broadcast groups",
            "Local radio and community newspapers",
            "Physical town hall meetings and notice boards"
        ],
        type: 'multi'
    },
    {
        category: 'Local',
        question: "What would most encourage you to use public transport in your city?",
        options: [
            "Improved frequency and \"on-time\" reliability",
            "Enhanced security on board and at stations",
            "A single unified payment card for all transport types",
            "Lower fares or monthly subscription passes"
        ],
        type: 'multi'
    }
];
