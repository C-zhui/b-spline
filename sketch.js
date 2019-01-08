let points = [
  [0, 0],
  [100, 0],
  [0, 100],
  [100, 100],
  [150, 70],
  [200, 200]
]
// points.reverse();

let T = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]


// let points = [
//   [0, 0],
//   [10, 50],
//   [30, 10],
//   [100, 100],
// ]

// let T = [0, 0.5, 1, 2, 3, 3.5, 4.5, 5]
// console.log(T)
// console.log(points)

function calN(N, T, n, k, t) {
  for (let i = 0; i <= k; i++) {
    if (!_.isArray(N[i]))
      N[i] = [];
    N[i].length = n + k - i;
  }

  for (let i = 0; i <= n + k; i++) {
    if (T[i] <= t && T[i + 1] > t)
      N[0][i] = 1;
    else
      N[0][i] = 0;
  }

  for (let j = 1; j <= k; j++) {
    for (let i = 0; i < n + k - j; i++) {
      let
        u = t - T[i],
        d = T[i + j] - T[i];
      N[j][i] = 0;
      if (d != 0)
        N[j][i] = u / d * N[j - 1][i];
      u = T[i + j + 1] - t;
      d = T[i + j + 1] - T[i + 1];
      if (d != 0)
        N[j][i] += u / d * N[j - 1][i + 1];
    }
  }
}

N = []
k = 3
delta = 0.001

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('pane2');
}

function draw() {
  background(180);
  translate(10, 10)
  scale(2)
  strokeWeight(2);

  stroke(255, 30, 30);

  for (let i = 0; i < points.length; i++) {
    point(points[i][0], points[i][1]);
  }

  stroke(30, 30, 255);
  strokeWeight(1);

  for (let i = 0; i < points.length - 1; i++) {
    line(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1])
  }


  stroke(30, 255, 30);
  beginShape(LINES);
  let point1 = null;

  for (let t = T[k], end = points.length; t <= T[end]; t += delta) {
    calN(N, T, points.length, k, t);
    let pinis = _.zipWith(points, N[k], function (pi, ni) { return [pi[0] * ni, pi[1] * ni] })

    let point2 = _.reduce(pinis, function (sum, pini) {
      return [sum[0] + pini[0], sum[1] + pini[1]]
    }, [0, 0])

    if (point1 == null) {
      point1 = point2;
      continue;
    }
    vertex(point1[0], point1[1])
    vertex(point2[0], point2[1]);
    point1 = point2;
  }
  endShape();
  noLoop();
}



$(function () {
  $ptext = $('#Ptext')
  $ptext.val(JSON.stringify(points));
  $Ttext = $('#Ttext')
  $Ttext.val(JSON.stringify(T));
  $Ktext = $('#Ktext')
  $Ktext.val(k)
  var err = false;

  $('#change').click(function () {
    try {
      var newpoints = JSON.parse($ptext.val())
      // console.log(newpoints)
      if (_.every(newpoints, function (p) {
        if (_.every(p, _.isNumber) && p.length == 2) return true;
      })) {
      } else err = true;
    } catch{
      err = true;
    }

    try {

      var newT = JSON.parse($Ttext.val())
      if (_.every(newT, _.isNumber)) {
      } else err = true;
    } catch{
      err = true;
    }

    var newk = parseInt($Ktext.val())
    if (_.isInteger(newk) && newk > 0) {
    } else err = true;

    if (points.length + k > T.length)
      err = true;

    if (err) {
      $ptext.val(JSON.stringify(points));
      $Ttext.val(JSON.stringify(T))
      $Ktext.val(k)
    } else {
      points = newpoints;
      T = newT;
      k = newk;
      redraw();
    }
  })
});
