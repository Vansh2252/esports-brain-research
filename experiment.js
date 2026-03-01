// ============================================================
//  EXPERIMENT.JS — Main Timeline Orchestrator
//  Wires all tests together with instructions, fullscreen,
//  progress bar, and debrief with summary statistics
// ============================================================

// ---------- WELCOME ----------

var welcome = {
  type: "instructions",
  pages: [
    '<div class="instruction-page" style="text-align:center;">' +
    '<h2 style="font-size:2rem;">🎮 Esports &amp; Cognitive Performance</h2>' +
    '<h3>Research Study</h3>' +
    '<p style="max-width:550px; margin:20px auto; color:#a0a0b8;">' +
    'Welcome! This experiment measures cognitive abilities associated with ' +
    'competitive gaming performance. You will complete <strong>6 short tasks</strong> ' +
    'testing reaction time, attention, memory, visual search, and cognitive flexibility.' +
    '</p>' +
    '<p style="max-width:550px; margin:0 auto; color:#a0a0b8;">' +
    'The entire session takes approximately <strong>15–20 minutes</strong>. ' +
    'Please ensure you are in a quiet environment with minimal distractions.' +
    '</p>' +
    '<br>' +
    '<p style="color:#6c5ce7; font-weight:600;">Your responses are anonymous and used for research purposes only.</p>' +
    '</div>'
  ],
  show_clickable_nav: true,
  data: { test: "welcome" }
};


// ---------- FULLSCREEN ----------

var enter_fullscreen = {
  type: "fullscreen",
  fullscreen_mode: true,
  message: '<div style="text-align:center; padding:40px;">' +
    '<h2>Enter Fullscreen</h2>' +
    '<p style="color:#a0a0b8;">For the best experience, the experiment will run in fullscreen mode.</p>' +
    '</div>',
  data: { test: "fullscreen_enter" }
};

var exit_fullscreen = {
  type: "fullscreen",
  fullscreen_mode: false,
  data: { test: "fullscreen_exit" }
};


// ---------- BREAK SCREENS ----------

function createBreak(nextTestName) {
  return {
    type: "html-keyboard-response",
    stimulus: '<div style="text-align:center;">' +
      '<h2 style="color:#00cec9;">☕ Short Break</h2>' +
      '<p style="color:#a0a0b8; max-width:500px; margin:16px auto;">' +
      'Take a moment to rest your eyes if needed.<br>' +
      'Next up: <strong>' + nextTestName + '</strong>' +
      '</p>' +
      '<p>Press any key when you\'re ready to continue.</p>' +
      '</div>',
    data: { test: "break" }
  };
}


// ---------- DEBRIEF ----------

