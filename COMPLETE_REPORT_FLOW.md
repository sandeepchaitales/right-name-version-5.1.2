# RIGHTNAME v2.0 - Complete Report Generation Flow Diagram

## 📊 HIGH-LEVEL ARCHITECTURE

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                    USER INPUT                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐ │
│  │ brand_names: ["BrandX", "BrandY"]     │ positioning: "Premium"                      │ │
│  │ category: "Finance App"                │ market_scope: "Multi-Country"              │ │
│  │ industry: "Fintech"                    │ countries: ["USA", "India"]                │ │
│  │ product_type: "Digital"                │ known_competitors: ["Paytm", "PhonePe"]    │ │
│  │ usp: "AI-powered budgeting"            │ product_keywords: ["UPI", "wallet"]        │ │
│  └─────────────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                         STEP 1: LLM-FIRST BRAND CONFLICT CHECK                           │
│                              ⏱️ 1-3 seconds | 💰 ~$0.002                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                      dynamic_brand_search() - GPT-4o-mini                            │ │
│  │                                                                                      │ │
│  │  For each brand name:                                                               │ │
│  │  ┌────────────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │ PROMPT: "Is '{brand}' similar to ANY existing brand?"                          │ │ │
│  │  │                                                                                 │ │ │
│  │  │ CHECKS:                                                                         │ │ │
│  │  │ ✓ Exact matches           ✓ Pluralization (MoneyControls ≈ Moneycontrol)       │ │ │
│  │  │ ✓ Phonetic similarity     ✓ Spelling variations (Googel ≈ Google)              │ │ │
│  │  │ ✓ Regional brands         ✓ Global brands                                      │ │ │
│  │  │                                                                                 │ │ │
│  │  │ RESPONSE: {has_conflict, confidence, conflicting_brand, similarity_%}          │ │ │
│  │  └────────────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                            ┌─────────────┴─────────────┐
                            ▼                           ▼
              ┌─────────────────────────┐   ┌─────────────────────────────────────────────┐
              │ ALL BRANDS HAVE         │   │        NO/PARTIAL CONFLICTS                 │
              │ CONFLICTS (HIGH/MEDIUM) │   │                                             │
              └───────────┬─────────────┘   └────────────────────┬────────────────────────┘
                          │                                      │
                          ▼                                      │
              ┌─────────────────────────┐                        │
              │  🛑 EARLY STOPPING      │                        │
              │  ⏱️ Total: 1-3 seconds  │                        │
              │                         │                        │
              │  Return IMMEDIATE       │                        │
              │  REJECT with:           │                        │
              │  • Score: 5/100         │                        │
              │  • Verdict: REJECT      │                        │
              │  • Reason: conflict     │                        │
              │                         │                        │
              │  ✅ SAVES 45-90 seconds │                        │
              │  ✅ SAVES $0.08-0.15    │                        │
              └─────────────────────────┘                        │
                                                                 │
                                                                 ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                      STEP 2: PARALLEL DATA GATHERING                                     │
