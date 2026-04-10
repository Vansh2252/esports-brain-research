// ============================================================
//  ERIKSEN FLANKER TASK
//  30 test trials (15 congruent, 15 incongruent)
//  + 5 practice trials with feedback
// ============================================================

var NUM_FLANKER_PRACTICE = 5;
var NUM_FLANKER_CONGRUENT = 15;
var NUM_FLANKER_INCONGRUENT = 15;

// ---------- TRIAL CREATOR ----------

function createFlankerTrial(congruent, isPractice) {

    // Center arrow direction
    var centerLeft = Math.random() < 0.5;
    var center = centerLeft ? '←' : '→';
    var flanker = congruent ? center : (centerLeft ? '→' : '←');

    var stimDisplay = flanker + ' ' + flanker + ' ' + center + ' ' + flanker + ' ' + flanker;
    var correctKey = centerLeft ? 'arrowleft' : 'arrowright';

    var fixation = {
        type: "html-keyboard-response",
        stimulus: '<div class="fixation">+</div>',
        choices: jsPsych.NO_KEYS,
        trial_duration: 500,
        data: { test: "flanker_fixation" }
    };

    var stimulus = {
        type: "html-keyboard-response",
        stimulus: '<div class="flanker-stimulus">' + stimDisplay + '</div>' +
            '<p style="margin-top:20px; color:#a0a0b8;">Press the arrow key matching the <strong>CENTER</strong> arrow</p>',
        choices: ['arrowleft', 'arrowright'],
        trial_duration: 3000,
        data: {
            test: "flanker",
            condition: congruent ? "congruent" : "incongruent",
            correct_response: correctKey,
            center_direction: centerLeft ? "left" : "right",
            phase: isPractice ? "practice" : "test"
        },
        on_finish: function (data) {
            data.correct = (data.response === data.correct_response);
        }
    };

    var trialSet = [fixation, stimulus];

    if (isPractice) {
        trialSet.push({
            type: "html-keyboard-response",
            stimulus: function () {
                var last = jsPsych.data.get().last(1).values()[0];
                if (last.response === null) {
                    return '<div class="feedback-incorrect">✗ Too slow! Respond faster.</div>';
                } else if (last.correct) {
                    return '<div class="feedback-correct">✓ Correct! (' + last.rt + ' ms)</div>';
                } else {
                    return '<div class="feedback-incorrect">✗ Wrong direction!</div>';
                }
            },
            choices: jsPsych.NO_KEYS,
            trial_duration: 1200,
            data: { test: "flanker_feedback" }
        });
    }

    return trialSet;
}


// ---------- INSTRUCTIONS ----------

var flanker_instructions = {
    type: "instructions",
    pages: [
        '<div class="instruction-page">' +
        '<h2>🎯 Test 3: Flanker (Selective Attention)</h2>' +
        '<ul>' +
        '<li>Five arrows will appear on screen, like: <strong class="flanker-stimulus" style="font-size:28px;">→ → ← → →</strong></li>' +
        '<li>Focus on the <strong>CENTER</strong> arrow only.</li>' +
        '<li>Press <span class="key-hint">← Left Arrow</span> if center points left.</li>' +
        '<li>Press <span class="key-hint">→ Right Arrow</span> if center points right.</li>' +
        '<li>Ignore the surrounding (flanking) arrows — they may try to mislead you!</li>' +
        '<li><strong>' + NUM_FLANKER_PRACTICE + ' practice</strong>, then <strong>' + (NUM_FLANKER_CONGRUENT + NUM_FLANKER_INCONGRUENT) + ' test trials</strong>.</li>' +
        '</ul>' +
        '<p style="text-align:center; color:#a0a0b8;">Click <strong>Next</strong> to begin.</p>' +
        '</div>'
    ],
    show_clickable_nav: true,
    data: { test: "instructions_flanker" }
};

var flanker_practice_label = {
    type: "html-keyboard-response",
    stimulus: '<h2 style="color:#00cec9;">— Practice Round —</h2><p>Press any key to start.</p>',
    data: { test: "label" }
};

var flanker_test_label = {
    type: "html-keyboard-response",
    stimulus: '<h2 style="color:#00cec9;">— Test Round —</h2><p>No more feedback. Press any key to start.</p>',
    data: { test: "label" }
};


// ---------- BUILD ----------

var flanker_practice_trials = [];
for (var fp = 0; fp < NUM_FLANKER_PRACTICE; fp++) {
    var cong = fp < 3; // first 3 congruent, last 2 incongruent
    flanker_practice_trials = flanker_practice_trials.concat(createFlankerTrial(cong, true));
}

var flanker_test_trials = [];
for (var fc = 0; fc < NUM_FLANKER_CONGRUENT; fc++) {
    flanker_test_trials = flanker_test_trials.concat(createFlankerTrial(true, false));
}
for (var fi = 0; fi < NUM_FLANKER_INCONGRUENT; fi++) {
    flanker_test_trials = flanker_test_trials.concat(createFlankerTrial(false, false));
}

// Shuffle in fixation+stimulus pairs
var flanker_groups = [];
for (var fg = 0; fg < flanker_test_trials.length; fg += 2) {
    flanker_groups.push([flanker_test_trials[fg], flanker_test_trials[fg + 1]]);
}
flanker_groups = jsPsych.randomization.shuffle(flanker_groups);
flanker_test_trials = [];
for (var fgg = 0; fgg < flanker_groups.length; fgg++) {
    flanker_test_trials = flanker_test_trials.concat(flanker_groups[fgg]);
}