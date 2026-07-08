function normalizeText(text) {
  return text.replace(/[\u061F?]/g, "?").replace(/[״"]/g, '"').replace(/[׳']/g, "'").replace(/\s+/g, " ").trim();
}
function tokenize(text) {
  return normalizeText(text).split(/[\s,.;:!?()[\]{}"'-]+/).map((t) => t.trim()).filter(Boolean);
}
function isHebrewNameLike(token) {
  if (!/^[א-ת]{2,}$/.test(token)) return false;
  const stopwords = /* @__PURE__ */ new Set([
    "\u05DE\u05D4",
    "\u05D4\u05D0\u05DD",
    "\u05D0\u05DD",
    "\u05D9\u05E9",
    "\u05E9\u05DC",
    "\u05E2\u05DC",
    "\u05E2\u05DD",
    "\u05D1\u05D9\u05DF",
    "\u05DC\u05DE\u05D4",
    "\u05D0\u05D9\u05DA",
    "\u05DE\u05EA\u05D9",
    "\u05D0\u05D9\u05E4\u05D4",
    "\u05D6\u05D4",
    "\u05D6\u05D0\u05EA",
    "\u05D4\u05D5\u05D0",
    "\u05D4\u05D9\u05D0",
    "\u05D4\u05DD",
    "\u05D4\u05DF",
    "\u05D0\u05E0\u05D9",
    "\u05D0\u05E0\u05D7\u05E0\u05D5",
    "\u05D0\u05EA\u05D4",
    "\u05D0\u05EA",
    "\u05D0\u05EA\u05DD",
    "\u05D0\u05EA\u05DF",
    "\u05E9\u05DC\u05D9",
    "\u05E9\u05DC\u05D5",
    "\u05E9\u05DC\u05D4",
    "\u05E9\u05DC\u05D4\u05DD",
    "\u05E9\u05DC\u05D4\u05DF",
    "\u05DE\u05E6\u05D1",
    "\u05D6\u05D5\u05D2\u05D9\u05D5\u05EA",
    "\u05D4\u05D6\u05D5\u05D2\u05D9\u05D5\u05EA",
    "\u05E7\u05E9\u05E8",
    "\u05D4\u05E7\u05E9\u05E8",
    "\u05E8\u05D2\u05E9",
    "\u05DE\u05E8\u05D2\u05D9\u05E9",
    "\u05DE\u05E8\u05D2\u05D9\u05E9\u05D4",
    "\u05E2\u05D1\u05D5\u05D3\u05D4",
    "\u05DB\u05E1\u05E3",
    "\u05D1\u05E7\u05E8\u05D5\u05D1",
    "\u05DB\u05E8\u05D2\u05E2",
    "\u05DB\u05DC\u05DC\u05D9\u05EA",
    "\u05DB\u05DC\u05DC\u05D9",
    "\u05E4\u05E8\u05D9\u05E1\u05D4",
    "\u05D6\u05D5\u05D2",
    "\u05D1\u05E0\u05D9",
    "\u05D4\u05D7\u05D3\u05E9",
    "\u05D4\u05D7\u05D3\u05E9\u05D4",
    "\u05D4\u05D6\u05D5",
    "\u05D4\u05D6\u05D4",
    "\u05E9\u05D0\u05E0\u05D9",
    "\u05E8\u05D5\u05E6\u05D4",
    "\u05E8\u05E6\u05D5\u05D9",
    "\u05E9\u05D5\u05D0\u05E3",
    "\u05E9\u05D5\u05D0\u05E4\u05EA",
    "\u05DC\u05D4\u05EA\u05E7\u05D1\u05DC",
    "\u05D0\u05EA\u05E7\u05D1\u05DC",
    "\u05E2\u05D1\u05D5\u05E8"
  ]);
  return !stopwords.has(token);
}
function detectQuestionType(text) {
  const t = normalizeText(text);
  if (t.endsWith("?") || /\bהאם\b/.test(t) || /\bאם\b/.test(t) || /\bהיתכן\b/.test(t) || /^האם\b/.test(t)) {
    return "yesno";
  }
  return "open";
}
function detectTopic(text) {
  const t = normalizeText(text);
  if (/זוג|זוגיות|אהבה|קשר|בינינו|ביניהם|מרגיש|מרגישה|רגש|יחסים|בני הזוג|בן זוג|בת זוג|חיבור|פרידה|גירוש/.test(
    t
  )) {
    return "love";
  }
  if (/עבודה|משרה|קריירה|קידום|קבלה|אתקבל|ראיון|מקום עבודה|מעסיק|תפקיד|משרה חדשה|עבודה חדשה/.test(
    t
  )) {
    return "work";
  }
  if (/כסף|כספי|תשלום|רווח|הכנסה|חוב|משכורת|פרנסה|תקציב|תגמול|רווחים/.test(t)) {
    return "money";
  }
  return "general";
}
function detectIntent(text, questionType) {
  const t = normalizeText(text);
  if (questionType === "yesno") return "yes_no";
  if (/מה הוא מרגיש|מה היא מרגישה|מה הם מרגישים|מה היא חושבת|מה הוא חושב|מה הוא מרגיש כלפיי|מה היא מרגישה כלפיי|מה הוא מרגיש כלפיה|מה היא מרגישה כלפיו|מרגיש|מרגישה|חושב על|חושבת על/.test(
    t
  )) {
    return "feeling";
  }
  if (/מי זה|מי זאת|מי האדם|במי מדובר|מי הדמות/.test(t)) {
    return "identity";
  }
  if (/מה יהיה|לאן זה הולך|בעתיד|בהמשך|בקרוב|יקרה|מה התוצאה/.test(t)) {
    return "future";
  }
  if (/מה מצב|מה קורה|מה קיים|איפה עומד|מה יש/.test(t)) {
    return "state";
  }
  return "general";
}
function detectQuestionMode(intent, questionType) {
  if (questionType === "yesno") return "yesno";
  if (intent === "feeling") return "feeling";
  if (intent === "future") return "outcome";
  if (intent === "identity") return "identity";
  if (intent === "state") return "state";
  return "general";
}
function detectQuestionFocus(topic) {
  if (topic === "love") return "relationship";
  if (topic === "work") return "work";
  if (topic === "money") return "money";
  return "general";
}
function detectPriority(questionType, intent) {
  if (questionType === "yesno") return "high";
  if (intent === "feeling" || intent === "state" || intent === "future") return "high";
  return "medium";
}
function cleanupEntityText(value) {
  return value.replace(/^(את|על|אל|ל|עם|של)\s+/, "").replace(/\?$/, "").trim();
}
function buildEntity(text, kind, role) {
  const clean = cleanupEntityText(text);
  return {
    text: clean,
    normalized: clean,
    kind,
    role
  };
}
function extractBetweenEntities(text) {
  const t = normalizeText(text);
  if (/בין בני הזוג|בין הזוג/.test(t)) {
    return [
      buildEntity("\u05D1\u05DF \u05D4\u05D6\u05D5\u05D2", "person", "participant"),
      buildEntity("\u05D1\u05EA \u05D4\u05D6\u05D5\u05D2", "person", "participant")
    ];
  }
  const patterns = [
    /בין\s+([^?.!,]+?)\s+לבין\s+([^?.!,]+)/,
    /בין\s+([^?.!,]+?)\s+ל\s*([^?.!,]+)/,
    /בין\s+([^?.!,]+?)\s+ו\s*([^?.!,]+)/
  ];
  for (const pattern of patterns) {
    const match = t.match(pattern);
    if (!match) continue;
    const left = cleanupEntityText(match[1]);
    const right = cleanupEntityText(match[2]);
    if (!left || !right) continue;
    return [
      buildEntity(left, "person", "participant"),
      buildEntity(right, "person", "participant")
    ];
  }
  return [];
}
function extractTowardEntity(text) {
  const t = normalizeText(text);
  const patterns = [
    /כלפי\s+([^?.!,]+)/,
    /אל\s+([^?.!,]+)/,
    /על\s+([^?.!,]+)/
  ];
  for (const pattern of patterns) {
    const match = t.match(pattern);
    if (match && match[1]) {
      const entity = cleanupEntityText(match[1]);
      if (!entity) continue;
      return [buildEntity(entity, "person", "target")];
    }
  }
  if (/כלפיי|אליי/.test(t)) {
    return [buildEntity("\u05D0\u05E0\u05D9", "person", "target")];
  }
  if (/כלפיו|אליו/.test(t)) {
    return [buildEntity("\u05D4\u05D5\u05D0", "person", "target")];
  }
  if (/כלפיה|אליה/.test(t)) {
    return [buildEntity("\u05D4\u05D9\u05D0", "person", "target")];
  }
  return [];
}
function extractNamePairs(text) {
  const tokens = tokenize(text);
  for (let i = 0; i < tokens.length - 2; i++) {
    if (isHebrewNameLike(tokens[i]) && tokens[i + 1] === "\u05D5" && isHebrewNameLike(tokens[i + 2])) {
      return [
        buildEntity(tokens[i], "person", "participant"),
        buildEntity(tokens[i + 2], "person", "participant")
      ];
    }
  }
  return [];
}
function extractDomainEntities(text, topic) {
  const t = normalizeText(text);
  const entities = [];
  if (topic === "work" && /משרה חדשה/.test(t)) {
    entities.push(buildEntity("\u05DE\u05E9\u05E8\u05D4 \u05D7\u05D3\u05E9\u05D4", "job", "other"));
  } else if (topic === "work" && /מקום עבודה/.test(t)) {
    entities.push(buildEntity("\u05DE\u05E7\u05D5\u05DD \u05E2\u05D1\u05D5\u05D3\u05D4", "job", "other"));
  } else if (topic === "work" && /תפקיד/.test(t)) {
    entities.push(buildEntity("\u05EA\u05E4\u05E7\u05D9\u05D3", "job", "other"));
  } else if (topic === "work" && /עבודה/.test(t)) {
    entities.push(buildEntity("\u05E2\u05D1\u05D5\u05D3\u05D4", "job", "other"));
  }
  if (topic === "money" && /כסף|תשלום|רווח|הכנסה|משכורת|חוב/.test(t)) {
    entities.push(buildEntity("\u05DB\u05E1\u05E3", "money", "other"));
  }
  if (topic === "love" && /בני הזוג/.test(t)) {
    entities.push(buildEntity("\u05D1\u05E0\u05D9 \u05D4\u05D6\u05D5\u05D2", "group", "participant"));
  } else if (topic === "love" && /זוגיות/.test(t)) {
    entities.push(buildEntity("\u05D6\u05D5\u05D2\u05D9\u05D5\u05EA", "relationship", "other"));
  } else if (topic === "love" && /יחסים/.test(t)) {
    entities.push(buildEntity("\u05D9\u05D7\u05E1\u05D9\u05DD", "relationship", "other"));
  } else if (topic === "love" && /קשר/.test(t)) {
    entities.push(buildEntity("\u05E7\u05E9\u05E8", "relationship", "other"));
  }
  return entities;
}
function extractEntities(text, topic) {
  const between = extractBetweenEntities(text);
  if (between.length >= 2) {
    return dedupeEntities([...between, ...extractDomainEntities(text, topic)]);
  }
  const toward = extractTowardEntity(text);
  if (toward.length >= 1) {
    return dedupeEntities([...toward, ...extractDomainEntities(text, topic)]);
  }
  const pair = extractNamePairs(text);
  if (pair.length >= 2) {
    return dedupeEntities([...pair, ...extractDomainEntities(text, topic)]);
  }
  const t = normalizeText(text);
  const entities = [];
  const pronounMap = [
    { pattern: /\bאני\b/, text: "\u05D0\u05E0\u05D9", kind: "person", role: "querent" },
    { pattern: /\bהוא\b/, text: "\u05D4\u05D5\u05D0", kind: "person", role: "target" },
    { pattern: /\bהיא\b/, text: "\u05D4\u05D9\u05D0", kind: "person", role: "target" },
    { pattern: /\bהם\b/, text: "\u05D4\u05DD", kind: "group", role: "participant" },
    { pattern: /\bהן\b/, text: "\u05D4\u05DF", kind: "group", role: "participant" },
    { pattern: /\bבני הזוג\b/, text: "\u05D1\u05E0\u05D9 \u05D4\u05D6\u05D5\u05D2", kind: "group", role: "participant" }
  ];
  for (const item of pronounMap) {
    if (item.pattern.test(t)) {
      entities.push(buildEntity(item.text, item.kind, item.role));
    }
  }
  return dedupeEntities([...entities, ...extractDomainEntities(text, topic)]);
}
function dedupeEntities(entities) {
  const seen = /* @__PURE__ */ new Set();
  return entities.filter((entity) => {
    const key = `${entity.role}:${entity.kind}:${entity.normalized}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function detectRelationType(text, entities) {
  const t = normalizeText(text);
  if (/בין/.test(t) && entities.filter((e) => e.role === "participant").length >= 2) {
    return "between";
  }
  if (/כלפי|אליי|אליו|אליה|אל\s/.test(t)) return "toward";
  if (/על/.test(t)) return "about";
  return void 0;
}
function detectRelationshipMode(text, entities, topic) {
  const t = normalizeText(text);
  if (entities.filter((e) => e.role === "participant").length >= 2) {
    return "between-two-people";
  }
  if (/כלפי|אליי|אליו|אליה|בינינו|ביני/.test(t) || topic === "love" && entities.some((e) => e.role === "target" || e.role === "participant")) {
    return "self-to-other";
  }
  if (entities.some((e) => e.role === "target" || e.role === "participant")) {
    return "about-other";
  }
  if (entities.some((e) => e.role === "querent")) {
    return "self";
  }
  return "general";
}
function detectSubject(text, topic, intent) {
  const t = normalizeText(text);
  if (/מה הוא מרגיש|מה היא מרגישה|מה הם מרגישים/.test(t)) {
    return "\u05D4\u05E8\u05D2\u05E9 \u05E9\u05DC \u05D4\u05E6\u05D3 \u05D4\u05E9\u05E0\u05D9";
  }
  if (/מה קורה בין בני הזוג|מה קורה ביניהם|מה המצב בין/.test(t)) {
    return "\u05DE\u05D4 \u05E9\u05E7\u05D5\u05E8\u05D4 \u05D1\u05D9\u05DF \u05E9\u05E0\u05D9 \u05D4\u05E6\u05D3\u05D3\u05D9\u05DD";
  }
  if (/מה מצב הזוגיות|מצב הזוגיות/.test(t)) return "\u05DE\u05E6\u05D1 \u05D4\u05D6\u05D5\u05D2\u05D9\u05D5\u05EA";
  if (/מה מצב הקשר|מצב הקשר/.test(t)) return "\u05DE\u05E6\u05D1 \u05D4\u05E7\u05E9\u05E8";
  if (/האם אתקבל לעבודה|האם אתקבל למשרה|האם אצליח להתקבל/.test(t)) {
    return "\u05E7\u05D1\u05DC\u05D4 \u05DC\u05E2\u05D1\u05D5\u05D3\u05D4";
  }
  if (intent === "feeling") return "\u05D4\u05E8\u05D2\u05E9";
  if (intent === "future") return "\u05D4\u05DE\u05E9\u05DA \u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA";
  if (intent === "identity") return "\u05D6\u05D4\u05D5\u05EA \u05D4\u05D3\u05DE\u05D5\u05EA";
  if (topic === "love") return "\u05D4\u05E7\u05E9\u05E8";
  if (topic === "work") return "\u05D4\u05E2\u05D1\u05D5\u05D3\u05D4";
  if (topic === "money") return "\u05D4\u05DE\u05E6\u05D1 \u05D4\u05DB\u05E1\u05E4\u05D9";
  return "\u05D4\u05DE\u05E6\u05D1 \u05D4\u05DB\u05DC\u05DC\u05D9";
}
function detectObject(entities, relationType) {
  const personEntities = entities.filter(
    (entity) => entity.kind === "person" || entity.kind === "group"
  );
  if (relationType === "between" && personEntities.length >= 2) {
    return `${personEntities[0].text} \u05D5${personEntities[1].text}`;
  }
  const preferred = entities.filter((e) => e.role === "target" || e.role === "participant");
  if (preferred.length >= 1) {
    return preferred.map((e) => e.text).join(", ");
  }
  const other = entities.filter((e) => e.role === "other");
  if (other.length >= 1) {
    return other.map((e) => e.text).join(", ");
  }
  return void 0;
}
function detectDesiredOutcome(text, questionType, topic) {
  const t = normalizeText(text);
  if (questionType !== "yesno") {
    if (/לאן זה הולך|מה יהיה|איך זה יתפתח/.test(t)) return "\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA \u05E2\u05EA\u05D9\u05D3\u05D9\u05EA";
    if (/מה הוא מרגיש|מה היא מרגישה/.test(t)) return "\u05D4\u05D1\u05E0\u05EA \u05D4\u05E8\u05D2\u05E9";
    if (/מה קורה|מה מצב/.test(t)) return "\u05D0\u05D1\u05D7\u05D5\u05DF \u05D4\u05DE\u05E6\u05D1";
    return void 0;
  }
  if (/אתקבל|קבלה|להתקבל/.test(t)) return "\u05E7\u05D1\u05DC\u05D4";
  if (/יחזור|נחזור|חזרה/.test(t)) return "\u05D7\u05D6\u05E8\u05D4";
  if (/יצליח|הצלחה|יעבוד/.test(t)) return "\u05D4\u05E6\u05DC\u05D7\u05D4";
  if (/כסף|רווח|תשלום/.test(t)) return "\u05EA\u05D5\u05E6\u05D0\u05D4 \u05DB\u05E1\u05E4\u05D9\u05EA";
  if (topic === "work") return "\u05E7\u05D1\u05DC\u05D4 \u05D0\u05D5 \u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA";
  if (topic === "love") return "\u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05D1\u05E7\u05E9\u05E8";
  if (topic === "money") return "\u05E9\u05D9\u05E4\u05D5\u05E8 \u05DB\u05E1\u05E4\u05D9";
  return "\u05D4\u05EA\u05D5\u05E6\u05D0\u05D4 \u05D4\u05DE\u05D1\u05D5\u05E7\u05E9\u05EA";
}
function buildPeopleHints(entities) {
  return entities.filter((entity) => entity.kind === "person" || entity.kind === "group").map((entity) => ({
    label: entity.text,
    text: entity.text,
    role: entity.role === "participant" ? "participant" : entity.role === "target" ? "target" : entity.role === "querent" ? "querent" : "other",
    genderHint: entity.text === "\u05D4\u05D5\u05D0" || entity.text === "\u05D1\u05DF \u05D4\u05D6\u05D5\u05D2" ? "male" : entity.text === "\u05D4\u05D9\u05D0" || entity.text === "\u05D1\u05EA \u05D4\u05D6\u05D5\u05D2" ? "female" : void 0
  }));
}
function analyzeQuestionRoles(question) {
  const text = normalizeText(question);
  const questionType = detectQuestionType(text);
  const topic = detectTopic(text);
  const intent = detectIntent(text, questionType);
  const questionMode = detectQuestionMode(intent, questionType);
  const questionFocus = detectQuestionFocus(topic);
  const priority = detectPriority(questionType, intent);
  const entities = extractEntities(text, topic);
  const relationType = detectRelationType(text, entities);
  const relationshipMode = detectRelationshipMode(text, entities, topic);
  const subject = detectSubject(text, topic, intent);
  const object = detectObject(entities, relationType);
  const desiredOutcome = detectDesiredOutcome(text, questionType, topic);
  const peopleHints = buildPeopleHints(entities);
  const scope = entities.length > 0 || relationType || topic !== "general" ? "targeted" : "general";
  return {
    questionType,
    topic,
    subject,
    object,
    desiredOutcome,
    relationshipMode,
    questionMode,
    questionFocus,
    priority,
    peopleHints,
    entities,
    scope,
    relationType,
    intent
  };
}
export {
  analyzeQuestionRoles
};
