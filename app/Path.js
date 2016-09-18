/*utility functions for calculating path*/

class Path {
  static reverse(points){
    return points.reverse();
  }

  static calculateOffset(points, offset, index){
    /*translate by difference between old starting point and new*/
     // if(offset.x > window.innerWidth) offset.x -= window.innerWidth;
     //  if(offset.x < 0) offset.x += window.innerWidth;
     //  if(offset.y > window.innerHeight) offset.y -= window.innerHeight;
     //  if(offset.y < 0) offset.y += window.innerHeight;
   if(points.length > index){
    var off = {x: offset.x-points[index].x, y: offset.y-points[index].y}

    return points.map(function(pt){
      var newPt = this.addPolarCoords({x: pt.x + off.x, y: pt.y + off.y});
      // if(newPt.x > window.innerWidth) newPt.x -= window.innerWidth;
      // if(newPt.x < 0) newPt.x += window.innerWidth;
      // if(newPt.y > window.innerHeight) newPt.y -= window.innerHeight;
      // if(newPt.y < 0) newPt.y += window.innerHeight;
      return newPt;
    }.bind(this));
   } else {
    return points;
   }
    
  }

  static calculatePolarOffset(points, o, index){
    //console.log("calc offset", o);
    var p = this.toPolar(o);
     console.log("rect", o);
    console.log("polar", p);
     console.log("re-rect", this.toRect(p));

    var offset = this.addPolarCoords(o);
    if(points.length > index){
      console.log("original point", points[index]);
      var off = {theta: offset.theta - points[index].theta, r: offset.r - points[index].r};
      console.log("difference", off);
      return points.map(function(pt){
        var newPt = this.addRectCoords({r: pt.r + off.r, theta: pt.theta + off.theta});
       // var newPt = this.addRectCoords({theta: pt.theta + off.theta, r: pt.r});
        return newPt;
      }.bind(this));
    } else {
      return points;
    }
  }

  static addRectCoords(pt){
    var rect = this.toRect(pt);
    pt.x = rect.x;
    pt.y = rect.y;
    return pt;
  }

  static toRect(pt){
    var x = pt.r*Math.cos(pt.theta);
    var y = pt.r*Math.sin(pt.theta);
    return ({x: x, y: y});
  }

  static addPolarCoords(pt){
    //console.log("point", pt);
    var polar = this.toPolar(pt);
   // console.log("polar", polar);
    pt.theta = polar.theta;
    pt.r = polar.r;
    return pt;
  }

  static toPolar(pt){
    var theta = Math.atan2(pt.y , pt.x);
    var r = Math.sqrt(pt.x*pt.x + pt.y*pt.y);
    return ({theta: theta, r: r});
  }
}

export default Path;
