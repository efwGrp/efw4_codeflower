/*import {
  select,
  partition,
  json,
  scaleOrdinal,
  quantize,
  interpolateRainbow,
  format,
} from 'd3';*/
var select=d3.select;
var partition=d3.partition;
var json=d3.json;
var scaleOrdinal=d3.scaleOrdinal;
var quantize=d3.quantize;
var interpolateRainbow=d3.interpolateRainbow;
var format=d3.format;

function rectHeight(d) {
  return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
}

function labelVisible(d) {
  return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 16;
}

const width = window.innerWidth;
const height = window.innerHeight;

function iciclePartition(data) {
  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort(
      (a, b) => b.height - a.height || b.value - a.value
    );
  return partition().size([
    height,
    ((root.height + 1) * width) / 3,
  ])(root);
}

function render(data) {
  const color = scaleOrdinal(
    quantize(interpolateRainbow, data.children.length + 1)
  );

  const root = iciclePartition(data);
  let focus = root;

  const svg = select('body')
    .append('svg')
    .attr('viewBox', [0, 0, width, height])
    .style('font', '10px sans-serif');

  const cell = svg
    .selectAll('g')
    .data(root.descendants())
    .join('g')
    .attr('transform', (d) => `translate(${d.y0},${d.x0})`);

  const rect = cell
    .append('rect')
    .attr('width', (d) => d.y1 - d.y0 - 1)
    .attr('height', (d) => rectHeight(d))
    .attr('fill-opacity', 0.6)
    .attr('fill', (d) => {
      if (!d.depth) return '#ccc';
      while (d.depth > 1) d = d.parent;
      return color(d.data.name);
    })
    .style('cursor', 'pointer')
    .on('click', clicked);

  const text = cell
    .append('text')
    .style('user-select', 'none')
    .attr('pointer-events', 'none')
    .attr('x', 4)
    .attr('y', 13)
    .attr('fill-opacity', (d) => +labelVisible(d));

  text.append('tspan').text((d) => d.data.name);
/*
  const tspan = text
    .append('tspan')
    .attr('fill-opacity', (d) => labelVisible(d) * 0.7)
    .text((d) => ` ${format(d.value)}`);
*/
/*
  cell.append('title').text(
    (d) =>
      `${d
        .ancestors()
        .map((d) => d.data.name)
        .reverse()
        .join('/')}\n${format(d.value)}`
  );
*/
  function clicked(event, p) {

    focus = focus === p ? (p = p.parent) : p;

    root.each(
      (d) =>
        (d.target = {
          x0: ((d.x0 - p.x0) / (p.x1 - p.x0)) * height,
          x1: ((d.x1 - p.x0) / (p.x1 - p.x0)) * height,
          y0: d.y0 - p.y0,
          y1: d.y1 - p.y0,
        })
    );

    const t = cell
      .transition()
      .duration(750)
      .attr(
        'transform',
        (d) => `translate(${d.target.y0},${d.target.x0})`
      );

    rect
      .transition(t)
      .attr('height', (d) => rectHeight(d.target));
    text
      .transition(t)
      .attr('fill-opacity', (d) => +labelVisible(d.target));
    tspan
      .transition(t)
      .attr(
        'fill-opacity',
        (d) => labelVisible(d.target) * 0.7
      );
  }
}

// Data hosted in
// https://gist.github.com/curran/d2656e98b489648ab3e2071479ced4b1
/*
const dataURL = [
  'https://gist.githubusercontent.com/',
  'curran/d2656e98b489648ab3e2071479ced4b1/raw/',
  '9f2499d63e971c2110e52b3fa2066ebed234828c/',
  'flare-2.json',
].join('');

json(dataURL).then(render);
*/
