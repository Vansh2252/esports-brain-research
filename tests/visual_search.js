// ============================================================
//  VISUAL SEARCH TASK
//  Find a target (red circle) among distractors
//  3 set sizes × 6 trials = 18 test trials
// ============================================================

var VS_SET_SIZES = [8, 16, 24];
var VS_TRIALS_PER_SIZE = 6;
var VS_CANVAS_SIZE = 500;
var VS_ITEM_RADIUS = 16;

// ---------- STIMULUS DRAWER ----------

function drawSearchDisplay(canvas, setSize, targetPresent) {

    var ctx = canvas.getContext('2d');
    canvas.width = VS_CANVAS_SIZE;
    canvas.height = VS_CANVAS_SIZE;

    ctx.fillStyle = '#0f1117';
    ctx.fillRect(0, 0, VS_CANVAS_SIZE, VS_CANVAS_SIZE);

    // Generate non-overlapping positions
    var positions = [];
    var margin = VS_ITEM_RADIUS * 2 + 8;

    function overlaps(x, y) {
        for (var p = 0; p < positions.length; p++) {
            var dx = positions[p][0] - x;
            var dy = positions[p][1] - y;
            if (Math.sqrt(dx * dx + dy * dy) < margin) return true;
        }
        return false;
    }

    var attempts = 0;
    while (positions.length < setSize && attempts < 5000) {
        var x = Math.random() * (VS_CANVAS_SIZE - margin * 2) + margin;
        var y = Math.random() * (VS_CANVAS_SIZE - margin * 2) + margin;
        if (!overlaps(x, y)) {
            positions.push([x, y]);
        }
        attempts++;
    }

    // Draw items
    for (var i = 0; i < positions.length; i++) {
        var px = positions[i][0];
        var py = positions[i][1];

        if (i === 0 && targetPresent) {
            // TARGET: red circle
            ctx.beginPath();
            ctx.arc(px, py, VS_ITEM_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = '#e74c3c';
            ctx.fill();
        } else {
            // DISTRACTORS: blue circles or red squares
            if (Math.random() < 0.5) {
                // Blue circle
                ctx.beginPath();
                ctx.arc(px, py, VS_ITEM_RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = '#4363d8';
                ctx.fill();
            } else {
                // Red square (same spatial extent)
                ctx.fillStyle = '#e74c3c';
                ctx.fillRect(px - VS_ITEM_RADIUS, py - VS_ITEM_RADIUS,
                    VS_ITEM_RADIUS * 2, VS_ITEM_RADIUS * 2);
            }
        }
    }

    // Label
    ctx.fillStyle = '#555';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('← Present   |   Absent →', VS_CANVAS_SIZE / 2, VS_CANVAS_SIZE - 10);
}


// ---------- BUILD TRIALS ----------

function buildVisualSearchTrials() {
    var trials = [];

    for (var s = 0; s < VS_SET_SIZES.length; s++) {
        var setSize = VS_SET_SIZES[s];

        for (var t = 0; t < VS_TRIALS_PER_SIZE; t++) {
            var present = t < (VS_TRIALS_PER_SIZE / 2); // half present, half absent

            // Fixation
            trials.push({
                type: "html-keyboard-response",
                stimulus: '<div class="fixation">+</div>',
                choices: jsPsych.NO_KEYS,
                trial_duration: 500,
                data: { test: "vs_fixation" }
            });

            // Capture variables in closure
            (function (ss, pr) {
                trials.push({
                    type: "canvas-keyboard-response",
                    canvas_size: [VS_CANVAS_SIZE, VS_CANVAS_SIZE],
                    stimulus: function (c) {
                        drawSearchDisplay(c, ss, pr);
                    },
                    choices: ['arrowleft', 'arrowright'],
                    trial_duration: 5000,
                    data: {
                        test: "visual_search",
                        set_size: ss,
                        target_present: pr,
                        correct_response: pr ? 'arrowleft' : 'arrowright',
                        phase: "test"
                    },
                    on_finish: function (data) {
                        data.correct = (data.response === data.correct_response);
                    }
                });
            })(setSize, present);
        }
    }

    // Shuffle
    // Group in pairs (fixation + canvas)
    var groups = [];
    for (var g = 0; g < trials.length; g += 2) {
        groups.push([trials[g], trials[g + 1]]);
    }
    groups = jsPsych.randomization.shuffle(groups);
    var shuffled = [];
    for (var gg = 0; gg < groups.length; gg++) {
        shuffled = shuffled.concat(groups[gg]);
    }

    return shuffled;
}


// ---------- INSTRUCTIONS ----------

var vs_instructions = {
    type: "instructions",
    pages: [
        '<div class="instruction-page">' +
        '<h2>🔍 Test 5: Visual Search</h2>' +
        '<ul>' +
        '<li>A display of colored shapes will appear.</li>' +
        '<li>Look for the <strong style="color:#e74c3c;">RED CIRCLE</strong> (target).</li>' +
        '<li>Distractors are <strong style="color:#4363d8;">blue circles</strong> and <strong style="color:#e74c3c;">red squares</strong>.</li>' +
        '<li>Press <span class="key-hint">← Left Arrow</span> if the target is <strong>PRESENT</strong>.</li>' +
        '<li>Press <span class="key-hint">→ Right Arrow</span> if the target is <strong>ABSENT</strong>.</li>' +
        '<li>Respond as quickly and accurately as you can.</li>' +
        '<li><strong>18 trials</strong> with varying numbers of items.</li>' +
        '</ul>' +
        '<p style="text-align:center; color:#a0a0b8;">Click <strong>Next</strong> to begin.</p>' +
        '</div>'
    ],
    show_clickable_nav: true,
    data: { test: "instructions_vs" }
};

// ---------- EXPORT ----------
var visual_search_trials = buildVisualSearchTrials();