│                              ⏱️ 30-45 seconds (runs simultaneously)                       │
│                                                                                          │
│   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│   │    DOMAIN      │  │   TRADEMARK    │  │  VISIBILITY    │  │    SOCIAL      │        │
│   │    CHECK       │  │   RESEARCH     │  │   ANALYSIS     │  │   HANDLES      │        │
│   │                │  │                │  │                │  │                │        │
│   │ • WHOIS lookup │  │ • Bing search  │  │ • Google search│  │ • Instagram    │        │
│   │ • .com status  │  │ • Trademark DB │  │ • Play Store   │  │ • Twitter/X    │        │
│   │                │  │ • Company reg  │  │ • App Store    │  │ • LinkedIn     │        │
│   │                │  │ • Legal cases  │  │ • Phonetic var │  │ • TikTok       │        │
│   └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘        │
│                                                                                          │
│   ┌────────────────┐  ┌────────────────┐                                                │
│   │  MULTI-DOMAIN  │  │   SIMILARITY   │                                                │
│   │  AVAILABILITY  │  │    CHECK       │                                                │
│   │                │  │                │                                                │
│   │ • Category TLDs│  │ • Levenshtein  │                                                │
│   │   (.finance,   │  │ • Jaro-Winkler │                                                │
│   │    .money)     │  │ • Soundex      │                                                │
│   │ • Country TLDs │  │ • Phonetic     │                                                │
│   │   (.in, .co.uk)│  │                │                                                │
│   └────────────────┘  └────────────────┘                                                │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                      STEP 3: LLM REPORT GENERATION (GPT-4o)                              │
│                              ⏱️ 15-45 seconds | 💰 $0.08-0.15                             │
│                                                                                          │
│   ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│   │                           SYSTEM PROMPT                                           │  │
│   │  Role: Expert Brand Strategist, Trademark Attorney, Marketing Analyst            │  │
│   │  Output: Strict JSON format matching BrandEvaluationResponse schema              │  │
│   └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                          +                                               │
│   ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│   │                           USER PROMPT (Context)                                   │  │
│   │  • Business context (industry, category, positioning, countries)                 │  │
│   │  • Trademark research data (conflicts, legal precedents)                         │  │
│   │  • Similarity analysis results                                                   │  │
│   │  • Domain availability data                                                      │  │
│   │  • Visibility/app store data                                                     │  │
│   │  • Social handle availability                                                    │  │
│   │  • Country-specific trademark costs                                              │  │
│   │  • Known competitors & product keywords                                          │  │
│   └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                          │                                               │
│                                          ▼                                               │
│   ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│   │                      JSON PARSING & VALIDATION                                    │  │
│   │  1. Extract JSON from markdown code blocks                                       │  │
│   │  2. Clean invalid characters                                                     │  │
│   │  3. Repair common LLM JSON errors                                                │  │
│   │  4. Aggressive repair if needed                                                  │  │
│   │  5. Fix type mismatches (int→str, etc.)                                          │  │
│   │  6. Validate against Pydantic schema                                             │  │
│   └──────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                          STEP 4: POST-PROCESSING & OVERRIDES                             │
│                                                                                          │
│   ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│   │  • If LLM-first detected conflicts, OVERRIDE LLM verdict → REJECT                │  │
│   │  • Generate unique report_id                                                     │  │
│   │  • Save to MongoDB                                                               │  │
│   └──────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                              FINAL OUTPUT                                                │
│                       BrandEvaluationResponse                                            │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 COMPLETE REPORT STRUCTURE

