function scoreSeverity(severity) {
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}
function pickWinner(candidates) {
  if (candidates.length === 0) {
    return {
      outcome: "mixed",
      severity: "low",
      dominantRule: "no_clear_rule",
      supportingRules: ["insufficient_signal_clarity"]
    };
  }
  return [...candidates].sort((a, b) => {
    return scoreSeverity(b.severity) - scoreSeverity(a.severity);
  })[0];
}
function decideThreeCardReading(signals) {
  const candidates = [];
  if (signals.sharpCenterWithPerson) {
    candidates.push({
      outcome: "direct_conflict",
      severity: "high",
      dominantRule: "sharp_center_with_person",
      supportingRules: ["sharp_blocking_center", "person_in_spread"],
      blockingRule: "center_block"
    });
  }
  if (signals.centerBlocksRelationship && signals.twoPeopleAroundBlockedCenter) {
    candidates.push({
      outcome: "direct_conflict",
      severity: signals.centerIsSharpBlock ? "high" : "medium",
      dominantRule: "blocked_center_between_two_people",
      supportingRules: [
        "relationship_mode",
        "two_people_around_blocked_center",
        "blocked_center_between_two_people"
      ],
      blockingRule: "center_block"
    });
  }
  if (signals.centerSupportsRelationship && signals.twoPeopleAroundSupportiveCenter) {
    candidates.push({
      outcome: "positive_connection",
      severity: "medium",
      dominantRule: "supportive_center_between_two_people",
      supportingRules: [
        "relationship_mode",
        "two_people_around_supportive_center",
        "center_supports_relationship"
      ]
    });
  }
  if (signals.questionMode === "yesno" && signals.yesNoBalanceSignal === "positive_bias" && signals.messageLeadsToSupportiveOutcome) {
    candidates.push({
      outcome: "acceptance",
      severity: "high",
      dominantRule: "positive_bias_message_to_supportive_outcome",
      supportingRules: [
        "positive_balance",
        "message_leads_to_supportive_outcome"
      ]
    });
  }
  if (signals.questionMode === "yesno" && signals.yesNoBalanceSignal === "positive_bias" && signals.supportivePersonInOutcome) {
    candidates.push({
      outcome: "acceptance",
      severity: "high",
      dominantRule: "positive_bias_with_supportive_person_in_outcome",
      supportingRules: [
        "positive_balance",
        "supportive_person_in_outcome",
        signals.femaleInfluenceOnOutcome ? "female_influence_on_outcome" : signals.maleInfluenceOnOutcome ? "male_influence_on_outcome" : "human_influence_on_outcome"
      ]
    });
  }
  if (signals.questionMode === "yesno" && signals.practicalStartLeadsToMessage && signals.messageLeadsToSupportiveOutcome) {
    candidates.push({
      outcome: "acceptance",
      severity: "high",
      dominantRule: "practical_start_message_center_supportive_outcome",
      supportingRules: [
        "practical_start",
        "message_center",
        "supportive_end"
      ]
    });
  }
  if (signals.questionMode === "yesno" && signals.supportiveStartSupportiveEnd && signals.yesNoBalanceSignal === "positive_bias") {
    candidates.push({
      outcome: "acceptance",
      severity: "medium",
      dominantRule: "supportive_start_and_supportive_end",
      supportingRules: [
        "supportive_start",
        "supportive_end",
        "positive_balance"
      ]
    });
  }
  if (signals.questionMode === "yesno" && signals.yesNoBalanceSignal === "negative_bias" && signals.blockedEnd) {
    candidates.push({
      outcome: "rejection",
      severity: "high",
      dominantRule: "negative_bias_and_blocked_end",
      supportingRules: ["negative_balance", "blocked_end"],
      blockingRule: "negative_end"
    });
  }
  if (signals.questionMode === "yesno" && signals.centerIsSharpBlock && signals.blockedCenter) {
    candidates.push({
      outcome: "rejection",
      severity: "high",
      dominantRule: "sharp_blocking_center",
      supportingRules: ["sharp_blocking_center", "blocked_center"],
      blockingRule: "center_block"
    });
  }
  if (signals.fullyBlockedFlow) {
    candidates.push({
      outcome: "rejection",
      severity: "high",
      dominantRule: "fully_blocked_flow",
      supportingRules: [
        "blocked_start",
        "blocked_center",
        "blocked_end"
      ],
      blockingRule: "full_blockage"
    });
  }
  if (signals.questionMode === "yesno" && signals.blockedCenterButRecoveredOutcome) {
    candidates.push({
      outcome: "delay",
      severity: "medium",
      dominantRule: "blocked_center_but_recovered_outcome",
      supportingRules: [
        "blocked_center",
        "supportive_end",
        "recovery_flow"
      ],
      blockingRule: "temporary_center_block"
    });
  }
  if (signals.questionMode === "yesno" && signals.yesNoBalanceSignal === "positive_bias" && signals.blockedEnd) {
    candidates.push({
      outcome: "delay",
      severity: "medium",
      dominantRule: "positive_bias_but_blocked_end",
      supportingRules: ["positive_balance", "blocked_end"],
      blockingRule: "negative_end"
    });
  }
  if (signals.recoveryFlow && signals.supportiveEnd) {
    candidates.push({
      outcome: "acceptance",
      severity: "medium",
      dominantRule: "recovery_flow_toward_supportive_end",
      supportingRules: ["recovery_flow", "supportive_end"]
    });
  }
  if (signals.directionIsSupportivePerson && signals.questionMode === "relationship") {
    candidates.push({
      outcome: "positive_connection",
      severity: "medium",
      dominantRule: "supportive_person_as_relationship_outcome",
      supportingRules: [
        "supportive_person_in_outcome",
        "human_influence_on_outcome"
      ]
    });
  }
  if (candidates.length === 0 && signals.questionMode === "yesno" && signals.yesNoBalanceSignal === "positive_bias") {
    candidates.push({
      outcome: "acceptance",
      severity: "low",
      dominantRule: "positive_balance_only",
      supportingRules: ["positive_balance"]
    });
  }
  if (candidates.length === 0 && signals.questionMode === "yesno" && signals.yesNoBalanceSignal === "negative_bias") {
    candidates.push({
      outcome: "rejection",
      severity: "low",
      dominantRule: "negative_balance_only",
      supportingRules: ["negative_balance"],
      blockingRule: "general_negative_bias"
    });
  }
  return pickWinner(candidates);
}
export {
  decideThreeCardReading
};
