// ============================================================
//  STROOP TEST — Extended Version
//  30 test trials (10 congruent, 20 incongruent)
//  + 5 practice trials with feedback + fixation cross
// ============================================================

// ---------- COLOR DEFINITIONS ----------
var color_names = [
  "red", "blue", "green", "yellow",
  "purple", "orange", "pink", "brown",
  "cyan", "lime"
];

var color_hex = {
  red: "#e6194b",
  blue: "#4363d8",
  green: "#3cb44b",
  yellow: "#ffe119",
  purple: "#911eb4",
  orange: "#f58231",
  pink: "#f032e6",
  brown: "#9a6324",
  cyan: "#42d4f4",
  lime: "#bfef45"
};

var words = color_names.map(function (c) { return c.toUpperCase(); });


// ---------- TRIAL CREATOR ----------

function createStroopTrial(congruent, isPractice) {

  var correct_index = Math.floor(Math.random() * color_names.length);
  var correct_color = color_names[correct_index];
  var word_index;

  if (congruent) {
    word_index = correct_index;
  } else {
    do {
      word_index = Math.floor(Math.random() * color_names.length);
    } while (word_index === correct_index);
  }

  // Fixation cross
  var fixation = {
    type: "html-keyboard-response",
    stimulus: '<div class="fixation">+</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: 500,
    data: { test: "stroop_fixation" }
  };

  // Main stimulus
  var stimulus = {
    type: "html-button-response",
    stimulus:
      '<h1 style="color:' + color_hex[correct_color] + '; font-size:70px; font-weight:bold;">' +
      words[word_index] +
      '</h1>' +
      '<p>Select the <strong>FONT COLOR</strong> (not the word)</p>',
    choices: words,
    data: {
      test: "stroop",
      condition: congruent ? "congruent" : "incongruent",
      correct_color: correct_color,
      displayed_word: color_names[word_index],
      phase: isPractice ? "practice" : "test"
    },
    on_finish: function (data) {
      var index = parseInt(data.response, 10);
      var chosen = color_names[index];
      data.chosen_color = chosen;
      data.correct = (chosen === data.correct_color);
    }
  };

  var trialSet = [fixation, stimulus];

  // Feedback for practice
  if (isPractice) {
    trialSet.push({
      type: "html-keyboard-response",
      stimulus: function () {
        var last = jsPsych.data.get().last(1).values()[0];
        if (last.correct) {
          return '<div class="feedback-correct">✓ Correct! (' + last.rt + ' ms)</div>';
        } else {
          return '<div class="feedback-incorrect">✗ Wrong — the color was ' +
            last.correct_color.toUpperCase() + '</div>';
        }
      },
      choices: jsPsych.NO_KEYS,
      trial_duration: 1500,
      data: { test: "stroop_feedback" }
    });
  }

  return trialSet;
}


// ---------- INSTRUCTION SCREEN ----------

var stroop_instructions = {
  type: "instructions",
  pages: [
    '<div class="instruction-page">' +
    '<h2>🎨 Test 2: Stroop Color Test</h2>' +
    '<ul>' +
    '<li>A color word will appear on screen (e.g. <strong style="color:#e6194b;">BLUE</strong>).</li>' +
    '<li>Ignore the <em>word</em> — click the button matching the <strong>font color</strong>.</li>' +
    '<li>In the example above, you would click <strong>RED</strong> (the ink color).</li>' +
    '<li><strong>5 practice trials</strong> with feedback, then <strong>30 test trials</strong>.</li>' +
    '</ul>' +
    '<p style="text-align:center; color:#a0a0b8;">Click <strong>Next</strong> to begin practice.</p>' +
    '</div>'
  ],
  show_clickable_nav: true,
  data: { test: "instructions_stroop" }
};

var stroop_practice_label = {
  type: "html-keyboard-response",
  stimulus: '<h2 style="color:#00cec9;">— Practice Round —</h2><p>Press any key to start.</p>',
  data: { test: "label" }
};

var stroop_test_label = {
  type: "html-keyboard-response",
  stimulus: '<h2 style="color:#00cec9;">— Test Round —</h2><p>No more feedback. Press any key to start.</p>',
  data: { test: "label" }
};


// ---------- BUILD TRIAL SETS ----------

// Practice: 3 congruent + 2 incongruent
var stroop_practice_trials = [];
for (var sp = 0; sp < 3; sp++) {
  stroop_practice_trials = stroop_practice_trials.concat(createStroopTrial(true, true));
}
for (var sp2 = 0; sp2 < 2; sp2++) {
  stroop_practice_trials = stroop_practice_trials.concat(createStroopTrial(false, true));
}

// Test: 10 congruent + 20 incongruent
var stroop_test_trials = [];
for (var sc = 0; sc < 10; sc++) {
  stroop_test_trials = stroop_test_trials.concat(createStroopTrial(true, false));
}
for (var si = 0; si < 20; si++) {
  stroop_test_trials = stroop_test_trials.concat(createStroopTrial(false, false));
}

// Shuffle test trials (pairs of fixation + stimulus stay together)
// We shuffle in groups of 2 (fixation + stimulus)
var stroop_groups = [];
for (var g = 0; g < stroop_test_trials.length; g += 2) {
  stroop_groups.push([stroop_test_trials[g], stroop_test_trials[g + 1]]);
}
stroop_groups = jsPsych.randomization.shuffle(stroop_groups);
stroop_test_trials = [];
for (var gg = 0; gg < stroop_groups.length; gg++) {
  stroop_test_trials = stroop_test_trials.concat(stroop_groups[gg]);
}