```
BrandEvaluationResponse
│
├── 📝 executive_summary (string)
│   └── High-level verdict: "✅ GO: Brand X is cleared for use..."
│
├── 📊 brand_scores[] (array - one per brand)
│   │
│   ├── 🏷️ BASIC INFO
│   │   ├── brand_name: "BrandX"
│   │   ├── namescore: 85.5 (0-100)
│   │   ├── verdict: "GO" | "CAUTION" | "REJECT"
│   │   ├── summary: "Brief verdict explanation..."
│   │   └── strategic_classification: "A High-Velocity Differentiation Asset"
│   │
│   ├── ✅❌ PROS & CONS
│   │   ├── pros: ["Strong trademark position", "Domain available", ...]
│   │   └── cons: ["Social handles taken", "Similar app exists", ...]
│   │
│   ├── 🎯 8 DIMENSION SCORES (Radar Chart)
│   │   ├── dimensions[0]: {name: "Brand Distinctiveness & Memorability", score: 8.5, reasoning: "..."}
│   │   ├── dimensions[1]: {name: "Cultural & Linguistic Resonance", score: 9.0, reasoning: "..."}
│   │   ├── dimensions[2]: {name: "Premiumisation & Trust Curve", score: 8.0, reasoning: "..."}
│   │   ├── dimensions[3]: {name: "Scalability & Brand Architecture", score: 9.0, reasoning: "..."}
│   │   ├── dimensions[4]: {name: "Trademark & Legal Sensitivity", score: 7.5, reasoning: "..."}
│   │   ├── dimensions[5]: {name: "Consumer Perception Mapping", score: 8.0, reasoning: "..."}
│   │   ├── dimensions[6]: {name: "Digital Readiness", score: 8.5, reasoning: "..."}
│   │   └── dimensions[7]: {name: "Future-Proofing", score: 8.0, reasoning: "..."}
│   │
│   ├── ⚖️ TRADEMARK RISK MATRIX
│   │   ├── trademark_risk: {risk_level: "Low", score: 8.0, summary: "...", details: [...]}
│   │   ├── trademark_matrix:
│   │   │   ├── genericness: {likelihood: 2, severity: 8, zone: "Green", commentary: "..."}
│   │   │   ├── existing_conflicts: {likelihood: 0, severity: 0, zone: "Green", commentary: "..."}
│   │   │   ├── phonetic_similarity: {likelihood: 1, severity: 5, zone: "Green", commentary: "..."}
│   │   │   ├── relevant_classes: {likelihood: 4, severity: 7, zone: "Yellow", commentary: "..."}
│   │   │   ├── rebranding_probability: {likelihood: 1, severity: 10, zone: "Green", commentary: "..."}
│   │   │   └── overall_assessment: "Trademarking under Class 9 is feasible..."
│   │   └── trademark_classes: ["Class 9: Software", "Class 36: Financial services"]
│   │
│   ├── 🔬 TRADEMARK RESEARCH (Real-time Web Data)
│   │   └── trademark_research:
│   │       ├── nice_classification: {class_number: 9, class_description: "...", matched_term: "..."}
│   │       ├── trademark_conflicts: [{conflict_name, application_number, status, similarity_score, ...}]
│   │       ├── company_conflicts: [{company_name, cin_number, registration_date, similarity_score, ...}]
│   │       ├── common_law_conflicts: [...]
│   │       ├── legal_precedents: [{case_name, court, year, relevance, key_principle, url}]
│   │       ├── overall_risk_score: 1 (1-10)
│   │       ├── registration_success_probability: 90 (0-100%)
│   │       ├── opposition_probability: 10 (0-100%)
│   │       ├── critical_conflicts_count: 0
│   │       ├── high_risk_conflicts_count: 0
│   │       └── total_conflicts_found: 0
│   │
│   ├── ⏱️ REGISTRATION TIMELINE (Country-Specific Costs)
│   │   └── registration_timeline:
│   │       ├── estimated_duration: "12-18 months"
│   │       ├── stages: [{stage, duration, risk}, ...]
│   │       ├── filing_cost: "₹4,500-₹9,000" (or $275-$400 for USA)
│   │       ├── opposition_defense_cost: "₹50,000-₹2,00,000"
│   │       └── total_estimated_cost: "₹15,000-₹2,50,000"
│   │
│   ├── 🛡️ MITIGATION STRATEGIES
│   │   └── mitigation_strategies: [
│   │       {priority: "HIGH", action: "Conduct formal trademark search...", rationale: "...", estimated_cost: "₹3,000-₹5,000"},
│   │       {priority: "HIGH", action: "Develop distinctive visual identity...", rationale: "...", estimated_cost: "₹10,000-₹50,000"},
│   │       {priority: "MEDIUM", action: "Consider co-existence agreement...", rationale: "...", estimated_cost: "..."}
│   │   ]
│   │
│   ├── 🌐 DOMAIN ANALYSIS
│   │   ├── domain_analysis:
│   │   │   ├── exact_match_status: "TAKEN" | "AVAILABLE"
│   │   │   ├── risk_level: "LOW" | "MEDIUM" | "HIGH"
│   │   │   ├── has_active_business: "YES" | "NO" | "UNKNOWN"
│   │   │   ├── has_trademark: "YES" | "NO" | "UNKNOWN"
│   │   │   ├── alternatives: [{domain, status}, ...]
│   │   │   ├── strategy_note: "..."
│   │   │   └── score_impact: "-1 point max for taken .com"
│   │   │
│   │   └── multi_domain_availability:
│   │       ├── category_domains: [{domain: ".finance", status, available}, {domain: ".money", ...}]
│   │       ├── country_domains: [{domain: ".in", status, available}, {domain: ".co.in", ...}]
│   │       ├── recommended_domain: "brandx.money"
│   │       └── acquisition_strategy: "..."
│   │
│   ├── 📱 SOCIAL HANDLES AVAILABILITY
│   │   └── social_availability:
│   │       ├── handle: "brandx"
│   │       ├── platforms: [
│   │       │   {platform: "instagram", handle: "brandx", status: "TAKEN", available: false},
│   │       │   {platform: "linkedin", handle: "brandx", status: "AVAILABLE", available: true},
│   │       │   {platform: "twitter", handle: "brandx", status: "TAKEN", available: false},
│   │       │   {platform: "tiktok", handle: "brandx", status: "AVAILABLE", available: true},
│   │       │   {platform: "youtube", handle: "brandx", status: "TAKEN", available: false},
│   │       │   {platform: "facebook", handle: "brandx", status: "TAKEN", available: false}
│   │       │]
│   │       ├── available_platforms: ["linkedin", "tiktok"]
│   │       ├── taken_platforms: ["instagram", "twitter", "youtube", "facebook"]
│   │       └── recommendation: "Secure LinkedIn immediately. Use @brandx_official for others."
│   │
│   ├── 👁️ VISIBILITY ANALYSIS (Conflict Detection)
│   │   └── visibility_analysis:
│   │       ├── user_product_intent: "AI-powered personal finance management..."
│   │       ├── user_customer_avatar: "Tech-savvy millennials seeking..."
│   │       ├── phonetic_conflicts: [
│   │       │   {input_name, phonetic_variants: [], ipa_pronunciation, found_conflict, conflict_type, legal_risk, verdict_impact}
│   │       │]
│   │       ├── direct_competitors: [
│   │       │   {name, category, their_product_intent, their_customer_avatar, intent_match, customer_overlap, risk_level, reason}
│   │       │]
│   │       ├── name_twins: [{...}] (similar names but different intent - LOW risk)
│   │       ├── google_presence: [...]
│   │       ├── app_store_presence: [...]
│   │       ├── warning_triggered: false
│   │       ├── warning_reason: "..."
│   │       └── conflict_summary: "0 direct competitors. 0 critical phonetic conflicts."
│   │
│   ├── 🌍 CULTURAL ANALYSIS (Per Country)
│   │   └── cultural_analysis: [
│   │       {country: "India", cultural_resonance_score: 9.0, cultural_notes: "...", linguistic_check: "Safe"},
│   │       {country: "USA", cultural_resonance_score: 8.5, cultural_notes: "...", linguistic_check: "Safe"}
│   │   ]
│   │
│   ├── 📈 COMPETITIVE LANDSCAPE (Global)
│   │   └── competitor_analysis:
│   │       ├── x_axis_label: "Price: Budget → Premium"
│   │       ├── y_axis_label: "Service: Basic → Comprehensive"
│   │       ├── competitors: [
│   │       │   {name: "Paytm", x_coordinate: 70, y_coordinate: 75, price_position, category_position, quadrant},
│   │       │   {name: "PhonePe", x_coordinate: 60, y_coordinate: 60, ...},
│   │       │   {name: "Google Pay", x_coordinate: 90, y_coordinate: 80, ...}
│   │       │]
│   │       ├── user_brand_position: {x_coordinate: 65, y_coordinate: 70, quadrant: "Premium Advanced", rationale: "..."}
│   │       ├── white_space_analysis: "Opportunity in mid-premium segment..."
│   │       ├── strategic_advantage: "..."
│   │       └── suggested_pricing: "₹X-₹Y monthly subscription"
│   │
│   ├── 🗺️ COUNTRY-SPECIFIC COMPETITOR ANALYSIS (Max 4 Countries)
│   │   └── country_competitor_analysis: [
│   │       {
│   │           country: "India",
│   │           country_flag: "🇮🇳",
│   │           x_axis_label: "Price: Budget → Premium",
│   │           y_axis_label: "Style: Traditional → Modern",
│   │           competitors: [{name: "Paytm", x_coordinate: 40, y_coordinate: 80, ...}, ...],
│   │           user_brand_position: {x_coordinate: 55, y_coordinate: 70, quadrant, rationale},
│   │           white_space_analysis: "...",
│   │           strategic_advantage: "...",
│   │           market_entry_recommendation: "..."
│   │       },
│   │       {country: "USA", country_flag: "🇺🇸", ...}
│   │   ]
│   │
│   ├── 🎯 FINAL ASSESSMENT
│   │   └── final_assessment:
│   │       ├── verdict_statement: "BrandX is well-positioned for success..."
│   │       ├── suitability_score: 8.5
│   │       ├── dimension_breakdown: [{Linguistic Foundation: 9.0}, {Market Viability: 8.0}]
│   │       ├── recommendations: [
│   │       │   {title: "IP Strategy", content: "File trademark under Class 9 and 36..."},
│   │       │   {title: "Brand Narrative", content: "Develop story around financial empowerment..."},
│   │       │   {title: "Launch Tactics", content: "Partner with influencers, digital ads..."}
│   │       │]
│   │       └── alternative_path: "If challenges arise, consider pivoting to..."
│   │
│   ├── 💡 ALTERNATIVE NAMES (If conflicts found)
│   │   └── alternative_names:
│   │       ├── poison_words: ["money", "control"] (words causing conflict)
│   │       ├── reasoning: "Alternative names avoid trademark issues..."
│   │       └── suggestions: [
│   │           {name: "FinWise", rationale: "Clean trademark space, modern feel"},
│   │           {name: "CashFlow Pro", rationale: "Descriptive yet distinctive"},
│   │           {name: "WealthPilot", rationale: "Premium positioning, available domains"}
│   │       ]
│   │
│   └── 📍 POSITIONING FIT
│       └── positioning_fit: "The name aligns well with the premium positioning strategy..."
│
├── ⚖️ comparison_verdict (string - if multiple brands)
│   └── "BrandX scores higher than BrandY due to better trademark clearance..."
│
└── 🆔 report_id (string)
    └── "report_abc123def456"
```

