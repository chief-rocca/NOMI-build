import { MultiPollData } from './multipolls';

export const sponsoredPollsData: MultiPollData[] = [
    {
        category: 'Telecommunications & Fiber',
        question: "Which factor is the primary reason you haven't upgraded to a 1Gbps fiber line in your current residence?",
        options: [
            "Monthly subscription cost is too high",
            "Current speed (100Mbps/200Mbps) is sufficient",
            "Unreliable uptime in my specific neighborhood",
            "Installation/In-home wiring is too difficult"
        ],
        type: 'multi',
        insight: 'Tech',
        insightColor: 'blue'
    },
    {
        category: 'Retail & Grocery',
        question: "When using a 60-minute delivery app (e.g., Sixty60, ASAP), which category are you most likely to 'impulse buy' that wasn't on your list?",
        options: [
            "Fresh Bakery/Ready-to-eat meals",
            "Alcohol & Beverages",
            "Household cleaning supplies",
            "Health & Beauty products"
        ],
        type: 'multi',
        insight: 'Shopping',
        insightColor: 'orange'
    },
    {
        category: 'Renewable Energy & Solar',
        question: "Which financing structure would most likely convince you to move your residence to a full solar hybrid system this year?",
        options: [
            "Fixed monthly 'Power Purchase' rental agreement",
            "Upfront purchase with a 5-year tax incentive",
            "Rent-to-own model integrated into my home loan",
            "Community-shared solar grid for my complex/street"
        ],
        type: 'multi',
        insight: 'Green',
        insightColor: 'green'
    },
    {
        category: 'Banking & Fintech',
        question: "Which digital feature would be the 'deal-breaker' that makes you switch your primary salary-receiving bank account?",
        options: [
            "Zero-fee international currency accounts",
            "Real-time, AI-powered credit limit increases",
            "Seamless integration with crypto/digital assets",
            "Exclusive lifestyle rewards (Lounge access, travel discounts)"
        ],
        type: 'multi',
        insight: 'Finance',
        insightColor: 'blue'
    },
    {
        category: 'Automotive & EV',
        question: "If your local shopping center installed Ultra-Fast EV Charging, how much more time would you spend at that location weekly?",
        options: [
            "1-2 hours (I'd do my weekly shopping there)",
            "30-60 mins (I'd grab a coffee/quick errand)",
            "No change (I'd charge and leave)",
            "Not applicable (I don't plan on buying an EV)"
        ],
        type: 'multi',
        insight: 'Auto',
        insightColor: 'red'
    },
    {
        category: 'Real Estate & Development',
        question: "What is the most important 'Lifestyle Amenity' you look for when considering a new residential development in this area?",
        options: [
            "On-site co-working spaces and high-speed Wi-Fi",
            "High-end fitness center and padel courts",
            "Sustainable features (Off-grid water/electricity)",
            "Advanced 24/7 biometric security and AI-surveillance"
        ],
        type: 'multi',
        insight: 'Living',
        insightColor: 'green'
    },
    {
        category: 'Insurance & Risk',
        question: "Does your current household insurance provider offer a discount for 'Smart Home' security integrations installed at your address?",
        options: [
            "Yes, and I am currently using it",
            "No, but I would switch for a 10% discount",
            "I am unsure what my policy covers regarding smart tech",
            "I do not have household insurance"
        ],
        type: 'multi',
        insight: 'Security',
        insightColor: 'blue'
    },
    {
        category: 'Quick Service Restaurants',
        question: "Which 'Healthy Alternative' menu item are you most likely to order during a workday lunch in this district?",
        options: [
            "Plant-based/Vegan protein bowls",
            "Low-carb/Keto-friendly wraps",
            "Cold-pressed juices and smoothie meal-replacements",
            "I prefer traditional fast-food options"
        ],
        type: 'multi',
        insight: 'Food',
        insightColor: 'orange'
    },
    {
        category: 'Luxury Goods',
        question: "When purchasing high-end electronics, which 'Value-Add' service do you prioritize most?",
        options: [
            "Extended 3-year 'accidental damage' warranty",
            "On-site home installation and optimization",
            "Guaranteed buy-back/Trade-in value after 2 years",
            "Concierge-level technical support 24/7"
        ],
        type: 'multi',
        insight: 'Tech',
        insightColor: 'blue'
    },
    {
        category: 'Health & Wellness',
        question: "Would you be willing to share your anonymized wearable health data (Apple Health/Fitbit) with a local gym for a personalized membership discount?",
        options: [
            "Yes, I’m happy to exchange data for lower fees",
            "Only if the data is 100% anonymized and encrypted",
            "No, my health data is private regardless of the discount",
            "I don't use wearable health tracking devices"
        ],
        type: 'multi',
        insight: 'Wellness',
        insightColor: 'green'
    }
];

export const sponsoredBinaryPolls = [
    {
        category: 'Real Estate',
        question: "Are you planning to purchase or relocate to a new primary residence within the next 12 months?",
        type: 'binary',
        insight: 'Lead Qual',
        insightColor: 'orange',
        status: 'pending'
    },
    {
        category: 'Beverage/FMCG',
        question: "Have you noticed our new 'Summer Vibes' digital billboard at the entrance of [Local Mall Name] this week?",
        type: 'binary',
        insight: 'Ad Recall',
        insightColor: 'red',
        status: 'pending'
    },
    {
        category: 'Banking',
        question: "On a scale of 1 to 5, how satisfied are you with your current bank's ability to handle international travel payments? (Do you rate it 4 or higher?)",
        type: 'binary', // Converting scale to binary context for MVP consistency as requested ("integrate some regular binary ones")
        insight: 'Sentiment',
        insightColor: 'blue',
        status: 'pending'
    },
    {
        category: 'Insurance',
        question: "Would you be interested in 'Pay-as-you-drive' insurance that lowers your premium for every day your car stays in your garage?",
        type: 'binary',
        insight: 'Validation',
        insightColor: 'green',
        status: 'pending'
    },
    {
        category: 'ISP/Telecom',
        question: "Are you currently experiencing more than 3 hours of unplanned internet downtime per week at your registered address?",
        type: 'binary',
        insight: 'Audit',
        insightColor: 'red',
        status: 'pending'
    },
    {
        category: 'Retail',
        question: "How likely are you to recommend the [Branch Name] Fresh Produce section to a friend or neighbor? (High likelihood?)",
        type: 'binary', // NPS adaptation
        insight: 'NPS',
        insightColor: 'orange',
        status: 'pending'
    },
    {
        category: 'Fintech',
        question: "Do you currently invest more than R500 a month into offshore (US/EU) stock markets?",
        type: 'binary',
        insight: 'Budgeting',
        insightColor: 'blue',
        status: 'pending'
    },
    {
        category: 'Home Security',
        question: "Is your home currently equipped with an AI-linked camera system that notifies your smartphone of intruders?",
        type: 'binary',
        insight: 'Market Share',
        insightColor: 'red',
        status: 'pending'
    },
    {
        category: 'E-commerce',
        question: "Was the 'Returns' process for your last online clothing order effortless?",
        type: 'binary', // UX Feedback adaptation
        insight: 'UX Feedback',
        insightColor: 'orange',
        status: 'pending'
    },
    {
        category: 'Automotive',
        question: "If a public 20-minute 'Fast Charger' was installed at your local petrol station, would you consider an EV for your next car?",
        type: 'binary',
        insight: 'Future Intent',
        insightColor: 'green',
        status: 'pending'
    }
];
