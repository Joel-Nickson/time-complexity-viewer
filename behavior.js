// Polyfill performance.now
performance.now = function () {return performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {return new Date().getTime()}}()

var inputSizes = {
  number: [0,1,2,5,10,25,75,250,1000,5000,20000,100000,500000,3000000],
  string: ["a","ab","abc","abcd","abcde","abcdef","abcdefg","abcdefgh","abcdefghi","abcdefghij","abcdefghijk"],
  array: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5],[1,2,3,4,5,6],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7,8],[1,2,3,4,5,6,7,8,9]]
}
var results = []
var round = -1
var chart

function setMode () {
  mode = $('.inputArea select').val()
  $('#script').attr({'placeholder': sampleFunctions[mode].toString()})
}
$(function () {
  setMode()
})

function getInput () {
  var func = $('#script').val()
  if (!func) {
    func = sampleFunctions[mode]
    $('#script').val(sampleFunctions[mode].toString())
  }
  return func
}

function run () {
  $('.results p').hide()
  // $('.results ul').text('')
  if (!chart) {
    generateChart()
  }
  round++
  results.push([])
  var func = getInput();
  (function (round) {
    inputSizes[mode].forEach(function (size) {
      setTimeout(print.bind(null, size, profile(func, size), round), 0)
    })
  })(round)
}

function profile (func, size) {
  var start = performance.now()
  var results = eval( '(' + func + ')').call(null, size)
  return (performance.now() - start).toFixed(4)
}

function print (size, time, round) {
  // $('.results ul').append('<li><span class="size">'+size+'</span>: <span class="time">'+time+'</span>ms</li>')
  results[round].push(time)

  chart.load({
    columns: [
      ['sizes'].concat(inputSizes[mode]),
      [function(){return 'round ' + (round + 1)}()].concat(results[round])
    ]
  })
}

function generateChart () {
  var format = d3.format(',')
  chart = c3.generate({
    bindto: '#chart',
    legend: {show: false},
    data: {
      columns: [],
      x: 'sizes'
    },
    axis: {
      y: {
        label: {
          text: 'milliseconds (ms)',
          position: 'outer-middle'
        }
      },
      x: {
        label: {
          text: 'input size (n)',
          position: 'outer-center'
        }
      }
    },
    tooltip: {
      format: {
        title: function (d) { return 'n = ' + format(d) },
        value: function (value) {
          return format(value) + " ms"
        }
      }
    }
  })
}