---

## 📊 DATA SOURCES FOR EACH SECTION

| Report Section | Data Source | Method |
|---------------|-------------|--------|
| **LLM-First Check** | GPT-4o-mini | Async API call |
| **Domain Analysis** | WHOIS | python-whois library |
| **Multi-Domain** | DNS/WHOIS | Async domain checks |
| **Social Handles** | Web scraping | HTTP requests to platforms |
| **Trademark Research** | Bing Search | Web scraping trademark DBs |
| **Visibility Analysis** | Bing + Play Store | Web search + scraping |
| **Similarity Check** | Local algorithms | Levenshtein, Jaro-Winkler, Soundex |
| **8 Dimensions** | GPT-4o | LLM analysis |
| **Trademark Matrix** | GPT-4o | LLM analysis |
| **Cultural Analysis** | GPT-4o | LLM analysis |
| **Competitor Analysis** | GPT-4o | LLM analysis |
| **Final Assessment** | GPT-4o | LLM analysis |
| **Alternative Names** | GPT-4o | LLM generation |

---

## ⏱️ TIMING BREAKDOWN

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROCESSING TIMELINE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CONFLICT DETECTED (Early Stopping):                            │
│  ├── LLM-First Check: 1-3 seconds                               │
│  └── TOTAL: 1-3 seconds ⚡                                       │
│                                                                 │
│  NO CONFLICT (Full Analysis):                                   │
│  ├── LLM-First Check: 1-3 seconds                               │
│  ├── Parallel Data Gathering: 30-45 seconds                     │
│  │   ├── Domain Check: ~2-5s                                    │
│  │   ├── Trademark Research: ~15-30s                            │
│  │   ├── Visibility Analysis: ~10-20s                           │
│  │   ├── Social Handles: ~5-10s                                 │
│  │   ├── Multi-Domain: ~5-10s                                   │
│  │   └── Similarity Check: ~1-2s                                │
│  ├── LLM Report Generation: 15-45 seconds                       │
│  └── TOTAL: 45-90 seconds                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💰 COST BREAKDOWN

| Scenario | LLM-First | Data Gathering | Report Gen | Total |
|----------|-----------|----------------|------------|-------|
| **Conflict Detected** | ~$0.002 | $0 | $0 | **~$0.002** |
| **Full Analysis** | ~$0.002 | $0 (free APIs) | $0.08-0.15 | **$0.08-0.15** |

---

## 🔄 RETRY & FALLBACK LOGIC

```
┌─────────────────────────────────────────────────────────────────┐
│                    LLM RETRY STRATEGY                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Primary Model: openai/gpt-4o                                   │
│  ├── Attempt 1 → Parse JSON → Validate Schema                   │
│  ├── Attempt 2 (if failed) → Clean JSON → Repair → Validate     │
│  └── Attempt 3 (if failed) → Aggressive Repair → Validate       │
│                                                                 │
│  Fallback Model: openai/gpt-4o-mini                             │
│  ├── Attempt 1 → Parse JSON → Validate Schema                   │
│  ├── Attempt 2 (if failed) → Clean JSON → Repair → Validate     │
│  └── Attempt 3 (if failed) → Aggressive Repair → Validate       │
│                                                                 │
│  If all fail → Return HTTP 500 error                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

*Generated: July 2025 | RIGHTNAME v2.0*
