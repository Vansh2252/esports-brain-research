// ============================================================
//  SIMPLE REACTION TIME TEST
//  20 trials + 3 practice trials + catch trials (no-go)
// ============================================================

var NUM_RT_PRACTICE = 3;
var NUM_RT_TEST = 20;
var CATCH_RATE = 0.15;  // 15% catch trials

// ---------- HELPERS ----------

function randomISI() {
  // Inter-stimulus interval: 1000–3000 ms
  return Math.floor(Math.random() * 2000) + 1000;
}

function isCatchTrial(index, total) {
  // Deterministic catch positions for reproducibility
  var catchCount = Math.round(total * CATCH_RATE);
  var spacing = Math.floor(total / (catchCount + 1));
  for (var c = 1; c <= catchCount; c++) {
    if (index === c * spacing) return true;
  }
  return false;
}

// ---------- BUILD TRIALS ----------

function buildReactionBlock(numTrials, isPractice) {
  var trials = [];

  for (var i = 0; i < numTrials; i++) {
    var catchTrial = isCatchTrial(i, numTrials);

    // Fixation / wait screen
    trials.push({
      type: "html-keyboard-response",
      stimulus: '<div class="fixation">+</div>',
      choices: jsPsych.NO_KEYS,
      trial_duration: randomISI(),
      data: { test: "reaction_fixation", phase: isPractice ? "practice" : "test" }
    });

    if (catchTrial) {
      // CATCH TRIAL — red STOP, participant should NOT press
      trials.push({
        type: "html-keyboard-response",
        stimulus: '<div class="stop-signal">✖ STOP</div>',
        choices: [' '],
        trial_duration: 1500,
        data: {
          test: "reaction",
          trial_type: "catch",
          phase: isPractice ? "practice" : "test"
        },
        on_finish: function (data) {
          // Correct if they did NOT press (rt === null)
          data.correct = (data.response === null || data.rt === null);
        }
      });
    } else {
      // GO TRIAL — green GO, press space ASAP
      trials.push({
        type: "html-keyboard-response",
        stimulus: '<h1 style="color:#00b894; font-size:72px; font-weight:700;">GO!</h1>',
        choices: [' '],
        trial_duration: 2000,
        data: {
          test: "reaction",
          trial_type: "go",
          phase: isPractice ? "practice" : "test"
        },
        on_finish: function (data) {
          data.correct = (data.rt !== null);
        }
      });
    }

    // Feedback (practice only)
    if (isPractice) {
      trials.push({
        type: "html-keyboard-response",
        stimulus: function () {
          var last = jsPsych.data.get().last(1).values()[0];
          if (last.trial_type === "catch") {
            if (last.correct) {
              return '<div class="feedback-correct">✓ Correct! You held back.</div>';
            } else {
              return '<div class="feedback-incorrect">✗ That was a STOP trial — don\'t press!</div>';
            }
          } else {
            if (last.correct) {
              return '<div class="feedback-correct">✓ ' + last.rt + ' ms</div>';
            } else {
              return '<div class="feedback-incorrect">✗ Too slow! Press SPACE faster.</div>';
            }
          }
        },
        choices: jsPsych.NO_KEYS,
        trial_duration: 1200,
        data: { test: "reaction_feedback" }
      });
    }
  }

  return trials;
}

// ---------- INSTRUCTION SCREEN ----------

var reaction_instructions = {
  type: "instructions",
  pages: [
    '<div class="instruction-page">' +
    '<h2>⚡ Test 1: Reaction Time</h2>' +
    '<ul>' +
    '<li>A <span class="key-hint">+</span> will appear — wait for the signal.</li>' +
    '<li>When you see <strong style="color:#00b894;">GO!</strong>, press <span class="key-hint">SPACE</span> as fast as you can.</li>' +
    '<li>If you see <strong style="color:#e74c3c;">✖ STOP</strong>, do <em>not</em> press anything.</li>' +
    '<li>You\'ll get <strong>' + NUM_RT_PRACTICE + ' practice trials</strong> first, then <strong>' + NUM_RT_TEST + ' test trials</strong>.</li>' +
    '</ul>' +
    '<p style="text-align:center; color:#a0a0b8;">Click <strong>Next</strong> to begin practice.</p>' +
    '</div>'
  ],
  show_clickable_nav: true,
  data: { test: "instructions_reaction" }
};

var reaction_practice_label = {
  type: "html-keyboard-response",
  stimulus: '<h2 style="color:#00cec9;">— Practice Round —</h2><p>Press any key to start.</p>',
  data: { test: "label" }
};

var reaction_test_label = {
  type: "html-keyboard-response",
  stimulus: '<h2 style="color:#00cec9;">— Test Round —</h2><p>No more feedback. Press any key to start.</p>',
  data: { test: "label" }
};

// ---------- EXPORT ----------

var reaction_practice_trials = buildReactionBlock(NUM_RT_PRACTICE, true);
var reaction_trials = buildReactionBlock(NUM_RT_TEST, false);