var debrief = {
  type: "html-keyboard-response",
  stimulus: function () {

    // Helper to compute mean RT and accuracy for a test
    function getStats(testName) {
      var data = jsPsych.data.get()
        .filter({ test: testName, phase: "test" });
      var total = data.count();
      if (total === 0) return { meanRT: '—', accuracy: '—', n: 0 };

      var correct = data.filter({ correct: true });
      var accuracy = Math.round((correct.count() / total) * 100);

      var rts = correct.select('rt').values.filter(function (v) { return v !== null; });
      var meanRT = rts.length > 0
        ? Math.round(rts.reduce(function (a, b) { return a + b; }, 0) / rts.length)
        : '—';

      return { meanRT: meanRT, accuracy: accuracy, n: total };
    }

    var rt = getStats("reaction");
    var st = getStats("stroop");
    var fl = getStats("flanker");
    var nb = getStats("nback");
    var vs = getStats("visual_search");
    var ts = getStats("task_switching");

    // Stroop breakdown
    var stroopCong = jsPsych.data.get().filter({ test: "stroop", phase: "test", condition: "congruent" });
    var stroopIncong = jsPsych.data.get().filter({ test: "stroop", phase: "test", condition: "incongruent" });
    var congRT = '—', incongRT = '—';
    var congRTs = stroopCong.filter({ correct: true }).select('rt').values.filter(function (v) { return v !== null; });
    var incongRTs = stroopIncong.filter({ correct: true }).select('rt').values.filter(function (v) { return v !== null; });
    if (congRTs.length) congRT = Math.round(congRTs.reduce(function (a, b) { return a + b; }, 0) / congRTs.length);
    if (incongRTs.length) incongRT = Math.round(incongRTs.reduce(function (a, b) { return a + b; }, 0) / incongRTs.length);

    return '<div class="debrief-card">' +
      '<h2>🏆 Experiment Complete!</h2>' +
      '<p style="color:#a0a0b8; text-align:center;">Thank you for participating. Here is a summary of your performance:</p>' +
      '<table class="debrief-table">' +
      '<thead><tr>' +
      '<th>Test</th><th>Trials</th><th>Mean RT (ms)</th><th>Accuracy</th>' +
      '</tr></thead>' +
      '<tbody>' +
      '<tr><td>⚡ Reaction Time</td><td>' + rt.n + '</td><td>' + rt.meanRT + '</td><td>' + rt.accuracy + '%</td></tr>' +
      '<tr><td>🎨 Stroop</td><td>' + st.n + '</td><td>' + st.meanRT + '</td><td>' + st.accuracy + '%</td></tr>' +
      '<tr><td>&nbsp;&nbsp;↳ Congruent</td><td></td><td>' + congRT + '</td><td></td></tr>' +
      '<tr><td>&nbsp;&nbsp;↳ Incongruent</td><td></td><td>' + incongRT + '</td><td></td></tr>' +
      '<tr><td>🎯 Flanker</td><td>' + fl.n + '</td><td>' + fl.meanRT + '</td><td>' + fl.accuracy + '%</td></tr>' +
      '<tr><td>🧠 2-Back Memory</td><td>' + nb.n + '</td><td>' + nb.meanRT + '</td><td>' + nb.accuracy + '%</td></tr>' +
      '<tr><td>🔍 Visual Search</td><td>' + vs.n + '</td><td>' + vs.meanRT + '</td><td>' + vs.accuracy + '%</td></tr>' +
      '<tr><td>🔄 Task Switching</td><td>' + ts.n + '</td><td>' + ts.meanRT + '</td><td>' + ts.accuracy + '%</td></tr>' +
      '</tbody>' +
      '</table>' +
      '<p style="text-align:center; color:#a0a0b8; margin-top:16px;">Your data has been saved. You may now close this window.</p>' +
      '<p style="text-align:center; color:#555; font-size:13px;">Press any key to finish.</p>' +
      '</div>';
  },
  choices: jsPsych.ALL_KEYS,
  data: { test: "debrief" }
};


// ---------- TIMELINE ----------

var timeline = [];

// 1. Welcome & fullscreen
timeline.push(enter_fullscreen);
timeline.push(welcome);

// 2. Participant info
timeline.push(participant_info);

// 3. Reaction Time
timeline.push(reaction_instructions);
timeline.push(reaction_practice_label);
timeline = timeline.concat(reaction_practice_trials);
timeline.push(reaction_test_label);
timeline = timeline.concat(reaction_trials);

// Break
timeline.push(createBreak('Stroop Color Test'));

// 4. Stroop
timeline.push(stroop_instructions);
timeline.push(stroop_practice_label);
timeline = timeline.concat(stroop_practice_trials);
timeline.push(stroop_test_label);
timeline = timeline.concat(stroop_test_trials);

// Break
timeline.push(createBreak('Flanker (Selective Attention)'));

// 5. Flanker
timeline.push(flanker_instructions);
timeline.push(flanker_practice_label);
timeline = timeline.concat(flanker_practice_trials);
timeline.push(flanker_test_label);
timeline = timeline.concat(flanker_test_trials);

// Break
timeline.push(createBreak('2-Back Memory'));

// 6. N-Back
timeline.push(nback_instructions);
timeline.push(nback_practice_label);
timeline = timeline.concat(nback_practice_trials);
timeline.push(nback_test_label);
timeline = timeline.concat(nback_test_trials);

// Break
timeline.push(createBreak('Visual Search'));

// 7. Visual Search
timeline.push(vs_instructions);
timeline = timeline.concat(visual_search_trials);

// Break
timeline.push(createBreak('Task Switching'));

// 8. Task Switching
timeline.push(ts_instructions);
timeline = timeline.concat(task_switching_trials);

// 9. Debrief
timeline.push(debrief);

// 10. Exit fullscreen
timeline.push(exit_fullscreen);


// ---------- INIT ----------

jsPsych.init({

  timeline: timeline,

  show_progress_bar: true,
  auto_update_progress_bar: true,

  on_finish: function () {
    jsPsych.data.get().localSave('csv', 'esports_data.csv');
  }

});
