// ============================================================
//  TASK SWITCHING
//  Magnitude (< or > 5) vs Parity (even/odd) judgments
//  30 trials, AABB pattern → switch & repeat trials
// ============================================================

var TS_NUM_TRIALS = 30;
var TS_NUMBERS = [1, 2, 3, 4, 6, 7, 8, 9]; // exclude 5

// ---------- TASK PATTERN ----------
// AABB pattern: Magnitude, Magnitude, Parity, Parity, ...
function getTaskForTrial(index) {
    var block = Math.floor(index / 2) % 2;
    return block === 0 ? "magnitude" : "parity";
}

function isSwitch(index) {
    if (index === 0) return false;
    return getTaskForTrial(index) !== getTaskForTrial(index - 1);
}


// ---------- BUILD TRIALS ----------

function buildTaskSwitchingTrials() {
    var trials = [];

    for (var i = 0; i < TS_NUM_TRIALS; i++) {
        var task = getTaskForTrial(i);
        var sw = isSwitch(i);
        var number = TS_NUMBERS[Math.floor(Math.random() * TS_NUMBERS.length)];

        var correctKey;
        if (task === "magnitude") {
            correctKey = number < 5 ? 'arrowleft' : 'arrowright';
        } else {
            correctKey = (number % 2 === 0) ? 'arrowleft' : 'arrowright';
        }

        var cueText = task === "magnitude" ? "MAGNITUDE" : "PARITY";
        var cueHint = task === "magnitude"
            ? "← Less than 5 &nbsp;|&nbsp; Greater than 5 →"
            : "← Even &nbsp;|&nbsp; Odd →";

        // Fixation
        trials.push({
            type: "html-keyboard-response",
            stimulus: '<div class="fixation">+</div>',
            choices: jsPsych.NO_KEYS,
            trial_duration: 400,
            data: { test: "ts_fixation" }
        });

        // Cue (shown briefly before number)
        (function (cue, hint) {
            trials.push({
                type: "html-keyboard-response",
                stimulus: '<div class="task-cue">' + cue + '</div>' +
                    '<p style="color:#555; font-size:14px;">' + hint + '</p>',
                choices: jsPsych.NO_KEYS,
                trial_duration: 600,
                data: { test: "ts_cue" }
            });
        })(cueText, cueHint);

        // Main stimulus
        (function (num, tsk, corr, swi, cue, hint) {
            trials.push({
                type: "html-keyboard-response",
                stimulus: '<div class="task-cue">' + cue + '</div>' +
                    '<div class="task-number">' + num + '</div>' +
                    '<p style="color:#555; font-size:14px;">' + hint + '</p>',
                choices: ['arrowleft', 'arrowright'],
                trial_duration: 3000,
                data: {
                    test: "task_switching",
                    task: tsk,
                    number: num,
                    correct_response: corr,
                    is_switch: swi,
                    trial_type: swi ? "switch" : "repeat",
                    phase: "test"
                },
                on_finish: function (data) {
                    data.correct = (data.response === data.correct_response);
                }
            });
        })(number, task, correctKey, sw, cueText, cueHint);
    }

    return trials;
}


// ---------- INSTRUCTIONS ----------

var ts_instructions = {
    type: "instructions",
    pages: [
        '<div class="instruction-page">' +
        '<h2>🔄 Test 6: Task Switching</h2>' +
        '<ul>' +
        '<li>A number (1–9, except 5) will appear with a task cue above it.</li>' +
        '<li>If the cue says <strong style="color:#a855f7;">MAGNITUDE</strong>:</li>' +
        '<ul style="margin-left:20px;">' +
        '<li>Press <span class="key-hint">← Left</span> if the number is <strong>less than 5</strong></li>' +
        '<li>Press <span class="key-hint">→ Right</span> if the number is <strong>greater than 5</strong></li>' +
        '</ul>' +
        '<li>If the cue says <strong style="color:#a855f7;">PARITY</strong>:</li>' +
        '<ul style="margin-left:20px;">' +
        '<li>Press <span class="key-hint">← Left</span> if the number is <strong>even</strong></li>' +
        '<li>Press <span class="key-hint">→ Right</span> if the number is <strong>odd</strong></li>' +
        '</ul>' +
        '<li>The cue will change back and forth — stay alert!</li>' +
        '<li><strong>30 trials</strong> total.</li>' +
        '</ul>' +
        '<p style="text-align:center; color:#a0a0b8;">Click <strong>Next</strong> to begin.</p>' +
        '</div>'
    ],
    show_clickable_nav: true,
    data: { test: "instructions_ts" }
};


// ---------- EXPORT ----------
var task_switching_trials = buildTaskSwitchingTrials();
