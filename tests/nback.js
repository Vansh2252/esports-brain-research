// ============================================================
//  2-BACK WORKING MEMORY TASK
//  30 test trials (~33% targets) + 5 practice trials
// ============================================================

var NBACK_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
var NBACK_NUM_TEST = 30;
var NBACK_NUM_PRACTICE = 5;
var NBACK_TARGET_RATE = 0.33;
var NBACK_STIM_DURATION = 1500;  // ms stimulus shown
var NBACK_ISI = 1000;  // ms blank between stimuli

// ---------- SEQUENCE GENERATOR ----------

function generateNbackSequence(numTrials, targetRate) {
  var sequence = [];
  var isTarget = [];
  var targetCount = Math.round(numTrials * targetRate);

  // Decide which trials are targets (not in first 2 positions)
  var targetPositions = [];
  var available = [];
  for (var i = 2; i < numTrials; i++) available.push(i);
  available = jsPsych.randomization.shuffle(available);
  for (var t = 0; t < targetCount; t++) {
    targetPositions.push(available[t]);
  }

  for (var j = 0; j < numTrials; j++) {
    var isTgt = targetPositions.indexOf(j) !== -1;
    isTarget.push(isTgt);

    if (isTgt && j >= 2) {
      // Must match the letter from 2 back
      sequence.push(sequence[j - 2]);
    } else {
      // Pick a letter that does NOT match 2-back
      var letter;
      do {
        letter = NBACK_LETTERS[Math.floor(Math.random() * NBACK_LETTERS.length)];
      } while (j >= 2 && letter === sequence[j - 2]);
      sequence.push(letter);
    }
  }

  return { sequence: sequence, isTarget: isTarget };
}


// ---------- BUILD TRIALS ----------

function buildNbackBlock(numTrials, isPractice) {

  var seqData = generateNbackSequence(numTrials, NBACK_TARGET_RATE);
  var trials = [];

  for (var i = 0; i < numTrials; i++) {

    var tgt = seqData.isTarget[i];

    // Stimulus
    trials.push({
      type: "html-keyboard-response",
      stimulus: '<div class="stimulus-letter">' + seqData.sequence[i] + '</div>' +
        (isPractice ? '<p style="color:#555; font-size:13px;">Trial ' + (i + 1) + ' of ' + numTrials + '</p>' : ''),
      choices: [' '],
      trial_duration: NBACK_STIM_DURATION,
      response_ends_trial: false,
      data: {
        test: "nback",
        letter: seqData.sequence[i],
        is_target: tgt,
        trial_index_in_block: i,
        phase: isPractice ? "practice" : "test"
      },
      on_finish: function (data) {
        var pressed = (data.response !== null && data.rt !== null);
        if (data.is_target) {
          data.correct = pressed;
          data.signal_type = pressed ? "hit" : "miss";
        } else {
          data.correct = !pressed;
          data.signal_type = pressed ? "false_alarm" : "correct_rejection";
        }
      }
    });

    // Blank ISI
    trials.push({
      type: "html-keyboard-response",
      stimulus: '',
      choices: jsPsych.NO_KEYS,
      trial_duration: NBACK_ISI,
      data: { test: "nback_isi" }
    });

    // Feedback (practice only)
    if (isPractice) {
      trials.push({
        type: "html-keyboard-response",
        stimulus: function () {
          // Get the nback trial (skip the ISI)
          var last = jsPsych.data.get().filter({ test: "nback" }).last(1).values()[0];
          if (last.correct) {
            return '<div class="feedback-correct">✓ Correct!</div>';
          } else {
            if (last.is_target) {
              return '<div class="feedback-incorrect">✗ That was a target — press SPACE!</div>';
            } else {
              return '<div class="feedback-incorrect">✗ Not a target — don\'t press!</div>';
            }
          }
        },
        choices: jsPsych.NO_KEYS,
        trial_duration: 1000,
        data: { test: "nback_feedback" }
      });
    }
  }

  return trials;
}


// ---------- INSTRUCTIONS ----------

var nback_instructions = {
  type: "instructions",
  pages: [
    '<div class="instruction-page">' +
    '<h2>🧠 Test 4: 2-Back Memory</h2>' +
    '<ul>' +
    '<li>Letters will appear one at a time on screen.</li>' +
    '<li>Press <span class="key-hint">SPACE</span> if the current letter is the <strong>same as the one shown 2 letters ago</strong>.</li>' +
    '<li>If it is <em>not</em> the same, do <strong>nothing</strong>.</li>' +
    '<li>Example: A … B … <strong>A</strong> ← press SPACE (matches 2 back)</li>' +
    '<li><strong>' + NBACK_NUM_PRACTICE + ' practice trials</strong> first, then <strong>' + NBACK_NUM_TEST + ' test trials</strong>.</li>' +
    '</ul>' +
    '<p style="text-align:center; color:#a0a0b8;">Click <strong>Next</strong> to begin.</p>' +
    '</div>'
  ],
  show_clickable_nav: true,
  data: { test: "instructions_nback" }
};

var nback_practice_label = {
  type: "html-keyboard-response",
  stimulus: '<h2 style="color:#00cec9;">— Practice Round —</h2><p>Press any key to start.</p>',
  data: { test: "label" }
};

var nback_test_label = {
  type: "html-keyboard-response",
  stimulus: '<h2 style="color:#00cec9;">— Test Round —</h2><p>No more feedback. Press any key to start.</p>',
  data: { test: "label" }
};


// ---------- EXPORT ----------

var nback_practice_trials = buildNbackBlock(NBACK_NUM_PRACTICE, true);
var nback_test_trials = buildNbackBlock(NBACK_NUM_TEST, false);