import THREE from 'three.js';
import lazy from 'lazy.js';
import topojson from 'topojson';
import koreaTopo from './static/korea_provinces_topo.json';

const koreaGeo = topojson.feature(koreaTopo, koreaTopo.objects.skorea_provinces_geo);

const xpoint = [];
const ypoint = [];
const colors = [
  0x2196F3, 0xFF9800, 0xFF5722, 0xFFEB3B, 0x3F51B5, 0xFDD835, 0x64FFDA, 0xE91E63,
  0x4CAF50, 0xCDDC39, 0x8BC34A, 0x7C4DFF, 0xF44336, 0xE91E63, 0x9C27B0, 0x795548,
  0xEEFF41
];

function coordinatesToShape(coordinates) {
  const points = lazy(coordinates[0])
    .map((point) => {
      xpoint.push(point[0]);
      ypoint.push(point[1]);
      return new THREE.Vector2(100 * (point[0] - 127.76715084813509), 100 * (point[1] - 35.90079472130276));
    })
    .value();
  return new THREE.Shape(points);
}

function drawPolygon(polygon) {
  const shape = coordinatesToShape(polygon.coordinates);

  return new THREE.ExtrudeGeometry(shape, {});
}

function drawMultiPolygon(multiPolygon) {
  const multiShapes = lazy(multiPolygon.coordinates)
    .map((polygon) => {
      return coordinatesToShape(polygon);
    })
    .value();

  const extrudeGeometry = new THREE.ExtrudeGeometry(multiShapes.pop(), {});

  extrudeGeometry.addShapeList(multiShapes, {});

  return extrudeGeometry;
}

function drawProvince(province) {
  const type = province.geometry.type;
  let geometry;
  if (type === 'MultiPolygon') {
    geometry = drawMultiPolygon(province.geometry);
  } else if (type === 'Polygon') {
    geometry = drawPolygon(province.geometry);
  }
  // console.log(colors.pop());
  const material = new THREE.MeshLambertMaterial({
    color: colors.pop(),
    wireframe: false,
  });
  return new THREE.Mesh(geometry, material);
}

function drawCountry() {
  const korea = new THREE.Object3D();
  const provinces = lazy(koreaGeo.features)
    .map((province) => {
      return drawProvince(province);
    })
    .value();
  korea.add(...provinces);
  return korea;
}

export default drawCountry;
